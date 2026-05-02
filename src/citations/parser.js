let refs = [];
let refLinks = [];
let reflists = [];

/**
 * Parse a COinS string into an object
 * @param {string} query - COinS string
 * @returns {Object} Parsed object
 */
export function parseCoinsString(query) {
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
}

/**
 * Decode a URI component, handling potential encoding issues.
 * @param str - The URI component string to decode
 * @returns {string} Decoded string
 */
export async function decodeURI(str) {
    try {  // First try the built-in function
        return decodeURIComponent(str);
    } catch (e) { }  // Fallback to detection and decoding

    function percentDecodeToBinStr(str) {
        let out = '';
        for (let i = 0; i < str.length; i++) {
            const ch = str[i];
            if (ch === '%' && i + 2 < str.length && /^[0-9A-Fa-f]{2}$/.test(str.slice(i + 1, i + 3))) {
                out += String.fromCharCode(parseInt(str.slice(i + 1, i + 3), 16));
                i += 2;
            } else if (ch === '+') {
                out += ' ';
            } else {
                out += String.fromCharCode(str.charCodeAt(i) & 0xFF);
            }
        }
        return out;
    }

    function canonicalLabel(label) {
        if (!label) return null;
        label = String(label).toLowerCase();
        if (label === 'ansi_x3.4-1968' || label === 'us-ascii' || label === 'ascii') return 'utf-8';
        if (label === 'latin1' || label === 'iso-8859-1' || label === 'cp1252') return 'windows-1252';
        return label;
    }

    const binStr = percentDecodeToBinStr(str);
    const detected = window.jschardet.detect(binStr);
    const encoding = canonicalLabel(detected?.encoding);
    const decoder = new TextDecoder(encoding);
    return decoder.decode(new TextEncoder().encode(binStr));
}

/**
 * Get the sibling elements associated with a citation marker.
 * eswiki subcitation compatibility: template output may split one logical citation
 * across sibling nodes after an empty <cite>.
 * Stops before the next citation marker or an explicit line-break separator.
 * @param {Element} citeTag - The citation marker element
 * @returns {Element[]} Associated sibling elements
 */
function getCitationSiblingSegment(citeTag) {
    const siblingSegment = [];
    let sibling = citeTag.nextElementSibling;

    while (sibling) {
        if (sibling.tagName === 'CITE' || sibling.tagName === 'BR') {
            break;
        }
        siblingSegment.push(sibling);
        sibling = sibling.nextElementSibling;
    }

    return siblingSegment;
}

/**
 * Return a selector match only when it is unambiguous within the given root.
 * @param {Element|null} root - The root element to search within
 * @param {string} selector - CSS selector to search for
 * @returns {Element|null} The single matching element, or null if none/multiple exist
 */
function getSingleScopedMatch(root, selector) {
    if (!root) {
        return null;
    }

    const matches = root.querySelectorAll(selector);
    return matches.length === 1 ? matches[0] : null;
}

/**
 * Collect unique external link elements from the given roots.
 * @param {Element[]} roots - Elements to search within
 * @returns {Element[]} Unique external link elements
 */
function collectExternalLinks(roots) {
    const externalLinks = [];
    const seen = new Set();

    for (const root of roots) {
        if (!root) {
            continue;
        }

        const matches = [];
        if (root.matches?.('a.external')) {
            matches.push(root);
        }
        if (root.querySelectorAll) {
            matches.push(...root.querySelectorAll('a.external'));
        }

        for (const link of matches) {
            if (!seen.has(link)) {
                seen.add(link);
                externalLinks.push(link);
            }
        }
    }

    return externalLinks;
}

/**
 * Find the rendered citation node, COinS tag, and external links associated with a cite marker.
 * @param {Element} citeTag - The citation marker element
 * @returns {{citationElement: Element, coinsTag: Element|null, externalLinks: Element[]}}
 */
