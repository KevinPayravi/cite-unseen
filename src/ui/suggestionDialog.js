import suggestionDialogTemplate from './suggestionDialog.template.vue';
import {
    closeCurrentDialog,
    closeDialogAfterAnimation,
    ensureDialogMount,
    setCurrentDialog
} from './dialogMount.js';

/**
 * @typedef {Object} SuggestionDialogOptions
 * @property {Function} convByVar - MediaWiki message conversion helper
 * @property {Object} i18n - Cite Unseen i18n message map
 * @property {Function} getSettingCategories - Returns available setting category IDs
 * @property {Function} getCategoryDisplayName - Returns the localized category label
 * @property {Function} getPrimarySourceUrl - Extracts the primary URL from parsed citation metadata
 * @property {Object} sourceToPageMapping - Reliability-source page mapping
 */

// ===============================
// SUGGESTIONS
// ===============================

/**
 * Open suggestion dialog for a specific citation
 * @param {Object} citationRef - Citation reference data
 * @param {SuggestionDialogOptions} options - Dialog dependencies
 */
export function openSuggestionDialog(citationRef, options) {
    closeCurrentDialog();
    createSuggestionDialog(citationRef, options);
}

/**
 * Create and show the Codex suggestion dialog
 * @param {Object} citationRef - Citation reference data
 * @param {SuggestionDialogOptions} options - Dialog dependencies
 */
function createSuggestionDialog(citationRef, options) {
    const {
        convByVar,
        i18n,
        getSettingCategories,
        getCategoryDisplayName,
        getPrimarySourceUrl,
        sourceToPageMapping
    } = options;

    // Load Codex and Vue dependencies
    mw.loader.using('@wikimedia/codex').then(function (require) {
        const Vue = require('vue');
        const Codex = require('@wikimedia/codex');
        const mountPoint = ensureDialogMount();
        let app = null;

        app = Vue.createMwApp({
            i18n: {
                dialogTitle: convByVar(i18n.suggestionDialogTitle),
                guidance: convByVar(i18n.suggestionsDialogGuidance),
                sourceUrl: convByVar(i18n.sourceUrl),
                suggestedCategories: convByVar(i18n.suggestedCategories),
                selectAtLeastOne: convByVar(i18n.selectAtLeastOneCategory),
                optionalComment: convByVar(i18n.optionalComment),
                commentPlaceholder: convByVar(i18n.commentPlaceholder),
                reliabilityGuidance: convByVar(i18n.suggestionsDialogReliabilityGuidance),
                reliabilityProjects: convByVar(i18n.reliabilityProjects),
                submit: convByVar(i18n.submit),
                submitting: convByVar(i18n.submitting),
                cancel: convByVar(i18n.cancel)
            },
            data() {
                return {
                    open: true,
                    sourceUrl: getPrimarySourceUrl(citationRef.coins),
                    selectedCategories: [],
                    comment: '',
                    isSubmitting: false
                };
            },
            computed: {
                availableCategories() {
                    return getAvailableCategories(getSettingCategories, getCategoryDisplayName);
                },
                reliabilityProjects() {
                    const pageLinks = Object.values(sourceToPageMapping);
                    const projects = [];
                    for (const pageLink of pageLinks) {
                        const [lang, ...pageParts] = pageLink.split(':');
                        const fullPagePath = pageParts.join(':');
                        projects.push({ page: pageLink, url: `//${lang}.wikipedia.org/wiki/${fullPagePath}` });
                    }
                    return projects;
                },
                primaryAction() {
                    return {
                        label: this.isSubmitting ? this.$options.i18n.submitting : this.$options.i18n.submit,
                        actionType: 'progressive',
                        disabled: this.isSubmitting || this.selectedCategories.length === 0
                    };
                },
                defaultAction() {
                    return {
                        label: this.$options.i18n.cancel
                    };
                }
            },
            methods: {
                onPrimaryAction() {
                    this.submitSuggestion();
                },
                onDefaultAction() {
                    this.closeDialog();
                },
                onUpdateOpen(newValue) {
                    if (!newValue) {
                        this.closeDialog();
                    }
                },
                closeDialog() {
                    this.open = false;
                    closeDialogAfterAnimation(app, mountPoint);
                },
                submitSuggestion() {
                    if (this.selectedCategories.length === 0) {
                        mw.notify(this.$options.i18n.selectAtLeastOne, {
                            type: 'error',
                            title: '[Cite Unseen]'
                        });
                        return;
                    }

                    this.isSubmitting = true;
                    submitSuggestionToMeta(this.sourceUrl, this.selectedCategories, this.comment, citationRef, getCategoryDisplayName)
                        .then(() => {
                            this.closeDialog();
                            mw.notify(convByVar(i18n.suggestionSubmitted), {
                                type: 'success',
                                title: '[Cite Unseen]'
                            });
                        })
                        .catch((error) => {
                            console.error('[Cite Unseen] Failed to submit suggestion:', error);
                            mw.notify(convByVar(i18n.suggestionSubmitError) + ' ' + (error.message || error), {
                                type: 'error',
                                title: '[Cite Unseen]'
                            });
                        })
                        .finally(() => {
                            this.isSubmitting = false;
                        });
                }
            },
            template: suggestionDialogTemplate
        });

        app.component('cdx-dialog', Codex.CdxDialog)
            .component('cdx-text-input', Codex.CdxTextInput)
            .component('cdx-text-area', Codex.CdxTextArea)
            .component('cdx-checkbox', Codex.CdxCheckbox);

        app.mount('#cite-unseen-dialog-mount');
        setCurrentDialog(app, mountPoint);
    }).catch(function (error) {
        console.error('[Cite Unseen] Failed to load Codex dependencies:', error);
        mw.notify(convByVar(i18n.dialogLoadError), { type: 'error', title: '[Cite Unseen]' });
    });
}

