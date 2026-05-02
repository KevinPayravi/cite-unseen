import settingsDialogTemplate from './settingsDialog.template.vue';
import {
    closeCurrentDialog,
    closeDialogAfterAnimation,
    ensureDialogMount,
    setCurrentDialog
} from './dialogMount.js';

/**
 * @typedef {Object} SettingsDialogOptions
 * @property {Function} convByVar - MediaWiki message conversion helper
 * @property {Object} i18n - Cite Unseen i18n message map
 * @property {Function} getSettingCategories - Returns available setting category IDs
 * @property {Function} getCategoryDisplayName - Returns the localized category label
 * @property {Function} loadCustomRulesFromWiki - Loads user rules from a wiki host
 * @property {Function} getMetaRules - Returns the cached Meta-wiki rules
 * @property {Function} getLocalRules - Returns the cached local-wiki rules
 * @property {Function} setMetaRules - Updates the cached Meta-wiki rules
 * @property {Function} setLocalRules - Updates the cached local-wiki rules
 */

/**
 * Get the default complete settings object used by Meta-wiki rules.
 * @returns {Object} Default settings
 */
function getDefaultSettings() {
    return {
        categories: {},
        domainIgnore: {},
        additionalDomains: {},
        additionalStrings: {},
        dashboard: true,
        showSuggestions: true,
        hideSocialMediaReliabilityRatings: false,
        showOtherLanguageReliabilityRatings: false
    };
}

/**
 * Get an empty local rules object that can inherit defaults from Meta.
 * @returns {Object} Empty local rules
 */
function getEmptyLocalRules() {
    return {
        categories: {},
        domainIgnore: {},
        additionalDomains: {},
        additionalStrings: {}
    };
}

/**
 * Build the localized strings exposed to the settings dialog component.
 * @param {Function} convByVar - MediaWiki message conversion helper
 * @param {Object} i18n - Cite Unseen i18n message map
 * @returns {Object} Localized dialog strings
 */
function getDialogI18n(convByVar, i18n) {
    return {
        documentationLink: convByVar(i18n.documentationLink),
        viewSettingsFrom: convByVar(i18n.viewSettingsFrom),
        loading: convByVar(i18n.loading),
        metaWikiGlobal: convByVar(i18n.metaWikiGlobal),
        local: convByVar(i18n.local),
        localSettingGuidance: convByVar(i18n.localSettingGuidance),
        tabGeneral: convByVar(i18n.tabGeneral),
        tabCategories: convByVar(i18n.tabCategories),
        tabIgnoreDomains: convByVar(i18n.tabIgnoreDomains),
        tabAdditionalDomains: convByVar(i18n.tabAdditionalDomains),
        tabAdditionalStrings: convByVar(i18n.tabAdditionalStrings),
        categoriesTabGuidance: convByVar(i18n.categoriesTabGuidance),
        ignoreDomainsTabGuidance: convByVar(i18n.ignoreDomainsTabGuidance),
        additionalDomainsTabGuidance: convByVar(i18n.additionalDomainsTabGuidance),
        additionalStringsTabGuidance: convByVar(i18n.additionalStringsTabGuidance),
        enableDisableCategories: convByVar(i18n.enableDisableCategories),
        showDashboard: convByVar(i18n.showDashboard),
        showSuggestionsButton: convByVar(i18n.showSuggestionsButton),
        hideSocialMediaReliabilityRatings: convByVar(i18n.hideSocialMediaReliabilityRatings),
        showOtherLanguageReliabilityRatings: convByVar(i18n.showOtherLanguageReliabilityRatings),
        domainsToIgnore: convByVar(i18n.domainsToIgnore),
        additionalDomains: convByVar(i18n.additionalDomains),
        additionalUrlStrings: convByVar(i18n.additionalUrlStrings)
    };
}

/**
 * Save settings to user's MediaWiki config page
 * @param {Object} settings - Settings object to save
 * @param {String} target - Target wiki ('meta' or 'local')
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 * @param {SettingsDialogOptions} options - Dialog dependencies
 */
function saveSettingsToWiki(settings, target, onSuccess, onError, options) {
    const pageTitle = 'User:' + mw.config.get('wgUserName') + '/CiteUnseen-Rules.js';
    const targetApi = target === 'meta' ?
        new mw.ForeignApi('//meta.wikimedia.org/w/api.php') :
        new mw.Api();

    targetApi.postWithToken('csrf', {
        action: 'edit',
        title: pageTitle,
        text: generateSettingsContent(settings, target, options),
        summary: `[Cite Unseen] Updating settings via settings menu`,
    }).done(function (result) {
        if (result.edit && result.edit.result === 'Success') {
            if (onSuccess) onSuccess(result);
        } else {
            const error = new Error('Failed to save settings');
            if (onError) onError(error);
        }
    }).fail(function (error) {
        console.error('Failed to save settings:', error);
        if (onError) onError(error);
    });
}

