import {
    matchUrl,
    matchUrlString
} from './ruleMatch.js';

/**
 * This module reduces the rule set before exact citation matching.
 *
 * The lookup has four explicit steps:
 * 1. Build a URL key set from every citation URL on the page.
 * 2. Use those page URL keys to filter all rules down to page-relevant rules.
 * 3. Build a rule key map from only those page-relevant rules.
 * 4. For each citation, build URL keys from that citation's URLs and look up only the matching rules in the smaller page rule map.
 *
 * URL keys are typed because rules like "gov" and "gov." have different meaning.
 * "gov" matches hostnames whose final label is gov, such as nih.gov.
 * "gov." matches hostnames where gov is followed by another label, such as gov.uk.
 */

/**
 * @typedef {Object} UrlKeySet
 * @property {Set<string>} hostSuffixKeys - Host suffixes such as www.example.com and example.com.
 * @property {Set<string>} finalLabelKeys - Final hostname labels such as gov in nih.gov.
 * @property {Set<string>} interiorHostKeys - Host suffixes before the final label, such as gov in gov.uk.
 */

/**
 * @typedef {Object} RuleKeyEntry
 * @property {string} category - Category ID that owns the rule.
 * @property {Object} rule - Source-matching rule from the categorized rules object.
 * @property {number} order - Rule order inside its category.
 */

/**
 * @typedef {Object} RuleKeyMap
 * @property {string[]} categories - Category IDs preserved for empty-result groups.
 * @property {Map<string, RuleKeyEntry[]>} hostRules - Rules keyed by host, such as example.com.
 * @property {Map<string, RuleKeyEntry[]>} finalLabelRules - Rules keyed by final hostname labels, such as gov.
 * @property {Map<string, RuleKeyEntry[]>} interiorHostRules - Trailing-dot rules keyed by host sequences that must not be final, such as gov in gov.uk.
 * @property {RuleKeyEntry[]} urlStringRules - Rules that use url_str substring matching.
 */

/**
 * @typedef {Object} RuleFilterResult
 * @property {Object.<string, Object[]>} categorizedRules - URL-matching rules grouped by category.
 * @property {number} candidateRuleCount - Candidate rule count before exact URL verification.
 */

/**
 * Create an empty URL key set.
 * @returns {UrlKeySet} URL key set.
 */
function createUrlKeySet() {
    return {
        hostSuffixKeys: new Set(),
        finalLabelKeys: new Set(),
        interiorHostKeys: new Set()
    };
}

/**
 * Create an empty rule key map.
 * @param {string[]} categories - Category IDs to preserve in lookup results.
 * @returns {RuleKeyMap} Rule key map.
 */
function createRuleKeyMap(categories) {
    return {
        categories,
        hostRules: new Map(),
        finalLabelRules: new Map(),
        interiorHostRules: new Map(),
        urlStringRules: []
    };
}

/**
 * Get a non-empty string field from a rule.
 * @param {Object} rule - Source-matching rule.
 * @param {string} key - Rule field to read.
 * @returns {string|null} Trimmed string value, or null when absent.
 */
function getRuleString(rule, key) {
    const value = rule[key];
    if (typeof value !== 'string') {
        return null;
    }

    const trimmedValue = value.trim();
    return trimmedValue === '' ? null : trimmedValue;
}

/**
 * Parse an HTTP(S) URL from a citation link.
 * @param {string} rawUrl - Raw URL from the citation DOM.
 * @returns {URL|null} Parsed URL, or null for unsupported/invalid values.
 */
function parseHttpUrl(rawUrl) {
    if (typeof rawUrl !== 'string' || rawUrl === '') {
        return null;
    }

    try {
        const baseUrl = typeof window !== 'undefined' && window.location ?
            window.location.href :
            'https://example.invalid/';
        const parsedUrl = new URL(rawUrl, baseUrl);
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:' ? parsedUrl : null;
    } catch (e) {
        return null;
    }
}

/**
 * Split a hostname into lowercase labels.
 * @param {string} hostname - URL hostname.
 * @returns {string[]} Hostname labels.
 */
function getHostnameLabels(hostname) {
    return hostname.toLowerCase().split('.').filter(Boolean);
}

/**
 * Get suffixes that may match normal domain and path rules.
 * @param {string[]} labels - Hostname labels.
 * @returns {string[]} Hostname suffixes with at least two labels.
 */
function getHostnameSuffixes(labels) {
    const suffixes = [];
    for (let index = 0; index < labels.length - 1; index++) {
        suffixes.push(labels.slice(index).join('.'));
    }
    return suffixes;
}

/**
 * Get host suffixes that end before the final hostname label.
 * @param {string[]} labels - Hostname labels.
 * @returns {string[]} Interior hostname suffixes.
 */
function getInteriorHostnameSuffixes(labels) {
    const interiorLabels = labels.slice(0, -1);
    const suffixes = [];
    for (let index = 0; index < interiorLabels.length; index++) {
        suffixes.push(interiorLabels.slice(index).join('.'));
    }
    return suffixes;
}