function getCitationMarkupContext(citeTag) {
    const siblingSegment = getCitationSiblingSegment(citeTag);
    const wrappingExternalLink = citeTag.closest('a.external');
    // frwiki compatibility: .ouvrage often wraps the full citation while <cite> only wraps the title.
    const citationWrapper = citeTag.closest('.ouvrage');
    let citationElement = citeTag;
    let coinsTag = null;

    if (citeTag.nextElementSibling && citeTag.nextElementSibling.matches('.Z3988[title]')) {
        coinsTag = citeTag.nextElementSibling;
    }

    if (!citeTag.textContent.trim()) {
        // subcitation compatibility: promote empty template markers to the rendered sibling citation.
        const renderedCitation =
            siblingSegment.find(node => node.classList?.contains('citation')) ||
            siblingSegment.find(node => !node.matches('.Z3988') && node.textContent.trim() !== '');
        if (renderedCitation) {
            citationElement = renderedCitation;
        }
    }

    if (citationElement === citeTag && wrappingExternalLink) {
        // frwiki compatibility: insert outside wrapped title links to avoid nesting icon links.
        citationElement =
            wrappingExternalLink.closest('.ouvrage') ||
            wrappingExternalLink.parentElement ||
            citeTag;
    }

    if (
        citationElement === citeTag &&
        citationWrapper &&
        citationWrapper !== citeTag &&
        citationWrapper.textContent.trim() !== citeTag.textContent.trim()
    ) {
        // frwiki compatibility: move icons to the full citation wrapper, not the title-only <cite>.
        citationElement = citationWrapper;
    }

    if (!coinsTag) {
        coinsTag = siblingSegment
            .map(node => node.matches('.Z3988[title]') ? node : node.querySelector('.Z3988[title]'))
            .find(Boolean) || null;
    }

    const externalLinks = collectExternalLinks([
        citationElement,
        citeTag,
        wrappingExternalLink,
        ...siblingSegment,
    ]);

    return {
        citationElement,
        coinsTag,
        externalLinks,
    };
}

/**
 * Get the top-level footnote list item for a citation.
 * This avoids treating wrapper text around nested citation lists as a separate source.
 * @param {Element} citationElement - The citation element
 * @returns {Element|null} The top-level citation note list item
 */
export function getReferenceNoteContainer(citationElement) {
    if (!citationElement) return null;
    return citationElement.closest('li[id^="cite_note-"]');
}

/**
 * Get the reflist container for a citation.
 * Prefer explicit wrapper elements like jawiki's div.reflist when present.
 * @param {Element} citationElement - The citation element
 * @returns {Element|null} The reflist container element
 */
export function getReflistContainer(citationElement) {
    if (!citationElement) return null;

    const wrapper = citationElement.closest('.reflist, .refbegin');
    if (wrapper) {
        return wrapper;
    }

    const reflist = citationElement.closest('ol.references, ol.mw-references, ol[typeof="mw:Extension/references"]');
    if (!reflist) {
        return null;
    }

    const parentElement = reflist.parentElement;
    if (parentElement && parentElement.tagName === 'DIV' && parentElement.childElementCount === 1) {
        return parentElement;
    }

    return reflist;
}

/**
 * Ensure a value is an array
 * @param {*} value - Value to ensure is an array
 * @returns {Array} Array version of the value
 */
export function ensureArray(value) {
    if (Array.isArray(value)) return value.filter(v => typeof v === 'string' && v !== '');
    if (typeof value === 'string' && value !== '') return [value];
    return [];
}

/**
 * Merge DOM/COinS URLs into rft_id while preserving existing order.
 * @param {Object} coins - COinS object
 * @param {string[]|string} hrefs - DOM hrefs to merge in
 */
export function mergeRftIds(coins, hrefs) {
    const merged = [...new Set(
        ensureArray(coins['rft_id']).concat(ensureArray(hrefs))
    )];

    if (merged.length === 0) {
        delete coins['rft_id'];
        return;
    }

    coins['rft_id'] = merged.length === 1 ? merged[0] : merged;
}

/**
 * Pick the primary URL for UI workflows from a citation.
 * @param {Object} coins - COinS object
 * @returns {string} Preferred URL
 */
export function getPrimarySourceUrl(coins) {
    const rftIds = ensureArray(coins && coins['rft_id']);
    return rftIds.find(url => !url.startsWith('info:sid/')) || rftIds[0] || '';
}

/**
 * Get parsed citation references.
 * @returns {Object[]} Parsed citation references
 */
export function getRefs() {
    return refs;
}

/**
 * Get external links found across parsed citations.
 * @returns {string[]} Parsed citation URLs
 */
export function getRefLinks() {
    return refLinks;
}

/**
 * Get parsed reflist containers and their citation references.
 * @returns {Object[]} Parsed reflist state
 */
export function getReflists() {
    return reflists;
}

/**
 * Find all <cite> tags and parse them into COinS objects; locate the position of {{reflist}}.
 * @returns {Promise<{refs: Object[], refLinks: string[], reflists: Object[]}>} Parsed citation state
 */
