import {
    citeUnseenSources,
    citeUnseenSourceToCategoryMapping,
    citeUnseenSourceToPageMapping
} from './sourceData.js';

let _sourceRevisions = null; // Stores revision IDs fetched from cite-unseen-revids
let _categorizedRules = null; // Stores source rules loaded from source definition pages

/**
 * Revision IDs for source pages. When specified, these revision IDs will be used
 * instead of fetching the latest revision. Set to null to use latest revision.
 * @type {Promise<Object.<string, number>>}
 * @constant
 */
async function citeUnseenSourceRevisions() {
    const revidJsonUrl = 'https://gitlab-content.toolforge.org/kevinpayravi/cite-unseen-revids/-/raw/main/revids.json?mime=text/plain';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(revidJsonUrl, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Failed to fetch revision IDs: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Failed to fetch revision IDs: Request timed out after 5 seconds');
        }
        throw error;
    }
}

/**
 * Resolve a source page name to its corresponding category.
 * If no mapping exists, returns the original page name.
 * @param {string} sourcePageName - The source page name to resolve.
 * @returns {string} The resolved category name.
 */
function resolveSourceToCategory(sourcePageName) {
    return citeUnseenSourceToCategoryMapping[sourcePageName] || sourcePageName;
}

/**
 * Create API instance based on current wiki context.
 * @returns {mw.Api|mw.ForeignApi} The appropriate API instance.
 */
function createApiInstance() {
    if (mw.config.get('wgServer') === "//meta.wikimedia.org") {
        return new mw.Api({ userAgent: 'CiteUnseen' });
    } else {
        return new mw.ForeignApi("//meta.wikimedia.org/w/api.php", { userAgent: 'CiteUnseen' });
    }
}

/**
 * Process API response pages into fulltext string.
 * @param {Object} response - API response object.
 * @returns {string} Combined fulltext from all pages.
 */
function processApiResponse(response) {
    let fulltext = '';
    for (const pageid of response.query.pageids) {
        if (pageid === '-1') {
            continue;
        }
        const page = response.query.pages[pageid];
        if (page.revisions && page.revisions.length > 0) {
            fulltext += page.revisions[0].slots.main['*'] + '\n\n';
        }
    }
    return fulltext;
}

/**
 * Process fulltext into categorized rules.
 * @param {string} fulltext - The complete wikitext.
 * @returns {Object.<string, Object[]>} Categorized rules object.
 */
function processCategorizedRules(fulltext) {
    const sections = getSections(fulltext);
    const categorizedRules = {};
    for (const [cat, section] of Object.entries(sections)) {
        const entries = Array.from(section.matchAll(/{{\s*CULink\s*\|\s*([^}]+?)\s*}}/g), match => match[1]);
        const resolvedCat = resolveSourceToCategory(cat);
        if (!categorizedRules[resolvedCat]) {
            categorizedRules[resolvedCat] = [];
        }
        categorizedRules[resolvedCat].push(...entries.map(parseRuleTemplates).filter(Boolean));
    }
    return categorizedRules;
};

/**
 * Resolve a source name to its corresponding wiki page link.
 * If no mapping exists, returns null to use default linking behavior.
 * @param {string} sourceName - The source name to resolve.
 * @returns {string|null} The resolved wiki page link or null if no mapping exists.
 */
export function resolveSourceToPageLink(sourceName) {
    return citeUnseenSourceToPageMapping[sourceName] || null;
};

/**
 * Get the full wikitext.
 * @returns {Promise<string>} A Promise containing the full wikitext.
 */
async function getFullText() {
    // Add 'Cite_Unseen/sources/' to the beginning each of the source names, then join them with '|'.
    const source_titles = citeUnseenSources.map(source => `Cite_Unseen/sources/${source}`).join('|');

    const api = createApiInstance();
    const response = await api.get({
        action: 'query', titles: source_titles, prop: 'revisions', rvslots: '*', rvprop: 'content', indexpageids: 1,
    });

    return processApiResponse(response);
};

/**
 * Get the full wikitext from specific revision IDs.
 * @param {Array.<number>} revisionIds - Array of revision IDs to fetch.
 * @returns {Promise<string>} A Promise containing the full wikitext.
 */
async function getFullTextFromRevisions(revisionIds) {
    const api = createApiInstance();

    const response = await api.get({
        action: 'query',
        revids: revisionIds.join('|'),
        prop: 'revisions',
        rvslots: '*',
        rvprop: 'content',
        indexpageids: 1,
    });

    return processApiResponse(response);
};

/**
 * Get categorized rules from specific revision IDs.
 * @param {Array.<number>} revisionIds - Array of revision IDs to fetch.
 * @returns {Promise<Object.<string, Object[]>>} An object containing categories and their corresponding rules.
 */