/**
 * Add URL keys from one parsed URL.
 * @param {UrlKeySet} urlKeySet - URL key set to update.
 * @param {URL} parsedUrl - Parsed citation URL.
 */
function addUrlKeys(urlKeySet, parsedUrl) {
    const labels = getHostnameLabels(parsedUrl.hostname);
    if (labels.length === 0) {
        return;
    }

    for (const suffix of getHostnameSuffixes(labels)) {
        urlKeySet.hostSuffixKeys.add(suffix);
    }

    urlKeySet.finalLabelKeys.add(labels[labels.length - 1]);

    for (const suffix of getInteriorHostnameSuffixes(labels)) {
        urlKeySet.interiorHostKeys.add(suffix);
    }
}

/**
 * Build typed URL keys from citation URLs.
 * @param {string[]} urls - URLs found in citations.
 * @returns {UrlKeySet} URL key set.
 */
export function buildUrlKeySet(urls) {
    const urlKeySet = createUrlKeySet();

    for (const url of new Set(urls)) {
        const parsedUrl = parseHttpUrl(url);
        if (parsedUrl) {
            addUrlKeys(urlKeySet, parsedUrl);
        }
    }

    return urlKeySet;
}

/**
 * Add a rule entry to an index map.
 * @param {Map<string, RuleKeyEntry[]>} indexMap - Target index map.
 * @param {string} key - Lookup key.
 * @param {RuleKeyEntry} entry - Rule entry to add.
 */
function addRuleKey(indexMap, key, entry) {
    if (!indexMap.has(key)) {
        indexMap.set(key, []);
    }
    indexMap.get(key).push(entry);
}

/**
 * Extract the host-like part of a rule URL.
 * @param {string} ruleUrl - Rule URL value, without protocol.
 * @returns {string|null} Lowercase host-like key, or null when no key exists.
 */
function getRuleHostKey(ruleUrl) {
    const slashIndex = ruleUrl.indexOf('/');
    const hostPart = slashIndex === -1 ? ruleUrl : ruleUrl.slice(0, slashIndex);
    const hostKey = hostPart.trim().toLowerCase();
    return hostKey === '' ? null : hostKey;
}

/**
 * Add a URL rule to the map bucket that matches its rule shape.
 * @param {RuleKeyMap} ruleKeyMap - Rule key map to update.
 * @param {RuleKeyEntry} entry - Rule entry to add.
 * @param {string} ruleUrl - Rule URL value.
 */
function addUrlRuleKey(ruleKeyMap, entry, ruleUrl) {
    const hostKey = getRuleHostKey(ruleUrl);
    if (!hostKey) {
        return;
    }

    if (hostKey.endsWith('.')) {
        // "gov." and "example.com." match only when another hostname label follows.
        const interiorHostKey = hostKey.slice(0, -1);
        if (interiorHostKey) {
            addRuleKey(ruleKeyMap.interiorHostRules, interiorHostKey, entry);
        }
        return;
    }

    if (!hostKey.includes('.')) {
        // "gov" and "mil" match hostnames where that label is the final label.
        addRuleKey(ruleKeyMap.finalLabelRules, hostKey, entry);
        return;
    }

    addRuleKey(ruleKeyMap.hostRules, hostKey, entry);
}

/**
 * Build a rule key map from categorized rules.
 * @param {Object.<string, Object[]>} categorizedRules - Rules grouped by category.
 * @param {Object.<string, string[]>} domainIgnore - Ignored domain lists grouped by category.
 * @returns {RuleKeyMap} Rule key map.
 */
export function buildRuleKeyMap(categorizedRules, domainIgnore = {}) {
    const ruleKeyMap = createRuleKeyMap(Object.keys(categorizedRules));

    for (const [category, rules] of Object.entries(categorizedRules)) {
        const ignoredDomains = domainIgnore[category] || [];

        rules.forEach((rule, order) => {
            const entry = { category, rule, order };
            const ruleUrl = getRuleString(rule, 'url');
            if (ruleUrl) {
                if (!ignoredDomains.includes(ruleUrl)) {
                    addUrlRuleKey(ruleKeyMap, entry, ruleUrl);
                }
                return;
            }

            if (getRuleString(rule, 'url_str')) {
                ruleKeyMap.urlStringRules.push(entry);
            }
        });
    }

    return ruleKeyMap;
}

/**
 * Add a candidate rule while keeping candidates grouped by category.
 * @param {Map<string, Map<Object, RuleKeyEntry>>} candidateRules - Candidate entries grouped by category.
 * @param {RuleKeyEntry} entry - Rule entry selected by URL keys.
 */
function addCandidateRule(candidateRules, entry) {
    if (!candidateRules.has(entry.category)) {
        candidateRules.set(entry.category, new Map());
    }
    candidateRules.get(entry.category).set(entry.rule, entry);
}

/**
 * Add all entries from one rule-key lookup.
 * @param {Map<string, Map<Object, RuleKeyEntry>>} candidateRules - Candidate entries grouped by category.
 * @param {Map<string, RuleKeyEntry[]>} indexMap - Source rule key map.
 * @param {string} key - URL key.
 */
