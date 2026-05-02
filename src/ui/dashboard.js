import {
    citeUnseenCategoryData,
    citeUnseenCategoryTypes
} from '../citations/categoryData.js';
import { citeUnseenChecklists } from '../citations/sourceData.js';
import {
    getConvByVar,
    getI18n
} from '../i18n.js';
import { getRefCategories } from './icons.js';

/**
 * Parse a string containing the plural marker "(s)"
 * @param {string} string - The string to parse
 * @param {number} value - The value used to determine plural form
 * @return {string} - The parsed string
 */
function parseI18nPlural(string, value) {
    return string.replace(/\(s\)/g, value === 1 ? '' : 's');
}

/**
 * Get all category types used in the system.
 * The order only matters when displaying in the dashboard.
 * @returns {Array} Array of all category type strings
 */
function getAllCategoryTypes() {
    return [...citeUnseenChecklists.flatMap(x => x[0]).toReversed(), ...citeUnseenCategoryTypes, 'unknown'];
}

/**
 * Get the appropriate container element for a citation (usually the <li> element)
 * @param {Element} citationElement - The citation element
 * @returns {Element} The container element to show/hide
 */
export function getCitationContainer(citationElement) {
    // Find closest li element
    const listItem = citationElement.closest('li');

    // Return the list item if found, otherwise use the citation element itself
    return listItem || citationElement;
}

/**
 * Calculate category counts for a specific reflist
 * @param {Object} reflistData - The reflist data object
 * @returns {Object} Category counts for this reflist
 */
function calculateCategoryCountsForReflist(reflistData) {
    const refCategories = getRefCategories();
    const counts = {};

    // Get all category types
    const categoryTypes = getAllCategoryTypes(); // Order doesn't matter here

    // Initialize all category counts to 0
    for (const category of categoryTypes) {
        counts[category] = 0;
    }

    // Count citations in this reflist by category
    for (const ref of reflistData.refs) {
        // Find which categories this citation belongs to
        for (const category in refCategories) {
            const categoryNodes = refCategories[category];
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
}

/**
 * Update dashboard categories display for a specific dashboard
 * @param {Object} dashboard - The dashboard object
 * @param {Object} categoryCounts - Category counts for this reflist
 */
function updateDashboardCategories(dashboard, categoryCounts) {
    const convByVar = getConvByVar();
    const i18n = getI18n();

    // Clear existing categories
    dashboard.cats.innerHTML = '';

    // List each type of source in order
    const categoryTypes = getAllCategoryTypes(); // Order matters here
    for (const category of categoryTypes) {
        const count = categoryCounts[category] || 0;
        if (count > 0) {
            const countNode = document.createElement('div');
            countNode.setAttribute('data-category', category);
            countNode.classList.add('cite-unseen-category-item');

            const countIcon = document.createElement('img');
            countIcon.alt = convByVar(i18n.categoryHints[category]);
            countIcon.src = citeUnseenCategoryData[category].icon;
            countIcon.width = '17';
            countIcon.classList.add("skin-invert");
            countIcon.classList.add('cite-unseen-category-icon');

            const countText = document.createElement('span');
            const categoryLabel = convByVar(i18n.categoryLabels[category]);
            // Handle plural for English
            const labelText = mw.config.get('wgContentLanguage') === 'en' ?
                parseI18nPlural(categoryLabel, count) :
                categoryLabel;
            countText.innerText = count + ' ' + labelText;
            countText.classList.add('cite-unseen-category-text');

            countNode.onclick = function () {
                toggleCategoryFilterForReflist(dashboard.reflistData, category);
            };

            countNode.setAttribute('role', 'button');
            countNode.setAttribute('tabindex', '0');
            countNode.setAttribute('aria-pressed', 'false');
            countNode.setAttribute('title', convByVar(i18n.filterToggleTooltip));

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
}

/**
 * Toggle a category filter on/off for a specific reflist
 * @param {Object} reflistData - The reflist data object
 * @param {string} category - Citation category to toggle
 */
function toggleCategoryFilterForReflist(reflistData, category) {
    if (!reflistData || !reflistData.selectedCategories || !category) {
        console.warn('[Cite Unseen] Invalid parameters provided to toggleCategoryFilterForReflist');
        return;
    }

    if (reflistData.selectedCategories.has(category)) {
        reflistData.selectedCategories.delete(category);
    } else {
        reflistData.selectedCategories.add(category);
    }

    applyMultiCategoryFilterForReflist(reflistData);
}

/**
 * Clear all category filters for a specific reflist
 * @param {Object} reflistData - The reflist data object
 */
function clearAllFiltersForReflist(reflistData) {
    if (!reflistData || !reflistData.selectedCategories) {
        console.warn('[Cite Unseen] Invalid reflist data provided to clearAllFiltersForReflist');
        return;
    }

    reflistData.selectedCategories.clear();
    applyMultiCategoryFilterForReflist(reflistData);
}

/**
 * Apply filtering based on currently selected categories for a specific reflist.
 * @param {Object} reflistData - The reflist data object
 */
function applyMultiCategoryFilterForReflist(reflistData) {
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
            li.classList.remove('cite-unseen-filtered-out');
            li.setAttribute('aria-hidden', 'false');
        });

        targetReflist.classList.remove('cite-unseen-filtering-active');
        targetReflist.removeAttribute('data-cite-unseen-filter');

        // Reset count display
        updateFilteredCountForReflist(dashboard, reflistData.totalCitations, reflistData.totalCitations);
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
                const container = getCitationContainer(citeElement);
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
            li.classList.remove('cite-unseen-filtered-out');
            li.setAttribute('aria-hidden', 'false');
        } else {
            li.classList.add('cite-unseen-filtered-out');
            li.setAttribute('aria-hidden', 'true');
        }
    });

    // Add filtering state to the target reflist
    targetReflist.classList.add('cite-unseen-filtering-active');
    targetReflist.setAttribute('data-cite-unseen-filter', selectedCategoriesArray.join(','));

    // Update count display
    updateFilteredCountForReflist(dashboard, visibleContainers.size, reflistData.totalCitations);
}

