(function () {

    const CiteUnseen = {
        /**
         * Parse a COinS string and convert it to an object.
         * @param query {String} - COinS string
         * @returns {Object} - Parsed object
         */
        parseCoinsString: function (query) {
            const result = {};
            // Split the string by '&'
            const pairs = query.split('&');
            pairs.forEach(pair => {
                if (!pair) return;
                // Split at the first '='
                const index = pair.indexOf('=');
                let key, value;
                if (index === -1) {
                    key = pair;
                    value = "";
                } else {
                    key = pair.substring(0, index);
                    value = pair.substring(index + 1);
                }
                // Replace '+' with space and decode both key and value
                key = key.replace(/\+/g, ' ');
                value = value.replace(/\+/g, ' ');
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
         * Parses a date rule string containing comma-separated conditions,
         * where each condition includes an operator and a date.
         * Returns a predicate function that accepts a date (or date string)
         * and returns true if the date matches all conditions.
         * @param ruleString {String} - Date rule string, e.g. "<2022-01-01,>2020-01-01"
         * @returns {Function|null} - Predicate function, or null if any condition is invalid.
         */
        parseDateRule: function (ruleString) {
            ruleString = ruleString.trim();
            if (ruleString.length === 0) {
                return null;
            }

            // Split the rule string by comma into individual conditions.
            let conditionStrings = ruleString.split(',').map(s => s.trim());

            // Array to hold predicate functions for each condition.
            let predicates = [];

            for (let cond of conditionStrings) {
                if (cond.length === 0) continue; // Skip empty conditions

                // Check if the condition starts with an operator (<, >, or =). Default to "=".
                let operator = '=';
                if (cond[0] === '<' || cond[0] === '>' || cond[0] === '=') {
                    operator = cond[0];
                    cond = cond.substring(1).trim();
                }

                // Parse the date portion.
                let targetDate = new Date(cond);
                if (isNaN(targetDate.getTime())) {
                    // If any condition has an invalid date, return null.
                    return null;
                }

                // Create and store a predicate function for this condition.
                let predicate;
                switch (operator) {
                    case '<':
                        predicate = function (date) {
                            return date < targetDate;
                        };
                        break;
                    case '>':
                        predicate = function (date) {
                            return date > targetDate;
                        };
                        break;
                    default: // '='
                        predicate = function (date) {
                            return date.getTime() === targetDate.getTime();
                        };
                }
                predicates.push(predicate);
            }

            // Return a predicate function that applies all conditions.
            return function (inputDate) {
                let date = (inputDate instanceof Date) ? inputDate : new Date(inputDate);
                if (isNaN(date.getTime())) {
                    return false;
                }
                return predicates.every(fn => fn(date));
            };
        },

        /**
         * Escapes special characters in a string.
         * @param string {String} - The string to escape
         * @returns {String} - The escaped string
         */
        escapeRegex: function (string) {
            return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
        },

        /**
         * Build a regular expression.
         * @param string {String} - The string
         * @returns {RegExp} - The regular expression
         */
        urlRegex: function (string) {
            // Given a domain and path, the regex looks for a substring that matches the following rules:
            //  starts with http:// or https://
            //  does not have any additional / before domain
            //  domain immediately follows :// or is preceded with a . (to account for subdomains)
            //  after the domain and path, look for one of the following:
            //	 string ends
            //	 next character is a /
            //	 domain had a period at the end (this allows gov. to match TLDs like gov.uk)
            return new RegExp('https?:\\/\\/([^\\/]*\\.)?' + CiteUnseen.escapeRegex(string) + '($|((?<=\\.)|\\/))');
        },

        /**
         * Check if the source's author matches the rule.
         * @param coins {Object} - COinS object
         * @param rule {Object} - Rule
         * @returns {boolean} - Whether it matches the rule
         */
        matchAuthor: function (coins, rule) {
            let author = coins['rft.au'];  // can be a string or an array
            if (coins['rft.aulast']) {
                let appendedAuthors = coins['rft.aulast'];
                if (typeof appendedAuthors === 'string' && coins['rft.aufirst']) {
                    appendedAuthors = [coins['rft.aufirst'] + ' ' + appendedAuthors];
                } else if (coins['rft.aufirst']) {
                    for (let i = 0; i < coins['rft.aufirst'].length; i++) {
                        appendedAuthors[i] = coins['rft.aufirst'][i] + ' ' + appendedAuthors[i];
                    }
                }
                if (typeof author === 'string') {
                    author = [author];
                }
                author.concat(appendedAuthors);
            }
            if (!author || !rule['author']) {
                return false;
            }
            let authorRegex = new RegExp(rule['author'], 'i');
            if (typeof author === 'string') {
                return authorRegex.test(author);
            } else {
                for (let au of author) {
                    if (authorRegex.test(au)) {
                        return true;
                    }
                }
                return false;
            }
        },

        /**
         * Checks if the source's publisher matches the rule.
         * @param coins {Object} - COinS object
         * @param rule {Object} - Rule
         * @returns {boolean} - Whether it matches the rule
         */
        matchPublisher: function (coins, rule) {
            const coinsPub = coins['rft.pub'] || coins['rft.jtitle'] || null;
            if (!coinsPub || !rule['pub']) {
                return false;
            }
            let publisherRegex = new RegExp(rule['pub'], 'i');
            if (typeof coinsPub === 'string') {
                return publisherRegex.test(coinsPub);
            } else {
                for (let publisher of coinsPub) {
                    if (publisherRegex.test(publisher)) {
                        return true;
                    }
                }
                return false;
            }
        },

        /**
         * Check if the date in the COinS object matches the date rule.
         * @param coins {Object} - COinS object.
         * @param rule {Object} - Rule object containing the date rule string.
         * @returns {boolean} - Returns true if the date matches the rule, otherwise false.
         */
        matchDate: function (coins, rule) {
            let predicate = CiteUnseen.parseDateRule(rule['date']);
            if (!predicate) {
                console.log("[Cite Unseen] Invalid date rule: " + rule['date']);
                return false;
            }

            return predicate(coins['rft.date']);
        },

        /**
         * Check if the source's URL matches the rule.
         * @param coins {Object} - COinS object
         * @param rule {Object} - Rule
         * @returns {boolean} - Whether it matches the rule
         */
        matchUrl: function (coins, rule) {
            if (!rule['url'] || !coins['rft_id']) {
                return false;
            }
            let urlRegex = CiteUnseen.urlRegex(rule['url']);
            return urlRegex.test(coins['rft_id']);
        },

        /**
         * Check if the source's URL string matches the rule.
         * @param coins {Object} - COinS object
         * @param rule {Object} - Rule
         * @returns {boolean} - Whether it matches the rule
         */
        matchUrlString: function (coins, rule) {
            if (!rule['url_str'] || !coins['rft_id']) {
                return false;
            }
            let urlString = rule['url_str'];
            if (typeof urlString === 'string') {
                return coins['rft_id'].includes(urlString);
            } else {
                for (let str of urlString) {
                    if (coins['rft_id'].includes(str)) {
                        return true;
                    }
                }
                return false;
            }
        },

        /**
         * Check if the source matches the rule.
         * @param coins {Object} - COinS object
         * @param rule {Object} - Rule
         * @returns {boolean} - Whether it matches the rule
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
            for (let key of Object.keys(rule)) {
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

        /**
         * Add icons to citation sources. Only executed once on page load.
         */
        addIcons: function () {
            // Filter categorizedDomains down to just the links that appear in the page's citations
            // Given how many domains we track and our RegExp usage later, this has significant time savings
            // Quick test on an article with ~500 citations went ~5x faster
            let filteredCategorizedRules = {};
            for (let key of Object.keys(CiteUnseen.categorizedRules)) {
                filteredCategorizedRules[key] = [];
                for (let link of CiteUnseen.refLinks) {
                    for (let rule of CiteUnseen.categorizedRules[key]) {
                        let domain = rule['url'];
                        if (!(CiteUnseen.citeUnseenDomainIgnore[key] && CiteUnseen.citeUnseenDomainIgnore[key].includes(domain)) && link.includes(domain)) {
                            if (!filteredCategorizedRules[key].includes(rule)) {
                                filteredCategorizedRules[key].push(rule);
                            }
                        }
                    }
                }
            }
            let typeCategories = CiteUnseen.citeUnseenCategoryTypes.flatMap(x => x[1]);

            // Whether the source is not identified by any of the rules.
            let unknownSet;

            CiteUnseen.refs.forEach(function (ref) {
                // Insert the icon area before the <cite> tag
                let iconsDiv = document.createElement("div");
                iconsDiv.classList.add("cite-unseen-icons");
                iconsDiv.style.display = 'inline-flex';
                iconsDiv.style.gap = '0 5px';
                iconsDiv.style.paddingRight = '5px';
                iconsDiv.style.verticalAlign = 'middle';
                ref.cite.prepend(iconsDiv);

                if (window.cite_unseen_dashboard) {
                    // Pre-insert the custom citation category icon
                    let iconNode = CiteUnseen.processIcon(iconsDiv, "flag");
                    iconNode.style.display = 'none';  // Initially hide the custom category icon
                    CiteUnseen.customCategoryIcons.push(iconNode);
                }

                // Determine the source type based on the class name.
                const classList = ref.cite.classList;
                if (classList.contains("book") || classList.contains("journal") || classList.contains("encyclopaedia") || classList.contains("conference") || classList.contains("thesis") || classList.contains("magazine")) {
                    if (CiteUnseen.citeUnseenCategories.books) {
                        CiteUnseen.processIcon(iconsDiv, "books");
                    }
                } else if (classList.contains("pressrelease")) {
                    if (CiteUnseen.citeUnseenCategories.press) {
                        CiteUnseen.processIcon(iconsDiv, "press");
                    }
                } else if (classList.contains("episode") || classList.contains("podcast") || classList.contains("media")) {
                    if (CiteUnseen.citeUnseenCategories.tvPrograms) {
                        CiteUnseen.processIcon(iconsDiv, "tvPrograms");
                    }
                } else if (ref.coins['rft_id']) {
                    unknownSet = true;

                    // Reliability categories
                    let checked = false;
                    for (let checklistTypeData of CiteUnseen.citeUnseenChecklists) {
                        if (checked) {
                            break;
                        }
                        let checklistType = checklistTypeData[0];
                        for (let checklist of checklistTypeData[1]) {
                            if (checked) {
                                break;
                            }
                            let checklistName = checklist[0], checklistID = checklist[1];
                            for (let rule of filteredCategorizedRules[checklistID]) {
                                if (CiteUnseen.match(ref.coins, rule)) {
                                    if (CiteUnseen.citeUnseenCategories[checklistID]) {
                                        CiteUnseen.processIcon(iconsDiv, checklistType, checklistName);
                                        checked = true;
                                        unknownSet = false;
                                        break;
                                    }
                                    unknownSet = false;
                                }
                            }
                        }
                    }

                    // Type categories
                    for (let category of typeCategories) {
                        for (let rule of filteredCategorizedRules[category]) {
                            if (CiteUnseen.match(ref.coins, rule)) {
                                if (CiteUnseen.citeUnseenCategories[category]) {
                                    CiteUnseen.processIcon(iconsDiv, category);
                                    unknownSet = false;
                                    break;
                                }
                                unknownSet = false;
                            }
                        }
                    }

                    if (CiteUnseen.citeUnseenCategories.unknown && unknownSet) {
                        // Source not identified by any rule, mark as unknown.
                        CiteUnseen.processIcon(iconsDiv, "unknown");
                    }
                }
            });

            if (window.cite_unseen_dashboard) {
                CiteUnseen.showDashboard();
            }

            // End timing
            console.timeEnd('CiteUnseen runtime');
        },

        /**
         * Add to count. Currently, it records regardless of whether it is in the reflist.
         * @param node {Element} - The node
         * @param type {String} - The type
         */
        addToCount: function (node, type) {
            CiteUnseen.citeUnseenCategoryData[type].count = CiteUnseen.citeUnseenCategoryData[type].count + 1;
        },

        /**
         * Add an icon and tooltip to a node.
         * @param node {Element} - The iconsDiv node
         * @param type {String} - The type
         * @param checklist {String|null} - The checklist
         * @returns {Element} - The iconNode element
         */
        processIcon: function (node, type, checklist = null) {
            let iconNode = document.createElement("img");
            iconNode.classList.add("skin-invert");
            iconNode.classList.add("cite-unseen-icon-" + type);
            iconNode.setAttribute("src", CiteUnseen.citeUnseenCategoryData[type].icon);
            let message = CiteUnseen.convByVar({
                hant: CiteUnseen.citeUnseenCategoryData[type].hint_hant,
                hans: CiteUnseen.citeUnseenCategoryData[type].hint_hans,
                en: CiteUnseen.citeUnseenCategoryData[type].hint_en,
                ja: CiteUnseen.citeUnseenCategoryData[type].hint_ja,
            });
            if (checklist) {
                message = CiteUnseen.convByVar({
                    en: 'From ',
                    hant: '來自 ',
                    hans: '来自 ',
                    ja: '出典 ',
                }) + checklist + CiteUnseen.convByVar({
                    en: ': ',
                    hant: '：',
                    hans: '：',
                    ja: '：',
                }) + message + CiteUnseen.convByVar({
                    en: ' Click the icon to open the checklist page to view details.',
                    hant: '點擊圖示可打開檢查表頁面以查看詳情。',
                    hans: '点击图标可打开检查表页面以查看详情。',
                    ja: 'アイコンをクリックすると、チェックリストページを開いて詳細を確認できます。',
                });
            }
            iconNode.setAttribute("alt", message);
            iconNode.setAttribute("title", "[Cite Unseen] " + message);
            CiteUnseen.addToCount(node, type);
            iconNode.style.width = "17px";
            iconNode.style.height = "17px";
            iconNode.style.objectFit = 'contain';
            iconNode.style.cssText += 'max-width: 17px !important;';
            if (checklist) {
                // If there is a checklist, wrap the icon in a link.
                const iconNodeLink = document.createElement("a");
                iconNodeLink.setAttribute("href", "//zh.wikipedia.org/wiki/" + checklist);
                iconNodeLink.setAttribute("target", "_blank");
                iconNodeLink.style.display = "contents";
                iconNodeLink.appendChild(iconNode);
                node.appendChild(iconNodeLink);
            } else {
                node.appendChild(iconNode);
            }
            if (!CiteUnseen.refCategories[type]) {
                CiteUnseen.refCategories[type] = [];
            }
            CiteUnseen.refCategories[type].push(node.parentNode);
            return iconNode;
        },

        CustomCategoryDialog: function (config) {
            CiteUnseen.CustomCategoryDialog.super.call(this, config);
        },

        /**
         * Create a row for selecting "URL" or "URL String".
         * This function generates a dropdown menu that allows the user to switch between "URL" and "URL String",
         * and updates the rule object based on the selection.
         * @param {Object} rule - The rule object to update based on the selection.
         */
        createUrlRow: function (rule) {
            const chineseUrl = CiteUnseen.convByVar({
                en: 'URL',
                hant: '網址',
                hans: '网址',
                ja: 'URL',
            });
            const chineseUrlString = CiteUnseen.convByVar({
                en: 'URL String',
                hant: '網址字串',
                hans: '网址字符串',
                ja: 'URL 文字列',
            });
            // Create menu options for URL and URL String using convByVar.
            var optionURL = new OO.ui.MenuOptionWidget({
                data: 'url', label: chineseUrl,
            });
            var optionURLString = new OO.ui.MenuOptionWidget({
                data: 'url_str', label: chineseUrlString,
            });
            // Initialize the dropdown label based on the current rule.
            var initialLabel = rule.hasOwnProperty('url_str') ? chineseUrlString : chineseUrl;
            var dropdown = new OO.ui.DropdownWidget({
                label: initialLabel, menu: {
                    items: [optionURL, optionURLString],
                },
            });
            // Update the rule when an option is chosen.
            dropdown.getMenu().on('choose', function (item) {
                var data = item.getData();
                if (data === 'url') {
                    if (rule.url_str !== undefined) {
                        rule.url = rule.url_str;
                        delete rule.url_str;
                    }
                    dropdown.setLabel(chineseUrl);
                } else if (data === 'url_str') {
                    if (rule.url !== undefined) {
                        rule.url_str = rule.url;
                        delete rule.url;
                    }
                    dropdown.setLabel(chineseUrlString);
                }
            });
            // Create the URL text input widget.
            var urlValue = rule.url || rule.url_str || '';
            var urlInput = new OO.ui.TextInputWidget({
                value: urlValue, title: CiteUnseen.convByVar({
                    en: 'The URL should include the domain name, without http(s); the URL String can contain any characters.',
                    hant: '網址應包含網域名，不需要包含 http(s)；網址字串則可以包含任何字元。',
                    hans: '网址应包含网域名，不需要包含 http(s)；网址字符串则可以包含任何字符。',
                    ja: 'URL にはドメイン名を含め、http(s) は不要です。URL 文字列は任意の文字を含むことができます。',
                }),
            });
            // Update rule when the text input value changes.
            urlInput.on('change', function (value) {
                if (rule.hasOwnProperty('url')) {
                    rule.url = value;
                } else {
                    rule.url_str = value;
                }
            });
            var $row = $('<div>').addClass('cite-unseen-dialog-url-row');
            $row.append(dropdown.$element, urlInput.$element);
            return $row;
        },

        /**
         * Create a row for optional parameters (such as author, publisher, date).
         * This function generates a container with multiple optional parameters, each containing a checkbox and a text input.
         * When the checkbox is selected, the corresponding text input is enabled; otherwise, it is disabled.
         * @param rule {Object} - The rule object containing parameter values.
         */
        createOptionalParamsRow: function (rule) {
            var $paramsContainer = $('<div>').addClass('cite-unseen-dialog-optional-params');
            const params = ['author', 'pub', 'date'];
            const chineseParams = {
                'author': CiteUnseen.convByVar({
                    en: 'Author',
                    hant: '作者',
                    hans: '作者',
                    ja: '著者'
                }),
                'pub': CiteUnseen.convByVar({
                    en: 'Publisher',
                    hant: '出版',
                    hans: '出版',
                    ja: '出版社'
                }),
                'date': CiteUnseen.convByVar({
                    en: 'Date',
                    hant: '日期',
                    hans: '日期',
                    ja: '日付'
                }),
            };
            params.forEach(function (param) {
                var paramValue = rule[param] || '';
                var checkbox = new OO.ui.CheckboxInputWidget({
                    selected: !!paramValue,
                });
                var textInput = new OO.ui.TextInputWidget({
                    value: paramValue,
                });
                textInput.$element.css('display', !!paramValue ? 'inline-block' : 'none');
                textInput.setDisabled(!checkbox.isSelected());
                checkbox.on('change', function (isSelected) {
                    textInput.setDisabled(!isSelected);
                    textInput.$element.css('display', isSelected ? 'inline-block' : 'none');
                    if (!isSelected) {
                        textInput.setValue('');
                        delete rule[param];
                    }
                });
                textInput.on('change', function (value) {
                    rule[param] = value;
                });
                var $paramRow = $('<div>')
                    .addClass('cite-unseen-dialog-param-container')
                    .css({ 'margin-top': '5px' });
                $paramRow.append(checkbox.$element, $('<span>').text(chineseParams[param]), textInput.$element);
                $paramsContainer.append($paramRow);
            });
            return $paramsContainer;
        },

        /**
         * Create a complete widget for a rule.
         * This function generates a container for the rule and attaches related UI components.
         * @param {Object} rule - The rule data object.
         * @param {OO.ui.FieldsetLayout} parentFieldset - The parent Fieldset, used to update the UI when removing a rule.
         */
        createRuleWidget: function (rule, parentFieldset) {
            var $container = $('<div>').addClass('cite-unseen-dialog-rule-container');
            var $urlRow = CiteUnseen.createUrlRow(rule);
            var $optionalParams = CiteUnseen.createOptionalParamsRow(rule);
            var ruleWidget = new OO.ui.Widget({ $element: $container });
            // Attach rule data directly to the widget.
            ruleWidget.ruleData = rule;
            var removeButton = new OO.ui.ButtonWidget({
                icon: 'trash', flags: ['destructive'],
            });
            removeButton.$element.addClass('cite-unseen-dialog-remove-button');
            removeButton.on('click', function () {
                if (parentFieldset) {
                    parentFieldset.removeItems([ruleWidget]); // Properly remove from the fieldset.
                } else {
                    ruleWidget.$element.remove();
                }
                CiteUnseen.updateCustomCategoryDialogHeight();
            });
            $container.append($urlRow, $optionalParams, removeButton.$element);
            return ruleWidget;
        },

        /**
         * Generate the content for the custom citation category dialog.
         * @returns {OO.ui.FieldsetLayout} - The content of the custom citation category dialog
         */
        generateCustomCategoryDialogRules: function (initialRules) {
            var fieldset = new OO.ui.FieldsetLayout({
                classes: ['cite-unseen-dialog-rules'],
            });
            if (initialRules) {
                // Create a widget for each rule without updating any global array.
                initialRules.forEach(function (rule) {
                    fieldset.addItems([CiteUnseen.createRuleWidget(rule, fieldset)]);
                });
            }
            var addButton = new OO.ui.ButtonWidget({
                label: CiteUnseen.convByVar({
                    en: 'Add Rule',
                    hant: '新增規則',
                    hans: '新增规则',
                    ja: 'ルールを追加',
                }), icon: 'add',
            });
            var addButtonField = new OO.ui.FieldLayout(addButton, { align: 'center' });
            addButtonField.$element.addClass('cite-unseen-dialog-add-button');
            fieldset.addButtonField = addButtonField;
            addButton.on('click', function () {
                var newRule = { url: '' };
                var newWidget = CiteUnseen.createRuleWidget(newRule, fieldset);
                // Insert new rule widget just before the add button.
                fieldset.removeItems([fieldset.addButtonField]);
                fieldset.addItems([newWidget]);
                fieldset.addItems([fieldset.addButtonField]);
                CiteUnseen.updateCustomCategoryDialogHeight();
            });
            fieldset.addItems([addButtonField]);
            return fieldset;
        },

        /**
         * Update the height of the custom citation category dialog.
         */
        updateCustomCategoryDialogHeight: function () {
            if (CiteUnseen.customCategoryDialog) {
                var maxHeight = $(window).height() * 0.5;
                CiteUnseen.customCategoryDialog.panel.$element.css('max-height', maxHeight + 'px');
                CiteUnseen.customCategoryDialog.updateSize();
            }
        },

        /**
         * Initialize the custom citation category dialog.
         */
        initCustomCategoryDialog: function () {
            if (CiteUnseen.customCategoryDialogRules === null) {
                CiteUnseen.customCategoryDialogRules = new OO.ui.FieldsetLayout();
            }
            OO.inheritClass(CiteUnseen.CustomCategoryDialog, OO.ui.Dialog);
            CiteUnseen.CustomCategoryDialog.static.name = 'CustomCategoryDialog';

            CiteUnseen.CustomCategoryDialog.prototype.initialize = function () {
                CiteUnseen.CustomCategoryDialog.super.prototype.initialize.apply(this, arguments);

                this.panel = new OO.ui.PanelLayout({
                    padded: true, expanded: false,
                });
                this.panel.$element.addClass('cite-unseen-dialog-panel');
                this.content = new OO.ui.FieldsetLayout();
                this.content.$element.addClass('cite-unseen-dialog-content');

                // Dialog title
                this.titleLabelWidget = new OO.ui.LabelWidget({
                    label: CiteUnseen.convByVar({
                        en: '[Cite Unseen] Add Custom Citation Category Rules',
                        hant: '[Cite Unseen] 添加自訂來源分類規則',
                        hans: '[Cite Unseen] 添加自定义来源分类规则',
                        ja: '[Cite Unseen] カスタム引用カテゴリルールを追加',
                    }), classes: ['cite-unseen-dialog-title'],
                });
                this.titleLabelWidget.$element.append($('<span>')
                    .text(CiteUnseen.convByVar({
                        en: ' (This is temporary; for customizing existing citation categories, see "',
                        hant: '（此為臨時生效；若需自訂已有的來源分類，請參見「',
                        hans: '（此为临时生效；若需自定义已有的来源分类，请参见「',
                        ja: '（これは一時的なものであり、既存の引用カテゴリをカスタマイズするには「',
                    }))
                    .css({ 'font-size': '0.75em', 'font-weight': 'normal' })
                    .append($('<a>')
                        .text(CiteUnseen.convByVar({
                            en: 'Customization Guide',
                            hant: '進階自訂教程',
                            hans: '进阶自定义教程',
                            ja: 'カスタマイズガイド',
                        }))
                        .attr('href', '//meta.wikimedia.org/wiki/Meta:Cite_Unseen'))
                    .append(CiteUnseen.convByVar({
                        en: '.")',
                        hant: '」。）',
                        hans: '」。）',
                        ja: '」。）',
                    }))
                );

                // Action buttons
                this.cancelButton = new OO.ui.ButtonWidget({
                    label: CiteUnseen.convByVar({
                        en: 'Cancel',
                        hant: '取消',
                        hans: '取消',
                        ja: 'キャンセル',
                    }), flags: ['safe', 'close'], action: 'cancel',
                });
                this.saveButton = new OO.ui.ButtonWidget({
                    label: CiteUnseen.convByVar({
                        en: 'Save',
                        hant: '儲存',
                        hans: '保存',
                        ja: '保存',
                    }),
                    flags: ['primary', 'progressive'],
                    action: 'save',
                });
                this.actionButtons = new OO.ui.ButtonGroupWidget({
                    items: [
                        this.cancelButton, this.saveButton,
                    ],
                });
                this.actionButtons.$element.addClass('cite-unseen-dialog-action-buttons');

                // Add click event handlers for the buttons
                this.cancelButton.$element.on('click', function (e) {
                    this.close();
                }.bind(this));
                this.saveButton.$element.on('click', async function (e) {
                    let response = await CiteUnseen.addCustomCategory();
                    if (response) {
                        this.close();
                    }
                }.bind(this));

                // Dialog content
                this.ruleContent = CiteUnseen.generateCustomCategoryDialogRules(CiteUnseen.customCategoryRules);
                this.content.addItems([
                    this.titleLabelWidget, this.actionButtons, this.ruleContent,
                ]);

                this.panel.$element.append(this.content.$element);
                this.$body.append(this.panel.$element);

                // Automatically update height on window resize.
                $(window).on('resize.customCategoryDialog', function () {
                    CiteUnseen.updateCustomCategoryDialogHeight();
                });
                CiteUnseen.updateCustomCategoryDialogHeight();
            };
            CiteUnseen.CustomCategoryDialog.prototype.getBodyHeight = function () {
                return this.panel.$element.outerHeight(true);
            };
            CiteUnseen.CustomCategoryDialog.prototype.getTearDownProcess = function (data) {
                return CiteUnseen.CustomCategoryDialog.super.prototype.getTearDownProcess.call(this, data);
            };
        },

        /**
         * Add a custom citation category rule.
         * @returns {Promise<boolean>} - Returns a Promise indicating whether the operation was successful.
         */
        addCustomCategory: async function () {
            if (!CiteUnseen.customCategoryDialog) {
                console.error("[Cite Unseen] customCategoryDialog is not initialized when addCustomCategory is called.");
                return false;
            }
            var dialog = CiteUnseen.customCategoryDialog;
            var newRules = [];
            dialog.ruleContent.getItems().forEach(function (item) {
                // Exclude the add button field and only collect widgets with ruleData.
                if (item !== dialog.ruleContent.addButtonField && item.ruleData) {
                    newRules.push(item.ruleData);
                }
            });
            console.log(newRules);

            for (let i = 0; i < newRules.length; i++) {
                // Ensure the rule has a non-empty URL value.
                var rule = newRules[i];
                var url = rule.url || rule.url_str;
                if (!url || url.trim() === '') {
                    mw.notify(CiteUnseen.convByVar({
                        en: 'Invalid source URL, please check and re-enter.',
                        hant: '來源網址無效，請檢查並重新輸入。',
                        hans: '来源网址无效，请检查并重新输入。',
                        ja: '無効なソースURLです。確認して再入力してください。',
                    }), { type: 'error', autoHide: true, title: '[Cite Unseen]' });
                    return false;
                }
            }

            CiteUnseen.customCategoryRules = newRules;

            // Update the display status of citation icons according to custom rules.
            let customCategoryCitations = [];
            for (let i = 0; i < CiteUnseen.refs.length; i++) {
                let ref = CiteUnseen.refs[i];
                let coins = ref.coins;
                let iconNode = CiteUnseen.customCategoryIcons[i];
                let matched = false;
                for (let rule of CiteUnseen.customCategoryRules) {
                    if (CiteUnseen.match(coins, rule)) {
                        iconNode.style.display = 'inline-block';
                        matched = true;
                        customCategoryCitations.push(ref.cite);
                        break;
                    }
                }
                if (!matched) {
                    iconNode.style.display = 'none';
                }
            }

            // Highlight citations
            CiteUnseen.highlightCitation('flag', customCategoryCitations);
            CiteUnseen.refCategories['flag'] = customCategoryCitations;

            return true;
        },

        /**
         * Show the custom citation category dialog.
         */
        showCustomCategoryDialog: function () {
            if (CiteUnseen.customCategoryDialogRules === null) {
                CiteUnseen.initCustomCategoryDialog();
            }
            CiteUnseen.customCategoryDialogRules.clearItems();
            CiteUnseen.customCategoryDialog = new CiteUnseen.CustomCategoryDialog({ padded: true, scrollable: true });
            CiteUnseen.customCategoryDialogRules.addItems(CiteUnseen.generateCustomCategoryDialogRules());

            if (CiteUnseen.windowManager === null) {
                CiteUnseen.windowManager = new OO.ui.WindowManager({ modal: false, classes: ['cite-unseen-non-modal'] });
                mw.util.addCSS(`
            .cite-unseen-non-modal {
                position: -webkit-sticky;
                position: sticky;
                bottom: 1em;
                max-width: 960px;
                margin-left: auto;
                margin-right: auto;
                background-color: white;
            }
            .cite-unseen-non-modal.oo-ui-windowManager-size-full {
                width: 100%;
                height: 100%;
                bottom: 0;
            }
            .cite-unseen-non-modal .oo-ui-window {
                border: 1px solid #a2a9b1;
                box-shadow: 0 0 4px 0 rgba( 0, 0, 0, 0.25 );
            }
            .cite-unseen-non-modal.oo-ui-windowManager-size-full .oo-ui-window {
                border: 0;
                box-shadow: unset;
            }
            .cite-unseen-dialog-panel {
                padding-bottom: 0;
            }
            .cite-unseen-dialog-action-buttons {
                position: absolute;
                top: 0;
                right: -5px;
                display: flex;
                gap: 0 10px;
                flex-wrap: wrap;
            } 
            .cite-unseen-dialog-title {
                font-size: 1.12em;
                font-weight: bold;
                margin-bottom: 10px;
                margin-right: 127px;
            }
            .cite-unseen-dialog-content {
                padding-bottom: 16px;
            }
            .cite-unseen-dialog-rule-container {
                position: relative;
                width: 20em;
                padding: 10px;
                background-color: rgb(249, 249, 249);
                border: 1px solid rgb(204, 204, 204);
                flex-grow: 1;
            }
            .cite-unseen-dialog-rules .oo-ui-fieldsetLayout-group {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                gap: 10px;
            }
            .cite-unseen-dialog-url-row {
                display: flex;
                align-items: center;
                margin-right: 55px;
            }
            .cite-unseen-dialog-url-row .oo-ui-dropdownWidget {
                width: auto !important;
                display: inline-block;
                vertical-align: middle;
                margin-right: 0;
            }
            .cite-unseen-dialog-url-row .oo-ui-textInputWidget {
                max-width: 100%;
                display: inline-block;
                vertical-align: middle;
                margin-left: 8px;
            }
            .cite-unseen-dialog-optional-params {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                flex-direction: row;
                gap: 0 10px;
            }
            .cite-unseen-dialog-param-container {
                display: flex;
                align-items: center;
                flex-grow: 1;
            }
            .cite-unseen-dialog-param-container .oo-ui-textInputWidget {
                width: 10em;
                vertical-align: middle;
                margin-left: 8px;
                flex-grow: 1;
            }
            .cite-unseen-dialog-remove-button {
                display: block;
                position: absolute;
                top: 11px;
                right: 11px;
            }
            .cite-unseen-dialog-add-button {
                margin-top: 0;
            }
            `);
                $('body').append(CiteUnseen.windowManager.$element);
            }
            CiteUnseen.windowManager.addWindows({ 'customCategoryDialog': CiteUnseen.customCategoryDialog });
            CiteUnseen.windowManager.openWindow('customCategoryDialog');
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

        /**
         * Add citation statistics dashboard.
         */
        showDashboard: function () {
            if (CiteUnseen.refs.length === 0) {
                // No citations found, do not display the dashboard.
                return;
            }

            if (CiteUnseen.dashboard === null) {
                CiteUnseen.dashboard = {
                    div: document.createElement('div'),
                    total: document.createElement('div'),
                    cats: document.createElement('div'),
                    flag: document.createElement('a'),
                    custom: false,
                };

                CiteUnseen.dashboard.div.style.border = '1px solid #ccc';
                CiteUnseen.dashboard.div.style.marginBottom = '1em';
                CiteUnseen.dashboard.div.style.borderRadius = '5px';
                CiteUnseen.dashboard.div.style.fontSize = '.8em';
                CiteUnseen.dashboard.div.style.display = 'flex';
                CiteUnseen.dashboard.div.style.gap = '.5em 1em';
                CiteUnseen.dashboard.div.style.flexWrap = 'wrap';
                CiteUnseen.dashboard.div.style.padding = '5px';
                CiteUnseen.dashboard.div.style.justifyContent = 'center';
                CiteUnseen.dashboard.div.style.textAlign = 'center';

                // Total number of marked citations
                let refLength = CiteUnseen.refs.length;
                CiteUnseen.dashboard.total.innerText = "[Cite Unseen] " + CiteUnseen.convByVar({
                    en: "Total ",
                    hant: "共 ",
                    hans: "共 ",
                    ja: "合計 ",
                }) + refLength + CiteUnseen.convByVar({
                    en: ' citation' + (refLength > 1 ? 's' : ''),
                    hant: ' 個來源',
                    hans: ' 个来源',
                    ja: ' 件の引用',
                });
                CiteUnseen.dashboard.total.style.fontWeight = 'bold';
                CiteUnseen.dashboard.div.appendChild(CiteUnseen.dashboard.total);

                // Source types
                CiteUnseen.dashboard.cats.style.display = 'contents';
                CiteUnseen.dashboard.cats.style.textAlign = 'center';
                CiteUnseen.dashboard.div.appendChild(CiteUnseen.dashboard.cats);

                // Custom citation filter button
                CiteUnseen.dashboard.flag.innerText = CiteUnseen.convByVar({
                    en: 'Custom',
                    hant: '自訂',
                    hans: '自定义',
                    ja: 'カスタム',
                });
                CiteUnseen.dashboard.flag.style.cursor = 'pointer';
                const flagIcon = document.createElement('img');
                flagIcon.src = CiteUnseen.citeUnseenCategoryData['flag'].icon;
                flagIcon.style.width = '17px';
                flagIcon.style.height = '17px';
                flagIcon.style.objectFit = 'contain';
                flagIcon.style.cssText += 'max-width: 17px !important;';
                flagIcon.style.marginRight = '5px';
                flagIcon.style.verticalAlign = 'middle';
                flagIcon.style.display = 'inline-block';
                this.dashboard.flag.prepend(flagIcon);

                CiteUnseen.dashboard.flag.onclick = function () {
                    CiteUnseen.showCustomCategoryDialog();
                };
                CiteUnseen.dashboard.div.appendChild(CiteUnseen.dashboard.flag);

                mw.util.addCSS(`
                    .cite-unseen-highlight {
                        background-color: rgba(255, 246, 153, 0.5);
                        -webkit-box-decoration-break: clone;
                        box-decoration-break: clone;
                    }
                `);

                // Insert the dashboard before {{reflist}}. If there is no {{reflist}}, insert at the end.
                document.querySelector('#mw-content-text .mw-parser-output').insertBefore(CiteUnseen.dashboard.div, CiteUnseen.reflistNode);
            }

            // Clear counts for each citation type
            CiteUnseen.dashboard.cats.innerHTML = '';

            // List each type of source in order
            let categoryTypes = CiteUnseen.citeUnseenChecklists.flatMap(x => x[0]);
            categoryTypes = categoryTypes.concat(CiteUnseen.citeUnseenCategoryTypes.flatMap(x => x[1]));
            categoryTypes.push('unknown');
            for (let category of categoryTypes) {
                let categoryData = CiteUnseen.citeUnseenCategoryData[category];
                if (categoryData.count > 0) {
                    let countNode = document.createElement('div');
                    let countIcon = document.createElement('img');
                    countIcon.alt = CiteUnseen.convByVar({
                        hant: categoryData.hint_hant,
                        hans: categoryData.hint_hans,
                        en: categoryData.hint_en,
                        ja: categoryData.hint_ja,
                    });
                    countIcon.src = categoryData.icon;
                    countIcon.width = '17';
                    countIcon.style.maxHeight = '18px';
                    let countText = document.createElement('span');
                    countText.innerText = categoryData.count + ' ' + CiteUnseen.convByVar({
                        hant: categoryData.label_hant,
                        hans: categoryData.label_hans,
                        en: CiteUnseen.parseI18nPlural(categoryData.label_en, categoryData.count),
                        ja: categoryData.label_ja,
                    });
                    countText.style.paddingLeft = '5px';
                    countText.style.cursor = 'pointer';
                    countText.onmouseover = function () {
                        countText.style.textDecoration = 'underline';
                    };
                    countText.onmouseout = function () {
                        countText.style.textDecoration = 'none';
                    };
                    countText.onclick = function () {
                        if (CiteUnseen.dashboardHighlighted === category) {
                            CiteUnseen.highlightCitation(null);  // Unhighlight all citations
                        } else {
                            CiteUnseen.highlightCitation(category);
                        }
                    };
                    countNode.appendChild(countIcon);
                    countNode.appendChild(countText);
                    CiteUnseen.dashboard.cats.appendChild(countNode);
                }
            }
        },

        /**
         * Highlight citations.
         * @param category - Citation category
         * @param nodes - List of nodes. Defaults to null, in which case nodes from the citation category are used.
         */
        highlightCitation: function (category, nodes = null) {
            if (CiteUnseen.dashboardHighlighted) {
                // Unhighlight previously highlighted citations
                CiteUnseen.refCategories[CiteUnseen.dashboardHighlighted].forEach(function (node) {
                    node.classList.remove('cite-unseen-highlight');
                });
            }
            CiteUnseen.dashboardHighlighted = category;
            if (category) {
                nodes = nodes || CiteUnseen.refCategories[category];  // If nodes are not specified, use the nodes from the citation category
                nodes.forEach(function (node) {
                    node.classList.add('cite-unseen-highlight');
                });
            }
        },

        /**
         * (helper function) Filter obj[filter] === filterValue.
         * @param obj - The object to filter
         * @param filter - The key to filter by
         * @param filterValue - The value to filter by
         * @returns {Object} - The filtered object
         */
        filterObjectIncludes: function (obj, filter, filterValue) {
            return Object.keys(obj).reduce((acc, val) => (obj[val][filter] !== filterValue ? acc : {
                ...acc, [val]: obj[val],
            }), {});
        },

        /**
         * (helper function) Filter obj[filter] !== filterValue.
         * @param obj - The object to filter
         * @param filter - The key to filter by
         * @param filterValue - The value to filter by
         * @returns {Object} - The filtered object
         */
        filterObjectExcludes: function (obj, filter, filterValue) {
            return Object.keys(obj).reduce((acc, val) => (obj[val][filter] === filterValue ? acc : {
                ...acc, [val]: obj[val],
            }), {});
        },

        /**
         * Get the user's custom rules from local User:<username>/CiteUnseen-Rules.js.
         */
        importCustomRules: async function () {
            try {
                await mw.loader.getScript('/w/index.php?title=User:' + encodeURIComponent(mw.config.get('wgUserName')) + '/CiteUnseen-Rules.js&ctype=text/javascript&action=raw');
            } catch (err) {
                console.log("[Cite Unseen] Error getting Cite Unseen custom rules: " + err.message);
                return;
            }

            try {
                // Account for previous config names:
                if (!window.cite_unseen_categories && window.cite_unseen_rules) {
                    window.cite_unseen_categories = window.cite_unseen_rules;
                }
                if (!window.cite_unseen_categories && window.cite_unseen_ruleset) {
                    window.cite_unseen_categories = window.cite_unseen_ruleset;
                }

                // Get user's category configurations:
                if (window.cite_unseen_categories && typeof window.cite_unseen_categories === 'object') {
                    for (let key in window.cite_unseen_categories) {
                        if (key in CiteUnseen.citeUnseenCategories) {
                            CiteUnseen.citeUnseenCategories[key] = window.cite_unseen_categories[key];
                        } else if (key in [
                            "blacklisted",
                            "deprecated",
                            "generallyUnreliable",
                            "marginallyReliable",
                            "generallyReliable",
                            "multi",
                        ]) {
                            for (let checklistTypeData of CiteUnseen.citeUnseenChecklists) {
                                if (checklistTypeData[0] === key) {
                                    for (let checklist of checklistTypeData[1]) {
                                        CiteUnseen.citeUnseenCategories[checklist] = window.cite_unseen_categories[key];
                                    }
                                }
                            }
                        }
                    }
                }

                // Get user's domain ignore lists:
                if (window.cite_unseen_domain_ignore && typeof window.cite_unseen_domain_ignore === 'object') {
                    for (let key in window.cite_unseen_domain_ignore) {
                        if (window.cite_unseen_domain_ignore[key].length && key in CiteUnseen.citeUnseenDomainIgnore) {
                            CiteUnseen.citeUnseenDomainIgnore[key] = window.cite_unseen_domain_ignore[key];
                        }
                    }
                }

                // Get user's custom domains:
                if (window.cite_unseen_additional_domains && typeof window.cite_unseen_additional_domains === 'object') {
                    for (let key in window.cite_unseen_additional_domains) {
                        if (window.cite_unseen_additional_domains[key].length && key in CiteUnseen.categorizedRules) {
                            CiteUnseen.categorizedRules[key] = CiteUnseen.categorizedRules[key].concat({
                                'url': window.cite_unseen_additional_domains[key],
                            });
                        }
                    }
                }

                // Get user's custom strings:
                if (window.cite_unseen_additional_strings && typeof window.cite_unseen_additional_strings === 'object') {
                    for (let key in window.cite_unseen_additional_strings) {
                        if (window.cite_unseen_additional_strings[key].length && key in CiteUnseen.categorizedRules) {
                            CiteUnseen.categorizedRules[key] = CiteUnseen.categorizedRules[key].concat({
                                'url_str': window.cite_unseen_additional_strings[key],
                            });
                        }
                    }
                }

                // Whether to show the dashboard. Shown by default.
                if (window.cite_unseen_dashboard === undefined) {
                    window.cite_unseen_dashboard = true;
                }
            } catch (err) {
                console.log('[Cite Unseen] Could not read custom rules due to error: ', err);
            }
        },

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
                let lang = mw.config.get('wgContentLanguage');
                CiteUnseen.convByVar = function (i18nDict) {
                    const locale = new Intl.Locale(lang);
                    // If the language is Chinese.
                    if (locale.language === 'zh') {
                        if (locale.script === 'Hans') {
                            return i18nDict['hans'] || i18nDict['hant'] || i18nDict['en'] || 'Language undefined!';
                        } else {
                            return i18nDict['hant'] || i18nDict['hans'] || i18nDict['en'] || 'Language undefined!';
                        }
                    }
                    // Other languages.
                    return i18nDict[lang] || i18nDict['en'] || 'Language undefined!';
                };
            }

            await mw.loader.getScript('//meta.wikimedia.org/w/index.php?title=Meta:Cite_Unseen/sources.js&action=raw&ctype=text/javascript');
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
            for (let citeTag of document.querySelectorAll("cite")) {
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

            // Find the location of {{reflist}}. If there are multiple, use the last one. If none, insert at the end.
            let reflists = document.querySelectorAll('#mw-content-text .mw-parser-output div.reflist');
            if (reflists.length > 0) {
                CiteUnseen.reflistNode = reflists[reflists.length - 1];
            } else {
                CiteUnseen.reflistNode = null;  // Insert at the end
            }
        },

        /**
         * Main entry point for the CiteUnseen script.
         */
        init: function () {
            // Start timer that will be output to console at end of script. (Ends in addIcons().)
            console.time('CiteUnseen runtime');

            // Import source categorization data
            CiteUnseen.importDependencies().then(function (categorizedRules) {
                CiteUnseen.categorizedRules = categorizedRules;
                CiteUnseen.citeUnseenCategories = CiteUnseenData.citeUnseenCategories;
                CiteUnseen.citeUnseenCategoryTypes = CiteUnseenData.citeUnseenCategoryTypes;
                CiteUnseen.citeUnseenChecklists = CiteUnseenData.citeUnseenChecklists;
                CiteUnseen.citeUnseenCategoryData = CiteUnseenData.citeUnseenCategoryData;

                // Fill in missing parameters
                for (let key of Object.keys(CiteUnseen.categorizedRules)) {
                    if (CiteUnseen.citeUnseenCategories[key] === undefined) {
                        CiteUnseen.citeUnseenCategories[key] = true;
                    }
                }

                // Import user custom rules
                CiteUnseen.importCustomRules().then(function () {
                    // After import is complete, start processing source categorization.
                    CiteUnseen.findCitations();
                    CiteUnseen.addIcons();
                });
            });
        },

        categorizedRules: null,  // Source categorization rules
        citeUnseenCategories: null,  // Default toggle settings for categories
        citeUnseenCategoryTypes: null,  // Types of source categories
        citeUnseenChecklists: null,  // Source checklists by reliability
        citeUnseenCategoryData: null,  // Category data: labels, icons, hints, etc.
        citeUnseenDomainIgnore: {},  // User-provided domain ignore lists for each category
        refs: [],  // All citations found in the document
        refLinks: [],  // All citation links found in the document
        refCategories: {},  // All citations by category
        reflistNode: null,  // Where {{reflist}} is located in the document
        convByVar: null,  // I18n & Chinese conversion function
        dashboard: null,  // Citation statistics dashboard
        dashboardHighlighted: null,  // Currently highlighted citation category
        customCategoryDialogRules: null,  // Current user-provided rules on the custom category dialog (not applied yet)
        customCategoryRules: [],  // Current user-provided rules for the custom category
        customCategoryIcons: [],  // Icons for custom categories
        windowManager: null,  // Window manager for OOUI dialogs
    };

    CiteUnseen.init();

})();