function addCandidateRulesForKey(candidateRules, indexMap, key) {
    const entries = indexMap.get(key);
    if (!entries) {
        return;
    }

    for (const entry of entries) {
        addCandidateRule(candidateRules, entry);
    }
}

/**
 * Collect candidate rules by looking up URL keys in a rule key map.
 * @param {RuleKeyMap} ruleKeyMap - Rule key map.
 * @param {UrlKeySet} urlKeySet - URL keys to look up.
 * @returns {Map<string, Map<Object, RuleKeyEntry>>} Candidate entries grouped by category.
 */
function collectCandidateRules(ruleKeyMap, urlKeySet) {
    const candidateRules = new Map();

    for (const key of urlKeySet.hostSuffixKeys) {
        addCandidateRulesForKey(candidateRules, ruleKeyMap.hostRules, key);
    }

    for (const key of urlKeySet.finalLabelKeys) {
        addCandidateRulesForKey(candidateRules, ruleKeyMap.finalLabelRules, key);
    }

    for (const key of urlKeySet.interiorHostKeys) {
        addCandidateRulesForKey(candidateRules, ruleKeyMap.interiorHostRules, key);
    }

    for (const entry of ruleKeyMap.urlStringRules) {
        addCandidateRule(candidateRules, entry);
    }

    return candidateRules;
}

/**
 * Count candidate rules across all category maps.
 * @param {Map<string, Map<Object, RuleKeyEntry>>} candidateRules - Candidate entries grouped by category.
 * @returns {number} Candidate rule count.
 */
function countCandidateRules(candidateRules) {
    return Array.from(candidateRules.values()).reduce((total, rules) => total + rules.size, 0);
}

/**
 * Check whether a candidate rule truly matches at least one URL.
 * @param {Object} rule - Source-matching rule.
 * @param {Object} refLinkCoins - COinS-like object containing URLs.
 * @returns {boolean} Whether the rule matches at least one URL.
 */
function ruleMatchesUrls(rule, refLinkCoins) {
    if (getRuleString(rule, 'url')) {
        return matchUrl(refLinkCoins, rule);
    }

    if (getRuleString(rule, 'url_str')) {
        return matchUrlString(refLinkCoins, rule);
    }

    return false;
}

/**
 * Initialize every category in a filtered-rule result.
 * @param {string[]} categories - Category IDs to include.
 * @returns {Object.<string, Object[]>} Empty categorized rule groups.
 */
function createEmptyCategorizedRules(categories) {
    const categorizedRules = {};
    for (const category of categories) {
        categorizedRules[category] = [];
    }
    return categorizedRules;
}

/**
 * Convert candidate entries into exact URL-matching categorized rules.
 * @param {RuleKeyMap} ruleKeyMap - Rule key map that supplied the candidates.
 * @param {Map<string, Map<Object, RuleKeyEntry>>} candidateRules - Candidate entries grouped by category.
 * @param {string[]} urls - URLs to verify against.
 * @returns {Object.<string, Object[]>} Exact URL-matching rules grouped by category.
 */
function buildCategorizedRulesFromCandidates(ruleKeyMap, candidateRules, urls) {
    const categorizedRules = createEmptyCategorizedRules(ruleKeyMap.categories);
    const refLinkCoins = { 'rft_id': urls };

    for (const [category, ruleMap] of candidateRules) {
        categorizedRules[category] = Array.from(ruleMap.values())
            .filter(entry => ruleMatchesUrls(entry.rule, refLinkCoins))
            .sort((a, b) => a.order - b.order)
            .map(entry => entry.rule);
    }

    return categorizedRules;
}

/**
 * Look up exact URL-matching rules for a URL key set.
 * @param {RuleKeyMap} ruleKeyMap - Rule key map.
 * @param {UrlKeySet} urlKeySet - URL keys to look up.
 * @param {string[]} urls - URLs to verify against.
 * @returns {RuleFilterResult} Filtered rules and candidate count.
 */
export function getRulesForUrlKeys(ruleKeyMap, urlKeySet, urls) {
    const candidateRules = collectCandidateRules(ruleKeyMap, urlKeySet);

    return {
        categorizedRules: buildCategorizedRulesFromCandidates(ruleKeyMap, candidateRules, urls),
        candidateRuleCount: countCandidateRules(candidateRules)
    };
}

/**
 * Filter categorized rules down to rules that match the supplied URL keys and URLs.
 * @param {Object.<string, Object[]>} categorizedRules - Rules grouped by category.
 * @param {Object.<string, string[]>} domainIgnore - Ignored domain lists grouped by category.
 * @param {UrlKeySet} urlKeySet - URL keys to look up.
 * @param {string[]} urls - URLs to verify against.
 * @returns {RuleFilterResult} Filtered rules and candidate count.
 */
export function filterRulesByUrlKeys(categorizedRules, domainIgnore, urlKeySet, urls) {
    const ruleKeyMap = buildRuleKeyMap(categorizedRules, domainIgnore);
    return getRulesForUrlKeys(ruleKeyMap, urlKeySet, urls);
}