/**
 * Update the display to show filtered count for a specific reflist
 * @param {Object} dashboard - The dashboard object
 * @param {number} visibleCount - Number of visible citations
 * @param {number} totalCount - Total number of citations
 */
function updateFilteredCountForReflist(dashboard, visibleCount, totalCount) {
    const convByVar = getConvByVar();
    const i18n = getI18n();
    if (!dashboard || !dashboard.total) return;

    const totalElement = dashboard.total;
    const baseText = "[Cite Unseen] ";
    const citationText = totalCount === 1 ?
        convByVar(i18n.citationSingular) :
        convByVar(i18n.citationPlural);

    if (visibleCount === totalCount) {
        totalElement.innerText = baseText + convByVar(i18n.totalCitations) + ' ' + totalCount + ' ' + citationText;
    } else {
        const filterInfo = dashboard.reflistData.selectedCategories.size > 1 ?
            " (" + dashboard.reflistData.selectedCategories.size + ' ' + convByVar(i18n.filtersActive) + ")" :
            "";

        totalElement.innerText = baseText +
            convByVar(i18n.showing) + ' ' + visibleCount + ' ' +
            convByVar(i18n.of) + ' ' + totalCount + ' ' +
            citationText + filterInfo;
    }
}

/**
 * Create a dashboard for a specific reflist
 * @param {Object} reflistData - The reflist data object
 */
export function createDashboardForReflist(reflistData) {
    const convByVar = getConvByVar();
    const i18n = getI18n();

    // Calculate category counts
    const reflistCategoryCounts = calculateCategoryCountsForReflist(reflistData);

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
    clearAllButton.innerText = convByVar(i18n.clearAllFilters);
    clearAllButton.setAttribute('title', convByVar(i18n.clearAllFiltersTooltip));
    clearAllButton.setAttribute('role', 'button');
    clearAllButton.setAttribute('tabindex', '0');
    clearAllButton.onclick = function () {
        clearAllFiltersForReflist(dashboard.reflistData);
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
    updateFilteredCountForReflist(dashboard, reflistData.totalCitations, reflistData.totalCitations);
    dashboard.total.classList.add('cite-unseen-dashboard-total');

    // Add total and clear all button to header
    dashboard.header.appendChild(dashboard.total);
    dashboard.header.appendChild(clearAllButton);
    dashboard.div.appendChild(dashboard.header);
    dashboard.cats.classList.add('cite-unseen-dashboard-cats');
    dashboard.div.appendChild(dashboard.cats);

    // Insert the dashboard before this reflist
    const parentElement = reflistData.element.parentNode;
    if (parentElement) {
        let insertPosition = reflistData.element;
        // If the reflist is preceded by a floated element, insert before that.
        // Note: On jawiki, there is a {{脚注ヘルプ}} that often floats right before the reflist.
        if (insertPosition.previousElementSibling && window.getComputedStyle(insertPosition.previousElementSibling).float !== 'none') {
            insertPosition = insertPosition.previousElementSibling;
        }
        if (insertPosition.previousElementSibling && insertPosition.previousElementSibling.classList.contains('cite-unseen-dashboard')) {
            return; // Dashboard already exists (duplication)
        }
        parentElement.insertBefore(dashboard.div, insertPosition);
    }
    updateDashboardCategories(dashboard, reflistCategoryCounts);
}
