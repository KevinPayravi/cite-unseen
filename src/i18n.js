import i18nFiles from 'cite-unseen-i18n-files';

// Loads bundled i18n JSON files and exports them as a module object.
// The build script auto-includes every i18n/*.json file in this module.

const FOLDER = 'i18n';

/**
 * Validate the structure of the i18n data
 * @param data {object} Data to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidData(data) {
    const isPlainObject = value => value && typeof value === 'object' && !Array.isArray(value);
    const isTranslationMap = value => isPlainObject(value) && Object.values(value).every(text => typeof text === 'string');

    function isValidNode(value) {
        if (isTranslationMap(value)) return true;
        return isPlainObject(value) && Object.values(value).every(isValidNode);
    }

    return isPlainObject(data) && Object.values(data).every(isValidNode);
}

/**
 * Fetch and parse a JSON file from the bundled i18n data
 * @param filePath {string} Path to the file within the repository
 * @returns {object} Parsed JSON content of the file
 * @throws {Error} If the bundled file cannot be found
 */
function fetchJsonFile(filePath) {
    const file = i18nFiles.find(item => item.path === filePath);
    if (!file) {
        throw new Error(`Failed to find bundled i18n file ${filePath}`);
    }
    return file.content;
}

/**
 * List all JSON files in the i18n folder of the repository
 * @returns {Array<{name: string, type: string}>} List of file objects with name and type
 */
function listI18nFiles() {
    return i18nFiles
        .filter(item => item.type === 'blob' && item.path.startsWith(`${FOLDER}/`) && /\.json$/i.test(item.name))
        .map(({ name, type }) => ({ name, type }));
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
        if (fullKey === '@metadata') continue;
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
 * Build the complete i18n object by loading and merging all language files
 * @returns {object} Complete i18n object
 * @throws {Error} If loading or processing fails
 */
function buildI18nObject() {
    const files = listI18nFiles();
    const result = {};

    files.forEach(f => {
        const langCode = f.name.replace(/\.json$/i, '');
        try {
            const flat = fetchJsonFile(`${FOLDER}/${f.name}`);
            mergeLanguageData(result, langCode, flat);
        } catch (e) {
            console.error('[Cite Unseen][i18n] Error loading language file', f.name, e);
        }
    });

    return result;
}

/**
 * Load the i18n data from bundled files
 * @returns {object} Loaded i18n data
 * @throws {Error} If loading fails
 */
function load() {
    const data = buildI18nObject();
    if (!isValidData(data)) {
        throw new Error('Bundled i18n data failed validation');
    }
    return data;
}

export default load();
