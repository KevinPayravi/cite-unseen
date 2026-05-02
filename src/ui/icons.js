import {
    ensureArray,
    getRefLinks,
    getRefs
} from '../citations/parser.js';
import {
    citeUnseenCategories,
    citeUnseenCategoryData,
    citeUnseenCategoryTypes
} from '../citations/categoryData.js';
import { citeUnseenChecklists } from '../citations/sourceData.js';
import {
    getCategorizedRules,
    resolveSourceToPageLink
} from '../citations/sources.js';
import {
    findReliabilityMatch,
    findTypeMatches
} from '../citations/ruleMatch.js';
import {
    buildRuleKeyMap,
    buildUrlKeySet,
    getCandidateRulesForUrlKeys,
    getRulesForUrlKeys
} from '../citations/rulePrefilter.js';
import {
    getCiteUnseenDomainIgnore,
} from '../config.js';
import {
    getConvByVar,
    getI18n
} from '../i18n.js';

let refCategories = {};

/**
 * Create an icons div for a citation
 * @returns {Element} The created icons div
 */
function createIconsDiv() {
    const iconsDiv = document.createElement('div');
    iconsDiv.classList.add('cite-unseen-icons');
    return iconsDiv;
}

/**
 * Add to count. Currently, it records regardless of whether it is in the reflist.
 * @param {String} type - The type
 */
function addToCount(type) {
    citeUnseenCategoryData[type].count++;
}

/**
 * Add an icon and tooltip to a node.
 * @param {Element} node - The iconsDiv node
 * @param {String} type - The type
 * @param {String|null} checklist - The checklist
 * @param {String|null} language - Language code for reliability icons
 * @returns {Element} The iconNode element
 */
