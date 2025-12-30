// Loads i18n JSON files from the GitLab repository and exposes them as a global object.
// Caches the result in localStorage for 72 hours to reduce network requests.

(function () {
    const BRANCH = 'main';
    const FOLDER = 'i18n';
    const API_BASE = `https://gitlab.wikimedia.org/api/v4/projects/kevinpayravi%2Fcite-unseen/repository`;
    const CACHE_KEY = 'CiteUnseenI18nCache-v2.1.6'; // bump to invalidate
    const CACHE_TTL_MS = 72 * 60 * 60 * 1000; // 72 hours

    // Expose placeholders immediately
    window.CiteUnseenI18n = window.CiteUnseenI18n || {}; // will be replaced once loaded

    /**
     * Validate the structure of the i18n data
     * @param data {object} Data to validate
     * @returns {boolean} True if valid, false otherwise
     */
    function isValidData(data) {
        if (!data || typeof data !== 'object') return false;
        for (const [k, v] of Object.entries(data)) {
            if (typeof k !== 'string') return false;
            if (!Array.isArray(v)) return false;
        }
        return true;
    }

    /**
     * Check if a cache entry is still fresh and valid
     * @param entry {object|null} Cache entry to check
     * @returns {false} if stale or invalid, otherwise true
     */
    function isCacheFresh(entry) {
        return entry && typeof entry === 'object' && Date.now() - entry.timestamp < CACHE_TTL_MS && entry.data && isValidData(entry.data);
    }

    /**
     * Fetch and parse a JSON file from the repository
     * @param filePath {string} Path to the file within the repository
     * @returns {Promise<object>} Parsed JSON content of the file
     * @throws {Error} If the fetch fails or the response is not valid JSON
     */
    async function fetchJsonFile(filePath) {
        const url = `${API_BASE}/files/${encodeURIComponent(filePath)}/raw?ref=${encodeURIComponent(BRANCH)}`;
        const resp = await fetch(url, {headers: {'Accept': 'application/json'}});
        if (!resp.ok) {
            throw new Error(`Failed to fetch ${filePath}: ${resp.status} ${resp.statusText}`);
        }
        return resp.json();
    }

    /**
     * List all JSON files in the i18n folder of the repository
     * @returns {Promise<Array<{name: string, type: string}>>} List of file objects with name and type
     */
    async function listI18nFiles() {
        const url = `${API_BASE}/tree?ref=${encodeURIComponent(BRANCH)}&recursive=false&path=${encodeURIComponent(FOLDER)}`;
        const resp = await fetch(url, {headers: {'Accept': 'application/json'}});
        if (!resp.ok) {
            throw new Error(`Failed listing i18n folder: ${resp.status} ${resp.statusText}`);
        }
        const data = await resp.json();
        return data.filter(item => item.type === 'blob' && /\.json$/i.test(item.name));
    }

    /**
     * Merge flat language data into the target structure
     * @param target {object} Target object to merge into
     * @param lang {string} Language code (e.g., 'en', 'ja', 'zh-hans', 'zh-hant')
     * @param flatObj {object} Flat object with dot-separated keys
     */
    function mergeLanguageData(target, lang, flatObj) {
        if (lang.startsWith('zh-')) lang = lang.substring(3); // 'zh-hans' -> 'hans', 'zh-hant' -> 'hant' (to be consistent with HanAssist)
        for (const [fullKey, value] of Object.entries(flatObj)) {
            if (fullKey.includes('.')) {
                const [root, child] = fullKey.split('.', 2); // only first dot (current data shape)
                if (!target[root]) target[root] = {};
                if (!target[root][child]) target[root][child] = {};
                target[root][child][lang] = value;
            } else {
                if (!target[fullKey]) target[fullKey] = {};
                target[fullKey][lang] = value;
            }
        }
    }

    /**
     * Build the complete i18n object by fetching and merging all language files
     * @returns {Promise<object>} Complete i18n object
     * @throws {Error} If fetching or processing fails
     */
    async function buildI18nObject() {
        const files = await listI18nFiles();
        const result = {};

        await Promise.all(files.map(async f => {
            const langCode = f.name.replace(/\.json$/i, '');
            try {
                const flat = await fetchJsonFile(`${FOLDER}/${f.name}`);
                mergeLanguageData(result, langCode, flat);
            } catch (e) {
                console.error('[Cite Unseen][i18n] Error fetching language file', f.name, e);
            }
        }));

        return result;
    }

    /**
     * Load the i18n data, using cache if available and fresh
     * @returns {Promise<object>} Loaded i18n data
     * @throws {Error} If loading fails
     */
    async function load() {
        // Try cache first
        let cached;
        try {
            const cachedRaw = localStorage.getItem(CACHE_KEY);
            if (cachedRaw) {
                cached = JSON.parse(cachedRaw);
                if (isCacheFresh(cached)) {
                    window.CiteUnseenI18n = cached.data;
                    return window.CiteUnseenI18n;
                }
            }
        } catch (e) {
            console.warn('[Cite Unseen][i18n] Cache read failed', e);
        }

        // Fetch fresh
        let data;
        try {
            data = await buildI18nObject();
            window.CiteUnseenI18n = data;
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify({timestamp: Date.now(), data}));
            } catch (e) {
                // Ignore storage failures
                console.warn('[Cite Unseen][i18n] Cache write failed', e);
            }
            return data;
        } catch (e) {
            console.error('[Cite Unseen][i18n] Failed to load translations', e);

            // Fallback to existing cache if available, even if stale
            if (cached && cached.data && isValidData(cached.data)) {
                window.CiteUnseenI18n = cached.data;
            }

            return window.CiteUnseenI18n;
        }
    }

    // Start loading immediately; expose a promise for consumers that want to await readiness
    window.CiteUnseenI18nPromise = load();
})();
