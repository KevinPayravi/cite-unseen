/**
 * Ensure a value is an array of non-empty strings.
 * @param {*} value - Value to normalize
 * @returns {string[]} Array of strings
 */
function ensureArray(value) {
    if (Array.isArray(value)) return value.filter(v => typeof v === 'string' && v !== '');
    if (typeof value === 'string' && value !== '') return [value];
    return [];
}

/**
 * Parse a date token into start/end range
 * @param {string} token - Date token like "2020", "2020-06", or "2020-06-15"
 * @returns {Object} Object with start and end Date objects
 */
function parseDateToken(token) {
    const parts = token.split("-");
    if (parts.length === 1) {
        // yyyy
        const year = parseInt(parts[0], 10);
        if (isNaN(year) || year < 1000 || year > 9999) {
            throw new Error("Invalid year: " + parts[0]);
        }
        return {
            start: new Date(year, 0, 1, 0, 0, 0, 0), // Start of Jan 1
            end: new Date(year, 11, 31, 23, 59, 59, 999), // End of Dec 31
        };
    } else if (parts.length === 2) {
        // yyyy-MM
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        if (isNaN(year) || isNaN(month) || year < 1000 || year > 9999 || month < 0 || month > 11) {
            throw new Error("Invalid year-month: " + token);
        }
        const start = new Date(year, month, 1, 0, 0, 0, 0); // First day of month, start of day
        const end = new Date(year, month + 1, 0, 23, 59, 59, 999); // Last day of month, end of day
        return { start, end };
    } else if (parts.length === 3) {
        // yyyy-MM-dd
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        if (isNaN(year) || isNaN(month) || isNaN(day) || year < 1000 || year > 9999 || month < 0 || month > 11 || day < 1 || day > 31) {
            throw new Error("Invalid date: " + token);
        }
        const start = new Date(year, month, day, 0, 0, 0, 0); // Start of the day
        const end = new Date(year, month, day, 23, 59, 59, 999); // End of the day
        return { start, end };
    } else {
        throw new Error("Invalid date token format: " + token);
    }
}

/**
 * Translate a single rule (e.g. ">= 2010-01") into a predicate function.
 * @param {string} rule - Single date rule with operator
 * @returns {Function} Predicate function that takes a date and returns true/false
 */
function ruleToPredicate(rule) {
    rule = rule.trim();
    const match = rule.match(/^(>=|<=|>|<|=)\s*(\d{4}(?:-\d{1,2})?(?:-\d{1,2})?)$/);

    if (!match) {
        throw new Error("Invalid rule format: " + rule);
    }

    const [, op, token] = match;
    const { start, end } = parseDateToken(token);

    switch (op) {
        case ">=":
            return d => d >= start;
        case ">":
            return d => d > end;
        case "<=":
            return d => d <= end;
        case "<":
            return d => d < start;
        case "=":
            return d => d >= start && d <= end;
        default:
            throw new Error("Unsupported operator: " + op);
    }
}

/**
 * Parse date rule string into predicate function
 * @param {string} ruleString - Date rule, e.g. "<=2022-01-01,>=2020-01-01" (AND) or "<=2015;>=2017" (OR)
 * @returns {Function|null} Predicate function or null if invalid
 */
function parseDateRule(ruleString) {
    const trimmedRule = ruleString.trim();
    if (!trimmedRule) {
        return null;
    }

    // Split by semicolons (OR groups)
    const orGroups = trimmedRule.split(';').map(s => s.trim()).filter(Boolean);
    const orGroupPredicates = [];

    for (const orGroup of orGroups) {
        // Within each OR group, split by commas (AND conditions)
        const andConditions = orGroup.split(',').map(s => s.trim()).filter(Boolean);
        const andPredicates = [];

        for (const rawCond of andConditions) {
            // Handle case where no operator is provided (default to '=')
            const cond = rawCond.match(/^(>=|<=|>|<|=)/) ? rawCond : '=' + rawCond;

            try {
                const predicate = ruleToPredicate(cond);
                andPredicates.push(predicate);
            } catch (error) {
                console.warn(`[Cite Unseen] ${error.message} in rule: "${orGroup}"`);
                return null;
            }
        }

        // Skip empty AND groups
        if (andPredicates.length === 0) {
            console.warn(`[Cite Unseen] Empty condition group in rule: "${orGroup}"`);
            continue;
        }

        // Create predicate for this OR group
        orGroupPredicates.push((date) => andPredicates.every(fn => fn(date)));
    }

    // If no valid OR groups found, return null
    if (orGroupPredicates.length === 0) {
        console.warn(`[Cite Unseen] No valid conditions found in rule: "${trimmedRule}"`);
        return null;
    }

    return (inputDate) => {
        const date = inputDate instanceof Date ? inputDate : new Date(inputDate);
        if (isNaN(date.getTime())) {
            return false;
        }
        return orGroupPredicates.some(fn => fn(date));
    };
}

