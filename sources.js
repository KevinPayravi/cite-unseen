var CiteUnseenData = {
    _sourceRevisions: null, // Stores revision IDs fetched from cite-unseen-revids

    /**
     * Definition page names for source lists. Prefixed with "Meta:Cite Unseen/sources/".
     * @type {Array.<string>}
     * @constant
     */
    citeUnseenSources: [
        'medium',
        'type',
        'influence',
        'advocacy/1',
        'advocacy/2',
        'zhRSP',
        'zhVGS',
        'zhACGS',
        'enRSP',
        'enVGS',
        'enAMS',
        'enJAPANS',
        'enKOREAS',
        'enAS',
        'enFILMR',
        'enNPPSG/1',
        'enNPPSG/2',
    ],

    /**
     * Revision IDs for source pages. When specified, these revision IDs will be used
     * instead of fetching the latest revision. Set to null to use latest revision.
     * @type {Promise<Object.<string, number>>}
     * @constant
     */
    citeUnseenSourceRevisions: async function () {
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
    },

    /**
     * Source lists grouped by reliability category.
     * @type {Array.<Array.<string>>}
     * @constant
     */
    citeUnseenChecklists: [
        [
            "blacklisted", [
                ["enRSP", "enRspBlacklisted"],
                ["zhRSP", "zhRspBlacklisted"],
                ["enKOREAS", "enKoreasBlacklisted"]
            ],
        ], [
            "deprecated", [
                ["enRSP", "enRspDeprecated"],
                ["zhRSP", "zhRspDeprecated"]
            ],
        ], [
            "generallyUnreliable", [
                ["enRSP", "enRspGenerallyUnreliable"],
                ["zhRSP", "zhRspGenerallyUnreliable"],
                ["enAMS", "enAmsGenerallyUnreliable"],
                ["enAS", "enAsGenerallyUnreliable"],
                ["enJAPANS", "enJapansGenerallyUnreliable"],
                ["enKOREAS", "enKoreasGenerallyUnreliable"],
                ["enNPPSG/1", "enNppsgGenerallyUnreliable"],
                ["enVGS", "enVgsGenerallyUnreliable"],
                ["zhACGS", "zhAcgsGenerallyUnreliable"],
                ["zhVGS", "zhVgsGenerallyUnreliable"],
                ["enFILMR", "enFilmrGenerallyUnreliable"]
            ],
        ], [
            "marginallyReliable", [
                ["enRSP", "enRspMarginallyReliable"],
                ["zhRSP", "zhRspMarginallyReliable"],
                ["enAMS", "enAmsMarginallyReliable"],
                ["enJAPANS", "enJapansMarginallyReliable"],
                ["enKOREAS", "enKoreasMarginallyReliable"],
                ["enVGS", "enVgsMarginallyReliable"],
                ["zhACGS", "zhAcgsMarginallyReliable"],
                ["zhVGS", "zhVgsMarginallyReliable"]
            ],
        ], [
            "multi", [
                ["enRSP", "enRspMulti"],
                ["zhRSP", "zhRspMulti"],
                ["enNPPSG/2", "enNppsgMulti"],
                ["enVGS", "enVgsMulti"],
                ["zhACGS", "zhAcgsMulti"],
                ["zhVGS", "zhVgsMulti"]
            ],
        ], [
            "generallyReliable", [
                ["enRSP", "enRspGenerallyReliable"],
                ["zhRSP", "zhRspGenerallyReliable"],
                ["enAMS", "enAmsGenerallyReliable"],
                ["enAS", "enAsGenerallyReliable"],
                ["enJAPANS", "enJapansGenerallyReliable"],
                ["enKOREAS", "enKoreasGenerallyReliable"],
                ["enNPPSG/2", "enNppsgGenerallyReliable"],
                ["enVGS", "enVgsGenerallyReliable"],
                ["zhACGS", "zhAcgsGenerallyReliable"],
                ["zhVGS", "zhVgsGenerallyReliable"],
                ["enFILMR", "enFilmrGenerallyReliable"]
            ],
        ],
    ],

    /**
     * Types of source categories.
     * @type {Array.<Array.<string>>}
     * @constant
     */
    citeUnseenCategoryTypes: [
        ["medium", ['books', 'tabloids', 'tvPrograms']],
        ["type", ['news', "opinions", "press", "satire"]],
        ['userGenerated', ['blogs', 'community', 'editable', 'social']],
        ["influence", ['advocacy', "government", "predatory", "sponsored"]],
    ],

    /**
     * Mapping from source page names to their corresponding categories.
     * This allows multiple source pages to map to a single category.
     *
     * @type {Object.<string, string>}
     * @constant
     */
    citeUnseenSourceToCategoryMapping: {
        'advocacy1': 'advocacy',
        'advocacy2': 'advocacy'
    },

    /**
     * Mapping from source names to their corresponding wiki page links.
     *
     * @type {Object.<string, string>}
     * @constant
     */
    citeUnseenSourceToPageMapping: {
        'enAS': 'en:Wikipedia:WikiProject Albums/Sources',
        'enAMS': 'en:Wikipedia:WikiProject Anime and manga/Online reliable sources',
        'enFILMR': 'en:Wikipedia:WikiProject Film/Resources',
        'enJAPANS': 'en:Wikipedia:WikiProject Japan/Reliable sources',
        'enKOREAS': 'en:Wikipedia:WikiProject Korea/Reliable sources',
        'enNPPSG/1': 'en:Wikipedia:New pages patrol source guide',
        'enNPPSG/2': 'en:Wikipedia:New pages patrol source guide',
        'enRSP': 'en:Wikipedia:Reliable sources/Perennial sources',
        'enVGS': 'en:Wikipedia:WikiProject Video games/Sources',
        'zhACGS': 'zh:维基专题:ACG/來源考量',
        'zhRSP': 'zh:维基百科:可靠来源/常见有争议来源列表',
        'zhVGS': 'zh:维基专题:电子游戏/来源考量'
    },

    /**
     * Resolve a source page name to its corresponding category.
     * If no mapping exists, returns the original page name.
     * @param {string} sourcePageName - The source page name to resolve.
     * @returns {string} The resolved category name.
     */
    resolveSourceToCategory: function (sourcePageName) {
        return this.citeUnseenSourceToCategoryMapping[sourcePageName] || sourcePageName;
    },

    /**
     * Get all source pages that map to a specific category.
     * @param {string} categoryName - The category name to find source pages for.
     * @returns {Array.<string>} Array of source page names that map to the category.
     */
    getSourcePagesForCategory: function (categoryName) {
        const sourcePages = [];
        for (const [sourcePage, category] of Object.entries(this.citeUnseenSourceToCategoryMapping)) {
            if (category === categoryName) {
                sourcePages.push(sourcePage);
            }
        }
        return sourcePages;
    },

    /**
     * Create API instance based on current wiki context.
     * @returns {mw.Api|mw.ForeignApi} The appropriate API instance.
     */
    createApiInstance: function () {
        if (mw.config.get('wgServer') === "//meta.wikimedia.org") {
            return new mw.Api({ userAgent: 'CiteUnseen' });
        } else {
            return new mw.ForeignApi("//meta.wikimedia.org/w/api.php", { userAgent: 'CiteUnseen' });
        }
    },

    /**
     * Process API response pages into fulltext string.
     * @param {Object} response - API response object.
     * @returns {string} Combined fulltext from all pages.
     */
    processApiResponse: function (response) {
        let pageids = response.query.pageids;
        let fulltext = '';
        for (let i = 0; i < pageids.length; i++) {
            let pageid = pageids[i];
            if (pageid === '-1') {
                continue;
            }
            let page = response.query.pages[pageid];
            if (page.revisions && page.revisions.length > 0) {
                fulltext += page.revisions[0].slots.main['*'] + '\n\n';
            }
        }
        return fulltext;
    },

    /**
     * Process fulltext into categorized rules.
     * @param {string} fulltext - The complete wikitext.
     * @returns {Object.<string, Object[]>} Categorized rules object.
     */
    processCategorizedRules: function (fulltext) {
        let sections = this.getSections(fulltext);
        let categorizedRules = {};
        for (const [cat, section] of Object.entries(sections)) {
            const entries = Array.from(section.matchAll(/{{\s*CULink\s*\|\s*([^}]+?)\s*}}/g), match => match[1]);
            const resolvedCat = this.resolveSourceToCategory(cat);
            if (!categorizedRules[resolvedCat]) {
                categorizedRules[resolvedCat] = [];
            }
            categorizedRules[resolvedCat].push(...entries.map(this.parseRuleTemplates).filter(Boolean));
        }
        return categorizedRules;
    },

    /**
     * Resolve a source name to its corresponding wiki page link.
     * If no mapping exists, returns null to use default linking behavior.
     * @param {string} sourceName - The source name to resolve.
     * @returns {string|null} The resolved wiki page link or null if no mapping exists.
     */
    resolveSourceToPageLink: function (sourceName) {
        return this.citeUnseenSourceToPageMapping[sourceName] || null;
    },

    /**
     * Get the full wikitext.
     * @returns {Promise<string>} A Promise containing the full wikitext.
     */
    getFullText: async function () {
        // Add 'Meta:Cite_Unseen/sources/' to the beginning each of the source names, then join them with '|'.
        let source_titles = this.citeUnseenSources.map(source => `Meta:Cite_Unseen/sources/${source}`).join('|');

        var api = this.createApiInstance();
        var response = await api.get({
            action: 'query', titles: source_titles, prop: 'revisions', rvslots: '*', rvprop: 'content', indexpageids: 1,
        });

        return this.processApiResponse(response);
    },

    /**
     * Get the full wikitext from specific revision IDs.
     * @param {Array.<number>} revisionIds - Array of revision IDs to fetch.
     * @returns {Promise<string>} A Promise containing the full wikitext.
     */
    getFullTextFromRevisions: async function (revisionIds) {
        var api = this.createApiInstance();

        var response = await api.get({
            action: 'query',
            revids: revisionIds.join('|'),
            prop: 'revisions',
            rvslots: '*',
            rvprop: 'content',
            indexpageids: 1,
        });

        return this.processApiResponse(response);
    },

    /**
     * Get categorized rules from specific revision IDs.
     * @param {Array.<number>} revisionIds - Array of revision IDs to fetch.
     * @returns {Promise<Object.<string, Object[]>>} An object containing categories and their corresponding rules.
     */
    getCategorizedRulesFromRevisions: async function (revisionIds) {
        const fulltext = await this.getFullTextFromRevisions(revisionIds);
        return this.processCategorizedRules(fulltext);
    },

    /**
     * Split wikitext into multiple sections by level 3 headings.
     * @param fulltext {string} The complete wikitext.
     * @returns {Object.<string, string>} An object containing headings and their corresponding content.
     */
    getSections: function (fulltext) {
        let sections = {};
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
    },

    /**
     * Parse the {{CULink}} template.
     * @param text {string} Text containing the {{CULink}} template.
     * @returns {Object} The parsed object.
     */
    parseRuleTemplates: function (text) {
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
    },

    /**
     * Get revision IDs for sources that have them specified.
     * @returns {Promise<Array.<number>>} Array of revision IDs to fetch, or empty array if none specified.
     */
    getSpecifiedRevisionIds: async function () {
        const revisionIds = [];
        try {
            if (this._sourceRevisions === null) {
                this._sourceRevisions = await this.citeUnseenSourceRevisions();
            }
            for (const source of this.citeUnseenSources) {
                const revisionId = this._sourceRevisions[source];
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
    },

    /**
     * Check if any sources have revision IDs specified.
     * @returns {Promise<boolean>} True if any sources have revision IDs, false otherwise.
     */
    hasSpecifiedRevisions: async function () {
        return (await this.getSpecifiedRevisionIds()).length > 0;
    },

    /**
     * Validate the structure of the data object.
     * @param data {Object} The data object to validate.
     * @returns {boolean} True if valid, false otherwise.
     */
    isValidData: function (data) {
        if (!data || typeof data !== 'object') return false;
        if (!data.getCategorizedRules || typeof data.getCategorizedRules !== 'function') return false;
        if (!data.citeUnseenCategories || typeof data.citeUnseenCategories !== 'object') return false;
        if (!data.citeUnseenCategoryTypes || !Array.isArray(data.citeUnseenCategoryTypes)) return false;
        if (!data.citeUnseenChecklists || !Array.isArray(data.citeUnseenChecklists)) return false;
        if (!data.citeUnseenCategoryData || typeof data.citeUnseenCategoryData !== 'object') return false;
        return true;
    },

    /**
     * Get categorized rules.
     * Uses specified revision IDs when available, otherwise fetches latest revisions.
     * @returns {Promise<Object.<string, Object[]>>} An object containing categories and their corresponding rules.
     */
    getCategorizedRules: async function () {
        const CACHE_KEY = 'CiteUnseenSourcesCache';
        const CACHE_TTL_MS = 3 * 60 * 60 * 1000; // 3 hours

        // Try cache first
        let cached;
        try {
            const raw = sessionStorage.getItem(CACHE_KEY);
            if (raw) {
                cached = JSON.parse(raw);
                if (cached && cached.timestamp && (Date.now() - cached.timestamp) < CACHE_TTL_MS && cached.data && this.isValidData(cached.data)) {
                    return cached.data;
                }
            }
        } catch (e) {
            console.warn('[Cite Unseen][sources] Cache read failed', e);
        }

        // Build fresh data
        let data;
        try {
            // Check if we have any revision IDs specified
            const revisionIds = await this.getSpecifiedRevisionIds();
            if (revisionIds.length > 0) {
                // Use revision-specific method if any revision IDs are specified
                data = await this.getCategorizedRulesFromRevisions(revisionIds);
            } else {
                // Fall back to latest revisions
                const fulltext = await this.getFullText();
                data = this.processCategorizedRules(fulltext);
            }
        } catch (e) {
            console.error('[Cite Unseen][sources] Failed to fetch source data', e);

            // On failure but we may still have stale cache
            if (cached && cached.data && this.isValidData(cached.data)) {
                return cached.data;
            }
            throw e; // rethrow original error
        }

        // Write cache
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
        } catch (e) {
            console.warn('[Cite Unseen][sources] Cache write failed', e);
        }

        return data;
    },

    /**
     * Default toggle settings for categories. Unstated categories will be default to true (CiteUnseen.init).
     * @type {Object.<string, boolean>}
     * @constant
     */
    citeUnseenCategories: {
        "unknown": true,
    },

    /**
     * Category data, icons, and counters in use.
     * Labels and hints are now externalized to CiteUnseenI18n for better internationalization.
     * @type {Object.<string, Object>}
     * @constant
     */
    citeUnseenCategoryData: {
        // Advocacy groups
        "advocacy": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAPCAMAAAA1b9QjAAAAbFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0Iv+qAAAAI3RSTlMA1A5E+vZW38mMJx7s2aOZjWdaQzoUCvHkyrmvhXx2bWBTMqn0tOoAAAB/SURBVBjTZc9XDoQwDARQZzc9lKVub/j+d8SMAIGYH8svsSXTLt1D7WFwzKctfAxD4hmx4camUiKB1zwjTWIYUeGXiERamt8v0kLyg7hl6v7+d5CGSl6ii4TN1H6l87YqM77WEIoihdT+pVlDepEce5tsvsILWVDyDrWW3xBkBEQGDke/jOMVAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Blog posts
        "blogs": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAclBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACa4vOeAAAAJXRSTlMA+/J3Bq43Mxb3x7OnnJl8Xkoc6ubLoVhNPCgj3dzDkI1ycVZUCH5LxQAAAJZJREFUGBkFwYVhAgEAALG84A51t9t/xSaG2/3DeQ0AVQ27ZwCqqnavAD9f+7uqxkcALI9D1QlYXme8LqpOoMb9E6ah+oWqtiv+hhqvqKrNmalaYL2a3qse2VVLME9DbVZehloAnob64FibtXk6XJiqi+fq7KG6mN9qz60OxurIqUYWtXVffbOsrj7rzst2PMysq5Wpxn9NeBK2TnaptgAAAABJRU5ErkJggg==",
            "count": 0,
        },

        // Book publications
        "books": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAMCAMAAACz+6aNAAAAWlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACLSV5RAAAAHXRSTlMAqt7QCRnpffrWSSry7cehoHVuRD0sJuLamGkfHurrquoAAABVSURBVAjXvYjJEYAgEMBWQO5bxHP7b1OBsQXzSSago5KSHAWq8NzRqIHnC1hN1lthGNwnBwKdgnoE/Q7D+ZdjlrWd5nY2wRGRZEz7aycUhKmjJB0RHg2VBO5eX4k3AAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Community-created news
        "community": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAMAAADH72RtAAAAaVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnbPKNAAAAInRSTlMAmWPM27eThIB/06+fjV0lD/r1yLuzqaRzTD8dmGpTUBYCKhLQsAAAAH1JREFUGNONi0kOAjEMBGMgCUy22VfW/v8jiU3EaQ5TUkvlkqz2qI3fRDYfapEAjCIDYEUM4NRc6aSBIOU9ufQCUKVhkq94JzIWmYWIHh+1gjnldSNbVOyobOz92jVZr1Jmc2b0sy2lyRN6XUp7K+XiuDD/wsfhstAPq3b5AqlTD1RMmHJ5AAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Community-maintained sources (editable)
        "editable": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAPCAMAAADeWG8gAAAAvVBMVEUAAABMTEw1NTUdHR0+Pj7o6Oj///8/Pz8pKSkuLi5TU1NXV1dcXFxiYmKMjIywsLDExMT///////9tbW0xMTFfX19KSkpFRUVUVFRMTExHR0dZWVlgYGBra2taWlp2dnaEhIRsbGxmZmZ8fHygoKCOjo6Dg4OqqqqXl5ekpKSmpqacnJyhoaG7u7unp6ezs7O7u7vHx8ft7e3///////8AAAAjIyMGBgZUVFRHR0cLCwtlZWVOTk4iIiIVFRWrycPlAAAANXRSTlMA9P7++R8F/v798+rm3rFcOwkC/v38+PHt7e3r6efi397e1My6uberoZOLh4Z9cnFZMSggDCg5MJMAAACOSURBVBgZXcGFEoJQAATAe6SUgt3dXUcZ//9ZMgYM7iJ1HRzxZ0L/jExJ2AuyiIwq0X+wqyFVHpF3Go11GT8r8sagTdonfLgyw4A9JuSlhoRn8lmlKPKtub8AM7JG2dUEP2KUAlbIrXoo8AsmdSmSCjFT2A31kDnAnFHdUBRFiJZl9R1nDHT8DfK8qYq8F7oKGQbJNCvvAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // State-affiliated or government sources
        "government": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAQAAABaOFzUAAAA2ElEQVQoz4XRPUoDURTF8d+MMG8gCpbRBWghlmLjIuwsrdyErY32U/mxA1MJCgpauAEFKzuLIJEQVFCCMo7FTGQSkngut3jnfzivuNS16MCTfQvGatmRvkKh0HdoaRiva8krPJjcqbUSz7oZgfW51ojMaNqxMfbzW8eeY7m2K5zL9NzJPHiRucSFtp8y3VTYwqMMJ+6xrTAPMQh/G5BIa14VSarnAIbKS4dbUiT/t4SRljC5JdS8KkLHt1jPJz684kunpBE27ZmkXWes6k45QNdK5N2caXr7BW+yUjtO1UbwAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // News articles
        "news": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAYFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD6T+iNAAAAH3RSTlMAupk7insrItNVS0O/F28fZWFF48uxSDIMCO+0oIAO/8GCqwAAAIBJREFUGNOdy9sSwiAMRdEDFGmQS6Gttd74/78UkXTGV9dDZrInQXK3RTCXAAhkjcPqgTtOA/LYELQCxuk5wJ8b3wpRGKK1dld1mE9B/ZpKKYZCCNtP8THGFxclpfS6jswFBy4X0dG/N1yS/FpW2ctjM50DcBXYHZq2VOTmWTD1Bls+BmmlzBpEAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Opinion pieces
        "opinions": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAMAAAD+MweGAAAAb1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABt6r1GAAAAJHRSTlMA+xH1Iph8OCYY3MWiLe/p1sq8lI53cGxiV0EM6rGwj2pNSjP1ocsVAAAAgUlEQVQIHV3BRQLCMABFwZ+m7q447/5nJC3dwIzizODYetYpA0yfbN5BjgHGV8qXzTcBdWyBISkaIBCQP4DWu84FUCmFIARugxljwOhpCUJ2U5IBRrqzhOyiDsdIfaiJXdfglNJbig1OFODkOiwXoLRA6+mU+E6RsuqXX636E0X6AFnuEKR6+rcNAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Predatory journals
        "predatory": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAMAAAAVBLyFAAAAmVBMVEUAAAC/AADAAADAAADAAAC/AAC+AAC/AAC/AAC/AAC/AADAAAC/AAC/AAC/AADAAAC/AADAAAC/AAC/AADEAAC/AADXYWHRS0vMOTnGHh7AAADAAAC+AAC/AAC/AADGAAC/AAD////XXFzHHx/++vr77u733NzQRETMNDTJJibDEBD99vb78PD55ubzzs7xyMjuurrSTEzBCQmtvS+6AAAAIHRSTlMApFWZXe5mRPU1085j39zWnol3Jw/49PPy8ObFloBsCQk/Lh0AAACMSURBVBjTVY7nDsIwDAYdoNCkaeliL6fpZvP+D0djBZHer9NZlj6QU+KUXc5HI7EEFs8NqYjCcO/56DNgMyAyDwnvnyDCd4td4aZlU96Ku1q7qX8qpeqdkwQ2Qxo9irZSpbpunBTo+qFf1dZNqHv8dOYxWRh4HqCBpqKduLLCgE+Iw3CXZBwseZr8/AvR2g1q3xyaTQAAAABJRU5ErkJggg==",
            "count": 0,
        },

        // Press releases
        "press": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAMAAAD+MweGAAAAPFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQLyYwAAAAE3RSTlMAzHczU/m4lm8wHL6timZBPQwdu570zwAAAFxJREFUCNetyDkOw0AMBEGS5p663f//q1eioUCxKhhgWi4lAanI7WBx94Xjep9ho46tbOcRnt4sOhEm/Zd1J+zrWVTVm4bmY6SatW6hN7MqGeZCKDNk+eYEt5T7D9g7DD/ysJyVAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Satirical or parody content
        "satire": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAARCAYAAAAG/yacAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wceCDI64ByhXQAAAPFJREFUKM+V0zFKQ0EQBuBvn4pWClaWYiF6Ck+Qy+Qi6VLkFNbpxEOYMoQQrCRqY0h8azML6+NJ4g/LMjP/zD/8y8IYLR4x0I9B1FuME3KH8IoXfOAc97iqCQnfcW9j0lmP0hcanCAXpTaSBduI2yAWtGiKUtMzfYfjnnwrlDadQq5OjQ1yUVg7DOt6jYwJbjDqKI0iP4l4l6piOkApI9XvtKucPIohuTIqFWNSceMfSmAVwXxPwzx4qwazSH7uaSr1GQwrM6Z/NEwrzjDhNLqvg/COJ7zhEg+4qFa8K5Nusei8T/csgteLZyzjaywj/oUf7bdVPf0Xy7cAAAAASUVORK5CYII=",
            "count": 0,
        },

        // Social media
        "social": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALNSURBVDhPjVNLSFRhFD7/f++MzIyZRrUxrUUR1JhE0QPaBBUIFW0KeiwqcvKZjxY9iEwoCFroOD7CFAJpUSatWriQEqGEICjLIkyamewlhOaM8/De//Td21VmUdgHwzn/Od//3XPOf4Yy0UAN8vCGBjcRCyf0X7DJp9d3LdFcsVa4BxCIMwlDCEowcVyQiFkW1JiAZaZfyE0Sk9eXbd5oGj6f0C0R3R3vhpnx+cx8K2jFFkPA37QzHtM74J4U1WuDOUkP/3CZ+vL20arYHwpROlSw1SSZ7akOP010rF6jDN7iq470OWkbpf7m3qShlcmUm3MFi2SmgAWDaC9ms9/y2TB3SMFH7UQmhJj26KkV0vJZsGYHgVhLfvFsqLBfCFHPRLWzoYI02D3MoiQeKhxKtq065FBxkV0sslxS6VKDii1mwcue97pUV8D4gLGP43cVgx7GUFNC48uzM+4nDhUQmOmcS7oNiGRUImvGUu7Kzy9A+A6hqLcqehMCLyGW9lZEh5ZdHJ92qOiGXFLqujRQCypZEEk2569Lhgpvw92O+Da0Mwr2cZyXJloLehLthXtsIoCnd5FhoB3NQCW00E4W65OQHGDmd9iZMAQGQX+FfZkgRQM4jzlUXBO6EppuXwZZWNtq+3XhqayKSC/m8AiXH3qrIuWK+Ba++txzLnrXUx7+ZPEsYPBZLE1NqmROBIT016K83U7ORtoQ9+bUXJvl/0zRoDLVJTvhoKa4KRdms1tzf7TXPuBvvo4vVxKpdnT2jSV/ufO61l6sM/7gESkoV5FiTQmFf5VCS160exaDfdY5UltmiwCi1B88BXsMgQLYlZ1vavIC/mA9Xu4aduQVisdlMgWTiTbi2K3H+SNT3Y3UqOZFFlC6MbhPCH6gmE5IKfqUUge73tb1O+m/YuFV5sG6OYHWfCj1Po4XFhP4JwKbmneVFrWUOMdFQPQbGOYih834xvIAAAAASUVORK5CYII=",
            "count": 0,
        },

        // Sponsored content
        "sponsored": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAASCAYAAAC9+TVUAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wceCRIMu+B6UQAAAUVJREFUOMuN079KXFEQx/HPVQwqEgIpU2yRzpSBFG7lK+QNtjeNQjqxCYivkCovkfRWQdhlCx9ALGyWgIWBsFl3b5o5MjneKw4Md5j5zu/8m8v/9gXXWGBc1caRvw6u0y7Rhq9SfNuTvyyNa0nkPL4tmtTwKgk0EWf+kR0HtIymVUfcBvdgTYrXA9rCi2iqbQ1/8Sfxj2yUzvyUj/qOcvRMgeJHtcAw3cU8tjyvmnK+3M0wi0wiuaie8gc+4meVL9wki+RC+X7GS7wJ5rSHe3idktxIc/Ia+3iLA9xhN9UL38A0CvfpXlp8iwU28ClEcr3wU2msVx2jfYUPGOBdD3fbhOJ6NfLwHnvYwTbO8LuDW8JNzza/YjMWGOB7z7Fv4CLNQVsBv2I651U+8xdw2POrL6phu+/hDsucnGDWAayS1wKz6PMP8f7HxLFPnyIAAAAASUVORK5CYII=",
            "count": 0,
        },

        // Tabloids
        "tabloids": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAe1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC9eBywAAAAKHRSTlMA33YN9+rLup5pZkU+8drRtKqTjF9aUyslHxsF4tXDwqujmYaBXBQIt6ZAsgAAAH1JREFUGBl1wVUWwjAABMBNUndXXPf+J4TIa39gBv9cCykVdmPIrxa7mloFvOE01DygnWFF1Dyl4jushVoNmQVwyuB88ZMkfQo4vS+jg+qG/ghrbkiKeE2zEEaa0zi9xg7alNMJYUXcZDAENw8YiUenmGAtcVX6IrgNK376AFE7D6Mmxn6bAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // TV programs
        "tvPrograms": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARAgMAAABGA69pAAAADFBMVEUAAACoqKgAAAA1NTWxW1e8AAAAAnRSTlMAWWQkJGgAAAA4SURBVAjXY2BgaGhgAIJGMPnoAIhUYwABayBmWrVqAQMD16pVKxgYNIAMILlqVRd+EqISogtqAgBQEBiFRNOi6QAAAABJRU5ErkJggg==",
            "count": 0,
        },

        // Reliability: Blacklisted
        "blacklisted": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAWlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////u7u7o6OgpKSkMDAy0tLT7+/v5+fl+fn58fHw5OTklJSUhISG1tbWsrKyjo6MkJCR7e3s8PDxKkGAPAAAACnRSTlMAvI4+GrPi4bSxfq7qvQAAAHZJREFUCNddj0sSwjAMQ/MtICexk/QDFO5/TXDpgol2b0a2JKPyLkbnzU/B4pANB03gLtIZk7LFO1WimhbY7x04PdacyzMxvHHotWAvWNsMZ664Uy7AlkkQTfzH22nedhQ1D680aEmNqGnQWWMWeTEuYSw5TPgAC+IHcILUzWIAAAAASUVORK5CYII=",
            "count": 0,
        },

        // Reliability: Deprecated
        "deprecated": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAq1BMVEUAAAAUBQUTBQWzJCT///+uIyOwIyOsIiJKEBBLDw9wFhZsFRVHDg67u7tgLS2OIiLLy8ttWVlkPj5kKyv6+vry8vLu7u7j4+Pc3NzX19e3t7eysrKdmJhpVFRhNzdWNDR6IyOhISHp6eno5+fY1tbDw8O6tbWqqamoqKiakJCQkJCQhYWKfX1lSkpYPj5aNTVEMjJnMDBcLy99KiqDKCimISGWICBAHBwsGRlV2YqAAAAAA3RSTlMAp597gGAlAAAAqklEQVQY02XQ1xKCMBAFUHE3BBUSlCLSsffe/v/LTLIjL9ynzJk7s5vt6fTdgY5rqTfBiNs6fGi1ACBFA8AUGWDAg2v4fRqiRvPxc9wXQORygGCTeOiNQYW7PYcBlLOpkccNmGNkQiKPJ7CV2Er8beZlxTkWbSdBxGi5OLz/nVLBPMXwAqpDsyLEFHEn9Syzj8wRVxhX7YoM7mtEv3oR0Na1EDUj6P69e58fVvYMNLFQgRAAAAAASUVORK5CYII=",
            "count": 0,
        },

        // Reliability: Generally reliable
        "generallyReliable": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAbFBMVEUAAAAsoCwsoSw+qD4toS0roCstoi0uoS4snyw8qDwtoC0toC0soCwuny4toC0toC3///8voi8toS0soCzo9egyozLp9enj8+PD5MORzZGOzI5GrEa/4r/e8N7M6Mxxv3FBqkH0+vTy+fLE5cSRPYNXAAAAEHRSTlMAsxr9vo4/5JD9wbw/PeaP9lvV4AAAAIVJREFUCNclzlsWgyAMBFBQRKu1TXgp+Gy7/z2WgfniHpKTEchzkHLQoqYZrWlbY1VT9OIYiELkHh55pZKVVd6zser8JKvFYEL985cznZAtfU+i3W8LPSR4+V8R+DZhuT1DGNY20nFvjoiSnYVQ+dAB7TyhRs8pyyXUgFUtOUGI7qTsZrz+IPgKG81qz+sAAAAASUVORK5CYII=",
            "count": 0,
        },

        // Reliability: Generally unreliable
        "generallyUnreliable": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAASFBMVEUAAADMAADMAADPAADMAADMAADMAADNAADMAADNAAD////MAAD99fXsnp7pj4/nhobib2/RGBjia2vojY3jcXHYPz/YPDzRGhqXVefLAAAACnRSTlMA8c8VVPOChINSyGF/kwAAAHJJREFUCNc9z9sSwyAIRVGQaFLAVs3t//+0gE3325pxnANYtKac00YQLXgftbaOS0hOZUuHmAlP2TkaSLDe+pZPUHuBdDA/bgly5b8rAhrDk6nxz/F46/rYvyIcHO1yIfmMMWdc8poje4uRJo+Kn1D8hC/MLAbL8liTMwAAAABJRU5ErkJggg==",
            "count": 0,
        },

        // Reliability: Marginally reliable
        "marginallyReliable": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAMAAAAR8Wy4AAAAjVBMVEUAAAD2eQD1eQD2eQD1eQD1eQD1eQD1eAD0eQD0eAD4egDycwD/gAD/cgD1egD1eQD1eQD1eQD1eQD2eQD2eQD0egD0eAD////4nUX1eQD2fgn3kSz3jCTj4N/96tf82LWYmJj7yJb7xI6Li4v5tG9ra2tZWVlISEj2hBT+9+/+9u7GxsbFxcVHR0dGRkYfNpgQAAAAF3RSTlMAu/lq7uDVenUuJBQJBMOvrZaUVFJHRoWjpJIAAAB/SURBVAgdVcEHFoIwEAXAJaEXu3429I71/sczKvJghiZS0oovhE9LW6V2tHDmuuYLzSI7ybLUjuhPcvEcCpY0CcwYrwGxGdDPXuXoe+TqQF+eaIGuA1rh0cdmvAKPO3AbDdKOXAFoGgAVn4hCK4FWltASKySX03iWskuOseK8AfKLCvyhOfkVAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Reliability: No consensus
        "multi": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAtFBMVEUAAAAJrd8gteIPsOAAqt0Aq90Aqt0Aqts4veUkt+IWsuAuuuMErN4FrN4ErN4Cq94Cq90Aqt0Aqt8Aqd4Aqt4AqtwApt8Zs+EEq94FrN0Dqt0Dq94AqdwAq90Aqd0Aqd4AqtkAqt8AgP////8Aqt1NxOj1/P74/f7m9/zb8/rE6/e86faq4/Sn4vOc3vKQ2vB70+5Xx+k+v+bs+fzk9vvU8fnO7/iW3PFozetYyOkktuIas+C+oCNVAAAAI3RSTlMA/fv7oJuWI/v7+/rh0MO4tXZGNScSC/vuzb6pjH9xTRsYAtfMWVAAAACbSURBVAjXJctXEsJQCEBRXmKipjd7F9J77Lr/fYnP+8HMGQC480Fz1noA/8Y2TV+9Qs5RajktMMuwXFgn5kq5JDFRnFwNFyCgEjtR16LDikLQFcS2QewHRHUHboxcevs8EScj8CRjemeSW0NySPhE+BBSxSwKHg+KADw15y2/3MUIAGaW2qR5nrTCnsPPGxKmKUhjySJf0/dj4L7guBKsqi+5hQAAAABJRU5ErkJggg==",
            "count": 0,
        },

        // Unknown
        "unknown": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJNSURBVDhPVVJNTxNRFJ33prCAdood6EIpi35YKjUsaGzqUjclRsrCXWHjD5CFphJYuBIo3UiiwQTDgoWkC2lNbGJioiEGIhBDFwLFNKGV8GG0KRlMEWbePO+dQmNPcpPzbs65Lzn3EqEOT2hLi/mOrusReHigdEKEbc7JgqLEPsCbowpRM1oscQ+l5DXQgM8nM7/fLnCQZbOHQj5fFoF/FkUaLZcf7VYdAEkac1ut8Z+BwCttdXVP5YCdnbJeKBwx5IuLBdXvf8kkabIoy/HL5zZOwPSlp2eGlUoVXVH+6pFIklmtkxwLOfYODo41n28a+vH3hg2mhFGwvPxDw+kjIx9Ze/szlkrl1HR6W0U+OvrJ+DmT+a6hVpImblBCeJ/LdYmFQg4RB9ntTWR8/JbQ3+81RSJXTb29br62tmdkEQ67aWtrEwRG71LIx9nV1YZ9A0NDQTIwcJ3iD8Xikba0tEtcLpuRJoRHOjtl4NwNRoExpmO/DoODb0l394wJ1kGGh2/W0q9qCcPJufX1Q4gew69HMHiFr6zcFzo6rIbx7EzjGxu/CSi30Phmf/+PmMnkmaE+RywWEhKJ26S5ubH2WzK5hQkTOJAFowERv/N4XjDYnZEeIhpNGXWBzc1fmsMxBeuYmDNMCLP5aRvEnHM6n7P5+W/a6amGy+dYJyeqPjubVdEEq/tqs01J6Pnv5MZkSk3TQO9ZLI3c65W5rnMhlyuRSkXFDOYaGoQHpdLjY9TXjBcwmxPXKOV9QOHI4bwJyXEuphXlYb6qQAjCP3DDM2e6XmppAAAAAElFTkSuQmCC",
            "count": 0,
        }
    },
};