export async function findCitations() {
    refs = [];
    refLinks = [];
    reflists = [];

    // Structure where COinS strings are located:
    //   <cite class="citation book">...</cite>
    //   <span title="...(COinS string)...">...</span>

    // Filter all <cite> tags
    for (const citeTag of document.querySelectorAll("cite")) {
        let coinsObject;
        const refTextElement = citeTag.closest('.reference-text, .mw-reference-text');
        const citationMarkup = getCitationMarkupContext(citeTag);
        const onlyCitationInRefText = refTextElement ? refTextElement.querySelectorAll('cite').length === 1 : false;
        let citationElement = citationMarkup.citationElement;
        let coinsTag = citationMarkup.coinsTag;
        let domLinks = ensureArray(citationMarkup.externalLinks.map(link => link.getAttribute('href')));
        if ((!coinsTag || coinsTag.tagName !== 'SPAN' || !coinsTag.hasAttribute('title')) && refTextElement) {
            const fallbackCoinsTag = getSingleScopedMatch(refTextElement, '.Z3988[title]');
            if (fallbackCoinsTag) {
                coinsTag = fallbackCoinsTag;
                if (!citeTag.textContent.trim() && citationElement === citeTag && onlyCitationInRefText) {
                    citationElement = refTextElement;
                }
            }
        }
        if (domLinks.length === 0 && refTextElement) {
            const refTextLinks = ensureArray(
                Array.from(refTextElement.querySelectorAll('a.external[href]'))
                    .map(link => link.getAttribute('href'))
            );
            if (onlyCitationInRefText || refTextLinks.length === 1) {
                domLinks = refTextLinks;
                if (refTextLinks.length > 0 && !citeTag.textContent.trim() && citationElement === citeTag && onlyCitationInRefText) {
                    citationElement = refTextElement;
                }
            }
        }
        if (!coinsTag || coinsTag.tagName !== 'SPAN' || !coinsTag.hasAttribute('title')) {
            // No COinS, so fall back to the DOM links we found in the rendered citation.
            if (domLinks.length === 0) {
                // No COinS and no <a> tag, so skip
                continue;
            }
            coinsObject = {};
            mergeRftIds(coinsObject, domLinks);
        } else {
            // Parse COinS string
            let coinsString = await decodeURI(coinsTag.getAttribute('title'));
            coinsObject = parseCoinsString(coinsString);

            // Fallback to rfr_id if rft_id is missing
            if (!coinsObject['rft_id'] && coinsObject['rfr_id']) {
                coinsObject['rft_id'] = coinsObject['rfr_id'];
            }

            mergeRftIds(coinsObject, domLinks);
        }
        refs.push({
            cite: citationElement,
            classListSource: citeTag,
            coins: coinsObject,
        });
        if (coinsObject['rft_id']) {
            refLinks.push(...ensureArray(coinsObject['rft_id']));
        }
    }

    // Handle plain-link citations in <li> tags not already covered by parsed citation markup.
    const citationLiElements = document.querySelectorAll('li[id^="cite_note-"]');
    const citationListItemsWithRefs = new Set(
        refs
            .map(ref => getReferenceNoteContainer(ref.classListSource || ref.cite))
            .filter(Boolean)
    );
    for (const li of citationLiElements) {
        if (citationListItemsWithRefs.has(li)) {
            continue;
        }

        const refTextElement = li.querySelector('.reference-text');
        if (!refTextElement) {
            continue;
        }

        const domLinks = ensureArray(
            Array.from(refTextElement.querySelectorAll('a.external[href]'))
                .map(link => link.getAttribute('href'))
        );
        if (domLinks.length > 0) {
            const coinsObject = {};
            mergeRftIds(coinsObject, domLinks);
            refs.push({
                cite: refTextElement,
                coins: coinsObject,
            });
            if (coinsObject['rft_id']) {
                refLinks.push(...ensureArray(coinsObject['rft_id']));
            }
        }
    }

    // Track citations by the reflist container they actually belong to.
    const reflistMap = new Map();
    for (const ref of refs) {
        const reflist = getReflistContainer(ref.cite);
        if (!reflist) {
            continue;
        }

        if (!reflistMap.has(reflist)) {
            reflistMap.set(reflist, {
                element: reflist,
                refs: [],
                categories: {},
                dashboard: null,
                selectedCategories: new Set(),
                totalCitations: null // Will be calculated when dashboard is created
            });
        }

        reflistMap.get(reflist).refs.push(ref);
    }
    reflists = Array.from(reflistMap.values());

    return { refs, refLinks, reflists };
}
