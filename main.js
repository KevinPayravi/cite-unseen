// <nowiki>

(function () {
    const CiteUnseen = {
        // ===============================
        // PROPERTIES AND STATE
        // ===============================
        categorizedRules: null,
        citeUnseenCategories: null,
        citeUnseenCategoryTypes: null,
        citeUnseenChecklists: null,
        citeUnseenCategoryData: null,
        citeUnseenDomainIgnore: {},
        refs: [],
        refLinks: [],
        refCategories: {},
        reflists: [],
        convByVar: null,
        settingsButton: null,
        vueApp: null,
        suggestionsToggleButton: null,
        suggestionsMode: false,
        currentSuggestionCitation: null,
        _metaRules: null, // Stores rules loaded from meta.wikimedia.org
        _localRules: null, // Stores rules loaded from local language wiki

        // ===============================
        // RULES OBJECT
        // ===============================
        ruleConfig: {
            globalVars: [
                'cite_unseen_categories',
                'cite_unseen_domain_ignore',
                'cite_unseen_additional_domains',
                'cite_unseen_additional_strings',
                'cite_unseen_dashboard',
                'cite_unseen_show_suggestions'
            ],

            mergeableProps: ['categories', 'domainIgnore', 'additionalDomains', 'additionalStrings'],
            booleanProps: ['dashboard', 'showSuggestions'],

            globalMapping: {
                categories: 'cite_unseen_categories',
                domainIgnore: 'cite_unseen_domain_ignore',
                additionalDomains: 'cite_unseen_additional_domains',
                additionalStrings: 'cite_unseen_additional_strings',
                dashboard: 'cite_unseen_dashboard',
                showSuggestions: 'cite_unseen_show_suggestions'
            }
        },

        // ===============================
        // UTILITY FUNCTIONS
        // ===============================

        /**
         * Parse a COinS string into an object
         * @param {string} query - COinS string
         * @returns {Object} Parsed object
         */
        parseCoinsString: function (query) {
            const result = {};
            const pairs = query.split('&').filter(Boolean);

            pairs.forEach(pair => {
                const index = pair.indexOf('=');
                const key = (index === -1 ? pair : pair.substring(0, index)).replace(/\+/g, ' ');
                const value = (index === -1 ? '' : pair.substring(index + 1)).replace(/\+/g, ' ');

                if (!result[key]) {
                    result[key] = value;
                } else {
                    if (typeof result[key] === 'string') {
                        result[key] = [result[key]];
                    }
                    result[key].push(value);
                }
            });
            return result;
        },

        /**
         * Parse a date token into start/end range
         * @param {string} token - Date token like "2020", "2020-06", or "2020-06-15"
         * @returns {Object} Object with start and end Date objects
         */
        parseDateToken: function (token) {
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
        },

        /**
         * Translate a single rule (e.g. ">= 2010-01") into a predicate function.
         * @param {string} rule - Single date rule with operator
         * @returns {Function} Predicate function that takes a date and returns true/false
         */
        ruleToPredicate: function (rule) {
            rule = rule.trim();
            const match = rule.match(/^(>=|<=|>|<|=)\s*(\d{4}(?:-\d{1,2})?(?:-\d{1,2})?)$/);
            
            if (!match) {
                throw new Error("Invalid rule format: " + rule);
            }

            const [, op, token] = match;
            const { start, end } = CiteUnseen.parseDateToken(token);

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
        },

        /**
         * Parse date rule string into predicate function
         * @param {string} ruleString - Date rule, e.g. "<=2022-01-01,>=2020-01-01" (AND) or "<=2015;>=2017" (OR)
         * @returns {Function|null} Predicate function or null if invalid
         */
        parseDateRule: function (ruleString) {
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

                for (let cond of andConditions) {
                    // Handle case where no operator is provided (default to '=')
                    if (!cond.match(/^(>=|<=|>|<|=)/)) {
                        cond = '=' + cond;
                    }

                    try {
                        const predicate = CiteUnseen.ruleToPredicate(cond);
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
        },

        /**
         * Escape special regex characters in string
         * @param {string} string - String to escape
         * @returns {string} Escaped string
         */
        escapeRegex: function (string) {
            if (typeof string !== 'string') {
                console.warn('[Cite Unseen] escapeRegex called with non-string:', typeof string, string);
                return String(string || '').replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
            }
            return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
        },

        /**
         * Build regular expression for URL matching
         * @param {string} string - Domain string
         * @returns {RegExp} URL matching regex
         */
        urlRegex: function (string) {
            return new RegExp('https?:\\/\\/([^\\/]*\\.)?' + CiteUnseen.escapeRegex(string) + '($|((?<=\\.)|\\/))');
        },

        /**
         * Check if source author matches rule
         * @param {Object} coins - COinS object
         * @param {Object} rule - Rule object
         * @returns {boolean} Whether author matches
         */
        matchAuthor: function (coins, rule) {
            if (!rule['author']) return false;

            const authors = [];

            // Extract authors from rft.au field
            if (coins['rft.au']) {
                authors.push(...CiteUnseen.ensureArray(coins['rft.au']));
            }

            // Extract authors from separate first/last name fields
            if (coins['rft.aulast']) {
                const lastNames = CiteUnseen.ensureArray(coins['rft.aulast']);
                const firstNames = CiteUnseen.ensureArray(coins['rft.aufirst']);

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
        },

        /**
         * Check if source publisher matches rule
         * @param {Object} coins - COinS object
         * @param {Object} rule - Rule object
         * @returns {boolean} Whether publisher matches
         */
        matchPublisher: function (coins, rule) {
            const coinsPub = coins['rft.pub'] || coins['rft.jtitle'];
            if (!coinsPub || !rule['pub']) return false;

            if (!rule._cachedPublisherRegex) {
                rule._cachedPublisherRegex = new RegExp(rule['pub'], 'i');
            }
            return CiteUnseen.ensureArray(coinsPub).some(publisher =>
                rule._cachedPublisherRegex.test(publisher)
            );
        },

        /**
         * Check if date in COinS object matches date rule
         * @param {Object} coins - COinS object
         * @param {Object} rule - Rule object
         * @returns {boolean} Whether date matches rule
         */
        matchDate: function (coins, rule) {
            if (!rule['date']) {
                return true;
            }

            const predicate = CiteUnseen.parseDateRule(rule['date']);
            if (!predicate) {
                return false;
            }

            if (!coins['rft.date']) {
                return false;
            }

            return predicate(coins['rft.date']);
        },

        /**
         * Check if source URL matches rule
         * @param {Object} coins - COinS object
         * @param {Object} rule - Rule object
         * @returns {boolean} Whether URL matches
         */
        matchUrl: function (coins, rule) {
            if (!rule['url'] || !coins['rft_id']) return false;

            // Handle case where rule['url'] might be an array or non-string
            const urlValue = rule['url'];
            if (Array.isArray(urlValue)) {
                return urlValue.some(url => {
                    if (typeof url === 'string') {
                        const urlRegex = CiteUnseen.urlRegex(url);
                        return urlRegex.test(coins['rft_id']);
                    }
                    return false;
                });
            }

            if (typeof urlValue === 'string') {
                const urlRegex = CiteUnseen.urlRegex(urlValue);
                return urlRegex.test(coins['rft_id']);
            }

            return false;
        },

        /**
         * Check if source's URL string matches rule
         * @param {Object} coins - COinS object
         * @param {Object} rule - Rule object
         * @returns {boolean} Whether URL string matches
         */
        matchUrlString: function (coins, rule) {
            if (!rule['url_str'] || !coins['rft_id']) return false;

            const urlStrings = CiteUnseen.ensureArray(rule['url_str']);
            return urlStrings.some(str => coins['rft_id'].includes(str));
        },

        /**
         * Check if source matches rule excluding date constraints
         * @param {Object} coins - COinS object
         * @param {Object} rule - Rule object
         * @returns {boolean} Whether non-date fields match
         */
        matchNonDateFields: function (coins, rule) {
            const matchFunctions = {
                'author': CiteUnseen.matchAuthor,
                'pub': CiteUnseen.matchPublisher,
                'url': CiteUnseen.matchUrl,
                'url_str': CiteUnseen.matchUrlString,
            };
            
            for (const key of Object.keys(rule)) {
                if (key === 'date') continue; // Skip date field
                if (!matchFunctions[key]) {
                    console.log("[Cite Unseen] Unknown rule field:", key);
                    continue;
                }
                if (!matchFunctions[key](coins, rule)) {
                    return false;
                }
            }
            return true;
        },

        /**
         * Find matching reliability categories for a citation, prioritizing current language.
         * Returns one match for current language, or all matches from other languages if none for current language.
         * When there are conflicting evaluations within a language, defer to the one that has a date rule.
         * @param {Object} coins - COinS object
         * @param {Object} filteredCategorizedRules - Filtered rules by category
         * @returns {Array} Array of match objects with type, name, and language
         */
        findReliabilityMatch: function (coins, filteredCategorizedRules) {
            const currentLanguage = mw.config.get('wgContentLanguage');
            const languageMatches = {}, languageMultiCandidates = {}, languageCache = new Map();
            const citationHasDate = Boolean(coins['rft.date']);

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
            for (const [checklistType, checklists] of CiteUnseen.citeUnseenChecklists) {
                for (const [checklistName, checklistID] of checklists) {
                    const rules = filteredCategorizedRules[checklistID];
                    
                    if (!rules || !CiteUnseen.citeUnseenCategories[checklistID]) {
                        if (!rules) console.log('[Cite Unseen] ' + checklistID + ' is not in the ruleset.');
                        continue;
                    }

                    const language = getLanguage(checklistName);
                    let hasDirectMatch = false, hasDateConstrainedMatch = false;

                    for (const rule of rules) {
                        if (CiteUnseen.match(coins, rule)) {
                            hasDirectMatch = true;
                            addMatch(languageMatches, language, {
                                type: checklistType,
                                name: checklistName,
                                language: language,
                                hasDateRule: Boolean(rule['date'])
                            });
                            break;
                        } else if (!citationHasDate && rule['date'] && CiteUnseen.matchNonDateFields(coins, rule)) {
                            hasDateConstrainedMatch = true;
                        }
                    }

                    // Track multi candidates if no direct match but has date-constrained potential
                    if (!hasDirectMatch && hasDateConstrainedMatch) {
                        addMatch(languageMultiCandidates, language, {
                            type: 'multi',
                            name: checklistName,
                            language: language,
                            hasDateRule: false
                        });
                    }
                }
            }

            // Function to select best match from multiple candidates
            const selectBestMatch = (matches) => {
                return matches.length === 1 ? matches[0] : 
                    matches.find(match => match.hasDateRule) || matches[0];
            };

            // Function to create clean match object
            const createCleanMatch = (match) => ({
                type: match.type,
                name: match.name,
                language: match.language
            });

            const results = { current: [], other: [] };

            // Process direct matches
            Object.entries(languageMatches).forEach(([language, matches]) => {
                const cleanMatch = createCleanMatch(selectBestMatch(matches));
                const targetArray = language === currentLanguage ? results.current : results.other;
                targetArray.push(cleanMatch);
            });

            // Process multi candidates for languages without direct matches based on date
            Object.entries(languageMultiCandidates).forEach(([language, multiCandidates]) => {
                if (!languageMatches[language] && multiCandidates.length > 0) {
                    const cleanMatch = createCleanMatch(multiCandidates[0]);
                    const targetArray = language === currentLanguage ? results.current : results.other;
                    targetArray.push(cleanMatch);
                }
            });

            return results.current.length > 0 ? results.current : results.other;
        },

        /**
         * Find all matching type categories for a citation.
         * @param {Object} coins - COinS object
         * @param {Object} filteredCategorizedRules - Filtered rules by category
         * @param {Array} typeCategories - Array of type categories to check
         * @returns {Array} Array of matching category names
         */
        findTypeMatches: function (coins, filteredCategorizedRules, typeCategories) {
            const matches = [];

            for (const category of typeCategories) {
                let hasMatch = false;

                // Check custom domains first
                if (window.cite_unseen_additional_domains &&
                    window.cite_unseen_additional_domains[category] &&
                    window.cite_unseen_additional_domains[category].length > 0) {

                    const customDomains = CiteUnseen.ensureArray(window.cite_unseen_additional_domains[category]);

                    for (const domain of customDomains) {
                        const customRule = { 'url': domain };
                        if (CiteUnseen.match(coins, customRule)) {
                            hasMatch = true;
                            break;
                        }
                    }
                }

                // Check custom URL strings
                if (!hasMatch && window.cite_unseen_additional_strings &&
                    window.cite_unseen_additional_strings[category] &&
                    window.cite_unseen_additional_strings[category].length > 0) {

                    const customStrings = CiteUnseen.ensureArray(window.cite_unseen_additional_strings[category]);

                    for (const urlStr of customStrings) {
                        const customRule = { 'url_str': urlStr };
                        if (CiteUnseen.match(coins, customRule)) {
                            hasMatch = true;
                            break;
                        }
                    }
                }

                // Check built-in categorizations
                if (!hasMatch && filteredCategorizedRules[category]) {
                    for (const rule of filteredCategorizedRules[category]) {
                        if (CiteUnseen.match(coins, rule)) {
                            hasMatch = true;
                            break;
                        }
                    }
                }

                // Add to matches if match is found and category is enabled
                if (hasMatch && CiteUnseen.citeUnseenCategories[category]) {
                    matches.push(category);
                }
            }

            return matches;
        },

        /**
         * Check if the source matches the rule.
         * @param {Object} coins - COinS object
         * @param {Object} rule - Rule
         * @returns {boolean} Whether it matches the rule
         */
        match: function (coins, rule) {
            if (!rule) {
                console.log("[Cite Unseen] There are empty rules in the ruleset.");
                return false;
            }
            const matchFunctions = {
                'author': CiteUnseen.matchAuthor,
                'pub': CiteUnseen.matchPublisher,
                'date': CiteUnseen.matchDate,
                'url': CiteUnseen.matchUrl,
                'url_str': CiteUnseen.matchUrlString,
            };
            for (const key of Object.keys(rule)) {
                if (!matchFunctions[key]) {
                    console.log("[Cite Unseen] Unknown rule:");
                    console.log(rule);
                    continue;
                }
                if (!matchFunctions[key](coins, rule)) {
                    return false;
                }
            }
            return true;
        },

        // ===============================
        // ICON PROCESSING AND DISPLAY
        // ===============================

        /**
         * Add icons to citation sources. Only executed once on page load.
         */
        addIcons: function () {
            const filteredCategorizedRules = {};

            Object.keys(CiteUnseen.categorizedRules).forEach(key => {
                const domainIgnoreList = CiteUnseen.citeUnseenDomainIgnore[key] || [];

                filteredCategorizedRules[key] = CiteUnseen.categorizedRules[key].filter(rule => {
                    const domain = rule['url'];
                    return !domainIgnoreList.includes(domain) &&
                        CiteUnseen.refLinks.some(link => link.includes(domain));
                });
            });
            const typeCategories = CiteUnseen.citeUnseenCategoryTypes.flatMap(x => x[1]);

            CiteUnseen.refs.forEach(ref => {
                // Insert icon area before the <cite> tag
                const iconsDiv = CiteUnseen.createIconsDiv();
                ref.cite.prepend(iconsDiv);

                const processedCategories = new Set();

                // Determine the source type based on the class name
                const classList = ref.cite.classList;
                const bookClasses = ["book", "journal", "encyclopaedia", "conference", "thesis", "magazine"];
                const tvClasses = ["episode", "podcast", "media"];

                // Check CSS-based classifications first
                if (bookClasses.some(cls => classList.contains(cls))) {
                    if (CiteUnseen.citeUnseenCategories.books && !processedCategories.has("books")) {
                        CiteUnseen.processIcon(iconsDiv, "books");
                        processedCategories.add("books");
                    }
                }

                if (classList.contains("pressrelease")) {
                    if (CiteUnseen.citeUnseenCategories.press && !processedCategories.has("press")) {
                        CiteUnseen.processIcon(iconsDiv, "press");
                        processedCategories.add("press");
                    }
                }

                if (tvClasses.some(cls => classList.contains(cls))) {
                    if (CiteUnseen.citeUnseenCategories.tvPrograms && !processedCategories.has("tvPrograms")) {
                        CiteUnseen.processIcon(iconsDiv, "tvPrograms");
                        processedCategories.add("tvPrograms");
                    }
                }

                // If rft_id, check URL-based classifications
                if (ref.coins['rft_id']) {
                    // Check reliability categories
                    const reliabilityMatches = CiteUnseen.findReliabilityMatch(ref.coins, filteredCategorizedRules);
                    for (const reliabilityMatch of reliabilityMatches) {
                        // We can show multiple icons from various language source evaluations,
                        // if current language wiki has none.
                        const reliabilityKey = `${reliabilityMatch.type}_${reliabilityMatch.language}`;
                        if (!processedCategories.has(reliabilityKey)) {
                            CiteUnseen.processIcon(iconsDiv, reliabilityMatch.type, reliabilityMatch.name, reliabilityMatch.language);
                            processedCategories.add(reliabilityKey);
                            processedCategories.add(reliabilityMatch.type);
                        }
                    }

                    // Check all type categories for matches
                    const typeMatches = CiteUnseen.findTypeMatches(ref.coins, filteredCategorizedRules, typeCategories);
                    for (const typeMatch of typeMatches) {
                        if (!processedCategories.has(typeMatch)) {
                            CiteUnseen.processIcon(iconsDiv, typeMatch);
                            processedCategories.add(typeMatch);
                        }
                    }
                }

                if (CiteUnseen.citeUnseenCategories.unknown && processedCategories.size === 0) {
                    CiteUnseen.trackUnknownCitation(iconsDiv);
                }
            });

            CiteUnseen.showSettingsButton();
            CiteUnseen.showDashboard();
            CiteUnseen.showSuggestionsToggleButton();
            CiteUnseen.groupButtons();

            console.timeEnd('[Cite Unseen] Runtime');
        },

        /**
         * Add to count. Currently, it records regardless of whether it is in the reflist.
         * @param {Element} node - The node
         * @param {String} type - The type
         */
        addToCount: function (node, type) {
            CiteUnseen.citeUnseenCategoryData[type].count++;
        },

        /**
         * Add an icon and tooltip to a node.
         * @param {Element} node - The iconsDiv node
         * @param {String} type - The type
         * @param {String|null} checklist - The checklist
         * @param {String|null} language - Language code for reliability icons
         * @returns {Element} The iconNode element
         */
        processIcon: function (node, type, checklist = null, language = null) {
            const iconContainer = document.createElement("span");
            iconContainer.classList.add("cite-unseen-icon-container");

            const iconNode = document.createElement("img");
            iconNode.classList.add("skin-invert");
            iconNode.classList.add("cite-unseen-icon-" + type);
            iconNode.classList.add("cite-unseen-icon");
            iconNode.setAttribute("src", CiteUnseen.citeUnseenCategoryData[type].icon);
            let message = CiteUnseen.convByVar(CiteUnseenI18n.categoryHints[type]);
            if (checklist) {
                const pageLink = CiteUnseen.citeUnseenData.resolveSourceToPageLink(checklist);
                const displayName = pageLink || checklist;
                message = CiteUnseen.convByVar(CiteUnseenI18n.citationTooltipPrefix) + displayName +
                    CiteUnseen.convByVar(CiteUnseenI18n.citationTooltipSuffix) + message +
                    CiteUnseen.convByVar(CiteUnseenI18n.citationTooltipAction);
            }
            iconNode.setAttribute("alt", message);
            iconNode.setAttribute("title", "[Cite Unseen] " + message);

            CiteUnseen.addToCount(node, type);
            if (checklist) {
                // If there is a checklist, wrap the icon in a link.
                const iconNodeLink = document.createElement("a");
                const pageLink = CiteUnseen.citeUnseenData.resolveSourceToPageLink(checklist);
                if (pageLink) {
                    const [lang, ...pageParts] = pageLink.split(':');
                    const fullPagePath = pageParts.join(':');
                    iconNodeLink.setAttribute("href", `//${lang}.wikipedia.org/wiki/${fullPagePath}`);
                }
                iconNodeLink.setAttribute("target", "_blank");
                iconNodeLink.classList.add("cite-unseen-icon-link");
                iconNodeLink.appendChild(iconNode);
                
                // Add language indicator for reliability icons from different languages.
                if (language && language !== mw.config.get('wgContentLanguage') && ['blacklisted', 'deprecated', 'generallyUnreliable', 'marginallyReliable', 'generallyReliable', 'multi'].includes(type)) {
                    const langIndicator = document.createElement("span");
                    langIndicator.classList.add("cite-unseen-lang-indicator");
                    langIndicator.textContent = language.toUpperCase();
                    iconNodeLink.appendChild(langIndicator);
                }
                
                iconContainer.appendChild(iconNodeLink);
                node.appendChild(iconContainer);
            } else {
                iconContainer.appendChild(iconNode);
                node.appendChild(iconContainer);
            }
            if (!CiteUnseen.refCategories[type]) {
                CiteUnseen.refCategories[type] = [];
            }
            CiteUnseen.refCategories[type].push(node.parentNode);
            return iconNode;
        },

        /**
         * Track a citation as unknown.
         * @param {Element} node - The iconsDiv node (parent of the citation)
         */
        trackUnknownCitation: function (node) {
            const type = "unknown";
            CiteUnseen.addToCount(node, type);

            if (!CiteUnseen.refCategories[type]) {
                CiteUnseen.refCategories[type] = [];
            }
            CiteUnseen.refCategories[type].push(node.parentNode);
        },

        /**
         * Parse a string containing the plural marker "(s)"
         * @param {string} string - The string to parse
         * @param {number} value - The value used to determine plural form
         * @return {string} - The parsed string
         */
        parseI18nPlural: function (string, value) {
            return string.replace(/\(s\)/g, value === 1 ? '' : 's');
        },

        // ===============================
        // UI AND DASHBOARD
        // ===============================

        /**
         * Show the settings button for Cite Unseen configuration.
         */
        showSettingsButton: function () {
            if (CiteUnseen.refs.length === 0) {
                return;
            }

            if (CiteUnseen.settingsButton === null) {
                CiteUnseen.settingsButton = document.createElement('div');
                CiteUnseen.settingsButton.className = 'cite-unseen-button';

                // Settings icon
                const icon = document.createElement('span');
                icon.innerHTML = '⚙️';
                CiteUnseen.settingsButton.appendChild(icon);

                // Settings label
                const label = document.createElement('span');
                label.textContent = CiteUnseen.convByVar(CiteUnseenI18n.settingsButton);
                CiteUnseen.settingsButton.appendChild(label);

                CiteUnseen.settingsButton.onclick = function () {
                    CiteUnseen.openSettingsDialog();
                };

                CiteUnseen.settingsButton.setAttribute('title', CiteUnseen.convByVar(CiteUnseenI18n.settingsButtonTooltip));
            }
        },

        /**
         * Add citation statistics dashboard for all reflists that contain citations.
         */
        showDashboard: function () {
            if (CiteUnseen.refs.length === 0 || window.cite_unseen_dashboard === false) {
                return;
            }

            // Create dashboards for each reflist that has citations
            for (const reflistData of CiteUnseen.reflists) {
                CiteUnseen.createDashboardForReflist(reflistData);
            }
        },

        /**
         * Create a dashboard for a specific reflist
         * @param {Object} reflistData - The reflist data object
         */
        createDashboardForReflist: function (reflistData) {
            // Calculate category counts
            const reflistCategoryCounts = CiteUnseen.calculateCategoryCountsForReflist(reflistData);

            const hasCategorizations = Object.values(reflistCategoryCounts).some(count => count > 0);
            if (!hasCategorizations) {
                return; // Don't create dashboard if no categorizations
            }

            const dashboard = {
                div: document.createElement('div'),
                header: document.createElement('div'),
                total: document.createElement('div'),
                clearAll: null,
                cats: document.createElement('div'),
                reflistData: reflistData
            };

            reflistData.dashboard = dashboard;

            dashboard.div.classList.add('cite-unseen-dashboard');
            dashboard.header.classList.add('cite-unseen-dashboard-header');

            // 'Clear All' button
            const clearAllButton = document.createElement('span');
            clearAllButton.className = 'cite-unseen-clear-all-header cite-unseen-hidden';
            clearAllButton.innerText = CiteUnseen.convByVar(CiteUnseenI18n.clearAllFilters);
            clearAllButton.setAttribute('title', CiteUnseen.convByVar(CiteUnseenI18n.clearAllFiltersTooltip));
            clearAllButton.setAttribute('role', 'button');
            clearAllButton.setAttribute('tabindex', '0');
            clearAllButton.onclick = function () {
                CiteUnseen.clearAllFiltersForReflist(dashboard.reflistData);
            };
            clearAllButton.onkeydown = function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    clearAllButton.onclick();
                }
            };
            dashboard.clearAll = clearAllButton;

            // Cache the total citation count
            reflistData.totalCitations = reflistData.element.querySelectorAll('li').length;

            // Show citation count
            CiteUnseen.updateFilteredCountForReflist(dashboard, reflistData.totalCitations, reflistData.totalCitations);
            dashboard.total.classList.add('cite-unseen-dashboard-total');

            // Add total and clear all button to header
            dashboard.header.appendChild(dashboard.total);
            dashboard.header.appendChild(clearAllButton);
            dashboard.div.appendChild(dashboard.header);
            dashboard.cats.classList.add('cite-unseen-dashboard-cats');
            dashboard.div.appendChild(dashboard.cats);

            // Insert the dashboard before this reflist
            document.querySelector('#mw-content-text .mw-parser-output').insertBefore(dashboard.div, reflistData.element);
            CiteUnseen.updateDashboardCategories(dashboard, reflistCategoryCounts);
        },

        /**
         * Calculate category counts for a specific reflist
         * @param {Object} reflistData - The reflist data object
         * @returns {Object} Category counts for this reflist
         */
        calculateCategoryCountsForReflist: function (reflistData) {
            const counts = {};

            // Get all category types
            const categoryTypes = CiteUnseen.getAllCategoryTypes();

            // Initialize all category counts to 0
            for (const category of categoryTypes) {
                counts[category] = 0;
            }

            // Count citations in this reflist by category
            for (const ref of reflistData.refs) {
                // Find which categories this citation belongs to
                for (const category in CiteUnseen.refCategories) {
                    const categoryNodes = CiteUnseen.refCategories[category];
                    if (categoryNodes && categoryNodes.includes(ref.cite)) {
                        counts[category]++;

                        // Store the reference to this category for this reflist
                        if (!reflistData.categories[category]) {
                            reflistData.categories[category] = [];
                        }
                        reflistData.categories[category].push(ref.cite);
                    }
                }
            }

            return counts;
        },

        /**
         * Get all category types used in the system
         * @returns {Array} Array of all category type strings
         */
        getAllCategoryTypes: function () {
            return [...CiteUnseen.citeUnseenChecklists.flatMap(x => x[0]), ...CiteUnseen.citeUnseenCategoryTypes.flatMap(x => x[1]), 'unknown'];
        },

        /**
         * Update dashboard categories display for a specific dashboard
         * @param {Object} dashboard - The dashboard object
         * @param {Object} categoryCounts - Category counts for this reflist
         */
        updateDashboardCategories: function (dashboard, categoryCounts) {
            // Clear existing categories
            dashboard.cats.innerHTML = '';

            // List each type of source in order
            const categoryTypes = CiteUnseen.getAllCategoryTypes();
            for (const category of categoryTypes) {
                const count = categoryCounts[category] || 0;
                if (count > 0) {
                    const countNode = document.createElement('div');
                    countNode.setAttribute('data-category', category);
                    countNode.classList.add('cite-unseen-category-item');

                    const countIcon = document.createElement('img');
                    countIcon.alt = CiteUnseen.convByVar(CiteUnseenI18n.categoryHints[category]);
                    countIcon.src = CiteUnseen.citeUnseenCategoryData[category].icon;
                    countIcon.width = '17';
                    countIcon.classList.add("skin-invert");
                    countIcon.classList.add('cite-unseen-category-icon');

                    const countText = document.createElement('span');
                    const categoryLabel = CiteUnseen.convByVar(CiteUnseenI18n.categoryLabels[category]);
                    // Handle plural for English
                    const labelText = mw.config.get('wgContentLanguage') === 'en' ?
                        CiteUnseen.parseI18nPlural(categoryLabel, count) :
                        categoryLabel;
                    countText.innerText = count + ' ' + labelText;
                    countText.classList.add('cite-unseen-category-text');

                    countNode.onclick = function () {
                        CiteUnseen.toggleCategoryFilterForReflist(dashboard.reflistData, category);
                    };

                    countNode.setAttribute('role', 'button');
                    countNode.setAttribute('tabindex', '0');
                    countNode.setAttribute('aria-pressed', 'false');
                    countNode.setAttribute('title', CiteUnseen.convByVar(CiteUnseenI18n.filterToggleTooltip));

                    countNode.onkeydown = function (e) {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            countNode.onclick();
                        }
                    };

                    countNode.appendChild(countIcon);
                    countNode.appendChild(countText);
                    dashboard.cats.appendChild(countNode);
                }
            }
        },

        /**
         * Get the appropriate container element for a citation (usually the <li> element)
         * @param {Element} citationElement - The citation element
         * @returns {Element} The container element to show/hide
         */
        getCitationContainer: function (citationElement) {
            // Try to find the list item within a references section
            const listItem = citationElement.closest('li');
            if (listItem && listItem.closest('.references, .reflist')) {
                return listItem;
            }

            // Fallback: look for any parent list item
            if (listItem) {
                return listItem;
            }

            // Final fallback: use the citation element itself
            return citationElement;
        },

        /**
         * Toggle a category filter on/off for a specific reflist
         * @param {Object} reflistData - The reflist data object
         * @param {string} category - Citation category to toggle
         */
        toggleCategoryFilterForReflist: function (reflistData, category) {
            if (!reflistData || !reflistData.selectedCategories || !category) {
                console.warn('[Cite Unseen] Invalid parameters provided to toggleCategoryFilterForReflist');
                return;
            }

            if (reflistData.selectedCategories.has(category)) {
                reflistData.selectedCategories.delete(category);
            } else {
                reflistData.selectedCategories.add(category);
            }

            CiteUnseen.applyMultiCategoryFilterForReflist(reflistData);
        },

        /**
         * Clear all category filters for a specific reflist
         * @param {Object} reflistData - The reflist data object
         */
        clearAllFiltersForReflist: function (reflistData) {
            if (!reflistData || !reflistData.selectedCategories) {
                console.warn('[Cite Unseen] Invalid reflist data provided to clearAllFiltersForReflist');
                return;
            }

            reflistData.selectedCategories.clear();
            CiteUnseen.applyMultiCategoryFilterForReflist(reflistData);
        },

        /**
         * Apply filtering based on currently selected categories for a specific reflist.
         * @param {Object} reflistData - The reflist data object
         */
        applyMultiCategoryFilterForReflist: function (reflistData) {
            if (!reflistData || !reflistData.element || !reflistData.dashboard) {
                console.warn('[Cite Unseen] Invalid reflist data provided to applyMultiCategoryFilterForReflist');
                return;
            }

            const dashboard = reflistData.dashboard;
            const targetReflist = reflistData.element;

            // Update dashboard visual indications for all categories
            const allCategoryElements = dashboard.cats.querySelectorAll('[data-category]');
            allCategoryElements.forEach(function (element) {
                const category = element.getAttribute('data-category');
                if (reflistData.selectedCategories.has(category)) {
                    element.classList.add('cite-unseen-filter-selected');
                    element.setAttribute('aria-pressed', 'true');
                } else {
                    element.classList.remove('cite-unseen-filter-selected');
                    element.setAttribute('aria-pressed', 'false');
                }
            });

            // Show/hide "Clear All" button based on active filters
            if (dashboard.clearAll) {
                if (reflistData.selectedCategories.size > 1) {
                    dashboard.clearAll.classList.remove('cite-unseen-hidden');
                    dashboard.clearAll.classList.add('cite-unseen-visible');
                } else {
                    dashboard.clearAll.classList.add('cite-unseen-hidden');
                    dashboard.clearAll.classList.remove('cite-unseen-visible');
                }
            }

            if (reflistData.selectedCategories.size === 0) {
                // No categories selected - show all citations
                const allListItems = targetReflist.querySelectorAll('li');
                allListItems.forEach(function (li) {
                    li.classList.remove('cite-unseen-list-hidden');
                    li.classList.remove('cite-unseen-filtered-out');
                    li.setAttribute('aria-hidden', 'false');
                });

                targetReflist.classList.remove('cite-unseen-filtering-active');
                targetReflist.removeAttribute('data-cite-unseen-filter');

                // Reset count display
                CiteUnseen.updateFilteredCountForReflist(dashboard, reflistData.totalCitations, reflistData.totalCitations);
                return;
            }

            // Collect all citations that match all of the selected categories
            let visibleContainers = new Set();
            const selectedCategoriesArray = Array.from(reflistData.selectedCategories);
            const containerToCategoriesMap = new Map();

            // Populate the map for all selected categories
            selectedCategoriesArray.forEach(function (category) {
                const nodes = reflistData.categories[category];
                if (nodes) {
                    nodes.forEach(function (citeElement) {
                        const container = CiteUnseen.getCitationContainer(citeElement);
                        if (container && targetReflist.contains(container)) {
                            if (!containerToCategoriesMap.has(container)) {
                                containerToCategoriesMap.set(container, new Set());
                            }
                            containerToCategoriesMap.get(container).add(category);
                        }
                    });
                }
            });

            // Find containers that belong to all selected categories
            containerToCategoriesMap.forEach(function (categoriesSet, container) {
                if (categoriesSet.size === selectedCategoriesArray.length) {
                    visibleContainers.add(container);
                }
            });

            // Hide all list items in the target reflist, then show only the visible ones
            const allListItems = targetReflist.querySelectorAll('li');
            allListItems.forEach(function (li) {
                if (visibleContainers.has(li)) {
                    li.classList.remove('cite-unseen-list-hidden');
                    li.classList.remove('cite-unseen-filtered-out');
                    li.setAttribute('aria-hidden', 'false');
                } else {
                    li.classList.add('cite-unseen-list-hidden');
                    li.classList.add('cite-unseen-filtered-out');
                    li.setAttribute('aria-hidden', 'true');
                }
            });

            // Add filtering state to the target reflist
            targetReflist.classList.add('cite-unseen-filtering-active');
            targetReflist.setAttribute('data-cite-unseen-filter', selectedCategoriesArray.join(','));

            // Update count display
            CiteUnseen.updateFilteredCountForReflist(dashboard, visibleContainers.size, reflistData.totalCitations);
        },

        /**
         * Update the display to show filtered count for a specific reflist
         * @param {Object} dashboard - The dashboard object
         * @param {number} visibleCount - Number of visible citations
         * @param {number} totalCount - Total number of citations
         */
        updateFilteredCountForReflist: function (dashboard, visibleCount, totalCount) {
            if (!dashboard || !dashboard.total) return;

            const totalElement = dashboard.total;
            const baseText = "[Cite Unseen] ";
            const citationText = totalCount === 1 ?
                CiteUnseen.convByVar(CiteUnseenI18n.citationSingular) :
                CiteUnseen.convByVar(CiteUnseenI18n.citationPlural);

            if (visibleCount === totalCount) {
                totalElement.innerText = baseText + CiteUnseen.convByVar(CiteUnseenI18n.totalCitations) + totalCount + citationText;
            } else {
                const filterInfo = dashboard.reflistData.selectedCategories.size > 1 ?
                    " (" + dashboard.reflistData.selectedCategories.size + CiteUnseen.convByVar(CiteUnseenI18n.filtersActive) + ")" :
                    "";

                totalElement.innerText = baseText +
                    CiteUnseen.convByVar(CiteUnseenI18n.showing) + visibleCount +
                    CiteUnseen.convByVar(CiteUnseenI18n.of) + totalCount +
                    citationText + filterInfo;
            }
        },

        // ===============================
        // RULE MANAGEMENT AND LOADING
        // ===============================

        /**
         * Capture current state of global rule variables
         * @returns {Object} Current state of global variables
         */
        captureGlobalRulesState: function () {
            const state = {};
            Object.entries(CiteUnseen.ruleConfig.globalMapping).forEach(([key, globalVar]) => {
                const value = window[globalVar];
                state[key] = value && typeof value === 'object' ? { ...value } : value;
            });
            return state;
        },

        /**
         * Check if two states are different (deep comparison for objects)
         * @param {*} a - First value
         * @param {*} b - Second value
         * @returns {boolean} Whether values are different
         */
        isDifferent: function (a, b) {
            if (a === b) return false;
            if (a == null || b == null) return a !== b;
            if (typeof a === 'object' && typeof b === 'object') {
                return JSON.stringify(a) !== JSON.stringify(b);
            }
            return a !== b;
        },

        /**
         * Load custom rules from a specific wiki and return changes
         * @param {string} wikiHost - Wiki host to load from
         * @param {Object} previousState - Previous state to compare against
         * @returns {Promise<Object|null>} Changed rules or null if no changes/error
         */
        loadCustomRulesFromWiki: async function (wikiHost, previousState = {}) {
            const userName = encodeURIComponent(mw.config.get('wgUserName'));
            const scriptUrl = `//${wikiHost}/w/index.php?title=User:${userName}/CiteUnseen-Rules.js&ctype=text/javascript&action=raw`;

            try {
                await mw.loader.getScript(scriptUrl);
                console.log(`[Cite Unseen] Loaded custom rules from ${wikiHost}`);

                const currentState = CiteUnseen.captureGlobalRulesState();
                const changes = {};

                // Find differences
                Object.keys(currentState).forEach(key => {
                    if (CiteUnseen.isDifferent(currentState[key], previousState[key])) {
                        changes[key] = currentState[key];
                    }
                });

                return Object.keys(changes).length > 0 ? changes : null;
            } catch (err) {
                console.log(`[Cite Unseen] No custom rules found on ${wikiHost} or error loading: ${err.message}`);
                return null;
            }
        },

        /**
         * Merge two rule objects with local taking priority
         * @param {Object} metaRules - Rules from meta.wikimedia.org
         * @param {Object} localRules - Rules from local wiki
         * @returns {Object} Merged rules
         */
        mergeRules: function (metaRules, localRules) {
            const merged = {};
            const { mergeableProps, booleanProps } = CiteUnseen.ruleConfig;

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
        },

        /**
         * Apply rules to global variables
         * @param {Object} rules - Rules to apply
         */
        applyRulesToGlobals: function (rules) {
            Object.entries(CiteUnseen.ruleConfig.globalMapping).forEach(([key, globalVar]) => {
                if (rules[key] !== undefined) {
                    window[globalVar] = rules[key];
                }
            });
        },

        /**
         * Apply user configurations to internal CiteUnseen objects
         */
        applyUserConfigurations: function () {
            // Apply category configurations
            if (window.cite_unseen_categories && typeof window.cite_unseen_categories === 'object') {
                for (const key in window.cite_unseen_categories) {
                    if (key in CiteUnseen.citeUnseenCategories) {
                        CiteUnseen.citeUnseenCategories[key] = window.cite_unseen_categories[key];
                    } else {
                        // Handle grouped categories (blacklisted, deprecated, etc.)
                        const groupKeys = ["blacklisted", "deprecated", "generallyUnreliable", "marginallyReliable", "generallyReliable", "multi"];
                        if (groupKeys.includes(key)) {
                            for (const checklistTypeData of CiteUnseen.citeUnseenChecklists) {
                                if (checklistTypeData[0] === key) {
                                    for (const checklist of checklistTypeData[1]) {
                                        CiteUnseen.citeUnseenCategories[checklist] = window.cite_unseen_categories[key];
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
                    if (window.cite_unseen_domain_ignore[key]?.length && key in CiteUnseen.citeUnseenDomainIgnore) {
                        CiteUnseen.citeUnseenDomainIgnore[key] = window.cite_unseen_domain_ignore[key];
                    }
                }
            }

            // Apply additional domains and strings
            ['cite_unseen_additional_domains', 'cite_unseen_additional_strings'].forEach(configType => {
                const config = window[configType];
                if (config && typeof config === 'object') {
                    const ruleKey = configType.includes('domains') ? 'url' : 'url_str';

                    for (const key in config) {
                        if (config[key]?.length && key in CiteUnseen.categorizedRules) {
                            const items = Array.isArray(config[key]) ? config[key] : [config[key]];
                            const rules = items.map(item => ({ [ruleKey]: item }));
                            CiteUnseen.categorizedRules[key] = CiteUnseen.categorizedRules[key].concat(rules);
                        }
                    }
                }
            });
        },

        /**
         * Load and merge custom rules from meta and local wikis
         */
        importCustomRules: async function () {
            try {
                // Get initial state and load rules from Meta Wiki
                const initialState = CiteUnseen.captureGlobalRulesState();
                const metaRules = await CiteUnseen.loadCustomRulesFromWiki('meta.wikimedia.org', initialState);
                const metaState = CiteUnseen.captureGlobalRulesState();
                CiteUnseen._metaRules = {
                    categories: metaState.categories || {},
                    domainIgnore: metaState.domainIgnore || {},
                    additionalDomains: metaState.additionalDomains || {},
                    additionalStrings: metaState.additionalStrings || {},
                    dashboard: metaState.dashboard !== undefined ? metaState.dashboard : true,
                    showSuggestions: metaState.showSuggestions !== undefined ? metaState.showSuggestions : true
                };

                // Load local rules
                const localRules = await CiteUnseen.loadCustomRulesFromWiki(
                    mw.config.get('wgServer').replace('//', ''),
                    metaState
                );

                CiteUnseen._localRules = {
                    categories: localRules?.categories || {},
                    domainIgnore: localRules?.domainIgnore || {},
                    additionalDomains: localRules?.additionalDomains || {},
                    additionalStrings: localRules?.additionalStrings || {},
                    dashboard: localRules?.dashboard !== undefined ? localRules.dashboard : true,
                    showSuggestions: localRules?.showSuggestions !== undefined ? localRules.showSuggestions : true
                };

                // Merge and apply all rules
                const mergedRules = CiteUnseen.mergeRules(metaRules, localRules);
                CiteUnseen.applyRulesToGlobals(mergedRules);

                CiteUnseen.applyUserConfigurations();

            } catch (err) {
                console.log('[Cite Unseen] Error during custom rules import:', err);
            }
        },

        // ===============================
        // DATA LOADING AND CITATION PROCESSING
        // ===============================

        /**
         * Import dependencies and categorized rules.
         * This function loads the CiteUnseenData module and sets up the convByVar function for language conversion.
         * @returns {Promise<Record<string, Object[]>>}
         */
        importDependencies: async function () {
            if (mw.config.get('wgServer') === "//zh.wikipedia.org") {
                // On Chinese Wikipedia, prioritize using the ext.gadget.HanAssist module.
                await mw.loader.using('ext.gadget.HanAssist', function (require) {
                    const { convByVar } = require('ext.gadget.HanAssist');
                    CiteUnseen.convByVar = convByVar;
                });
            } else {
                const lang = mw.config.get('wgContentLanguage');
                CiteUnseen.convByVar = function (i18nDict) {
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

            await mw.loader.load('//gitlab-content.toolforge.org/kevinpayravi/cite-unseen/-/raw/main/styles.css?mime=text/css', 'text/css');
            await mw.loader.getScript('//gitlab-content.toolforge.org/kevinpayravi/cite-unseen/-/raw/main/i18n.js?mime=text/javascript');
            await mw.loader.getScript('//gitlab-content.toolforge.org/kevinpayravi/cite-unseen/-/raw/main/sources.js?mime=text/javascript');
            return await CiteUnseenData.getCategorizedRules();
        },

        /**
         * Find all <cite> tags and parse them into COinS objects; locate the position of {{reflist}}.
         */
        findCitations: function () {
            // Structure where COinS strings are located:
            //   <cite class="citation book">...</cite>
            //   <span title="...(COinS string)...">...</span>

            // Filter all <cite> tags
            for (const citeTag of document.querySelectorAll("cite")) {
                let coinsObject;
                let coinsTag = citeTag.nextElementSibling;
                if (!coinsTag || coinsTag.tagName !== 'SPAN' || !coinsTag.hasAttribute('title')) {
                    // No COinS, so get the href attribute of the <a> tag inside the cite
                    // This is a partial solution to parse jawiki {{Cite web}} and {{Cite news}}.
                    let aTag = citeTag.querySelector('a.external');
                    if (aTag && aTag.hasAttribute('href')) {
                        coinsObject = {
                            'rft_id': aTag.getAttribute('href'),
                        };
                    } else {
                        // No COinS and no <a> tag, so skip
                        continue;
                    }
                } else {
                    // Parse COinS string
                    let coinsString = decodeURIComponent(coinsTag.getAttribute('title'));
                    coinsObject = CiteUnseen.parseCoinsString(coinsString);
                    if (!coinsObject['rft_id']) {
                        let aTag = citeTag.querySelector('a.external');
                        if (aTag) {
                            coinsObject['rft_id'] = aTag.getAttribute('href');
                        }
                    }
                }
                CiteUnseen.refs.push({
                    cite: citeTag, coins: coinsObject,
                });
                if (coinsObject['rft_id']) {
                    CiteUnseen.refLinks.push(coinsObject['rft_id']);
                }
            }

            // Handle plain-link citations in <li> tags that don't have <cite>
            const citationLiElements = document.querySelectorAll('li[id^="cite_note-"]');
            for (const li of citationLiElements) {
                if (li.querySelector('cite')) {
                    continue;
                }

                const refTextElement = li.querySelector('.reference-text');
                if (!refTextElement) {
                    continue;
                }

                const aTag = refTextElement.querySelector('a.external');
                if (aTag && aTag.hasAttribute('href')) {
                    const coinsObject = { 'rft_id': aTag.getAttribute('href') };
                    CiteUnseen.refs.push({
                        cite: refTextElement,
                        coins: coinsObject,
                    });
                    if (coinsObject['rft_id']) {
                        CiteUnseen.refLinks.push(coinsObject['rft_id']);
                    }
                }
            }

            // Find all reflists and track citations within each
            const reflists = document.querySelectorAll('#mw-content-text .mw-parser-output div.reflist');
            CiteUnseen.reflists = [];

            if (reflists.length > 0) {
                // Create reflist data structure for each reflist
                for (const reflist of reflists) {
                    const reflistData = {
                        element: reflist,
                        refs: [],
                        categories: {},
                        dashboard: null,
                        selectedCategories: new Set(),
                        totalCitations: null // Will be calculated when dashboard is created
                    };

                    // Find which of our tracked citations belong to this reflist
                    for (const ref of CiteUnseen.refs) {
                        if (reflist.contains(ref.cite)) {
                            reflistData.refs.push(ref);
                        }
                    }

                    // Only track reflists that have citations
                    if (reflistData.refs.length > 0) {
                        CiteUnseen.reflists.push(reflistData);
                    }
                }
            }
        },

        /**
         * Get meta rules from global variables (rules that were loaded from meta.wikimedia.org)
         * @returns {Object} Meta rules object
         */
        getMetaRulesFromGlobals: function () {
            // Return the stored meta rules if available, otherwise default to empty
            return CiteUnseen._metaRules || {
                categories: {},
                domainIgnore: {},
                additionalDomains: {},
                additionalStrings: {},
                dashboard: true,
                showSuggestions: true
            };
        },

        /**
         * Get local rules from global variables
         * @returns {Object} Local rules object
         */
        getLocalRulesFromGlobals: function () {
            return CiteUnseen._localRules || {
                categories: {},
                domainIgnore: {},
                additionalDomains: {},
                additionalStrings: {},
                dashboard: true,
                showSuggestions: true
            };
        },

        /**
         * Save settings to user's MediaWiki config page
         * @param {Object} settings - Settings object to save
         * @param {String} target - Target wiki ('meta' or 'local')
         * @param {Function} onSuccess - Success callback
         * @param {Function} onError - Error callback
         */
        saveSettingsToWiki: function (settings, target, onSuccess, onError) {
            // Determine the target wiki and page title
            let pageTitle, apiOptions;

            if (target === 'meta') {
                pageTitle = 'User:' + mw.config.get('wgUserName') + '/CiteUnseen-Rules.js';
                // For meta.wikimedia.org, we need to use cross-wiki API
                apiOptions = {
                    ajax: {
                        url: '//meta.wikimedia.org/w/api.php',
                        xhrFields: { withCredentials: true }
                    }
                };
            } else {
                pageTitle = 'User:' + mw.config.get('wgUserName') + '/CiteUnseen-Rules.js';
                apiOptions = {};
            }

            const targetApi = target === 'meta' ? new mw.ForeignApi('//meta.wikimedia.org/w/api.php') : new mw.Api();

            targetApi.postWithToken('csrf', {
                action: 'edit',
                title: pageTitle,
                text: CiteUnseen.generateSettingsContent(settings, target),
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
        },

        // ===============================
        // SETTINGS DIALOG AND CONFIG
        // ===============================

        /**
         * Create and show the Codex settings dialog
         */
        createSettingsDialog: function () {
            mw.loader.using('@wikimedia/codex').then(function (require) {
                const Vue = require('vue');
                const Codex = require('@wikimedia/codex');

                if (!document.getElementById('cite-unseen-dialog-mount')) {
                    const mountPoint = document.createElement('div');
                    mountPoint.id = 'cite-unseen-dialog-mount';
                    document.body.appendChild(mountPoint);
                }

                const app = Vue.createMwApp({
                    i18n: {
                        documentationLink: CiteUnseen.convByVar(CiteUnseenI18n.documentationLink),
                        viewSettingsFrom: CiteUnseen.convByVar(CiteUnseenI18n.viewSettingsFrom),
                        loading: CiteUnseen.convByVar(CiteUnseenI18n.loading),
                        metaWikiGlobal: CiteUnseen.convByVar(CiteUnseenI18n.metaWikiGlobal),
                        local: CiteUnseen.convByVar(CiteUnseenI18n.local),
                        localSettingGuidance: CiteUnseen.convByVar(CiteUnseenI18n.localSettingGuidance),
                        tabGeneral: CiteUnseen.convByVar(CiteUnseenI18n.tabGeneral),
                        tabCategories: CiteUnseen.convByVar(CiteUnseenI18n.tabCategories),
                        tabIgnoreDomains: CiteUnseen.convByVar(CiteUnseenI18n.tabIgnoreDomains),
                        tabAdditionalDomains: CiteUnseen.convByVar(CiteUnseenI18n.tabAdditionalDomains),
                        tabAdditionalStrings: CiteUnseen.convByVar(CiteUnseenI18n.tabAdditionalStrings),
                        categoriesTabGuidance: CiteUnseen.convByVar(CiteUnseenI18n.categoriesTabGuidance),
                        ignoreDomainsTabGuidance: CiteUnseen.convByVar(CiteUnseenI18n.ignoreDomainsTabGuidance),
                        additionalDomainsTabGuidance: CiteUnseen.convByVar(CiteUnseenI18n.additionalDomainsTabGuidance),
                        additionalStringsTabGuidance: CiteUnseen.convByVar(CiteUnseenI18n.additionalStringsTabGuidance),
                        enableDisableCategories: CiteUnseen.convByVar(CiteUnseenI18n.enableDisableCategories),
                        showDashboard: CiteUnseen.convByVar(CiteUnseenI18n.showDashboard),
                        showSuggestionsButton: CiteUnseen.convByVar(CiteUnseenI18n.showSuggestionsButton),
                        domainsToIgnore: CiteUnseen.convByVar(CiteUnseenI18n.domainsToIgnore),
                        additionalDomains: CiteUnseen.convByVar(CiteUnseenI18n.additionalDomains),
                        additionalUrlStrings: CiteUnseen.convByVar(CiteUnseenI18n.additionalUrlStrings)
                    },
                    data() {
                        return {
                            open: true,
                            activeTab: 'general',
                            target: 'meta', // 'meta' or 'local'
                            settings: {
                                categories: {},
                                domainIgnore: {},
                                additionalDomains: {},
                                additionalStrings: {},
                                dashboard: true,
                                showSuggestions: true
                            },
                            isSaving: false,
                            cleanupTimer: null
                        };
                    },
                    computed: {
                        categories() {
                            return CiteUnseen.getSettingCategories();
                        },
                        categoriesForDomains() {
                            return CiteUnseen.getSettingCategories().filter(category => category !== 'unknown');
                        },
                        dialogTitle() {
                            return CiteUnseen.convByVar(CiteUnseenI18n.settingsDialogTitle);
                        },
                        primaryAction() {
                            return {
                                label: this.isSaving ? CiteUnseen.convByVar(CiteUnseenI18n.saving) : CiteUnseen.convByVar(CiteUnseenI18n.save),
                                actionType: 'progressive',
                                disabled: this.isSaving
                            };
                        },
                        defaultAction() {
                            return {
                                label: CiteUnseen.convByVar(CiteUnseenI18n.cancel)
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
                            return CiteUnseen.getCategoryDisplayName(categoryId);
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
                            this.settings = {
                                categories: {},
                                domainIgnore: {},
                                additionalDomains: {},
                                additionalStrings: {},
                                dashboard: true,
                                showSuggestions: true
                            };

                            // Determine which wiki to load from
                            const wikiHost = this.target === 'meta' ?
                                'meta.wikimedia.org' :
                                mw.config.get('wgServer').replace('//', '');

                            // Clear global variables
                            const globalVars = ['cite_unseen_categories', 'cite_unseen_domain_ignore', 'cite_unseen_additional_domains', 'cite_unseen_additional_strings', 'cite_unseen_dashboard', 'cite_unseen_show_suggestions'];
                            globalVars.forEach(varName => {
                                delete window[varName];
                            });

                            // Load fresh settings from the selected wiki
                            CiteUnseen.loadCustomRulesFromWiki(wikiHost, {})
                                .then(rules => {
                                    if (this.target === 'meta') {
                                        // For meta rules, use defaults for any undefined values
                                        const defaultRules = {
                                            categories: {},
                                            domainIgnore: {},
                                            additionalDomains: {},
                                            additionalStrings: {},
                                            dashboard: true,
                                            showSuggestions: true
                                        };
                                        CiteUnseen._metaRules = rules ? { ...defaultRules, ...rules } : defaultRules;
                                    } else {
                                        // For local rules, preserve undefined values to inherit defaults from Meta
                                        const emptyRules = {
                                            categories: {},
                                            domainIgnore: {},
                                            additionalDomains: {},
                                            additionalStrings: {}
                                        };
                                        CiteUnseen._localRules = rules ? { ...emptyRules, ...rules } : emptyRules;
                                    }

                                    this.loadCurrentSettings();
                                })
                                .catch(error => {
                                    console.warn(`[Cite Unseen] Failed to load settings from ${wikiHost}:`, error);
                                    if (this.target === 'meta') {
                                        // Set default rules for meta if loading fails
                                        CiteUnseen._metaRules = {
                                            categories: {},
                                            domainIgnore: {},
                                            additionalDomains: {},
                                            additionalStrings: {},
                                            dashboard: true,
                                            showSuggestions: true
                                        };
                                    } else {
                                        CiteUnseen._localRules = {
                                            categories: {},
                                            domainIgnore: {},
                                            additionalDomains: {},
                                            additionalStrings: {}
                                        };
                                    }

                                    this.loadCurrentSettings();
                                })
                                .finally(() => {
                                    this.isSaving = false;
                                });
                        },
                        closeDialog() {
                            this.open = false;
                            setTimeout(() => {
                                const mountPoint = document.getElementById('cite-unseen-dialog-mount');
                                if (mountPoint) {
                                    mountPoint.remove();
                                }

                                CiteUnseen.vueApp = null;
                            }, 300);
                        },
                        loadCurrentSettings() {
                            // Load settings based on current target
                            const targetRules = this.target === 'meta' ?
                                CiteUnseen.getMetaRulesFromGlobals() :
                                CiteUnseen.getLocalRulesFromGlobals();

                            if (this.target === 'meta') {
                                // Load category settings
                                this.categories.forEach(category => {
                                    this.settings.categories[category] = targetRules.categories?.[category] !== false;
                                });

                                // Load boolean settings
                                this.settings.dashboard = targetRules.dashboard !== false;
                                this.settings.showSuggestions = targetRules.showSuggestions !== false;
                            } else {
                                // For local rules, inherit from Meta if undefined, otherwise use local value
                                const metaRules = CiteUnseen.getMetaRulesFromGlobals();

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
                                showSuggestions: this.settings.showSuggestions
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
                                        correctionMessages.push(`${correction.category} (${correction.type}): "${c.original}" → "${c.corrected}"`);
                                    });
                                });

                                const correctionMessage = CiteUnseen.convByVar(CiteUnseenI18n.domainsCorrectedMessage) + correctionMessages.join('\n');

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
                                const errorMessage = CiteUnseen.convByVar(CiteUnseenI18n.invalidDomainFormatMessage) + validationErrors.join('\n');

                                mw.notify(errorMessage, {
                                    type: 'error',
                                    title: '[Cite Unseen]',
                                    autoHide: false
                                });
                                return;
                            }

                            CiteUnseen.saveSettingsToWiki(
                                processedSettings,
                                this.target,
                                (result) => {
                                    this.closeDialog();
                                    if (confirm(CiteUnseen.convByVar(CiteUnseenI18n.settingsSavedSuccess))) {
                                        location.reload();
                                    }
                                },
                                (error) => {
                                    mw.notify(CiteUnseen.convByVar(CiteUnseenI18n.settingsSaveError) + (error.message || error), {
                                        type: 'error',
                                        title: '[Cite Unseen]'
                                    });
                                }
                            );

                            this.isSaving = false;
                        }
                    },
                    mounted() {
                        this.loadCurrentSettings();
                    },
                    template: `
                        <cdx-dialog
                            v-model:open="open"
                            :title="dialogTitle"
                            :use-close-button="true"
                            :primary-action="primaryAction"
                            :default-action="defaultAction"
                            @primary="onPrimaryAction"
                            @default="onDefaultAction"
                            @update:open="onUpdateOpen"
                            class="cite-unseen-dialog"
                        >
                            <template #header>
                                <div class="cite-unseen-dialog-header">
                                    <span>{{ dialogTitle }}</span>
                                    <a href="https://meta.wikimedia.org/wiki/Meta:Cite_Unseen" target="_blank" class="cite-unseen-dialog-docs-link">
                                        {{ $options.i18n.documentationLink }}
                                    </a>
                                </div>
                            </template>
                            <div class="cite-unseen-target-section">
                                <span class="cite-unseen-target-label">
                                    {{ $options.i18n.viewSettingsFrom }}
                                    <span v-if="isSaving" class="cite-unseen-loading-text">({{ $options.i18n.loading }})</span>
                                </span>
                                <div class="cite-unseen-target-controls">
                                    <label class="cite-unseen-radio-option">
                                        <input type="radio" v-model="target" value="meta" @change="onTargetChange" :disabled="isSaving">
                                        <span>{{ $options.i18n.metaWikiGlobal }}</span>
                                    </label>
                                    <label class="cite-unseen-radio-option">
                                        <input type="radio" v-model="target" value="local" @change="onTargetChange" :disabled="isSaving">
                                        <span>{{ targetWikiDisplayName }} ({{ $options.i18n.local }})</span>
                                    </label>
                                </div>
                                <span>
                                    ({{ $options.i18n.localSettingGuidance }})
                                </span>
                            </div>
                            <hr />
                            <cdx-tabs v-if="!isSaving" v-model:active="activeTab">
                                <cdx-tab name="general" :label="$options.i18n.tabGeneral">
                                    <cdx-checkbox v-model="settings.dashboard">
                                        {{ $options.i18n.showDashboard }}
                                    </cdx-checkbox>
                                    <cdx-checkbox v-model="settings.showSuggestions">
                                        {{ $options.i18n.showSuggestionsButton }}
                                    </cdx-checkbox>
                                </cdx-tab>

                                <cdx-tab name="categories" :label="$options.i18n.tabCategories">
                                    <div class="cite-unseen-tab-guidance">
                                        {{ $options.i18n.categoriesTabGuidance }}
                                    </div>
                                    <h3>{{ $options.i18n.enableDisableCategories }}</h3>
                                    <div v-for="category in categories" :key="category" class="cite-unseen-category-container">
                                        <cdx-checkbox
                                            v-model="settings.categories[category]"
                                            :input-value="category"
                                        >
                                            {{ getCategoryDisplayName(category) }}
                                        </cdx-checkbox>
                                    </div>
                                </cdx-tab>

                                <cdx-tab name="ignore" :label="$options.i18n.tabIgnoreDomains">
                                    <div class="cite-unseen-tab-guidance">
                                        {{ $options.i18n.ignoreDomainsTabGuidance }}
                                    </div>
                                    <h3>{{ $options.i18n.domainsToIgnore }}</h3>
                                    <div v-for="category in categoriesForDomains" :key="category" class="cite-unseen-domain-category-container">
                                        <label class="cite-unseen-category-label">{{ getCategoryDisplayName(category) }}</label>
                                        <cdx-text-area
                                            v-model="settings.domainIgnore[category]"
                                            :rows="3"
                                            @input="onDomainInputChange(category, 'ignore')"
                                        />
                                    </div>
                                </cdx-tab>

                                <cdx-tab name="additionalDomains" :label="$options.i18n.tabAdditionalDomains">
                                    <div class="cite-unseen-tab-guidance">
                                        {{ $options.i18n.additionalDomainsTabGuidance }}
                                    </div>
                                    <h3>{{ $options.i18n.additionalDomains }}</h3>
                                    <div v-for="category in categoriesForDomains" :key="category" class="cite-unseen-domain-category-container">
                                        <label class="cite-unseen-category-label">{{ getCategoryDisplayName(category) }}</label>
                                        <cdx-text-area
                                            v-model="settings.additionalDomains[category]"
                                            :rows="2"
                                            @input="onDomainInputChange(category, 'additional')"
                                        />
                                    </div>
                                </cdx-tab>

                                <cdx-tab name="additionalStrings" :label="$options.i18n.tabAdditionalStrings">
                                    <div class="cite-unseen-tab-guidance">
                                        {{ $options.i18n.additionalStringsTabGuidance }}
                                    </div>
                                    <h3>{{ $options.i18n.additionalUrlStrings }}</h3>
                                    <div v-for="category in categoriesForDomains" :key="category" class="cite-unseen-domain-category-container">
                                        <label class="cite-unseen-category-label">{{ getCategoryDisplayName(category) }}</label>
                                        <cdx-text-area
                                            v-model="settings.additionalStrings[category]"
                                            :rows="2"
                                        />
                                    </div>
                                </cdx-tab>
                            </cdx-tabs>
                        </cdx-dialog>
                    `
                });

                app.component('cdx-dialog', Codex.CdxDialog)
                    .component('cdx-tabs', Codex.CdxTabs)
                    .component('cdx-tab', Codex.CdxTab)
                    .component('cdx-checkbox', Codex.CdxCheckbox)
                    .component('cdx-text-area', Codex.CdxTextArea)
                    .component('cdx-radio', Codex.CdxRadio);

                CiteUnseen.vueApp = app.mount('#cite-unseen-dialog-mount');
            }).catch(function (error) {
                console.error('[Cite Unseen] Failed to load Codex dependencies:', error);
                mw.notify(CiteUnseen.convByVar(CiteUnseenI18n.dialogLoadError), { type: 'error', title: '[Cite Unseen]' });
            });
        },

        /**
         * Returns an array of all setting categories.
         * @returns {string[]}
         */
        getSettingCategories: function (includeReliability = true) {
            // Get all type categories from citeUnseenCategoryTypes
            const typeCategories = CiteUnseen.citeUnseenCategoryTypes ?
                CiteUnseen.citeUnseenCategoryTypes.flatMap(x => x[1]) :
                ['advocacy', 'blogs', 'books', 'community', 'editable', 'government', 'news', 'opinions', 'predatory', 'press', 'satire', 'social', 'sponsored', 'tabloids', 'tvPrograms'];

            if (!includeReliability) {
                return [...typeCategories, 'unknown'];
            }

            // Get all reliability categories from citeUnseenChecklists
            const reliabilityCategories = CiteUnseen.citeUnseenChecklists ?
                CiteUnseen.citeUnseenChecklists.map(x => x[0]) :
                ['generallyReliable', 'marginallyReliable', 'generallyUnreliable', 'deprecated', 'blacklisted', 'multi'];

            // Combine all categories + unknown
            return [...typeCategories, ...reliabilityCategories, 'unknown'];
        },

        /**
         * Returns the localized display name for a category.
         * @param {string} categoryId - The category identifier
         * @returns {string} The localized display name
         */
        getCategoryDisplayName: function (categoryId) {
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
                return CiteUnseen.convByVar(CiteUnseenI18n.categoryLabels[displayKey]);
            }

            // Fallback to the category ID with proper capitalization
            return categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
        },

        /**
         * Generate JavaScript content for the settings file
         * @param {Object} settings - Settings object to save
         * @param {String} target - Target wiki ('meta' or 'local')
         */
        generateSettingsContent: function (settings, target = 'meta') {
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
            } else {
                // For local wiki, include boolean settings if they differ from Meta settings
                const metaRules = CiteUnseen.getMetaRulesFromGlobals();

                const metaDashboard = metaRules.dashboard !== false; // Meta default logic
                const metaShowSuggestions = metaRules.showSuggestions !== false; // Meta default logic

                if (settings.dashboard !== metaDashboard) {
                    content += `\n\n// Dashboard visibility setting
cite_unseen_dashboard = ${settings.dashboard};`;
                }

                if (settings.showSuggestions !== metaShowSuggestions) {
                    content += `\n\n// Suggestions button visibility setting
cite_unseen_show_suggestions = ${settings.showSuggestions};`;
                }
            }

            return content + '\n';
        },

        /**
         * Open the settings dialog
         */
        openSettingsDialog: function () {
            // Close existing dialog if open
            if (CiteUnseen.vueApp) {
                const mountPoint = document.getElementById('cite-unseen-dialog-mount');
                if (mountPoint) {
                    mountPoint.remove();
                }
                CiteUnseen.vueApp = null;
            }

            // Create and show new Codex dialog
            CiteUnseen.createSettingsDialog();
        },

        // ===============================
        // SUGGESTIONS
        // ===============================

        /**
         * Add suggestions toggle button.
         */
        showSuggestionsToggleButton: function () {
            if (CiteUnseen.refs.length === 0 || window.cite_unseen_show_suggestions === false) {
                return;
            }

            if (CiteUnseen.suggestionsToggleButton === null) {
                CiteUnseen.suggestionsToggleButton = document.createElement('div');
                CiteUnseen.suggestionsToggleButton.className = 'cite-unseen-button';

                // Inset plus icon
                const icon = document.createElement('span');
                icon.innerHTML = '💡';
                CiteUnseen.suggestionsToggleButton.appendChild(icon);

                // Button label
                const label = document.createElement('span');
                label.textContent = CiteUnseen.convByVar(CiteUnseenI18n.suggestionsToggleButton);
                CiteUnseen.suggestionsToggleButton.appendChild(label);
                CiteUnseen.suggestionsToggleButton.onclick = function () {
                    CiteUnseen.toggleSuggestionsMode();
                };

                CiteUnseen.suggestionsToggleButton.setAttribute('title', CiteUnseen.convByVar(CiteUnseenI18n.suggestionsToggleTooltip));
            }
        },

        /**
         * Toggle suggestions mode on/off
         */
        toggleSuggestionsMode: function () {
            CiteUnseen.suggestionsMode = !CiteUnseen.suggestionsMode;

            if (CiteUnseen.suggestionsToggleButton.updateEditStyleLink) {
                CiteUnseen.suggestionsToggleButton.updateEditStyleLink(CiteUnseen.suggestionsMode);
            } else {
                CiteUnseen.suggestionsToggleButton.classList.toggle('suggestions-active', CiteUnseen.suggestionsMode);
            }

            CiteUnseen.toggleSuggestionPlusSigns();
        },

        /**
         * Group the buttons together in the References headers for all reflists
         */
        groupButtons: function () {
            if (CiteUnseen.settingsButton || CiteUnseen.suggestionsToggleButton) {
                // Position buttons for each reflist that has a dashboard
                for (const reflistData of CiteUnseen.reflists) {
                    CiteUnseen.positionButtonsInHeaderForReflist(reflistData);
                }
            }
        },

        /**
         * Show or hide plus signs next to citations for suggestions
         */
        toggleSuggestionPlusSigns: function () {
            CiteUnseen.refs.forEach(ref => {
                // Get the citation container (usually the <li> element)
                const citationContainer = CiteUnseen.getCitationContainer(ref.cite);
                if (!citationContainer) return;

                let plusSign = citationContainer.querySelector('.cite-unseen-suggestion-plus');

                if (CiteUnseen.suggestionsMode) {
                    if (!plusSign) {
                        plusSign = document.createElement('img');
                        plusSign.className = 'cite-unseen-suggestion-plus';
                        plusSign.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMyOGE3NDUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICAgIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+CiAgICA8bGluZSB4MT0iMTIiIHkxPSI4IiB4Mj0iMTIiIHkyPSIxNiIvPgogICAgPGxpbmUgeDE9IjgiIHkxPSIxMiIgeDI9IjE2IiB5Mj0iMTIiLz4KPC9zdmc+Cg==';
                        plusSign.setAttribute('title', CiteUnseen.convByVar(CiteUnseenI18n.suggestCategorization));

                        plusSign.onclick = function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            CiteUnseen.openSuggestionDialog(ref);
                        };

                        citationContainer.prepend(plusSign);
                    }
                } else {
                    if (plusSign) {
                        plusSign.remove();
                    }
                }
            });
        },

        /**
         * Open suggestion dialog for a specific citation
         */
        openSuggestionDialog: function (citationRef) {
            // Store the citation reference for use in the dialog
            CiteUnseen.currentSuggestionCitation = citationRef;

            if (CiteUnseen.vueApp) {
                const mountPoint = document.getElementById('cite-unseen-dialog-mount');
                if (mountPoint) {
                    mountPoint.remove();
                }
                CiteUnseen.vueApp = null;
            }

            CiteUnseen.createSuggestionDialog(citationRef);
        },

        /**
         * Create and show the Codex suggestion dialog
         */
        createSuggestionDialog: function (citationRef) {
            // Load Codex and Vue dependencies
            mw.loader.using('@wikimedia/codex').then(function (require) {
                const Vue = require('vue');
                const Codex = require('@wikimedia/codex');

                if (!document.getElementById('cite-unseen-dialog-mount')) {
                    const mountPoint = document.createElement('div');
                    mountPoint.id = 'cite-unseen-dialog-mount';
                    document.body.appendChild(mountPoint);
                }

                const app = Vue.createMwApp({
                    i18n: {
                        dialogTitle: CiteUnseen.convByVar(CiteUnseenI18n.suggestionDialogTitle),
                        guidance: CiteUnseen.convByVar(CiteUnseenI18n.suggestionsDialogGuidance),
                        sourceUrl: CiteUnseen.convByVar(CiteUnseenI18n.sourceUrl),
                        suggestedCategories: CiteUnseen.convByVar(CiteUnseenI18n.suggestedCategories),
                        selectAtLeastOne: CiteUnseen.convByVar(CiteUnseenI18n.selectAtLeastOneCategory),
                        optionalComment: CiteUnseen.convByVar(CiteUnseenI18n.optionalComment),
                        commentPlaceholder: CiteUnseen.convByVar(CiteUnseenI18n.commentPlaceholder),
                        reliabilityGuidance: CiteUnseen.convByVar(CiteUnseenI18n.suggestionsDialogReliabilityGuidance),
                        reliabilityProjects: CiteUnseen.convByVar(CiteUnseenI18n.reliabilityProjects),
                        submit: CiteUnseen.convByVar(CiteUnseenI18n.submit),
                        submitting: CiteUnseen.convByVar(CiteUnseenI18n.submitting),
                        cancel: CiteUnseen.convByVar(CiteUnseenI18n.cancel)
                    },
                    data() {
                        return {
                            open: true,
                            sourceUrl: citationRef.coins['rft_id'] || '',
                            selectedCategories: [],
                            comment: '',
                            isSubmitting: false
                        };
                    },
                    computed: {
                        availableCategories() {
                            return CiteUnseen.getAvailableCategories();
                        },
                        reliabilityProjects() {
                            const pageLinks = Object.values(CiteUnseen.citeUnseenData.citeUnseenSourceToPageMapping);
                            const projects = [];
                            for (const pageLink of pageLinks) {
                                const [lang, ...pageParts] = pageLink.split(':');
                                const fullPagePath = pageParts.join(':');
                                projects.push({ page: pageLink, url: `//${lang}.wikipedia.org/wiki/${fullPagePath}` });
                            }
                            return projects;
                        },
                        primaryAction() {
                            return {
                                label: this.isSubmitting ? this.$options.i18n.submitting : this.$options.i18n.submit,
                                actionType: 'progressive',
                                disabled: this.isSubmitting || this.selectedCategories.length === 0
                            };
                        },
                        defaultAction() {
                            return {
                                label: this.$options.i18n.cancel
                            };
                        }
                    },
                    methods: {
                        onPrimaryAction() {
                            this.submitSuggestion();
                        },
                        onDefaultAction() {
                            this.closeDialog();
                        },
                        onUpdateOpen(newValue) {
                            if (!newValue) {
                                this.closeDialog();
                            }
                        },
                        closeDialog() {
                            this.open = false;
                            setTimeout(() => {
                                const mountPoint = document.getElementById('cite-unseen-dialog-mount');
                                if (mountPoint) {
                                    mountPoint.remove();
                                }
                                CiteUnseen.vueApp = null;
                                CiteUnseen.currentSuggestionCitation = null;
                            }, 300);
                        },
                        submitSuggestion() {
                            if (this.selectedCategories.length === 0) {
                                mw.notify(this.$options.i18n.selectAtLeastOne, {
                                    type: 'error',
                                    title: '[Cite Unseen]'
                                });
                                return;
                            }

                            this.isSubmitting = true;
                            CiteUnseen.submitSuggestionToMeta(this.sourceUrl, this.selectedCategories, this.comment)
                                .then(() => {
                                    this.closeDialog();
                                    mw.notify(CiteUnseen.convByVar(CiteUnseenI18n.suggestionSubmitted), {
                                        type: 'success',
                                        title: '[Cite Unseen]'
                                    });
                                })
                                .catch((error) => {
                                    console.error('[Cite Unseen] Failed to submit suggestion:', error);
                                    mw.notify(CiteUnseen.convByVar(CiteUnseenI18n.suggestionSubmitError) + (error.message || error), {
                                        type: 'error',
                                        title: '[Cite Unseen]'
                                    });
                                })
                                .finally(() => {
                                    this.isSubmitting = false;
                                });
                        }
                    },
                    template: `
                        <cdx-dialog
                            v-model:open="open"
                            :title="$options.i18n.dialogTitle"
                            :use-close-button="true"
                            :primary-action="primaryAction"
                            :default-action="defaultAction"
                            @primary="onPrimaryAction"
                            @default="onDefaultAction"
                            @update:open="onUpdateOpen"
                            class="cite-unseen-dialog"
                        >
                            <div class="cite-unseen-tab-guidance">
                                {{ $options.i18n.guidance }}
                            </div>

                            <div class="cite-unseen-form-section">
                                <label class="cite-unseen-input-label">{{ $options.i18n.sourceUrl }}</label>
                                <cdx-text-input
                                    v-model="sourceUrl"
                                    :disabled="true"
                                    class="cite-unseen-full-width-input"
                                />
                            </div>

                            <div class="cite-unseen-form-section">
                                <label class="cite-unseen-checkbox-label">{{ $options.i18n.suggestedCategories }}</label>
                                <div class="cite-unseen-category-grid">
                                    <cdx-checkbox
                                        v-for="category in availableCategories"
                                        :key="category.id"
                                        v-model="selectedCategories"
                                        :input-value="category.id"
                                    >
                                        {{ category.label }}
                                    </cdx-checkbox>
                                </div>
                            </div>

                            <div class="cite-unseen-form-section">
                                <label class="cite-unseen-input-label">{{ $options.i18n.optionalComment }}</label>
                                <cdx-text-area
                                    v-model="comment"
                                    :rows="4"
                                    :placeholder="$options.i18n.commentPlaceholder"
                                />
                            </div>
                            
                            <div class="cite-unseen-tab-guidance">
                                {{ $options.i18n.reliabilityGuidance }}
                            </div>
                            
                            <div class="cite-unseen-form-section">
                                <label class="cite-unseen-checkbox-label">{{ $options.i18n.reliabilityProjects }}</label>
                                <ul>
                                    <li v-for="project in reliabilityProjects" :key="project.page">
                                        <a :href="project.url" target="_blank">{{ project.page }}</a>
                                    </li>
                                </ul>
                            </div>
                        </cdx-dialog>
                    `
                });

                app.component('cdx-dialog', Codex.CdxDialog)
                    .component('cdx-text-input', Codex.CdxTextInput)
                    .component('cdx-text-area', Codex.CdxTextArea)
                    .component('cdx-checkbox', Codex.CdxCheckbox);

                CiteUnseen.vueApp = app.mount('#cite-unseen-dialog-mount');
            }).catch(function (error) {
                console.error('[Cite Unseen] Failed to load Codex dependencies:', error);
                mw.notify(CiteUnseen.convByVar(CiteUnseenI18n.dialogLoadError), { type: 'error', title: '[Cite Unseen]' });
            });
        },

        /**
         * Get available categories for suggestions
         */
        getAvailableCategories: function () {
            const categories = CiteUnseen.getSettingCategories(false);
            return categories.map(categoryId => ({
                id: categoryId,
                label: CiteUnseen.getCategoryDisplayName(categoryId)
            }));
        },

        /**
         * Extract domain from URL
         */
        extractDomain: function (url) {
            if (!url) return 'unknown-domain';
            try {
                const urlObj = new URL(url);
                let domain = urlObj.hostname;
                // Remove www. prefix if present
                if (domain.startsWith('www.')) {
                    domain = domain.substring(4);
                }
                return domain;
            } catch (e) {
                // If URL parsing fails, try to extract domain manually
                const match = url.match(/^https?:\/\/(?:www\.)?([^\/\?#]+)/i);
                return match ? match[1] : 'unknown-domain';
            }
        },

        /**
         * Submit suggestion to Meta Wiki by opening pre-populated edit form
         */
        submitSuggestionToMeta: function (sourceUrl, selectedCategories, comment) {
            return new Promise((resolve, reject) => {
                try {
                    const domain = CiteUnseen.extractDomain(sourceUrl);

                    const categoryLabels = selectedCategories.map(catId =>
                        CiteUnseen.getCategoryDisplayName(catId)
                    ).join(', ');

                    const username = mw.config.get('wgUserName');
                    const currentPage = mw.config.get('wgPageName');
                    const currentWiki = mw.config.get('wgServerName');

                    const citationRef = CiteUnseen.currentSuggestionCitation;
                    let referenceInfo = `* '''URL:''' ${sourceUrl}`;
                    if (citationRef && citationRef.coins) {
                        const coins = citationRef.coins;
                        if (coins['rft.title']) {
                            referenceInfo += `\n* '''Title:''' ${[].concat(coins['rft.title']).join(', ')}`;
                        }
                        if (coins['rft.au']) {
                            referenceInfo += `\n* '''Author(s):''' ${[].concat(coins['rft.au']).join(', ')}`;
                        }
                        if (coins['rft.aulast']) {
                            const lastNames = [].concat(coins['rft.aulast']);
                            const firstNames = coins['rft.aufirst'] ? [].concat(coins['rft.aufirst']) : [];
                            const authors = lastNames.map((lastName, i) => {
                                const firstName = firstNames[i] || '';
                                return firstName ? `${firstName} ${lastName}` : lastName;
                            });
                            referenceInfo += `\n* '''Author(s):''' ${authors.join(', ')}`;
                        }
                        if (coins['rft.date']) {
                            referenceInfo += `\n* '''Date:''' ${coins['rft.date']}`;
                        }
                        if (coins['rft.pub'] || coins['rft.jtitle']) {
                            const publisher = coins['rft.pub'] || coins['rft.jtitle'];
                            referenceInfo += `\n* '''Publisher/Journal:''' ${[].concat(publisher).join(', ')}`;
                        }
                    }
                    referenceInfo += `\n* '''Found on:''' [[${currentWiki.replace('.wikipedia.org', '')}:${currentPage.replace(/_/g, ' ')}]]`;
                    referenceInfo += `\n* '''Suggested categories:''' ${categoryLabels}`;

                    const editSummary = `Categorization suggestion for ${domain}`;
                    const baseUrl = 'https://meta.wikimedia.org/w/index.php';

                    let editUrl = baseUrl + '?title=' + encodeURIComponent('Meta_talk:Cite_Unseen/Suggestions');
                    editUrl += '&action=edit';
                    editUrl += '&section=new';
                    editUrl += '&preload=' + encodeURIComponent('Meta:Cite_Unseen/Suggestions/Template');
                    editUrl += '&preloadtitle=' + encodeURIComponent(domain);
                    editUrl += '&summary=' + encodeURIComponent(editSummary);

                    // Add preload parameters for the template
                    // $1 = reference info, $2 = optional comment
                    editUrl += '&preloadparams[]=' + encodeURIComponent(referenceInfo);
                    if (comment && comment.trim()) {
                        editUrl += '&preloadparams[]=' + encodeURIComponent(comment.trim());
                    } else {
                        editUrl += '&preloadparams[]=';
                    }

                    let sectionContent = `${referenceInfo}`;
                    if (comment && comment.trim()) {
                        sectionContent += `\n${comment.trim()}`;
                    }
                    sectionContent += `~~~~`;

                    // Open the edit form in a new tab/window
                    const newWindow = window.open(editUrl, '_blank');

                    if (newWindow) {
                        // Copy content to clipboard as a fallback
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            navigator.clipboard.writeText(sectionContent).catch(err => {
                                console.warn('[Cite Unseen] Failed to copy to clipboard:', err);
                            });
                        }

                        resolve();
                    } else {
                        reject(new Error('Failed to open edit window. Please check popup blocker settings.'));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        },

        // ===============================
        // DOM HELPERS
        // ===============================

        /**
         * Find the header that comes before the reflist
         * @param {Element} reflistElement - Optional specific reflist element
         * @returns {Element|null} The header element before reflist, or null if not found
         */
        findHeaderBeforeReflist: function (reflistElement = null) {
            let targetReflist = reflistElement;

            // If no specific reflist provided, try to find any reflist on the page
            if (!targetReflist) {
                const reflists = document.querySelectorAll('#mw-content-text .mw-parser-output div.reflist, .references');
                if (reflists.length > 0) {
                    targetReflist = reflists[0]; // Use the first reflist found
                } else {
                    return null; // No reflist found
                }
            }

            // Start from the reflist and walk backwards to find the closest heading
            let currentElement = targetReflist.previousElementSibling;

            while (currentElement) {
                if (currentElement.matches('h2, h3') ||
                    currentElement.classList.contains('mw-heading') ||
                    currentElement.classList.contains('mw-heading2')) {
                    return currentElement;
                }

                const heading = currentElement.querySelector('h2, h3, .mw-heading, .mw-heading2');
                if (heading) {
                    return heading.closest('.mw-heading, .mw-heading2') || heading.parentElement || heading;
                }

                currentElement = currentElement.previousElementSibling;
            }

            return null;
        },

        /**
         * Position buttons in the header before a specific reflist
         * @param {Object} reflistData - The reflist data object
         */
        positionButtonsInHeaderForReflist: function (reflistData) {
            const header = CiteUnseen.findHeaderBeforeReflist(reflistData.element);
            if (!header) {
                return false;
            }

            // Find the mw-editsection span within the header
            const editSection = header.querySelector('.mw-editsection');

            if (editSection) {
                // Use existing [edit] button section
                return CiteUnseen.injectButtonsInEditSection(header, editSection, reflistData);
            } else {
                // Fallback: create standalone buttons
                return CiteUnseen.injectStandaloneButtons(header, reflistData);
            }
        },

        /**
         * Inject buttons within the existing [edit] section
         * @param {Element} header - The header element
         * @param {Element} editSection - The edit section element
         * @param {Object} reflistData - Optional reflist data for tracking
         */
        injectButtonsInEditSection: function (header, editSection, reflistData = null) {
            // Check if buttons are already injected in this header
            if (header.querySelector('.cite-unseen-section')) {
                return true;
            }

            const citeUnseenSection = document.createElement('span');
            citeUnseenSection.className = 'mw-editsection cite-unseen-section cite-unseen-edit-section';

            const openingBracket = document.createElement('span');
            openingBracket.className = 'mw-editsection-bracket';
            openingBracket.textContent = '[';
            citeUnseenSection.appendChild(openingBracket);

            const convertToEditSectionStyle = (button, linkText) => {
                if (!button) return null;

                const link = document.createElement('a');
                link.href = '#';
                link.className = 'cite-unseen-edit-style';
                link.setAttribute('title', button.getAttribute('title') || '');

                const span = document.createElement('span');
                span.textContent = linkText;
                link.appendChild(span);

                link.onclick = function (e) {
                    e.preventDefault();
                    if (button.onclick) {
                        button.onclick(e);
                    }
                };

                return link;
            };

            let hasButtons = false;

            if (CiteUnseen.settingsButton) {
                const settingsLink = convertToEditSectionStyle(
                    CiteUnseen.settingsButton,
                    CiteUnseen.convByVar(CiteUnseenI18n.settingsButton)
                );
                if (settingsLink) {
                    citeUnseenSection.appendChild(settingsLink);
                    hasButtons = true;
                }
            }

            if (CiteUnseen.settingsButton && CiteUnseen.suggestionsToggleButton) {
                const divider = document.createElement('span');
                divider.className = 'cite-unseen-editsection-divider';
                divider.textContent = ' | ';
                citeUnseenSection.appendChild(divider);
            }

            if (CiteUnseen.suggestionsToggleButton) {
                const suggestionsLink = convertToEditSectionStyle(
                    CiteUnseen.suggestionsToggleButton,
                    CiteUnseen.convByVar(CiteUnseenI18n.suggestionsToggleButton)
                );
                if (suggestionsLink) {
                    citeUnseenSection.appendChild(suggestionsLink);
                    hasButtons = true;

                    CiteUnseen.suggestionsToggleButton.updateEditStyleLink = function (isActive) {
                        if (isActive) {
                            suggestionsLink.classList.add('cite-unseen-suggestions-active');
                            suggestionsLink.classList.remove('cite-unseen-suggestions-default');
                        } else {
                            suggestionsLink.classList.add('cite-unseen-suggestions-default');
                            suggestionsLink.classList.remove('cite-unseen-suggestions-active');
                        }
                    };
                }
            }

            const closingBracket = document.createElement('span');
            closingBracket.className = 'mw-editsection-bracket';
            closingBracket.textContent = ']';
            citeUnseenSection.appendChild(closingBracket);

            if (hasButtons) {
                editSection.parentNode.insertBefore(citeUnseenSection, editSection.nextSibling);
                return true;
            }

            return false;
        },

        /**
         * Inject standalone buttons when edit section doesn't exist
         * @param {Element} header - The header element
         * @param {Object} reflistData - Optional reflist data for tracking
         */
        injectStandaloneButtons: function (header, reflistData = null) {
            // Check if we already have buttons injected to avoid duplicates
            if (header.querySelector('.cite-unseen-fallback-section')) {
                return true;
            }

            const fallbackSection = document.createElement('span');
            fallbackSection.className = 'mw-editsection cite-unseen-fallback-section';

            const openingBracket = document.createElement('span');
            openingBracket.className = 'mw-editsection-bracket';
            openingBracket.textContent = '[';
            fallbackSection.appendChild(openingBracket);

            const convertToFallbackStyle = (button, linkText) => {
                if (!button) return null;

                const link = document.createElement('a');
                link.href = '#';
                link.className = 'cite-unseen-edit-style';
                link.setAttribute('title', button.getAttribute('title') || '');

                const span = document.createElement('span');
                span.textContent = linkText;
                link.appendChild(span);

                link.onclick = function (e) {
                    e.preventDefault();
                    if (button.onclick) {
                        button.onclick(e);
                    }
                };

                return link;
            };

            let hasButtons = false;

            if (CiteUnseen.settingsButton) {
                const settingsLink = convertToFallbackStyle(
                    CiteUnseen.settingsButton,
                    CiteUnseen.convByVar(CiteUnseenI18n.settingsButton)
                );
                if (settingsLink) {
                    fallbackSection.appendChild(settingsLink);
                    hasButtons = true;
                }
            }

            if (CiteUnseen.settingsButton && CiteUnseen.suggestionsToggleButton) {
                const divider = document.createElement('span');
                divider.className = 'cite-unseen-editsection-divider';
                divider.textContent = ' | ';
                fallbackSection.appendChild(divider);
            }

            if (CiteUnseen.suggestionsToggleButton) {
                const suggestionsLink = convertToFallbackStyle(
                    CiteUnseen.suggestionsToggleButton,
                    CiteUnseen.convByVar(CiteUnseenI18n.suggestionsToggleButton)
                );
                if (suggestionsLink) {
                    fallbackSection.appendChild(suggestionsLink);
                    hasButtons = true;

                    CiteUnseen.suggestionsToggleButton.updateEditStyleLink = function (isActive) {
                        if (isActive) {
                            suggestionsLink.classList.add('cite-unseen-suggestions-active');
                            suggestionsLink.classList.remove('cite-unseen-suggestions-default');
                        } else {
                            suggestionsLink.classList.add('cite-unseen-suggestions-default');
                            suggestionsLink.classList.remove('cite-unseen-suggestions-active');
                        }
                    };
                }
            }

            const closingBracket = document.createElement('span');
            closingBracket.className = 'mw-editsection-bracket';
            closingBracket.textContent = ']';
            fallbackSection.appendChild(closingBracket);

            if (hasButtons) {
                header.appendChild(fallbackSection);
                return true;
            }

            return false;
        },

        /**
         * Create an icons div for a citation
         * @returns {Element} The created icons div
         */
        createIconsDiv: function () {
            const iconsDiv = document.createElement('div');
            iconsDiv.classList.add('cite-unseen-icons');
            return iconsDiv;
        },

        /**
         * Ensure a value is an array
         * @param {*} value - Value to ensure is an array
         * @returns {Array} Array version of the value
         */
        ensureArray: function (value) {
            if (Array.isArray(value)) return value;
            if (value == null) return [];
            return [value];
        },

        // ===============================
        // INITIALIZATION
        // ===============================

        init: function () {
            console.time('[Cite Unseen] Runtime');

            // Import source categorization data
            CiteUnseen.importDependencies().then(function (categorizedRules) {
                CiteUnseen.categorizedRules = categorizedRules;
                CiteUnseen.citeUnseenData = CiteUnseenData;
                CiteUnseen.citeUnseenCategories = CiteUnseenData.citeUnseenCategories;
                CiteUnseen.citeUnseenCategoryTypes = CiteUnseenData.citeUnseenCategoryTypes;
                CiteUnseen.citeUnseenChecklists = CiteUnseenData.citeUnseenChecklists;
                CiteUnseen.citeUnseenCategoryData = CiteUnseenData.citeUnseenCategoryData;

                // Fill in missing parameters
                for (const key of Object.keys(CiteUnseen.categorizedRules)) {
                    if (CiteUnseen.citeUnseenCategories[key] === undefined) {
                        CiteUnseen.citeUnseenCategories[key] = true;
                    }
                }

                // Import user custom rules
                CiteUnseen.importCustomRules().then(function () {
                    // Run on every wikipage.content hook. This is to support gadgets like QuickEdit.
                    mw.hook('wikipage.content').add(function () {
                        if (document.querySelector('#cite-unseen-finished-loading')) {
                            return;
                        }

                        CiteUnseen.findCitations();
                        CiteUnseen.addIcons();
                        let finishedLoading = document.createElement('div');
                        finishedLoading.id = 'cite-unseen-finished-loading';
                        finishedLoading.classList.add('cite-unseen-finished-loading');
                        document.querySelector('#mw-content-text .mw-parser-output').appendChild(finishedLoading);
                    });
                });
            });
        }

    };

    CiteUnseen.init();

})();

// </nowiki>