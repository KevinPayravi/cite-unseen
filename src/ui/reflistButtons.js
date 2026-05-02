import { getCitationContainer } from './dashboard.js';
import { openSettingsDialog } from './settingsDialog.js';
import { openSuggestionDialog } from './suggestionDialog.js';

/**
 * Show the settings button for Cite Unseen configuration.
 * @param {boolean} minerva - Whether the Minerva skin is used
 * @param {Object} options - Reflist button dependencies
 * @returns {Element} The settings button element
 */
function createSettingsButton(minerva, options) {
    const {
        convByVar,
        i18n,
        getSettingCategories,
        getCategoryDisplayName,
        loadCustomRulesFromWiki,
        getMetaRules,
        getLocalRules,
        setMetaRules,
        setLocalRules
    } = options;
    const settingsButton = document.createElement('a');

    if (minerva) {
        settingsButton.classList.add('cdx-button', 'cdx-button--size-large', 'cdx-button--fake-button', 'cdx-button--fake-button--enabled', 'cdx-button--icon-only', 'cdx-button--weight-quiet');

        // Settings icon
        const icon = document.createElement('span');
        icon.classList.add('skin-invert', 'minerva-icon');
        icon.classList.add('cite-unseen-minerva-icon', 'cite-unseen-minerva-settings-icon');
        settingsButton.appendChild(icon);
    } else {
        settingsButton.classList.add('cite-unseen-edit-style');

        // Settings label
        const label = document.createElement('span');
        label.textContent = convByVar(i18n.settingsButton);
        settingsButton.appendChild(label);
    }

    settingsButton.onclick = function (e) {
        e.preventDefault();
        openSettingsDialog({
            convByVar,
            i18n,
            getSettingCategories,
            getCategoryDisplayName,
            loadCustomRulesFromWiki,
            getMetaRules,
            getLocalRules,
            setMetaRules,
            setLocalRules
        });
    };

    settingsButton.setAttribute('title', convByVar(i18n.settingsButtonTooltip));

    return settingsButton;
}

/**
 * Add suggestions toggle button.
 * @param {boolean} minerva - Whether Minerva skin is active
 * @param {Object} reflistData - Reference list data
 * @param {Object} options - Reflist button dependencies
 * @return {HTMLElement} The suggestions toggle button element
 */
function createSuggestionsToggleButton(minerva, reflistData, options) {
    const { convByVar, i18n } = options;
    const suggestionsToggleButton = document.createElement('a');
    suggestionsToggleButton.className = 'cite-unseen-suggestions-default';

    if (minerva) {
        suggestionsToggleButton.classList.add('cdx-button', 'cdx-button--size-large', 'cdx-button--fake-button', 'cdx-button--fake-button--enabled', 'cdx-button--icon-only', 'cdx-button--weight-quiet');

        // Suggestion icon
        const icon = document.createElement('span');
        icon.classList.add('skin-invert', 'minerva-icon');
        icon.classList.add('cite-unseen-minerva-icon', 'cite-unseen-minerva-suggestions-icon');
        suggestionsToggleButton.appendChild(icon);
    } else {
        suggestionsToggleButton.classList.add('cite-unseen-edit-style');

        // Suggestion label
        const label = document.createElement('span');
        label.textContent = convByVar(i18n.suggestionsToggleButton);
        suggestionsToggleButton.appendChild(label);
    }

    suggestionsToggleButton.onclick = function (e) {
        e.preventDefault();

        suggestionsToggleButton.classList.toggle('cite-unseen-suggestions-active');
        suggestionsToggleButton.classList.toggle('cite-unseen-suggestions-default');

        const suggestionsMode = suggestionsToggleButton.classList.contains('cite-unseen-suggestions-active');
        toggleSuggestionPlusSigns(suggestionsMode, reflistData, options);
    };

    suggestionsToggleButton.setAttribute('title', convByVar(i18n.suggestionsToggleTooltip));

    return suggestionsToggleButton;
}

/**
 * Show or hide plus signs next to citations for suggestions
 * @param {boolean} suggestionsMode - Whether suggestions mode is active
 * @param {Object} reflistData - Reference list data
 * @param {Object} options - Reflist button dependencies
 */
