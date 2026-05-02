import citeUnseenStyles from './styles.css';
import CiteUnseenI18n from './i18n.js';
import {
    getLocalRulesFromGlobals,
    getMetaRulesFromGlobals,
    importCustomRules,
    loadCustomRulesFromWiki,
    setLocalRules,
    setMetaRules
} from './config.js';
import {
    citeUnseenCategories as defaultCiteUnseenCategories,
    citeUnseenCategoryData as defaultCiteUnseenCategoryData,
    citeUnseenCategoryTypes as defaultCiteUnseenCategoryTypes
} from './citations/categoryData.js';
import {
    citeUnseenChecklists as defaultCiteUnseenChecklists,
    citeUnseenSourceToPageMapping
} from './citations/sourceData.js';
import {
    getCategorizedRules,
    resolveSourceToPageLink
} from './citations/sources.js';
import { findCitations, getPrimarySourceUrl } from './citations/parser.js';
import dialogStyles from './ui/dialog.css';
import settingsDialogStyles from './ui/settingsDialog.css';
import suggestionDialogStyles from './ui/suggestionDialog.css';
import { addIcons } from './ui/icons.js';
import { createDashboardForReflist } from './ui/dashboard.js';
import { createButtons } from './ui/reflistButtons.js';

// ===============================
// PROPERTIES AND STATE
// ===============================
let categorizedRules = null;
let citeUnseenCategories = null;
let citeUnseenCategoryTypes = null;
let citeUnseenChecklists = null;
let citeUnseenCategoryData = null;
let citeUnseenDomainIgnore = {};
let refs = [];
let refLinks = [];
let refCategories = {};
let reflists = [];
let convByVar = null;

// ===============================
// DATA LOADING AND CITATION PROCESSING
// ===============================

/**
 * Inject bundled CSS styles.
 */