/**
 * Get available categories for suggestions
 * @param {Function} getSettingCategories - Returns available setting category IDs
 * @param {Function} getCategoryDisplayName - Returns the localized category label
 * @returns {Object[]} Category options for the dialog
 */
function getAvailableCategories(getSettingCategories, getCategoryDisplayName) {
    const categories = getSettingCategories(false);
    return categories.map(categoryId => ({
        id: categoryId,
        label: getCategoryDisplayName(categoryId)
    }));
}

/**
 * Extract domain from URL
 * @param {string} url - Source URL
 * @returns {string} Domain name or fallback value
 */
function extractDomain(url) {
    if (!url) return 'unknown-domain';
    try {
        const urlObj = new URL(url);
        let domain = urlObj.hostname;
        // Remove www. prefix if present
        if (domain.startsWith('www.')) {
            domain = domain.substring(4);
        }
        return domain;
    } catch (e) {
        // If URL parsing fails, try to extract domain manually
        const match = url.match(/^https?:\/\/(?:www\.)?([^\/\?#]+)/i);
        return match ? match[1] : 'unknown-domain';
    }
}

/**
 * Submit suggestion to Meta Wiki by opening pre-populated edit form
 * @param {string} sourceUrl - Citation source URL
 * @param {string[]} selectedCategories - Category IDs selected by the user
 * @param {string} comment - Optional user comment
 * @param {Object} citationRef - Citation reference data
 * @param {Function} getCategoryDisplayName - Returns the localized category label
 * @returns {Promise<void>} Resolves after opening the edit form
 */
function submitSuggestionToMeta(sourceUrl, selectedCategories, comment, citationRef, getCategoryDisplayName) {
    return new Promise((resolve, reject) => {
        try {
            const domain = extractDomain(sourceUrl);

            const categoryLabels = selectedCategories.map(catId =>
                getCategoryDisplayName(catId)
            ).join(', ');

            const currentPage = mw.config.get('wgPageName');
            const currentWiki = mw.config.get('wgServerName');

            let referenceInfo = `* '''URL:''' ${sourceUrl}`;
            if (citationRef && citationRef.coins) {
                const coins = citationRef.coins;
                if (coins['rft.title']) {
                    referenceInfo += `\n* '''Title:''' ${[].concat(coins['rft.title']).join(', ')}`;
                }
                if (coins['rft.au']) {
                    referenceInfo += `\n* '''Author(s):''' ${[].concat(coins['rft.au']).join(', ')}`;
                }
                if (coins['rft.aulast']) {
                    const lastNames = [].concat(coins['rft.aulast']);
                    const firstNames = coins['rft.aufirst'] ? [].concat(coins['rft.aufirst']) : [];
                    const authors = lastNames.map((lastName, i) => {
                        const firstName = firstNames[i] || '';
                        return firstName ? `${firstName} ${lastName}` : lastName;
                    });
                    referenceInfo += `\n* '''Author(s):''' ${authors.join(', ')}`;
                }
                if (coins['rft.date']) {
                    referenceInfo += `\n* '''Date:''' ${coins['rft.date']}`;
                }
                if (coins['rft.pub'] || coins['rft.jtitle']) {
                    const publisher = coins['rft.pub'] || coins['rft.jtitle'];
                    referenceInfo += `\n* '''Publisher/Journal:''' ${[].concat(publisher).join(', ')}`;
                }
            }
            referenceInfo += `\n* '''Found on:''' [[${currentWiki.replace('.wikipedia.org', '')}:${currentPage.replace(/_/g, ' ')}]]`;
            referenceInfo += `\n* '''Suggested categories:''' ${categoryLabels}`;

            const editSummary = `Categorization suggestion for ${domain}`;
            const baseUrl = 'https://meta.wikimedia.org/w/index.php';

            let editUrl = baseUrl + '?title=' + encodeURIComponent('Talk:Cite_Unseen/Suggestions');
            editUrl += '&action=edit';
            editUrl += '&section=new';
            editUrl += '&preload=' + encodeURIComponent('Cite_Unseen/Suggestions/Template');
            editUrl += '&preloadtitle=' + encodeURIComponent(domain);
            editUrl += '&summary=' + encodeURIComponent(editSummary);

            // Add preload parameters for the template
            // $1 = reference info, $2 = optional comment
            editUrl += '&preloadparams[]=' + encodeURIComponent(referenceInfo);
            if (comment && comment.trim()) {
                editUrl += '&preloadparams[]=' + encodeURIComponent(comment.trim());
            } else {
                editUrl += '&preloadparams[]=';
            }

            let sectionContent = `${referenceInfo}`;
            if (comment && comment.trim()) {
                sectionContent += `\n${comment.trim()}`;
            }
            sectionContent += `~~~~`;

            // Open the edit form in a new tab/window
            const newWindow = window.open(editUrl, '_blank');

            if (newWindow) {
                // Copy content to clipboard as a fallback
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(sectionContent).catch(err => {
                        console.warn('[Cite Unseen] Failed to copy to clipboard:', err);
                    });
                }

                resolve();
            } else {
                reject(new Error('Failed to open edit window. Please check popup blocker settings.'));
            }
        } catch (error) {
            reject(error);
        }
    });
}