function toggleSuggestionPlusSigns(suggestionsMode, reflistData, options) {
    const {
        convByVar,
        i18n,
        getSettingCategories,
        getCategoryDisplayName,
        getPrimarySourceUrl,
        sourceToPageMapping
    } = options;

    reflistData.refs.forEach(ref => {
        // Get the citation container (usually the <li> element)
        const citationContainer = getCitationContainer(ref.cite);
        if (!citationContainer) return;

        let plusSign = citationContainer.querySelector('.cite-unseen-suggestion-plus');

        if (suggestionsMode) {
            if (!plusSign) {
                plusSign = document.createElement('img');
                plusSign.className = 'cite-unseen-suggestion-plus';
                plusSign.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMyOGE3NDUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICAgIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+CiAgICA8bGluZSB4MT0iMTIiIHkxPSI4IiB4Mj0iMTIiIHkyPSIxNiIvPgogICAgPGxpbmUgeDE9IjgiIHkxPSIxMiIgeDI9IjE2IiB5Mj0iMTIiLz4KPC9zdmc+Cg==';
                plusSign.setAttribute('title', convByVar(i18n.suggestCategorization));

                plusSign.onclick = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    openSuggestionDialog(ref, {
                        convByVar,
                        i18n,
                        getSettingCategories,
                        getCategoryDisplayName,
                        getPrimarySourceUrl,
                        sourceToPageMapping
                    });
                };

                citationContainer.prepend(plusSign);
            }
        } else {
            if (plusSign) {
                plusSign.remove();
            }
        }
    });
}

/**
 * Find the header that comes before the reflist
 * Used to insert settings + suggest buttons in header
 * @param {Element} reflistElement - The reflist element to search from
 * @returns {Element|null} The header element before reflist, or null if not found
 */
function findHeaderBeforeReflist(reflistElement) {
    let searchElement = reflistElement;

    // Traverse backwards to find the nearest preceding header
    for (let level = 0; ; level++) {
        let currentElement = searchElement.previousElementSibling;

        while (currentElement) {
            // Skip our own dashboard elements
            if (currentElement.classList.contains('cite-unseen-dashboard')) {
                currentElement = currentElement.previousElementSibling;
                continue;
            }

            // Check if element is an h2/h3
            if (currentElement.matches('h2, h3') ||
                currentElement.classList.contains('mw-heading') ||
                currentElement.classList.contains('mw-heading2')) {
                return currentElement;
            }
            // Check if element contains h2/h3
            const header = currentElement.querySelector('h2, h3, .mw-heading, .mw-heading2');
            if (header) {
                return header.closest('.mw-heading, .mw-heading2') || header.parentElement || header;
            }

            currentElement = currentElement.previousElementSibling;
        }

        // Move up one level for next iteration; stop if we reach the main container
        searchElement = searchElement.parentElement;
        if (!searchElement || searchElement.classList.contains('mw-parser-output') || searchElement.nodeName === 'MAIN') break;
    }

    return null;
}

/**
 * Create a button section with Cite Unseen buttons
 * @param {string} sectionClass - CSS class for the section
 * @param {Object} reflistData - The reflist data object
 * @param {Object} options - Reflist button dependencies
 * @returns {Element} The created button section element
 */
function createButtonSection(sectionClass, reflistData, options) {
    const section = document.createElement('span');
    section.className = `mw-editsection cite-unseen-section ${sectionClass}`;
    const minerva = mw.config.get('skin') === 'minerva';
    if (minerva) {
        section.classList.add('cite-unseen-minerva-edit-section');
    }

    // Create opening bracket
    if (!minerva) {
        const openingBracket = document.createElement('span');
        openingBracket.className = 'mw-editsection-bracket';
        openingBracket.textContent = '[';
        section.appendChild(openingBracket);
    }

    // Add settings button
    section.appendChild(createSettingsButton(minerva, options));

    // Add suggestions button
    if (window.cite_unseen_show_suggestions !== false) {
        // Add divider if not using Minerva skin
        if (!minerva) {
            const divider = document.createElement('span');
            divider.className = 'cite-unseen-editsection-divider';
            divider.textContent = ' | ';
            section.appendChild(divider);
        }

        // Add suggestions button
        section.appendChild(createSuggestionsToggleButton(minerva, reflistData, options));
    }

    // Create closing bracket
    if (!minerva) {
        const closingBracket = document.createElement('span');
        closingBracket.className = 'mw-editsection-bracket';
        closingBracket.textContent = ']';
        section.appendChild(closingBracket);
    }

    return section;
}

/**
 * Create buttons in the header before a specific reflist
 * @param {Object} reflistData - The reflist data object
 * @param {Object} options - Reflist button dependencies
 * @returns {boolean} Success status
 */
export function createButtons(reflistData, options) {
    const header = findHeaderBeforeReflist(reflistData.element);
    if (!header) return false;

    // Check if buttons already exist
    if (header.querySelector('.cite-unseen-section')) return true;

    const editSection = header.querySelector('.mw-editsection');
    const sectionClass = editSection ? 'cite-unseen-edit-section' : 'cite-unseen-fallback-section';
    const buttonSection = createButtonSection(sectionClass, reflistData, options);

    if (editSection) {
        // Insert after existing edit section
        editSection.parentNode.insertBefore(buttonSection, editSection.nextSibling);
    } else {
        // Insert as standalone section
        const h2Element = header.querySelector('h2');
        const targetElement = (h2Element && header.classList.contains('mw-heading')) ? h2Element : header;
        targetElement.appendChild(buttonSection);
    }

    return true;
}
