// Loads i18n JSON files from the GitLab repository and exposes them as a global object.
// Caches the result in sessionStorage for 12 hours to reduce network requests.

(function () {
    const BRANCH = 'main';
    const FOLDER = 'i18n';
    const API_BASE = `https://gitlab.wikimedia.org/api/v4/projects/kevinpayravi%2Fcite-unseen/repository`;
    const CACHE_KEY = 'CiteUnseenI18nCache';
    const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

    // Expose placeholders immediately
    window.CiteUnseenI18n = window.CiteUnseenI18n || {}; // will be replaced once loaded

    function isCacheFresh(entry) {
        return entry && typeof entry === 'object' && Date.now() - entry.timestamp < CACHE_TTL_MS && entry.data;
    }

    async function fetchJsonFile(filePath) {
        const url = `${API_BASE}/files/${encodeURIComponent(filePath)}/raw?ref=${encodeURIComponent(BRANCH)}`;
        const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!resp.ok) {
            throw new Error(`Failed to fetch ${filePath}: ${resp.status} ${resp.statusText}`);
        }
        return resp.json();
    }

    async function listI18nFiles() {
        const url = `${API_BASE}/tree?ref=${encodeURIComponent(BRANCH)}&recursive=false&path=${encodeURIComponent(FOLDER)}`;
        const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!resp.ok) {
            throw new Error(`Failed listing i18n folder: ${resp.status} ${resp.statusText}`);
        }
        const data = await resp.json();
        return data.filter(item => item.type === 'blob' && /\.json$/i.test(item.name));
    }

    function mergeLanguageData(target, lang, flatObj) {
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

    async function buildI18nObject() {
        const files = await listI18nFiles();
        const result = {};

        await Promise.all(files.map(async f => {
            const langCode = f.name.replace(/\.json$/i, '');
            try {
                const flat = await fetchJsonFile(`${FOLDER}/${f.name}`);
                mergeLanguageData(result, langCode, flat);
            } catch (e) {
                console.error('[CiteUnseenI18n] Error fetching language file', f.name, e);
            }
        }));

        return result;
    }

    async function load() {
        // Try cache first
        let cached;
        try {
            const cachedRaw = sessionStorage.getItem(CACHE_KEY);
            if (cachedRaw) {
                cached = JSON.parse(cachedRaw);
                if (isCacheFresh(cached)) {
                    window.CiteUnseenI18n = cached.data;
                    return window.CiteUnseenI18n;
                }
            }
        } catch (e) {
            console.warn('[CiteUnseenI18n] Cache read failed', e);
        }

        // Fetch fresh
        let data;
        try {
            data = await buildI18nObject();
            window.CiteUnseenI18n = data;
            try {
                sessionStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
            } catch (e) {
                // Ignore storage failures
                console.warn('[CiteUnseenI18n] Cache write failed', e);
            }
            return data;
        } catch (e) {
            console.error('[CiteUnseenI18n] Failed to load translations', e);

            // Fallback to existing cache if available, even if stale
            if (cached && cached.data) {
                window.CiteUnseenI18n = cached.data;
            }

            return window.CiteUnseenI18n;
        }
    }

    // Start loading immediately; expose a promise for consumers that want to await readiness
    window.CiteUnseenI18nPromise = load();
})();
