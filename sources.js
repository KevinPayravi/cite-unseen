var CiteUnseenData = {
    /**
     * Definition page names for source checklists. Starts with "Meta:Cite Unseen/sources/".
     * @type {Array.<string>}
     * @constant
     */
    citeUnseenSources: [
        'medium',
        'type',
        'influence',
        'advocacy',
        'zhRsp',
        'zhVgs',
        'zhAcgs',
        'enRsp',
        'enVgs',
        'enAmrs',
        'enJapanrs',
        'enKors',
        'enAs',
        'enNppsg',
    ],

    /**
     * Source checklists grouped by reliability category.
     * @type {Array.<Array.<string>>}
     * @constant
     */
    citeUnseenChecklists: [
        [
            "generallyReliable", [
                ["zh:WP:RS/P", "zhRspGenerallyReliable"],
                ["zh:PJ:VG/S", "zhVgsGenerallyReliable"],
                ["zh:PJ:ACG/S", "zhAcgsGenerallyReliable"],
                ["en:WP:RS/P", "enRspGenerallyReliable"],
                ["en:WP:VG/S", "enVgsGenerallyReliable"],
                ["en:WP:A&M/RS", "enAmrsGenerallyReliable"],
                ['en:WP:JAPAN/RS', 'enJapanrsGenerallyReliable'],
                ["en:WP:KO/RS", "enKorsGenerallyReliable"],
                ['en:WP:A/S', 'enAsGenerallyReliable'],
                ['en:WP:NPPSG', 'enNppsgGenerallyReliable'],
            ],
        ], [
            "marginallyReliable", [
                ["zh:WP:RS/P", "zhRspMarginallyReliable"],
                ["zh:PJ:VG/S", "zhVgsMarginallyReliable"],
                ["zh:PJ:ACG/S", "zhAcgsMarginallyReliable"],
                ["en:WP:RS/P", "enRspMarginallyReliable"],
                ["en:WP:VG/S", "enVgsMarginallyReliable"],
                ["en:WP:KO/RS", "enKorsMarginallyReliable"],
            ],
        ], [
            "generallyUnreliable", [
                ["zh:WP:RS/P", "zhRspGenerallyUnreliable"],
                ["zh:PJ:VG/S", "zhVgsGenerallyUnreliable"],
                ["zh:PJ:ACG/S", "zhAcgsGenerallyUnreliable"],
                ["en:WP:RS/P", "enRspGenerallyUnreliable"],
                ["en:WP:VG/S", "enVgsGenerallyUnreliable"],
                ["en:WP:A&M/RS", "enAmrsGenerallyUnreliable"],
                ["en:WP:KO/RS", "enKorsGenerallyUnreliable"],
                ["en:WP:A/S", "enAsGenerallyUnreliable"],
                ['en:WP:NPPSG', 'enNppsgGenerallyUnreliable'],
            ],
        ], [
            "deprecated", [
                ["zh:WP:RS/P", "zhRspDeprecated"],
                ["en:WP:RS/P", "enRspDeprecated"],
            ],
        ], [
            "blacklisted", [
                ["zh:WP:RS/P", "zhRspBlacklisted"],
                ["en:WP:RS/P", "enRspBlacklisted"],
                ["en:WP:KO/RS", "enKorsBlacklisted"],
            ],
        ], [
            "multi", [
                ["zh:WP:RS/P", "zhRspMulti"],
                ["zh:PJ:VG/S", "zhVgsMulti"],
                ["zh:PJ:ACG/S", "zhAcgsMulti"],
                ["en:WP:RS/P", "enRspMulti"],
                ["en:WP:VG/S", "enVgsMulti"],
                ['en:WP:NPPSG', 'enNppsgMulti'],
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
     * Get the full wikitext.
     * @returns {Promise<string>} A Promise containing the full wikitext.
     */
    getFullText: async function () {
        // Add 'Meta:Cite_Unseen/sources/' to the beginning each of the source names, then join them with '|'.
        let source_titles = this.citeUnseenSources.map(source => `Meta:Cite_Unseen/sources/${source}`).join('|');

        var api;
        if (mw.config.get('wgServer') === "//meta.wikimedia.org") {
            api = new mw.Api({ userAgent: 'CiteUnseen/2.1.0' });
        } else {
            api = new mw.ForeignApi("//meta.wikimedia.org/w/api.php", { userAgent: 'CiteUnseen/2.1.0' });
        }
        var response = await api.get({
            action: 'query', titles: source_titles, prop: 'revisions', rvslots: '*', rvprop: 'content', indexpageids: 1,
        });
        // var fulltext = response.query.pages[response.query.pageids[0]].revisions[0].slots.main['*'];
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
     * Split wikitext into multiple sections by level 3 headings.
     * @param fulltext {string} The complete wikitext.
     * @returns {Object.<string, string>} An object containing headings and their corresponding content.
     */
    getSections: function (fulltext) {
        let sections = {};
        // Only parse the 3rd level headers (=== ... ===).
        const headerRegex = /^(={3,})([^=]+)\1/gm;
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
            if (key && rest.length) {
                rule[key.trim()] = rest.join('=').trim();
            }
        });
        return rule;
    },

    /**
     * Get categorized rules.
     * @returns {Promise<Object.<string, Object[]>>} An object containing categories and their corresponding rules.
     */
    getCategorizedRules: async function () {
        const fulltext = await this.getFullText();
        let sections = this.getSections(fulltext);
        let categorizedRules = {};
        for (const [cat, section] of Object.entries(sections)) {
            // Parse {{CULink}} templates.
            // Using matchAll to capture the content inside the braces.
            const entries = Array.from(section.matchAll(/{{\s*CULink\s*\|\s*([^}]+?)\s*}}/g), match => match[1]);
            categorizedRules[cat] = entries.map(this.parseRuleTemplates).filter(Boolean);
        }
        return categorizedRules;
    },

    /**
     * Default toggle settings for categories. Unstated categories will be default to true (CiteUnseen.init).
     * @type {Object.<string, boolean>}
     * @constant
     */
    citeUnseenCategories: {
        "unknown": false,
    },

    /**
     * Category data, icons, and counters in use.
     * Labels are used in the dashboard. "(s)" will be parsed to "" or "s" depending on the count (CiteUnseen.parseI18nPlural).
     * hints are used when hovering over the icons.
     * @type {Object.<string, boolean>}
     * @constant
     */
    citeUnseenCategoryData: {
        // Advocacy agencies
        "advocacy": {
            "label_en": "advocacy",
            "label_hant": "宣傳機構",
            "label_hans": "宣传机构",
            "label_ja": "アドボカシー",
            "hint_en": "This source is an advocacy organization.",
            "hint_hant": "此來源為宣傳機構。",
            "hint_hans": "此来源为宣传机构。",
            "hint_ja": "この情報源はアドボカシー組織です。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAPCAMAAAA1b9QjAAAAbFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0Iv+qAAAAI3RSTlMA1A5E+vZW38mMJx7s2aOZjWdaQzoUCvHkyrmvhXx2bWBTMqn0tOoAAAB/SURBVBjTZc9XDoQwDARQZzc9lKVub/j+d8SMAIGYH8svsSXTLt1D7WFwzKctfAxD4hmx4camUiKB1zwjTWIYUeGXiERamt8v0kLyg7hl6v7+d5CGSl6ii4TN1H6l87YqM77WEIoihdT+pVlDepEce5tsvsILWVDyDrWW3xBkBEQGDke/jOMVAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Blog posts
        "blogs": {
            "label_en": "blog post(s)",
            "label_hant": "部落格",
            "label_hans": "博客",
            "label_ja": "ブログ",
            "hint_en": "This source is a blog post.",
            "hint_hant": "此來源為部落格文章。",
            "hint_hans": "此来源为博客文章。",
            "hint_ja": "この情報源はブログ記事です。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAclBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACa4vOeAAAAJXRSTlMA+/J3Bq43Mxb3x7OnnJl8Xkoc6ubLoVhNPCgj3dzDkI1ycVZUCH5LxQAAAJZJREFUGBkFwYVhAgEAALG84A51t9t/xSaG2/3DeQ0AVQ27ZwCqqnavAD9f+7uqxkcALI9D1QlYXme8LqpOoMb9E6ah+oWqtiv+hhqvqKrNmalaYL2a3qse2VVLME9DbVZehloAnob64FibtXk6XJiqi+fq7KG6mN9qz60OxurIqUYWtXVffbOsrj7rzst2PMysq5Wpxn9NeBK2TnaptgAAAABJRU5ErkJggg==",
            "count": 0,
        },

        // Publications
        "books": {
            "label_en": "publication(s)",
            "label_hant": "書刊",
            "label_hans": "书刊",
            "label_ja": "出版物",
            "hint_en": "This source is a publication such as a book, journal, or other printed material.",
            "hint_hant": "此來源為出版書籍、期刊或其他出版物。",
            "hint_hans": "此来源为出版书籍、期刊或其他出版物。",
            "hint_ja": "この情報源は書籍、ジャーナル、またはその他の印刷物などの出版物です。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAMCAMAAACz+6aNAAAAWlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACLSV5RAAAAHXRSTlMAqt7QCRnpffrWSSry7cehoHVuRD0sJuLamGkfHurrquoAAABVSURBVAjXvYjJEYAgEMBWQO5bxHP7b1OBsQXzSSago5KSHAWq8NzRqIHnC1hN1lthGNwnBwKdgnoE/Q7D+ZdjlrWd5nY2wRGRZEz7aycUhKmjJB0RHg2VBO5eX4k3AAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Community-created news
        "community": {
            "label_en": "community",
            "label_hant": "社群新聞",
            "label_hans": "社群新闻",
            "label_ja": "コミュニティ",
            "hint_en": "This source is community-created news.",
            "hint_hant": "此來源為社群創作的新聞。",
            "hint_hans": "此来源为社群创作的新闻。",
            "hint_ja": "この情報源はコミュニティが作成したニュースです。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAMAAADH72RtAAAAaVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnbPKNAAAAInRSTlMAmWPM27eThIB/06+fjV0lD/r1yLuzqaRzTD8dmGpTUBYCKhLQsAAAAH1JREFUGNONi0kOAjEMBGMgCUy22VfW/v8jiU3EaQ5TUkvlkqz2qI3fRDYfapEAjCIDYEUM4NRc6aSBIOU9ufQCUKVhkq94JzIWmYWIHh+1gjnldSNbVOyobOz92jVZr1Jmc2b0sy2lyRN6XUp7K+XiuDD/wsfhstAPq3b5AqlTD1RMmHJ5AAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Community-maintained sources
        "editable": {
            "label_en": "editable",
            "label_hant": "可編輯",
            "label_hans": "可编辑",
            "label_ja": "編集可能",
            "hint_en": "This source is editable by the community (e.g., a wiki or database).",
            "hint_hant": "此來源可由社群編輯（例如 Wiki 或資料庫）。",
            "hint_hans": "此来源可由社群编辑（例如 Wiki 或数据库）。",
            "hint_ja": "この情報源はコミュニティによって編集可能です（例：ウィキやデータベース）。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAPCAMAAADeWG8gAAAAvVBMVEUAAABMTEw1NTUdHR0+Pj7o6Oj///8/Pz8pKSkuLi5TU1NXV1dcXFxiYmKMjIywsLDExMT///////9tbW0xMTFfX19KSkpFRUVUVFRMTExHR0dZWVlgYGBra2taWlp2dnaEhIRsbGxmZmZ8fHygoKCOjo6Dg4OqqqqXl5ekpKSmpqacnJyhoaG7u7unp6ezs7O7u7vHx8ft7e3///////8AAAAjIyMGBgZUVFRHR0cLCwtlZWVOTk4iIiIVFRWrycPlAAAANXRSTlMA9P7++R8F/v798+rm3rFcOwkC/v38+PHt7e3r6efi397e1My6uberoZOLh4Z9cnFZMSggDCg5MJMAAACOSURBVBgZXcGFEoJQAATAe6SUgt3dXUcZ//9ZMgYM7iJ1HRzxZ0L/jExJ2AuyiIwq0X+wqyFVHpF3Go11GT8r8sagTdonfLgyw4A9JuSlhoRn8lmlKPKtub8AM7JG2dUEP2KUAlbIrXoo8AsmdSmSCjFT2A31kDnAnFHdUBRFiJZl9R1nDHT8DfK8qYq8F7oKGQbJNCvvAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // State-affiliated or government sources
        "government": {
            "label_en": "government",
            "label_hant": "政府",
            "label_hans": "政府",
            "label_ja": "政府",
            "hint_en": "This source is identified as a state-owned or state-run media, or a government source.",
            "hint_hant": "此來源已被識別為國有或國營媒體，或為政府來源。",
            "hint_hans": "此来源已被识别为国有或国营媒体，或为政府来源。",
            "hint_ja": "この情報源は国有または国営メディア、または政府の情報源として識別されています。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAQAAABaOFzUAAAA2ElEQVQoz4XRPUoDURTF8d+MMG8gCpbRBWghlmLjIuwsrdyErY32U/mxA1MJCgpauAEFKzuLIJEQVFCCMo7FTGQSkngut3jnfzivuNS16MCTfQvGatmRvkKh0HdoaRiva8krPJjcqbUSz7oZgfW51ojMaNqxMfbzW8eeY7m2K5zL9NzJPHiRucSFtp8y3VTYwqMMJ+6xrTAPMQh/G5BIa14VSarnAIbKS4dbUiT/t4SRljC5JdS8KkLHt1jPJz684kunpBE27ZmkXWes6k45QNdK5N2caXr7BW+yUjtO1UbwAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // News articles
        "news": {
            "label_en": "news",
            "label_hant": "新聞",
            "label_hans": "新闻",
            "label_ja": "ニュース",
            "hint_en": "This source is a news article from a reputable news organization.",
            "hint_hant": "此來源為來自知名新聞機構的新聞文章。",
            "hint_hans": "此来源为来自知名新闻机构的新闻文章。",
            "hint_ja": "この情報源は信頼できるニュース組織からのニュース記事です。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAYFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD6T+iNAAAAH3RSTlMAupk7insrItNVS0O/F28fZWFF48uxSDIMCO+0oIAO/8GCqwAAAIBJREFUGNOdy9sSwiAMRdEDFGmQS6Gttd74/78UkXTGV9dDZrInQXK3RTCXAAhkjcPqgTtOA/LYELQCxuk5wJ8b3wpRGKK1dld1mE9B/ZpKKYZCCNtP8THGFxclpfS6jswFBy4X0dG/N1yS/FpW2ctjM50DcBXYHZq2VOTmWTD1Bls+BmmlzBpEAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Opinion pieces
        "opinions": {
            "label_en": "opinion piece(s)",
            "label_hant": "觀點",
            "label_hans": "观点",
            "label_ja": "意見",
            "hint_en": "This source is an opinion piece.",
            "hint_hant": "此來源為觀點文章。",
            "hint_hans": "此来源为观点文章。",
            "hint_ja": "この情報源は意見記事です。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAMAAAD+MweGAAAAb1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABt6r1GAAAAJHRSTlMA+xH1Iph8OCYY3MWiLe/p1sq8lI53cGxiV0EM6rGwj2pNSjP1ocsVAAAAgUlEQVQIHV3BRQLCMABFwZ+m7q447/5nJC3dwIzizODYetYpA0yfbN5BjgHGV8qXzTcBdWyBISkaIBCQP4DWu84FUCmFIARugxljwOhpCUJ2U5IBRrqzhOyiDsdIfaiJXdfglNJbig1OFODkOiwXoLRA6+mU+E6RsuqXX636E0X6AFnuEKR6+rcNAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Predatory journals
        "predatory": {
            "label_en": "predatory journal(s)",
            "label_hant": "掠奪性期刊",
            "label_hans": "掠夺性期刊",
            "label_ja": "ハゲタカジャーナル",
            "hint_en": "This source is from a predatory journal.",
            "hint_hant": "此來源來自掠奪性期刊。",
            "hint_hans": "此来源来自掠夺性期刊。",
            "hint_ja": "この情報源はハゲタカジャーナルからのものです。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAMAAAAVBLyFAAAAmVBMVEUAAAC/AADAAADAAADAAAC/AAC+AAC/AAC/AAC/AAC/AADAAAC/AAC/AAC/AADAAAC/AADAAAC/AAC/AADEAAC/AADXYWHRS0vMOTnGHh7AAADAAAC+AAC/AAC/AADGAAC/AAD////XXFzHHx/++vr77u733NzQRETMNDTJJibDEBD99vb78PD55ubzzs7xyMjuurrSTEzBCQmtvS+6AAAAIHRSTlMApFWZXe5mRPU1085j39zWnol3Jw/49PPy8ObFloBsCQk/Lh0AAACMSURBVBjTVY7nDsIwDAYdoNCkaeliL6fpZvP+D0djBZHer9NZlj6QU+KUXc5HI7EEFs8NqYjCcO/56DNgMyAyDwnvnyDCd4td4aZlU96Ku1q7qX8qpeqdkwQ2Qxo9irZSpbpunBTo+qFf1dZNqHv8dOYxWRh4HqCBpqKduLLCgE+Iw3CXZBwseZr8/AvR2g1q3xyaTQAAAABJRU5ErkJggg==",
            "count": 0,
        },

        // Press releases
        "press": {
            "label_en": "press release(s)",
            "label_hant": "新聞稿",
            "label_hans": "新闻稿",
            "label_ja": "プレスリリース",
            "hint_en": "This source is a press release.",
            "hint_hant": "此來源為新聞稿。",
            "hint_hans": "此来源为新闻稿。",
            "hint_ja": "この情報源はプレスリリースです。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAMAAAD+MweGAAAAPFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQLyYwAAAAE3RSTlMAzHczU/m4lm8wHL6timZBPQwdu570zwAAAFxJREFUCNetyDkOw0AMBEGS5p663f//q1eioUCxKhhgWi4lAanI7WBx94Xjep9ho46tbOcRnt4sOhEm/Zd1J+zrWVTVm4bmY6SatW6hN7MqGeZCKDNk+eYEt5T7D9g7DD/ysJyVAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Satirical or parody content
        "satire": {
            "label_en": "satirical",
            "label_hant": "幽默",
            "label_hans": "幽默",
            "label_ja": "風刺",
            "hint_en": "This source publishes satirical or parody content.",
            "hint_hant": "此來源發表諷刺、惡搞內容。",
            "hint_hans": "此来源发表讽刺、恶搞内容。",
            "hint_ja": "この情報源は風刺やパロディのコンテンツを公開しています。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAARCAYAAAAG/yacAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wceCDI64ByhXQAAAPFJREFUKM+V0zFKQ0EQBuBvn4pWClaWYiF6Ck+Qy+Qi6VLkFNbpxEOYMoQQrCRqY0h8azML6+NJ4g/LMjP/zD/8y8IYLR4x0I9B1FuME3KH8IoXfOAc97iqCQnfcW9j0lmP0hcanCAXpTaSBduI2yAWtGiKUtMzfYfjnnwrlDadQq5OjQ1yUVg7DOt6jYwJbjDqKI0iP4l4l6piOkApI9XvtKucPIohuTIqFWNSceMfSmAVwXxPwzx4qwazSH7uaSr1GQwrM6Z/NEwrzjDhNLqvg/COJ7zhEg+4qFa8K5Nusei8T/csgteLZyzjaywj/oUf7bdVPf0Xy7cAAAAASUVORK5CYII=",
            "count": 0,
        },

        // Social media
        "social": {
            "label_en": "social media",
            "label_hant": "社群媒體",
            "label_hans": "社交媒体",
            "label_ja": "ソーシャルメディア",
            "hint_en": "This source is a social media website, possibly a social media post.",
            "hint_hant": "此來源為社群媒體網站，可能是社群媒體貼文。",
            "hint_hans": "此来源为社交媒体网站，可能是社交媒体贴文。",
            "hint_ja": "この情報源はソーシャルメディアのウェブサイトで、ソーシャルメディアの投稿である可能性があります。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALNSURBVDhPjVNLSFRhFD7/f++MzIyZRrUxrUUR1JhE0QPaBBUIFW0KeiwqcvKZjxY9iEwoCFroOD7CFAJpUSatWriQEqGEICjLIkyamewlhOaM8/De//Td21VmUdgHwzn/Od//3XPOf4Yy0UAN8vCGBjcRCyf0X7DJp9d3LdFcsVa4BxCIMwlDCEowcVyQiFkW1JiAZaZfyE0Sk9eXbd5oGj6f0C0R3R3vhpnx+cx8K2jFFkPA37QzHtM74J4U1WuDOUkP/3CZ+vL20arYHwpROlSw1SSZ7akOP010rF6jDN7iq470OWkbpf7m3qShlcmUm3MFi2SmgAWDaC9ms9/y2TB3SMFH7UQmhJj26KkV0vJZsGYHgVhLfvFsqLBfCFHPRLWzoYI02D3MoiQeKhxKtq065FBxkV0sslxS6VKDii1mwcue97pUV8D4gLGP43cVgx7GUFNC48uzM+4nDhUQmOmcS7oNiGRUImvGUu7Kzy9A+A6hqLcqehMCLyGW9lZEh5ZdHJ92qOiGXFLqujRQCypZEEk2569Lhgpvw92O+Da0Mwr2cZyXJloLehLthXtsIoCnd5FhoB3NQCW00E4W65OQHGDmd9iZMAQGQX+FfZkgRQM4jzlUXBO6EppuXwZZWNtq+3XhqayKSC/m8AiXH3qrIuWK+Ba++txzLnrXUx7+ZPEsYPBZLE1NqmROBIT016K83U7ORtoQ9+bUXJvl/0zRoDLVJTvhoKa4KRdms1tzf7TXPuBvvo4vVxKpdnT2jSV/ufO61l6sM/7gESkoV5FiTQmFf5VCS160exaDfdY5UltmiwCi1B88BXsMgQLYlZ1vavIC/mA9Xu4aduQVisdlMgWTiTbi2K3H+SNT3Y3UqOZFFlC6MbhPCH6gmE5IKfqUUge73tb1O+m/YuFV5sG6OYHWfCj1Po4XFhP4JwKbmneVFrWUOMdFQPQbGOYih834xvIAAAAASUVORK5CYII=",
            "count": 0,
        },

        // Sponsored content
        "sponsored": {
            "label_en": "sponsored",
            "label_hant": "宣傳稿",
            "label_hans": "宣传稿",
            "label_ja": "スポンサー付き",
            "hint_en": "This source is a sponsored content or promotional material.",
            "hint_hant": "此來源為商單、宣傳稿。",
            "hint_hans": "此来源为商单、宣传稿。",
            "hint_ja": "この情報源はスポンサー付きのコンテンツまたはプロモーション資料です。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAASCAYAAAC9+TVUAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wceCRIMu+B6UQAAAUVJREFUOMuN079KXFEQx/HPVQwqEgIpU2yRzpSBFG7lK+QNtjeNQjqxCYivkCovkfRWQdhlCx9ALGyWgIWBsFl3b5o5MjneKw4Md5j5zu/8m8v/9gXXWGBc1caRvw6u0y7Rhq9SfNuTvyyNa0nkPL4tmtTwKgk0EWf+kR0HtIymVUfcBvdgTYrXA9rCi2iqbQ1/8Sfxj2yUzvyUj/qOcvRMgeJHtcAw3cU8tjyvmnK+3M0wi0wiuaie8gc+4meVL9wki+RC+X7GS7wJ5rSHe3idktxIc/Ia+3iLA9xhN9UL38A0CvfpXlp8iwU28ClEcr3wU2msVx2jfYUPGOBdD3fbhOJ6NfLwHnvYwTbO8LuDW8JNzza/YjMWGOB7z7Fv4CLNQVsBv2I651U+8xdw2POrL6phu+/hDsucnGDWAayS1wKz6PMP8f7HxLFPnyIAAAAASUVORK5CYII=",
            "count": 0,
        },

        // Tabloids
        "tabloids": {
            "label_en": "tabloid(s)",
            "label_hant": "小報",
            "label_hans": "小报",
            "label_ja": "タブロイド",
            "hint_en": "This source is a tabloid or gossip news.",
            "hint_hant": "此來源為小報或八卦新聞。",
            "hint_hans": "此来源为小报或八卦新闻。",
            "hint_ja": "この情報源はタブロイドまたはゴシップニュースです。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAe1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC9eBywAAAAKHRSTlMA33YN9+rLup5pZkU+8drRtKqTjF9aUyslHxsF4tXDwqujmYaBXBQIt6ZAsgAAAH1JREFUGBl1wVUWwjAABMBNUndXXPf+J4TIa39gBv9cCykVdmPIrxa7mloFvOE01DygnWFF1Dyl4jushVoNmQVwyuB88ZMkfQo4vS+jg+qG/ghrbkiKeE2zEEaa0zi9xg7alNMJYUXcZDAENw8YiUenmGAtcVX6IrgNK376AFE7D6Mmxn6bAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // TV programs
        "tvPrograms": {
            "label_en": "TV program(s)",
            "label_hant": "電視節目",
            "label_hans": "电视节目",
            "label_ja": "テレビ番組",
            "hint_en": "This source is a TV or radio program. Its reliability depends on the individual program.",
            "hint_hant": "此來源為電視或廣播節目。其可靠性取決於個別節目。",
            "hint_hans": "此来源为电视或广播节目。其可靠性取决于个别节目。",
            "hint_ja": "この情報源はテレビまたはラジオ番組です。その信頼性は個々の番組によって異なります。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARAgMAAABGA69pAAAADFBMVEUAAACoqKgAAAA1NTWxW1e8AAAAAnRSTlMAWWQkJGgAAAA4SURBVAjXY2BgaGhgAIJGMPnoAIhUYwABayBmWrVqAQMD16pVKxgYNIAMILlqVRd+EqISogtqAgBQEBiFRNOi6QAAAABJRU5ErkJggg==",
            "count": 0,
        },

        // Reliability: Blacklisted
        "blacklisted": {
            "label_en": "blacklisted",
            "label_hant": "列入黑名單",
            "label_hans": "列入黑名单",
            "label_ja": "ブラックリスト入り",
            "hint_en": "This source has been blacklisted due to persistent abuse, typically in the form of spam external links.",
            "hint_hant": "由於持續濫用（通常以垃圾外部連結的形式），此來源已被列入黑名單。",
            "hint_hans": "由于持续滥用（通常以垃圾外部链接的形式），此来源已被列入黑名单。",
            "hint_ja": "この情報源は、持続的な濫用（通常はスパム外部リンクの形で）によりブラックリスト入りしています。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAWlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////u7u7o6OgpKSkMDAy0tLT7+/v5+fl+fn58fHw5OTklJSUhISG1tbWsrKyjo6MkJCR7e3s8PDxKkGAPAAAACnRSTlMAvI4+GrPi4bSxfq7qvQAAAHZJREFUCNddj0sSwjAMQ/MtICexk/QDFO5/TXDpgol2b0a2JKPyLkbnzU/B4pANB03gLtIZk7LFO1WimhbY7x04PdacyzMxvHHotWAvWNsMZ664Uy7AlkkQTfzH22nedhQ1D680aEmNqGnQWWMWeTEuYSw5TPgAC+IHcILUzWIAAAAASUVORK5CYII=",
            "count": 0,
        },

        // Reliability: Deprecated
        "deprecated": {
            "label_en": "deprecated",
            "label_hant": "應停用",
            "label_hans": "应停用",
            "label_ja": "非推奨",
            "hint_en": "This source is deprecated and should not be used. It may still be used for non-controversial self-descriptions or expert self-published content.",
            "hint_hant": "社群共識認為此來源通常不可靠。它仍可用於無爭議的自我描述，或來自專家的自行發表內容。",
            "hint_hans": "社区共识认为此来源通常不可靠。它仍可用于无争议的自我描述，或来自专家的自行发表内容。",
            "hint_ja": "この情報源は非推奨であり、使用しないでください。無争議の自己記述や専門家による自己出版コンテンツには引き続き使用できます。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAq1BMVEUAAAAUBQUTBQWzJCT///+uIyOwIyOsIiJKEBBLDw9wFhZsFRVHDg67u7tgLS2OIiLLy8ttWVlkPj5kKyv6+vry8vLu7u7j4+Pc3NzX19e3t7eysrKdmJhpVFRhNzdWNDR6IyOhISHp6eno5+fY1tbDw8O6tbWqqamoqKiakJCQkJCQhYWKfX1lSkpYPj5aNTVEMjJnMDBcLy99KiqDKCimISGWICBAHBwsGRlV2YqAAAAAA3RSTlMAp597gGAlAAAAqklEQVQY02XQ1xKCMBAFUHE3BBUSlCLSsffe/v/LTLIjL9ynzJk7s5vt6fTdgY5rqTfBiNs6fGi1ACBFA8AUGWDAg2v4fRqiRvPxc9wXQORygGCTeOiNQYW7PYcBlLOpkccNmGNkQiKPJ7CV2Er8beZlxTkWbSdBxGi5OLz/nVLBPMXwAqpDsyLEFHEn9Syzj8wRVxhX7YoM7mtEv3oR0Na1EDUj6P69e58fVvYMNLFQgRAAAAAASUVORK5CYII=",
            "count": 0,
        },

        // Reliability: Generally reliable
        "generallyReliable": {
            "label_en": "generally reliable",
            "label_hant": "通常可靠",
            "label_hans": "通常可靠",
            "label_ja": "通常信頼できる",
            "hint_en": "Editors generally agree that this source is reliable on topics in its area of expertise.",
            "hint_hant": "編輯們一致認為此來源在其專業領域的主題上通常可靠。",
            "hint_hans": "编辑们一致认为此来源在其专业领域的主题上通常可靠。",
            "hint_ja": "編集者は一般的に、この情報源がその専門分野のトピックにおいて信頼できると考えています。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAbFBMVEUAAAAsoCwsoSw+qD4toS0roCstoi0uoS4snyw8qDwtoC0toC0soCwuny4toC0toC3///8voi8toS0soCzo9egyozLp9enj8+PD5MORzZGOzI5GrEa/4r/e8N7M6Mxxv3FBqkH0+vTy+fLE5cSRPYNXAAAAEHRSTlMAsxr9vo4/5JD9wbw/PeaP9lvV4AAAAIVJREFUCNclzlsWgyAMBFBQRKu1TXgp+Gy7/z2WgfniHpKTEchzkHLQoqYZrWlbY1VT9OIYiELkHh55pZKVVd6zser8JKvFYEL985cznZAtfU+i3W8LPSR4+V8R+DZhuT1DGNY20nFvjoiSnYVQ+dAB7TyhRs8pyyXUgFUtOUGI7qTsZrz+IPgKG81qz+sAAAAASUVORK5CYII=",
            "count": 0,
        },

        // Reliability: Generally unreliable
        "generallyUnreliable": {
            "label_en": "generally unreliable",
            "label_hant": "通常不可靠",
            "label_hans": "通常不可靠",
            "label_ja": "通常信頼できない",
            "hint_en": "This source is generally considered unreliable by the community. It may still be used for non-controversial self-descriptions or expert self-published content.",
            "hint_hant": "社群共識認為此來源通常不可靠。它仍可用於無爭議的自我描述，或來自專家的自行發表內容。",
            "hint_hans": "社区共识认为此来源通常不可靠。它仍可用于无争议的自我描述，或来自专家的自行发表内容。",
            "hint_ja": "この情報源はコミュニティによって通常信頼できないと考えられています。無争議の自己記述や専門家による自己出版コンテンツには引き続き使用できます。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAASFBMVEUAAADMAADMAADPAADMAADMAADMAADNAADMAADNAAD////MAAD99fXsnp7pj4/nhobib2/RGBjia2vojY3jcXHYPz/YPDzRGhqXVefLAAAACnRSTlMA8c8VVPOChINSyGF/kwAAAHJJREFUCNc9z9sSwyAIRVGQaFLAVs3t//+0gE3325pxnANYtKac00YQLXgftbaOS0hOZUuHmAlP2TkaSLDe+pZPUHuBdDA/bgly5b8rAhrDk6nxz/F46/rYvyIcHO1yIfmMMWdc8poje4uRJo+Kn1D8hC/MLAbL8liTMwAAAABJRU5ErkJggg==",
            "count": 0,
        },

        // Reliability: Marginally reliable
        "marginallyReliable": {
            "label_en": "marginally reliable",
            "label_hant": "半可靠",
            "label_hans": "半可靠",
            "label_ja": "限られた信頼性",
            "hint_en": "This source is marginally reliable. It may be necessary to review it on a case-by-case basis to determine its reliability in each context.",
            "hint_hant": "此來源半可靠。可能有必要在每次使用該來源時逐個進行審查，視情境決定是否可靠。",
            "hint_hans": "此来源半可靠。可能有必要在每次使用该来源时逐个进行审查，视情境决定是否可靠。",
            "hint_ja": "この情報源は限られた信頼性があります。各コンテキストでの信頼性を判断するために、個別にレビューする必要があるかもしれません。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAMAAAAR8Wy4AAAAjVBMVEUAAAD2eQD1eQD2eQD1eQD1eQD1eQD1eAD0eQD0eAD4egDycwD/gAD/cgD1egD1eQD1eQD1eQD1eQD2eQD2eQD0egD0eAD////4nUX1eQD2fgn3kSz3jCTj4N/96tf82LWYmJj7yJb7xI6Li4v5tG9ra2tZWVlISEj2hBT+9+/+9u7GxsbFxcVHR0dGRkYfNpgQAAAAF3RSTlMAu/lq7uDVenUuJBQJBMOvrZaUVFJHRoWjpJIAAAB/SURBVAgdVcEHFoIwEAXAJaEXu3429I71/sczKvJghiZS0oovhE9LW6V2tHDmuuYLzSI7ybLUjuhPcvEcCpY0CcwYrwGxGdDPXuXoe+TqQF+eaIGuA1rh0cdmvAKPO3AbDdKOXAFoGgAVn4hCK4FWltASKySX03iWskuOseK8AfKLCvyhOfkVAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Reliability: No consensus
        "multi": {
            "label_en": "no consensus",
            "label_hant": "無共識",
            "label_hans": "无共识",
            "label_ja": "コンセンサスなし",
            "hint_en": "There is no consensus in the community about the reliability of this source. Its reliability may be affected by one or more factors, such as the subject area, author, or publication time.",
            "hint_hant": "社群對此來源的可靠性沒有共識。其可靠性可能受到一個或多個因素影響（例如主題領域、作者或出版時間）。",
            "hint_hans": "社区对此来源的可靠性没有共识。其可靠性可能受到一个或多个因素影响（例如主题领域、作者或出版时间）。",
            "hint_ja": "この情報源の信頼性についてコミュニティ内でコンセンサスがありません。その信頼性は、主題領域、著者、または出版時間など、1つ以上の要因によって影響を受ける可能性があります。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAtFBMVEUAAAAJrd8gteIPsOAAqt0Aq90Aqt0Aqts4veUkt+IWsuAuuuMErN4FrN4ErN4Cq94Cq90Aqt0Aqt8Aqd4Aqt4AqtwApt8Zs+EEq94FrN0Dqt0Dq94AqdwAq90Aqd0Aqd4AqtkAqt8AgP////8Aqt1NxOj1/P74/f7m9/zb8/rE6/e86faq4/Sn4vOc3vKQ2vB70+5Xx+k+v+bs+fzk9vvU8fnO7/iW3PFozetYyOkktuIas+C+oCNVAAAAI3RSTlMA/fv7oJuWI/v7+/rh0MO4tXZGNScSC/vuzb6pjH9xTRsYAtfMWVAAAACbSURBVAjXJctXEsJQCEBRXmKipjd7F9J77Lr/fYnP+8HMGQC480Fz1noA/8Y2TV+9Qs5RajktMMuwXFgn5kq5JDFRnFwNFyCgEjtR16LDikLQFcS2QewHRHUHboxcevs8EScj8CRjemeSW0NySPhE+BBSxSwKHg+KADw15y2/3MUIAGaW2qR5nrTCnsPPGxKmKUhjySJf0/dj4L7guBKsqi+5hQAAAABJRU5ErkJggg==",
            "count": 0,
        },

        // Unknown
        "unknown": {
            "label_en": "unknown",
            "label_hant": "未知",
            "label_hans": "未知",
            "label_ja": "不明",
            "hint_en": "This source is not yet evaluated.",
            "hint_hant": "此來源尚未評估。",
            "hint_hans": "此来源尚未评估。",
            "hint_ja": "この情報源はまだ評価されていません。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJNSURBVDhPVVJNTxNRFJ33prCAdood6EIpi35YKjUsaGzqUjclRsrCXWHjD5CFphJYuBIo3UiiwQTDgoWkC2lNbGJioiEGIhBDFwLFNKGV8GG0KRlMEWbePO+dQmNPcpPzbs65Lzn3EqEOT2hLi/mOrusReHigdEKEbc7JgqLEPsCbowpRM1oscQ+l5DXQgM8nM7/fLnCQZbOHQj5fFoF/FkUaLZcf7VYdAEkac1ut8Z+BwCttdXVP5YCdnbJeKBwx5IuLBdXvf8kkabIoy/HL5zZOwPSlp2eGlUoVXVH+6pFIklmtkxwLOfYODo41n28a+vH3hg2mhFGwvPxDw+kjIx9Ze/szlkrl1HR6W0U+OvrJ+DmT+a6hVpImblBCeJ/LdYmFQg4RB9ntTWR8/JbQ3+81RSJXTb29br62tmdkEQ67aWtrEwRG71LIx9nV1YZ9A0NDQTIwcJ3iD8Xikba0tEtcLpuRJoRHOjtl4NwNRoExpmO/DoODb0l394wJ1kGGh2/W0q9qCcPJufX1Q4gew69HMHiFr6zcFzo6rIbx7EzjGxu/CSi30Phmf/+PmMnkmaE+RywWEhKJ26S5ubH2WzK5hQkTOJAFowERv/N4XjDYnZEeIhpNGXWBzc1fmsMxBeuYmDNMCLP5aRvEnHM6n7P5+W/a6amGy+dYJyeqPjubVdEEq/tqs01J6Pnv5MZkSk3TQO9ZLI3c65W5rnMhlyuRSkXFDOYaGoQHpdLjY9TXjBcwmxPXKOV9QOHI4bwJyXEuphXlYb6qQAjCP3DDM2e6XmppAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Custom tag (used for dashboard custom filters)
        "flag": {
            "label_en": "custom tag",
            "label_hant": "自訂標記",
            "label_hans": "自定义标记",
            "label_ja": "カスタムタグ",
            "hint_en": "This source has been marked with a custom tag.",
            "hint_hant": "自訂標記。",
            "hint_hans": "自定义标记。",
            "hint_ja": "この情報源にはカスタムタグが付いています。",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAExSURBVDhP7ZM9SANBEIXnbXEExCZXiwhiYRMVC7FVsBWCrSI2QrDSIlYiwUrESm1EMHViZ2UrBiGQQyKmNK3xgrUeM86FRe+4BH9i6dcsvB3ezs8OKEL+vDQPSGGrulcQ5hTBNNy018AusQ3pirFnB4CGHX6bEcYlyJQhdN/2Jx6ec5lV2YnHRul5EWEMwJnvZ65buclpq3UIjetL406snO1iac3h19ON6j6BxKqfqCKGpMJCFQ0YgGBBILffyeQDfVErxKxmtgnCugojKjz+yCSBSMtJyWE/Jm1iLA4e3D39wkQCbc4FGFPuiXcTKl1NtPYrZl6GQSaAGWXiOW3qihBnA3aG3CMvmz6uNW14nHA6+WL5RURiU/uK/hpr+TdJ8vcmItTU/1DX3UhuX0+I3gECeWjI1GP/3wAAAABJRU5ErkJggg==",
            "count": 0,
        },
    },
};