function processIcon(node, type, checklist = null, language = null) {
    const convByVar = getConvByVar();
    const i18n = getI18n();
    const iconContainer = document.createElement("span");
    iconContainer.classList.add("cite-unseen-icon-container");

    const iconNode = document.createElement("img");
    iconNode.classList.add("skin-invert");
    iconNode.classList.add("cite-unseen-icon-" + type);
    iconNode.classList.add("cite-unseen-icon");
    iconNode.setAttribute("src", citeUnseenCategoryData[type].icon);
    let message = convByVar(i18n.categoryHints[type]);
    if (checklist) {
        const pageLink = resolveSourceToPageLink(checklist);
        const displayName = pageLink || checklist;
        message = convByVar(i18n.citationTooltipPrefix) + ' ' + displayName +
            convByVar(i18n.citationTooltipSuffix) + ' ' + message + ' ' +
            convByVar(i18n.citationTooltipAction);
    }
    iconNode.setAttribute("alt", message);
    iconNode.setAttribute("title", "[Cite Unseen] " + message);

    addToCount(type);
    if (checklist) {
        // If there is a checklist, wrap the icon in a link.
        const iconNodeLink = document.createElement("a");
        const pageLink = resolveSourceToPageLink(checklist);
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
    if (!refCategories[type]) {
        refCategories[type] = [];
    }
    refCategories[type].push(node.parentNode);
    return iconNode;
}

/**
 * Track a citation as unknown.
 * @param {Element} node - The iconsDiv node (parent of the citation)
 */
function trackUnknownCitation(node) {
    const type = "unknown";
    addToCount(type);

    if (!refCategories[type]) {
        refCategories[type] = [];
    }
    refCategories[type].push(node.parentNode);
}

/**
 * Get citation nodes grouped by rendered category.
 * @returns {Object.<string, Element[]>} Citation nodes grouped by category
 */
export function getRefCategories() {
    return refCategories;
}

/**
 * Add icons to citation sources. Only executed once on page load.
 * @returns {Object} Citation nodes grouped by category
 */
export function addIcons() {
    const categorizedRules = getCategorizedRules() || {};
    const citeUnseenDomainIgnore = getCiteUnseenDomainIgnore();
    const refs = getRefs();
    const refLinks = getRefLinks();
    refCategories = {};

    const pageUrlKeySet = buildUrlKeySet(refLinks);
    const fullRuleKeyMap = buildRuleKeyMap(categorizedRules, citeUnseenDomainIgnore);
    const {
        categorizedRules: pageCandidateCategorizedRules
    } = getCandidateRulesForUrlKeys(fullRuleKeyMap, pageUrlKeySet);
    const pageRuleKeyMap = buildRuleKeyMap(pageCandidateCategorizedRules);
    const typeCategories = citeUnseenCategoryTypes;

    refs.forEach(ref => {
        // Insert icon area before the <cite> tag
        const iconsDiv = createIconsDiv();
        ref.cite.prepend(iconsDiv);

        const processedCategories = new Set();

        // Determine the source type based on the class name
        const classList = (ref.classListSource || ref.cite).classList;
        const bookClasses = ["book", "journal", "encyclopaedia", "conference", "thesis", "magazine"];
        const tvClasses = ["episode", "podcast", "media"];
        const hasNewsClass = classList.contains("news");

        // Check CSS-based classifications first
        if (bookClasses.some(cls => classList.contains(cls))) {
            if (citeUnseenCategories.books && !processedCategories.has("books")) {
                processIcon(iconsDiv, "books");
                processedCategories.add("books");
            }
        }

        if (classList.contains("pressrelease")) {
            if (citeUnseenCategories.press && !processedCategories.has("press")) {
                processIcon(iconsDiv, "press");
                processedCategories.add("press");
            }
        }

        if (tvClasses.some(cls => classList.contains(cls))) {
            if (citeUnseenCategories.tvPrograms && !processedCategories.has("tvPrograms")) {
                processIcon(iconsDiv, "tvPrograms");
                processedCategories.add("tvPrograms");
            }
        }

        // If rft_id, check URL-based classifications
        const rftIds = ensureArray(ref.coins['rft_id']);
        if (rftIds.length > 0) {
            const refUrlKeySet = buildUrlKeySet(rftIds);
            const refCategorizedRules = getRulesForUrlKeys(pageRuleKeyMap, refUrlKeySet, rftIds).categorizedRules;

            // Find reliability and type matches
            const reliabilityMatches = findReliabilityMatch(ref.coins, refCategorizedRules, {
                citeUnseenChecklists,
                citeUnseenCategories,
                currentLanguage: mw.config.get('wgContentLanguage'),
                showOtherLanguageReliabilityRatings: window.cite_unseen_show_other_language_reliability_ratings
            });
            const typeMatches = findTypeMatches(ref.coins, refCategorizedRules, typeCategories, {
                citeUnseenCategories,
                additionalDomains: window.cite_unseen_additional_domains,
                additionalStrings: window.cite_unseen_additional_strings
            });
            const hideSocialMediaReliabilityRating = window.cite_unseen_hide_social_media_reliability_ratings === true && typeMatches.includes('social');

            // Process reliability categories
            for (const reliabilityMatch of reliabilityMatches) {
                // If hiding social media reliability ratings, skip generic (spec=0) matches
                if (hideSocialMediaReliabilityRating && reliabilityMatch.spec === 0.0) {
                    continue;
                }

                // We can show multiple icons from various language source evaluations,
                // if current language wiki has none.
                const reliabilityKey = `${reliabilityMatch.type}_${reliabilityMatch.language}`;
                if (!processedCategories.has(reliabilityKey)) {
                    processIcon(iconsDiv, reliabilityMatch.type, reliabilityMatch.name, reliabilityMatch.language);
                    processedCategories.add(reliabilityKey);
                    processedCategories.add(reliabilityMatch.type);
                }
            }

            // Process type categories
            for (const typeMatch of typeMatches) {
                if (!processedCategories.has(typeMatch)) {
                    processIcon(iconsDiv, typeMatch);
                    processedCategories.add(typeMatch);
                }
            }
        }

        if (rftIds.length === 0 || rftIds.some(id => id.startsWith('info:sid/'))) {
            // If a template is already categorized as news via CSS but links are missing,
            // treat it as news instead of falling back to unknown.
            if (processedCategories.size === 0 && hasNewsClass && citeUnseenCategories.news) {
                processIcon(iconsDiv, "news");
                processedCategories.add("news");
            }
        }

        if (citeUnseenCategories.unknown && processedCategories.size === 0) {
            if (window.cite_unseen_show_unknown_links_icon === true) {
                processIcon(iconsDiv, "unknown");
            } else {
                trackUnknownCitation(iconsDiv);
            }
        }
    });

    return refCategories;
}