// ===============================
// SETTINGS DIALOG AND CONFIG
// ===============================

/**
 * Create and show the Codex settings dialog
 * @param {SettingsDialogOptions} options - Dialog dependencies
 */
function createSettingsDialog(options) {
    const {
        convByVar,
        i18n,
        getSettingCategories,
        getCategoryDisplayName,
        loadCustomRulesFromWiki,
        getMetaRules,
        getLocalRules,
        setMetaRules,
        setLocalRules
    } = options;

    mw.loader.using('@wikimedia/codex').then(function (require) {
        const Vue = require('vue');
        const Codex = require('@wikimedia/codex');
        const mountPoint = ensureDialogMount();
        let app = null;

        app = Vue.createMwApp({
            i18n: getDialogI18n(convByVar, i18n),
            data() {
                return {
                    open: true,
                    activeTab: 'general',
                    target: 'meta', // 'meta' or 'local'
                    settings: getDefaultSettings(),
                    isSaving: false,
                    cleanupTimer: null
                };
            },
            computed: {
                categories() {
                    return getSettingCategories();
                },
                categoriesForDomains() {
                    return getSettingCategories().filter(category => category !== 'unknown');
                },
                dialogTitle() {
                    return convByVar(i18n.settingsDialogTitle);
                },
                primaryAction() {
                    return {
                        label: this.isSaving ? convByVar(i18n.saving) : convByVar(i18n.save),
                        actionType: 'progressive',
                        disabled: this.isSaving
                    };
                },
                defaultAction() {
                    return {
                        label: convByVar(i18n.cancel)
                    };
                },
                targetWikiDisplayName() {
                    const siteName = mw.config.get('wgSiteName') || '';

                    // wbCurrentSiteDetails.shortName (not available on all skins/wikis)
                    const wbSiteDetails = mw.config.get('wbCurrentSiteDetails');
                    if (wbSiteDetails && wbSiteDetails.shortName) {
                        return `${wbSiteDetails.shortName} ${siteName}`;
                    }

                    // Fallback to wgContentLanguage
                    let langCode = mw.config.get('wgContentLanguage') || '';

                    // Fallback to extract language from wgDBname
                    if (!langCode) {
                        const dbName = mw.config.get('wgDBname') || '';
                        const langMatch = dbName.match(/^([a-z\-]+)wiki/);
                        langCode = langMatch ? langMatch[1] : '';
                    }

                    return langCode ? `${langCode.toUpperCase()} ${siteName}` : siteName;
                }
            },
            methods: {
                getCategoryDisplayName(categoryId) {
                    return getCategoryDisplayName(categoryId);
                },
                validateDomain(domain) {
                    // Check if domain matches expected format: name.tld
                    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
                    return domainRegex.test(domain);
                },
                cleanDomainInput(input) {
                    if (!input || typeof input !== 'string') return input;

                    let cleaned = input.trim();

                    // Extract domain from URL if it contains protocol
                    if (cleaned.includes('://')) {
                        try {
                            cleaned = new URL(cleaned).hostname;
                        } catch (e) {
                            const match = cleaned.match(/^https?:\/\/([^\/\?#]+)/i);
                            if (match) cleaned = match[1];
                        }
                    }

                    // Clean up the domain
                    cleaned = cleaned.split(/[\/\?#:]/)[0]; // Remove path, query, fragment, port
                    if (cleaned.startsWith('www.')) cleaned = cleaned.substring(4);

                    return cleaned.toLowerCase();
                },
                validateAndCleanDomains(domainsText) {
                    const domains = domainsText.trim() ? domainsText.split('\n').map(s => s.trim()).filter(Boolean) : [];
                    const validDomains = [];
                    const invalidDomains = [];
                    const correctedDomains = [];

                    domains.forEach(domain => {
                        const originalDomain = domain;
                        const cleanedDomain = this.cleanDomainInput(domain);

                        if (this.validateDomain(cleanedDomain)) {
                            validDomains.push(cleanedDomain);
                            if (cleanedDomain !== originalDomain) {
                                correctedDomains.push({ original: originalDomain, corrected: cleanedDomain });
                            }
                        } else {
                            invalidDomains.push(originalDomain);
                        }
                    });

                    return { validDomains, invalidDomains, correctedDomains };
                },
                onPrimaryAction() {
                    this.saveSettings();
                },
                onDefaultAction() {
                    this.closeDialog();
                },
                onUpdateOpen(newValue) {
                    if (!newValue) {
                        this.closeDialog();
                    }
                },
                onDomainInputChange(category, type) {
                    if (this.cleanupTimer) {
                        clearTimeout(this.cleanupTimer);
                    }

                    this.cleanupTimer = setTimeout(() => {
                        const textKey = type === 'ignore' ? 'domainIgnore' : 'additionalDomains';
                        const currentText = this.settings[textKey][category] || '';
                        const result = this.validateAndCleanDomains(currentText);

                        if (result.correctedDomains.length > 0) {
                            this.settings[textKey][category] = result.validDomains.join('\n');
                        }
                    }, 1000); // 1 second delay after user stops typing
                },
                onTargetChange() {
                    // Show loading state
                    this.isSaving = true;

                    // Clear current settings
                    this.settings = getDefaultSettings();

                    // Determine which wiki to load from
                    const wikiHost = this.target === 'meta' ?
                        'meta.wikimedia.org' :
                        mw.config.get('wgServer').replace('//', '');

                    // Clear global variables
                    const globalVars = [
                        'cite_unseen_categories',
                        'cite_unseen_domain_ignore',
                        'cite_unseen_additional_domains',
                        'cite_unseen_additional_strings',
                        'cite_unseen_dashboard',
                        'cite_unseen_show_suggestions',
                        'cite_unseen_hide_social_media_reliability_ratings',
                        'cite_unseen_show_other_language_reliability_ratings'
                    ];
                    globalVars.forEach(varName => {
                        delete window[varName];
                    });

                    // Load fresh settings from the selected wiki
                    loadCustomRulesFromWiki(wikiHost, {})
                        .then(rules => {
                            if (this.target === 'meta') {
                                // For meta rules, use defaults for any undefined values
                                const defaultRules = getDefaultSettings();
                                setMetaRules(rules ? { ...defaultRules, ...rules } : defaultRules);
                            } else {
                                // For local rules, preserve undefined values to inherit defaults from Meta
                                const emptyRules = getEmptyLocalRules();
                                setLocalRules(rules ? { ...emptyRules, ...rules } : emptyRules);
                            }

                            this.loadCurrentSettings();
                        })
                        .catch(error => {
                            console.warn(`[Cite Unseen] Failed to load settings from ${wikiHost}:`, error);
                            if (this.target === 'meta') {
                                // Set default rules for meta if loading fails
                                setMetaRules(getDefaultSettings());
                            } else {
                                setLocalRules(getEmptyLocalRules());
                            }

                            this.loadCurrentSettings();
                        })
                        .finally(() => {
                            this.isSaving = false;
                        });
                },
                closeDialog() {
                    this.open = false;
                    closeDialogAfterAnimation(app, mountPoint);
                },
                loadCurrentSettings() {
                    // Load settings based on current target
                    const targetRules = this.target === 'meta' ?
                        getMetaRules() :
                        getLocalRules();

                    if (this.target === 'meta') {
                        // Load category settings
                        this.categories.forEach(category => {
                            this.settings.categories[category] = targetRules.categories?.[category] !== false;
                        });

                        // Load boolean settings
                        this.settings.dashboard = targetRules.dashboard !== false;
                        this.settings.showSuggestions = targetRules.showSuggestions !== false;
                        this.settings.hideSocialMediaReliabilityRatings = targetRules.hideSocialMediaReliabilityRatings === true;
                        this.settings.showOtherLanguageReliabilityRatings = targetRules.showOtherLanguageReliabilityRatings === true;
                    } else {
                        // For local rules, inherit from Meta if undefined, otherwise use local value
                        const metaRules = getMetaRules();

                        // Load category settings
                        this.categories.forEach(category => {
                            this.settings.categories[category] = targetRules.categories?.[category] !== undefined ?
                                targetRules.categories[category] :
                                (metaRules.categories?.[category] !== false);
                        });

                        // Load boolean settings
                        this.settings.dashboard = targetRules.dashboard !== undefined ?
                            targetRules.dashboard :
                            (metaRules.dashboard !== false);

                        this.settings.showSuggestions = targetRules.showSuggestions !== undefined ?
                            targetRules.showSuggestions :
                            (metaRules.showSuggestions !== false);

                        this.settings.hideSocialMediaReliabilityRatings = targetRules.hideSocialMediaReliabilityRatings !== undefined ?
                            targetRules.hideSocialMediaReliabilityRatings :
                            (metaRules.hideSocialMediaReliabilityRatings === true);

                        this.settings.showOtherLanguageReliabilityRatings = targetRules.showOtherLanguageReliabilityRatings !== undefined ?
                            targetRules.showOtherLanguageReliabilityRatings :
                            (metaRules.showOtherLanguageReliabilityRatings === true);
                    }

                    // Load list settings
                    this.categories.forEach(category => {
                        this.settings.domainIgnore[category] = (targetRules.domainIgnore?.[category] || []).join('\n');
                        this.settings.additionalDomains[category] = (targetRules.additionalDomains?.[category] || []).join('\n');
                        this.settings.additionalStrings[category] = (targetRules.additionalStrings?.[category] || []).join('\n');
                    });
                },
                saveSettings() {
                    this.isSaving = true;

                    const processedSettings = {
                        categories: { ...this.settings.categories },
                        domainIgnore: {},
                        additionalDomains: {},
                        additionalStrings: {},
                        dashboard: this.settings.dashboard,
                        showSuggestions: this.settings.showSuggestions,
                        hideSocialMediaReliabilityRatings: this.settings.hideSocialMediaReliabilityRatings,
                        showOtherLanguageReliabilityRatings: this.settings.showOtherLanguageReliabilityRatings
                    };

                    const validationErrors = [];
                    const allCorrections = [];

                    // Process text areas into arrays
                    this.categories.forEach(category => {
                        const processTextArea = (text) => text.trim() ? text.split('\n').map(s => s.trim()).filter(Boolean) : [];

                        // Helper function to process domain validation
                        const processDomains = (domains, type) => {
                            const result = this.validateAndCleanDomains(domains || '');

                            if (result.invalidDomains.length > 0) {
                                validationErrors.push(`${this.getCategoryDisplayName(category)} - Invalid ${type} domains: ${result.invalidDomains.join(', ')}`);
                            }

                            if (result.correctedDomains.length > 0) {
                                allCorrections.push({
                                    category: this.getCategoryDisplayName(category),
                                    type: `${type} domains`,
                                    corrections: result.correctedDomains
                                });
                            }

                            return result.validDomains;
                        };

                        if (category !== 'unknown') {
                            // Process ignore and additional domains
                            processedSettings.domainIgnore[category] = processDomains(this.settings.domainIgnore[category], 'ignore');
                            processedSettings.additionalDomains[category] = processDomains(this.settings.additionalDomains[category], 'additional');
                            processedSettings.additionalStrings[category] = processTextArea(this.settings.additionalStrings[category] || '');
                        }
                    });

                    // Show corrections made (if any)
                    if (allCorrections.length > 0) {
                        let correctionMessages = [];
                        allCorrections.forEach(correction => {
                            correction.corrections.forEach(c => {
                                correctionMessages.push(`${correction.category} (${correction.type}): "${c.original}" -> "${c.corrected}"`);
                            });
                        });

                        const correctionMessage = convByVar(i18n.domainsCorrectedMessage) + '\n\n' + correctionMessages.join('\n');

                        mw.notify(correctionMessage, {
                            type: 'info',
                            title: '[Cite Unseen]',
                            autoHide: true
                        });

                        // Update the form with corrected values
                        this.categories.forEach(category => {
                            ['domainIgnore', 'additionalDomains'].forEach(type => {
                                const result = this.validateAndCleanDomains(this.settings[type][category] || '');
                                if (result.correctedDomains.length > 0) {
                                    this.settings[type][category] = result.validDomains.join('\n');
                                }
                            });
                        });
                    }

                    // If there are validation errors, show them and stop
                    if (validationErrors.length > 0) {
                        this.isSaving = false;
                        const errorMessage = convByVar(i18n.invalidDomainFormatMessage) + '\n\n' + validationErrors.join('\n');

                        mw.notify(errorMessage, {
                            type: 'error',
                            title: '[Cite Unseen]',
                            autoHide: false
                        });
                        return;
                    }

                    saveSettingsToWiki(
                        processedSettings,
                        this.target,
                        (result) => {
                            this.closeDialog();
                            if (confirm(convByVar(i18n.settingsSavedSuccess))) {
                                location.reload();
                            }
                        },
                        (error) => {
                            mw.notify(convByVar(i18n.settingsSaveError) + ' ' + (error.message || error), {
                                type: 'error',
                                title: '[Cite Unseen]'
                            });
                        },
                        options
                    );

                    this.isSaving = false;
                }
            },
            mounted() {
                this.loadCurrentSettings();
            },
            template: settingsDialogTemplate
        });

        app.component('cdx-dialog', Codex.CdxDialog)
            .component('cdx-tabs', Codex.CdxTabs)
            .component('cdx-tab', Codex.CdxTab)
            .component('cdx-checkbox', Codex.CdxCheckbox)
            .component('cdx-text-area', Codex.CdxTextArea)
            .component('cdx-radio', Codex.CdxRadio);

        app.mount('#cite-unseen-dialog-mount');
        setCurrentDialog(app, mountPoint);
    }).catch(function (error) {
        console.error('[Cite Unseen] Failed to load Codex dependencies:', error);
        mw.notify(convByVar(i18n.dialogLoadError), { type: 'error', title: '[Cite Unseen]' });
    });
}

/**
 * Generate JavaScript content for the settings file
 * @param {Object} settings - Settings object to save
 * @param {String} target - Target wiki ('meta' or 'local')
 * @param {SettingsDialogOptions} options - Dialog dependencies
 * @returns {String} JavaScript settings page content
 */
function generateSettingsContent(settings, target = 'meta', options) {
    const formatObject = (obj) => {
        const entries = Object.entries(obj).map(([key, value]) => {
            if (Array.isArray(value)) {
                const items = value.map(item => `"${item}"`).join(', ');
                return `  "${key}": [${items}]`;
            }
            return `  "${key}": ${value}`;
        });
        return `{\n${entries.join(',\n')}\n}`;
    };

    let content = `// Cite Unseen Settings
cite_unseen_categories = ${formatObject(settings.categories)};
cite_unseen_domain_ignore = ${formatObject(settings.domainIgnore)};
cite_unseen_additional_domains = ${formatObject(settings.additionalDomains)};
cite_unseen_additional_strings = ${formatObject(settings.additionalStrings)};`;

    if (target === 'meta') {
        // For Meta wiki, only include boolean settings if they differ from default (true)
        if (settings.dashboard === false) {
            content += `\n// Dashboard visibility setting
cite_unseen_dashboard = ${settings.dashboard};`;
        }

        if (settings.showSuggestions === false) {
            content += `\n// Suggestions button visibility setting
cite_unseen_show_suggestions = ${settings.showSuggestions};`;
        }

        if (settings.hideSocialMediaReliabilityRatings === true) {
            content += `\n// Hide social media reliability ratings setting
cite_unseen_hide_social_media_reliability_ratings = ${settings.hideSocialMediaReliabilityRatings};`;
        }

        if (settings.showOtherLanguageReliabilityRatings === true) {
            content += `\n// Show other language reliability ratings setting
cite_unseen_show_other_language_reliability_ratings = ${settings.showOtherLanguageReliabilityRatings};`;
        }
    } else {
        // For local wiki, include boolean settings if they differ from Meta settings
        const metaRules = options.getMetaRules();

        const metaDashboard = metaRules.dashboard !== false; // Meta default logic
        const metaShowSuggestions = metaRules.showSuggestions !== false; // Meta default logic
        const metaRulesHideSocialMedia = metaRules.hideSocialMediaReliabilityRatings === true; // Meta default logic
        const metaRulesShowOtherLanguage = metaRules.showOtherLanguageReliabilityRatings === true; // Meta default logic

        if (settings.dashboard !== metaDashboard) {
            content += `\n\n// Dashboard visibility setting
cite_unseen_dashboard = ${settings.dashboard};`;
        }

        if (settings.showSuggestions !== metaShowSuggestions) {
            content += `\n\n// Suggestions button visibility setting
cite_unseen_show_suggestions = ${settings.showSuggestions};`;
        }

        if (settings.hideSocialMediaReliabilityRatings !== metaRulesHideSocialMedia) {
            content += `\n\n// Hide social media reliability ratings setting
cite_unseen_hide_social_media_reliability_ratings = ${settings.hideSocialMediaReliabilityRatings};`;
        }

        if (settings.showOtherLanguageReliabilityRatings !== metaRulesShowOtherLanguage) {
            content += `\n\n// Show other language reliability ratings setting
cite_unseen_show_other_language_reliability_ratings = ${settings.showOtherLanguageReliabilityRatings};`;
        }
    }

    return content + '\n';
}

/**
 * Open the settings dialog
 * @param {SettingsDialogOptions} options - Dialog dependencies
 */
export function openSettingsDialog(options) {
    closeCurrentDialog();
    createSettingsDialog(options);
}
