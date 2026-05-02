let _metaRules = null; // Stores rules loaded from meta.wikimedia.org
let _localRules = null; // Stores rules loaded from local language wiki

let ruleConfig = {
    globalVars: [
        'cite_unseen_categories',
        'cite_unseen_domain_ignore',
        'cite_unseen_additional_domains',
        'cite_unseen_additional_strings',
        'cite_unseen_dashboard',
        'cite_unseen_show_suggestions',
        'cite_unseen_hide_social_media_reliability_ratings'
    ],

    mergeableProps: ['categories', 'domainIgnore', 'additionalDomains', 'additionalStrings'],
    booleanProps: ['dashboard', 'showSuggestions', 'hideSocialMediaReliabilityRatings', 'showOtherLanguageReliabilityRatings'],

    globalMapping: {
        categories: 'cite_unseen_categories',
        domainIgnore: 'cite_unseen_domain_ignore',
        additionalDomains: 'cite_unseen_additional_domains',
        additionalStrings: 'cite_unseen_additional_strings',
        dashboard: 'cite_unseen_dashboard',
        showSuggestions: 'cite_unseen_show_suggestions',
        hideSocialMediaReliabilityRatings: 'cite_unseen_hide_social_media_reliability_ratings',
        showOtherLanguageReliabilityRatings: 'cite_unseen_show_other_language_reliability_ratings'
    }
};

/**
 * Capture current state of global rule variables
 * @returns {Object} Current state of global variables
 */
function captureGlobalRulesState() {
    const state = {};
    Object.entries(ruleConfig.globalMapping).forEach(([key, globalVar]) => {
        const value = window[globalVar];
        state[key] = value && typeof value === 'object' ? { ...value } : value;
    });
    return state;
}

/**
 * Check if two states are different (deep comparison for objects)
 * @param {*} a - First value
 * @param {*} b - Second value
 * @returns {boolean} Whether values are different
 */
function isDifferent(a, b) {
    if (a === b) return false;
    if (a == null || b == null) return a !== b;
    if (typeof a === 'object' && typeof b === 'object') {
        return JSON.stringify(a) !== JSON.stringify(b);
    }
    return a !== b;
}

/**
 * Load custom rules from a specific wiki and return changes
 * @param {string} wikiHost - Wiki host to load from
 * @param {Object} previousState - Previous state to compare against
 * @returns {Promise<Object|null>} Changed rules or null if no changes/error
 */
export async function loadCustomRulesFromWiki(wikiHost, previousState = {}) {
    const userName = mw.config.get('wgUserName');

    if (!userName) {
        return null;
    }

    const encodedUserName = encodeURIComponent(userName);
    const scriptUrl = `//${wikiHost}/w/index.php?title=User:${encodedUserName}/CiteUnseen-Rules.js&ctype=text/javascript&action=raw`;

    try {
        await mw.loader.getScript(scriptUrl);
        console.log(`[Cite Unseen] Loaded custom rules from ${wikiHost}`);

        const currentState = captureGlobalRulesState();
        const changes = {};

        // Find differences
        Object.keys(currentState).forEach(key => {
            if (isDifferent(currentState[key], previousState[key])) {
                changes[key] = currentState[key];
            }
        });

        return Object.keys(changes).length > 0 ? changes : null;
    } catch (err) {
        console.log(`[Cite Unseen] No custom rules found on ${wikiHost} or error loading: ${err.message}`);
        return null;
    }
}

/**
 * Merge two rule objects with local taking priority
 * @param {Object} metaRules - Rules from meta.wikimedia.org
 * @param {Object} localRules - Rules from local wiki
 * @returns {Object} Merged rules
 */
function mergeRules(metaRules, localRules) {
    const merged = {};
    const { mergeableProps, booleanProps } = ruleConfig;

    // Merge object properties
    mergeableProps.forEach(prop => {
        const metaValue = metaRules?.[prop];
        const localValue = localRules?.[prop];

        if (localValue && metaValue) {
            // If both Meta and local have values, merge them
            merged[prop] = {};

            Object.keys(metaValue).forEach(key => {
                merged[prop][key] = metaValue[key];
            });

            Object.keys(localValue).forEach(key => {
                if (Array.isArray(metaValue[key]) && Array.isArray(localValue[key])) {
                    // For arrays, combine them (Meta + local), removing duplicates
                    merged[prop][key] = [...new Set([...(metaValue[key] || []), ...(localValue[key] || [])])];
                } else {
                    merged[prop][key] = localValue[key];
                }
            });
        } else if (localValue) {
            merged[prop] = localValue;
        } else if (metaValue) {
            merged[prop] = metaValue;
        }
    });

    // For Boolean properties, local takes precedence
    booleanProps.forEach(prop => {
        const localValue = localRules?.[prop];
        const metaValue = metaRules?.[prop];

        if (localValue !== undefined) {
            merged[prop] = localValue;
        } else if (metaValue !== undefined) {
            merged[prop] = metaValue;
        }
    });

    return merged;
}

/**
 * Apply rules to global variables
 * @param {Object} rules - Rules to apply
 */
function applyRulesToGlobals(rules) {
    Object.entries(ruleConfig.globalMapping).forEach(([key, globalVar]) => {
        if (rules[key] !== undefined) {
            window[globalVar] = rules[key];
        }
    });
}