function injectStyles() {
    if (document.getElementById('cite-unseen-bundled-styles')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'cite-unseen-bundled-styles';
    style.type = 'text/css';
    style.textContent = [
        citeUnseenStyles,
        dialogStyles,
        settingsDialogStyles,
        suggestionDialogStyles
    ].join('\n');
    document.head.appendChild(style);
}

/**
 * Import dependencies and categorized rules.
 * This function loads the CiteUnseenData module and sets up the convByVar function for language conversion.
 * @returns {Promise<Record<string, Object[]>>}
 */
async function importDependencies() {
    injectStyles();

    if (mw.config.get('wgServer') === "//zh.wikipedia.org") {
        // On Chinese Wikipedia, prioritize using the ext.gadget.HanAssist module.
        await mw.loader.using('ext.gadget.HanAssist', function (require) {
            const hanAssist = require('ext.gadget.HanAssist');
            convByVar = hanAssist.convByVar;
        });
    } else {
        const lang = mw.config.get('wgContentLanguage');
        convByVar = function (i18nDict) {
            const locale = new Intl.Locale(lang);
            if (locale.language === 'zh') {
                if (locale.script === 'Hans') {
                    return i18nDict['hans'] || i18nDict['hant'] || i18nDict['en'] || 'Language undefined!';
                } else {
                    return i18nDict['hant'] || i18nDict['hans'] || i18nDict['en'] || 'Language undefined!';
                }
            }
            return i18nDict[lang] || i18nDict['en'] || 'Language undefined!';
        };
    }
    return await getCategorizedRules();
}

/**
 * Returns an array of all setting categories.
 * @param {boolean} includeReliability - Whether reliability categories should be included
 * @returns {string[]}
 */
function getSettingCategories(includeReliability = true) {
    // Get all type categories from citeUnseenCategoryTypes
    const typeCategories = citeUnseenCategoryTypes;

    if (!includeReliability) {
        return [...typeCategories, 'unknown'];
    }

    // Get all reliability categories from citeUnseenChecklists
    const reliabilityCategories = citeUnseenChecklists ?
        citeUnseenChecklists.map(x => x[0]) :
        ['generallyReliable', 'marginallyReliable', 'generallyUnreliable', 'deprecated', 'blacklisted', 'multi'];

    // Combine all categories + unknown
    return [...typeCategories, ...reliabilityCategories, 'unknown'];
}

/**
 * Returns the localized display name for a category.
 * @param {string} categoryId - The category identifier
 * @returns {string} The localized display name
 */
function getCategoryDisplayName(categoryId) {
    // Map some category IDs to their proper display names in i18n
    const categoryMappings = {
        'rspDeprecated': 'deprecated',
        'rspBlacklisted': 'blacklisted',
        'rspGenerallyUnreliable': 'generallyUnreliable',
        'rspMarginallyReliable': 'marginallyReliable',
        'rspGenerallyReliable': 'generallyReliable',
        'rspMulti': 'multi'
    };

    const displayKey = categoryMappings[categoryId] || categoryId;

    if (CiteUnseenI18n.categoryLabels[displayKey]) {
        return convByVar(CiteUnseenI18n.categoryLabels[displayKey]);
    }

    // Fallback to the category ID with proper capitalization
    return categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
}

// ===============================
// INITIALIZATION
// ===============================

function init() {
    // Singleton
    if (window._citeUnseenInitialized) {
        return;
    }
    window._citeUnseenInitialized = true;

    console.time('[Cite Unseen] Dependency runtime');

    // Import source categorization data
    importDependencies().then(function (categorizedRulesData) {
        categorizedRules = categorizedRulesData;
        citeUnseenCategories = defaultCiteUnseenCategories;
        citeUnseenCategoryTypes = defaultCiteUnseenCategoryTypes;
        citeUnseenChecklists = defaultCiteUnseenChecklists;
        citeUnseenCategoryData = defaultCiteUnseenCategoryData;

        // Fill in missing parameters
        for (const key of Object.keys(categorizedRules)) {
            if (citeUnseenCategories[key] === undefined) {
                citeUnseenCategories[key] = true;
            }
        }

        // Import user custom rules
        importCustomRules({
            categorizedRules,
            citeUnseenCategories,
            citeUnseenChecklists,
            citeUnseenDomainIgnore
        }).then(function () {
            console.timeEnd('[Cite Unseen] Dependency runtime');

            // Run on every wikipage.content hook. This is to support gadgets like QuickEdit.
            mw.hook('wikipage.content').add(function () {
                if (window.citeUnseenLoaded) {
                    return;
                }
                window.citeUnseenLoaded = true;
                console.time('[Cite Unseen] Render runtime');

                findCitations().then(function (citationState) {
                    refs = citationState.refs;
                    refLinks = citationState.refLinks;
                    reflists = citationState.reflists;
                    refCategories = {};

                    if (refs.length === 0) {
                        console.timeEnd('[Cite Unseen] Render runtime');
                        return;
                    }

                    // Add icons to citations
                    refCategories = addIcons({
                        categorizedRules,
                        citeUnseenCategories,
                        citeUnseenCategoryTypes,
                        citeUnseenChecklists,
                        citeUnseenCategoryData,
                        citeUnseenDomainIgnore,
                        refs,
                        refLinks,
                        convByVar,
                        i18n: CiteUnseenI18n,
                        resolveSourceToPageLink
                    });

                    for (const reflistData of reflists) {
                        if (window.cite_unseen_dashboard !== false) {
                            // Create dashboards for each reflist that has citations
                            createDashboardForReflist(reflistData, {
                                refCategories,
                                citeUnseenChecklists,
                                citeUnseenCategoryTypes,
                                citeUnseenCategoryData,
                                convByVar,
                                i18n: CiteUnseenI18n
                            });
                        }

                        // Create buttons for each reflist that has a dashboard
                        createButtons(reflistData, {
                            convByVar,
                            i18n: CiteUnseenI18n,
                            getSettingCategories,
                            getCategoryDisplayName,
                            loadCustomRulesFromWiki,
                            getMetaRules: getMetaRulesFromGlobals,
                            getLocalRules: getLocalRulesFromGlobals,
                            setMetaRules,
                            setLocalRules,
                            getPrimarySourceUrl,
                            sourceToPageMapping: citeUnseenSourceToPageMapping
                        });
                    }

                    console.timeEnd('[Cite Unseen] Render runtime');
                });
            });
        });
    });
}

init();