/**
 * Escape special regex characters in string
 * @param {string} string - String to escape
 * @returns {string} Escaped string
 */
function escapeRegex(string) {
    if (typeof string !== 'string') {
        console.warn('[Cite Unseen] escapeRegex called with non-string:', typeof string, string);
        return String(string || '').replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * Build regular expression for URL matching
 * @param {string} string - Domain string
 * @returns {RegExp} URL matching regex
 */
function urlRegex(string) {
    return new RegExp('https?:\\/\\/([^\\/]*\\.)?' + escapeRegex(string) + '($|((?<=\\.)|\\/))');
}

/**
 * Get the cached URL regex for a rule.
 * @param {Object} rule - Rule object
 * @returns {RegExp} URL matching regex
 */
function getRuleUrlRegex(rule) {
    if (rule._cachedUrlRegexSource !== rule['url']) {
        rule._cachedUrlRegexSource = rule['url'];
        rule._cachedUrlRegex = urlRegex(rule['url']);
    }
    return rule._cachedUrlRegex;
}

/**
 * Split a rule's whitespace-separated exclude list into individual tokens.
 * @param {Object} rule - Rule object
 * @returns {string[]} Exclude tokens
 */
function getExcludeTokens(rule) {
    if (typeof rule['exclude'] !== 'string' || rule['exclude'] === '') {
        return [];
    }

    if (rule._cachedExcludeSource !== rule['exclude']) {
        rule._cachedExcludeSource = rule['exclude'];
        rule._cachedExcludeTokens = rule['exclude'].trim().split(/\s+/).filter(Boolean);
    }

    return rule._cachedExcludeTokens || [];
}

/**
 * Get cached URL regexes for a rule's exclude list.
 * @param {Object} rule - Rule object
 * @returns {RegExp[]} Exclude URL regexes
 */
function getExcludeUrlRegexes(rule) {
    const excludeTokens = getExcludeTokens(rule);
    if (excludeTokens.length === 0) {
        return [];
    }

    if (rule._cachedExcludeRegexSource !== rule['exclude']) {
        rule._cachedExcludeRegexSource = rule['exclude'];
        rule._cachedExcludeUrlRegexes = excludeTokens.map(urlRegex);
    }

    return rule._cachedExcludeUrlRegexes || [];
}

/**
 * Check whether a URL is excluded from a broader `url` rule match.
 * @param {string} rftId - Citation URL
 * @param {Object} rule - Rule object
 * @returns {boolean} Whether the URL is excluded
 */
function isExcludedUrlMatch(rftId, rule) {
    const excludeUrlRegexes = getExcludeUrlRegexes(rule);
    if (excludeUrlRegexes.length === 0) {
        return false;
    }

    return excludeUrlRegexes.some(regex => regex.test(rftId));
}

/**
 * Check whether a URL is excluded from a broader `url_str` rule match.
 * @param {string} rftId - Citation URL
 * @param {Object} rule - Rule object
 * @returns {boolean} Whether the URL is excluded
 */
function isExcludedUrlStringMatch(rftId, rule) {
    const excludeTokens = getExcludeTokens(rule);
    if (excludeTokens.length === 0) {
        return false;
    }

    return excludeTokens.some(token => rftId.includes(token));
}

/**
 * Check if source author matches rule
 * @param {Object} coins - COinS object
 * @param {Object} rule - Rule object
 * @returns {boolean} Whether author matches
 */
function matchAuthor(coins, rule) {
    if (!rule['author']) return false;

    const authors = [];

    // Extract authors from rft.au field
    if (coins['rft.au']) {
        authors.push(...ensureArray(coins['rft.au']));
    }

    // Extract authors from separate first/last name fields
    if (coins['rft.aulast']) {
        const lastNames = ensureArray(coins['rft.aulast']);
        const firstNames = ensureArray(coins['rft.aufirst']);

        const combinedAuthors = lastNames.map((lastName, i) => {
            const firstName = firstNames[i] || '';
            return firstName ? `${firstName} ${lastName}` : lastName;
        });

        authors.push(...combinedAuthors);
    }

    if (authors.length === 0) return false;

    if (!rule._cachedAuthorRegex) {
        rule._cachedAuthorRegex = new RegExp(rule['author'], 'i');
    }
    return authors.some(author => rule._cachedAuthorRegex.test(author));
}

/**
 * Check if source publisher matches rule
 * @param {Object} coins - COinS object
 * @param {Object} rule - Rule object
 * @returns {boolean} Whether publisher matches
 */
function matchPublisher(coins, rule) {
    const coinsPub = coins['rft.pub'] || coins['rft.jtitle'];
    const coinsAuthor = coins['rft.au'] || coins['rft.aulast'];  // Also consider author fields as potential publisher names
    if (!(coinsPub || coinsAuthor) || !rule['pub']) return false;
    const coinsPubCombined = ensureArray(coinsPub).concat(ensureArray(coinsAuthor));

    if (!rule._cachedPublisherRegex) {
        rule._cachedPublisherRegex = new RegExp(rule['pub'], 'i');
    }
    return coinsPubCombined.some(publisher =>
        rule._cachedPublisherRegex.test(publisher)
    );
}

/**
 * Check if date in COinS object matches date rule
 * @param {Object} coins - COinS object
 * @param {Object} rule - Rule object
 * @returns {boolean} Whether date matches rule
 */
function matchDate(coins, rule) {
    if (!rule['date']) {
        return true;
    }

    if (rule._cachedDateRuleSource !== rule['date']) {
        rule._cachedDateRuleSource = rule['date'];
        rule._cachedDatePredicate = parseDateRule(rule['date']);
    }

    const predicate = rule._cachedDatePredicate;
    if (!predicate) {
        return false;
    }

    if (!coins['rft.date']) {
        return false;
    }

    return predicate(coins['rft.date']);
}

/**
 * Check if source URL matches rule
 * @param {Object} coins - COinS object
 * @param {Object} rule - Rule object
 * @returns {boolean} Whether URL matches
 */
export function matchUrl(coins, rule) {
    if (typeof rule['url'] !== 'string' || rule['url'] === '') return false;
    const rftIds = ensureArray(coins['rft_id']);
    if (rftIds.length === 0) return false;
    const regex = getRuleUrlRegex(rule);
    return rftIds.some(rftId =>
        regex.test(rftId) &&
        !isExcludedUrlMatch(rftId, rule)
    );
}

/**
 * Check if source's URL string matches rule
 * @param {Object} coins - COinS object
 * @param {Object} rule - Rule object
 * @returns {boolean} Whether URL string matches
 */
export function matchUrlString(coins, rule) {
    if (typeof rule['url_str'] !== 'string' || rule['url_str'] === '') return false;
    const rftIds = ensureArray(coins['rft_id']);
    if (rftIds.length === 0) return false;
    return rftIds.some(rftId =>
        rftId.includes(rule['url_str']) &&
        !isExcludedUrlStringMatch(rftId, rule)
    );
}

/**
 * Find matching reliability categories for a citation, prioritizing current language.
 * Returns one match for current language, or all matches from other languages if none for current language.
 * When there are conflicting evaluations within a language, defer to the one that has more conditions.
 * @param {Object} coins - COinS object
 * @param {Object} filteredCategorizedRules - Filtered rules by category
 * @param {Object} options - Matching context
 * @returns {Array} Array of match objects with type, name, and language
 */
export function findReliabilityMatch(coins, filteredCategorizedRules, options) {
    const {
        citeUnseenChecklists,
        citeUnseenCategories,
        currentLanguage,
        showOtherLanguageReliabilityRatings
    } = options;
    const languageMatches = {}, languageMultiCandidates = {}, languageCache = new Map();

    // Function to extract language from checklist name
    const getLanguage = (checklistName) => {
        let language = languageCache.get(checklistName);
        if (language === undefined) {
            language = (checklistName.match(/^([a-z]{2})/) || [, 'unknown'])[1];
            languageCache.set(checklistName, language);
        }
        return language;
    };

    // Function to add match to appropriate collection
    const addMatch = (collection, language, matchData) => {
        (collection[language] ||= []).push(matchData);
    };

    // Process all checklists to find matches
    for (const [checklistType, checklists] of citeUnseenChecklists) {
        for (const [checklistName, checklistID] of checklists) {
            const rules = filteredCategorizedRules[checklistID];

            if (!rules || !citeUnseenCategories[checklistID]) {
                if (!rules) console.log('[Cite Unseen] ' + checklistID + ' is not in the ruleset.');
                continue;
            }

            const language = getLanguage(checklistName);
            let hasDirectMatch = false, hasConstrainedMatch = false;

            for (const rule of rules) {
                const specificity = (Boolean(rule['author']) ? 1.5 : 0.0) + (Boolean(rule['date']) ? 1.0 : 0.0) + (Boolean(rule['pub']) ? 0.7 : 0.0);
                if (match(coins, rule)) {
                    hasDirectMatch = true;
                    addMatch(languageMatches, language, {
                        type: checklistType,
                        name: checklistName,
                        language: language,
                        spec: specificity
                    });
                    if (specificity === 0.0) break;  // No need to check further if matched with no conditions
                } else if (specificity > 0.0 && (matchUrl(coins, rule) || matchUrlString(coins, rule))) {
                    hasConstrainedMatch = true;
                }
            }

            // Track multi candidates if no direct match but has constrained potential
            if (!hasDirectMatch && hasConstrainedMatch) {
                addMatch(languageMultiCandidates, language, {
                    type: 'multi',
                    name: checklistName,
                    language: language,
                    spec: -1.0  // Constrained match takes the least priority
                });
            }
        }
    }

    // Function to select best match from multiple candidates
    const selectBestMatch = (matches) => {
        return matches.length === 1 ? matches[0] :
            matches.reduce((best, current) => (current.spec > best.spec ? current : best));
    };

    // Function to create clean match object
    const createCleanMatch = (match) => ({
        type: match.type,
        name: match.name,
        language: match.language,
        spec: match.spec
    });

    const results = { current: [], other: [] };

    // Process direct matches
    Object.entries(languageMatches).forEach(([language, matches]) => {
        const cleanMatch = createCleanMatch(selectBestMatch(matches));
        const targetArray = language === currentLanguage ? results.current : results.other;
        targetArray.push(cleanMatch);
    });

    // Process multi candidates for languages without direct matches but has constrained potential
    Object.entries(languageMultiCandidates).forEach(([language, multiCandidates]) => {
        if (!languageMatches[language] && multiCandidates.length > 0) {
            const cleanMatch = createCleanMatch(multiCandidates[0]);
            const targetArray = language === currentLanguage ? results.current : results.other;
            targetArray.push(cleanMatch);
        }
    });

    if (showOtherLanguageReliabilityRatings === true) {
        return results.current.concat(results.other);
    } else {
        return results.current.length > 0 ? results.current : results.other;
    }
}

/**
 * Find all matching type categories for a citation.
 * @param {Object} coins - COinS object
 * @param {Object} filteredCategorizedRules - Filtered rules by category
 * @param {Array} typeCategories - Array of type categories to check
 * @param {Object} options - Matching context
 * @returns {Array} Array of matching category names
 */
export function findTypeMatches(coins, filteredCategorizedRules, typeCategories, options) {
    const {
        citeUnseenCategories,
        additionalDomains,
        additionalStrings
    } = options;
    const matches = [];

    for (const category of typeCategories) {
        let hasMatch = false;

        // Check custom domains first
        if (additionalDomains &&
            additionalDomains[category] &&
            additionalDomains[category].length > 0) {

            const customDomains = ensureArray(additionalDomains[category]);

            for (const domain of customDomains) {
                const customRule = { 'url': domain };
                if (match(coins, customRule)) {
                    hasMatch = true;
                    break;
                }
            }
        }

        // Check custom URL strings
        if (!hasMatch && additionalStrings &&
            additionalStrings[category] &&
            additionalStrings[category].length > 0) {

            const customStrings = ensureArray(additionalStrings[category]);

            for (const urlStr of customStrings) {
                const customRule = { 'url_str': urlStr };
                if (match(coins, customRule)) {
                    hasMatch = true;
                    break;
                }
            }
        }

        // Check built-in categorizations
        if (!hasMatch && filteredCategorizedRules[category]) {
            for (const rule of filteredCategorizedRules[category]) {
                if (match(coins, rule)) {
                    hasMatch = true;
                    break;
                }
            }
        }

        // Add to matches if match is found and category is enabled
        if (hasMatch && citeUnseenCategories[category]) {
            matches.push(category);
        }
    }

    return matches;
}

const MATCH_FUNCTIONS = {
    'author': matchAuthor,
    'pub': matchPublisher,
    'date': matchDate,
    'url': matchUrl,
    'url_str': matchUrlString,
};

/**
 * Check if the source matches the rule.
 * @param {Object} coins - COinS object
 * @param {Object} rule - Rule
 * @returns {boolean} Whether it matches the rule
 */
export function match(coins, rule) {
    if (!rule) {
        console.log("[Cite Unseen] There are empty rules in the ruleset.");
        return false;
    }
    for (const key of Object.keys(rule)) {
        if (key.startsWith('_') || key === 'exclude') {
            continue;
        }
        if (!MATCH_FUNCTIONS[key]) {
            console.log("[Cite Unseen] Unknown rule:");
            console.log(rule);
            continue;
        }
        if (!MATCH_FUNCTIONS[key](coins, rule)) {
            return false;
        }
    }
    return true;
}