/**
 * Apply user configurations to internal CiteUnseen objects
 * @param {Object} context - Mutable citation configuration context
 */
function applyUserConfigurations(context) {
    const {
        categorizedRules,
        citeUnseenCategories,
        citeUnseenChecklists,
        citeUnseenDomainIgnore
    } = context;

    // Apply category configurations
    if (window.cite_unseen_categories && typeof window.cite_unseen_categories === 'object') {
        for (const key in window.cite_unseen_categories) {
            if (key in citeUnseenCategories) {
                citeUnseenCategories[key] = window.cite_unseen_categories[key];
            } else {
                // Handle grouped categories (blacklisted, deprecated, etc.)
                const groupKeys = ["blacklisted", "deprecated", "generallyUnreliable", "marginallyReliable", "generallyReliable", "multi"];
                if (groupKeys.includes(key)) {
                    for (const checklistTypeData of citeUnseenChecklists) {
                        if (checklistTypeData[0] === key) {
                            for (const checklist of checklistTypeData[1]) {
                                citeUnseenCategories[checklist] = window.cite_unseen_categories[key];
                            }
                        }
                    }
                }
            }
        }
    }

    // Apply domain ignore lists
    if (window.cite_unseen_domain_ignore && typeof window.cite_unseen_domain_ignore === 'object') {
        for (const key in window.cite_unseen_domain_ignore) {
            if (window.cite_unseen_domain_ignore[key]?.length && key in citeUnseenDomainIgnore) {
                citeUnseenDomainIgnore[key] = window.cite_unseen_domain_ignore[key];
            }
        }
    }

    // Apply additional domains and strings
    ['cite_unseen_additional_domains', 'cite_unseen_additional_strings'].forEach(configType => {
        const config = window[configType];
        if (config && typeof config === 'object') {
            const ruleKey = configType.includes('domains') ? 'url' : 'url_str';

            for (const key in config) {
                if (config[key]?.length && key in categorizedRules) {
                    const items = Array.isArray(config[key]) ? config[key] : [config[key]];
                    const rules = items.map(item => ({ [ruleKey]: item }));
                    categorizedRules[key] = categorizedRules[key].concat(rules);
                }
            }
        }
    });
}

/**
 * Load and merge custom rules from meta and local wikis
 * @param {Object} context - Mutable citation configuration context
 */
export async function importCustomRules(context) {
    try {
        // Check if logged in
        const userName = mw.config.get('wgUserName');
        if (!userName) {
            return;
        }

        // Get initial state and load rules from Meta Wiki
        const initialState = captureGlobalRulesState();
        const metaRules = await loadCustomRulesFromWiki('meta.wikimedia.org', initialState);
        const metaState = captureGlobalRulesState();
        _metaRules = {
            categories: metaState.categories || {},
            domainIgnore: metaState.domainIgnore || {},
            additionalDomains: metaState.additionalDomains || {},
            additionalStrings: metaState.additionalStrings || {},
            dashboard: metaState.dashboard !== undefined ? metaState.dashboard : true,
            showSuggestions: metaState.showSuggestions !== undefined ? metaState.showSuggestions : true,
            hideSocialMediaReliabilityRatings: metaState.hideSocialMediaReliabilityRatings === true || false,
            showOtherLanguageReliabilityRatings: metaState.showOtherLanguageReliabilityRatings === true || false
        };

        // Load local rules
        const localRules = await loadCustomRulesFromWiki(
            mw.config.get('wgServer').replace('//', ''),
            metaState
        );

        _localRules = {
            categories: localRules?.categories || {},
            domainIgnore: localRules?.domainIgnore || {},
            additionalDomains: localRules?.additionalDomains || {},
            additionalStrings: localRules?.additionalStrings || {},
            dashboard: localRules?.dashboard !== undefined ? localRules.dashboard : true,
            showSuggestions: localRules?.showSuggestions !== undefined ? localRules.showSuggestions : true,
            hideSocialMediaReliabilityRatings: localRules?.hideSocialMediaReliabilityRatings === true || false,
            showOtherLanguageReliabilityRatings: localRules?.showOtherLanguageReliabilityRatings === true || false
        };

        // Merge and apply all rules
        const mergedRules = mergeRules(metaRules, localRules);
        applyRulesToGlobals(mergedRules);

        applyUserConfigurations(context);

    } catch (err) {
        console.log('[Cite Unseen] Error during custom rules import:', err);
    }
}

/**
 * Get meta rules from global variables (rules that were loaded from meta.wikimedia.org)
 * @returns {Object} Meta rules object
 */
export function getMetaRulesFromGlobals() {
    // Return the stored meta rules if available, otherwise default to empty
    return _metaRules || {
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
 * Get local rules from global variables
 * @returns {Object} Local rules object
 */
export function getLocalRulesFromGlobals() {
    return _localRules || {
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
 * Store loaded Meta wiki rules.
 * @param {Object} rules - Meta rules
 */
export function setMetaRules(rules) {
    _metaRules = rules;
}

/**
 * Store loaded local wiki rules.
 * @param {Object} rules - Local rules
 */
export function setLocalRules(rules) {
    _localRules = rules;
}