async function getCategorizedRulesFromRevisions(revisionIds) {
    const fulltext = await getFullTextFromRevisions(revisionIds);
    return processCategorizedRules(fulltext);
};

/**
 * Split wikitext into multiple sections by level 3 headings.
 * @param fulltext {string} The complete wikitext.
 * @returns {Object.<string, string>} An object containing headings and their corresponding content.
 */
function getSections(fulltext) {
    const sections = {};
    // Only parse the 3rd level headers (=== ... ===).
    const headerRegex = /^(={3})([^=]+)\1$/gm;
    let match;
    let lastHeader = null;
    let lastIndex = 0;
    while ((match = headerRegex.exec(fulltext)) !== null) {
        if (lastHeader !== null) {
            sections[lastHeader] = fulltext.substring(lastIndex, match.index).trim();
        }
        lastHeader = match[2].trim();
        lastIndex = headerRegex.lastIndex;
    }
    if (lastHeader !== null) {
        sections[lastHeader] = fulltext.substring(lastIndex).trim();
    }
    return sections;
}

/**
 * Parse the {{CULink}} template.
 * @param text {string} Text containing the {{CULink}} template.
 * @returns {Object} The parsed object.
 */
function parseRuleTemplates(text) {
    // Split on '|' and then split each part by '='.
    const parts = text.split('|').map(part => part.trim()).filter(Boolean);
    const rule = {};
    parts.forEach(part => {
        const [key, ...rest] = part.split('=');
        if (key) {
            if (rest.length) {
                // Key-value pair; if key is '1', map to 'url'.
                rule[key.trim() === '1' ? 'url' : key.trim()] = rest.join('=').trim();
            } else {
                // Only a single value without '='.
                rule['url'] = key.trim();
            }
        }
    });
    return Object.keys(rule).length ? rule : null;  // Empty object should be falsy
}

/**
 * Get revision IDs for sources that have them specified.
 * @returns {Promise<Array.<number>>} Array of revision IDs to fetch, or empty array if none specified.
 */
async function getSpecifiedRevisionIds() {
    const revisionIds = [];
    try {
        if (_sourceRevisions === null) {
            _sourceRevisions = await citeUnseenSourceRevisions();
        }
        for (const source of citeUnseenSources) {
            const revisionId = _sourceRevisions[source];
            if (revisionId !== null && revisionId !== undefined) {
                revisionIds.push(revisionId);
            }
        }
    } catch (error) {
        // If call for revision IDs fails, return empty array
        console.warn('[Cite Unseen][sources] Failed to fetch revision IDs:', error.message);
        return [];
    }
    return revisionIds;
};

/**
 * Validate the structure of the data object.
 * @param data {Object} The data object to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function isValidData(data) {
    const isPlainObject = value => value && typeof value === 'object' && !Array.isArray(value);
    if (!isPlainObject(data)) return false;

    return Object.values(data).every(entries =>
        Array.isArray(entries) &&
        entries.every(rule => isPlainObject(rule) && Object.values(rule).every(value => typeof value === 'string'))
    );
};

/**
 * Load categorized rules.
 * Uses specified revision IDs when available, otherwise fetches latest revisions.
 * @returns {Promise<Object.<string, Object[]>>} An object containing categories and their corresponding rules.
 */
export async function loadCategorizedRules() {
    const CACHE_KEY = 'CiteUnseenSourcesCache';
    const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

    // Try cache first
    let cached;
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
            cached = JSON.parse(raw);
            if (cached && cached.timestamp && (Date.now() - cached.timestamp) < CACHE_TTL_MS && cached.data && isValidData(cached.data)) {
                _categorizedRules = cached.data;
                return _categorizedRules;
            }
        }
    } catch (e) {
        console.warn('[Cite Unseen][sources] Cache read failed', e);
    }

    // Build fresh data
    let data;
    try {
        // Check if we have any revision IDs specified
        const revisionIds = await getSpecifiedRevisionIds();
        if (revisionIds.length > 0) {
            // Use revision-specific method if any revision IDs are specified
            data = await getCategorizedRulesFromRevisions(revisionIds);
        } else {
            // Fall back to latest revisions
            const fulltext = await getFullText();
            data = processCategorizedRules(fulltext);
        }
    } catch (e) {
        console.error('[Cite Unseen][sources] Failed to fetch source data', e);

        // On failure but we may still have stale cache
        if (cached && cached.data && isValidData(cached.data)) {
            _categorizedRules = cached.data;
            return _categorizedRules;
        }
        throw e; // rethrow original error
    }

    // Write cache
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
    } catch (e) {
        console.warn('[Cite Unseen][sources] Cache write failed', e);
    }

    _categorizedRules = data;
    return _categorizedRules;
};

/**
 * Get the loaded categorized rules.
 * @returns {Object.<string, Object[]>|null} Loaded category rules, or null before loading completes.
 */
export function getCategorizedRules() {
    return _categorizedRules;
};
