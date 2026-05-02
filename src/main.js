import { initializeConvByVar } from './i18n.js';
import {
    importCustomRules,
    initializeCategoryDefaults
} from './config.js';
import { loadCategorizedRules } from './citations/sources.js';
import { findCitations, getRefs, getReflists } from './citations/parser.js';
import dashboardStyles from './ui/dashboard.css';
import dialogStyles from './ui/dialog.css';
import iconsStyles from './ui/icons.css';
import reflistButtonsStyles from './ui/reflistButtons.css';
import settingsDialogStyles from './ui/settingsDialog.css';
import suggestionDialogStyles from './ui/suggestionDialog.css';
import { addIcons } from './ui/icons.js';
import { createDashboardForReflist } from './ui/dashboard.js';
import { createButtons } from './ui/reflistButtons.js';

// ===============================
// DATA LOADING AND CITATION PROCESSING
// ===============================

/**
 * Inject bundled CSS styles.
 */
function injectStyles() {
    if (document.getElementById('cite-unseen-bundled-styles')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'cite-unseen-bundled-styles';
    style.type = 'text/css';
    style.textContent = [
        dashboardStyles,
        dialogStyles,
        iconsStyles,
        reflistButtonsStyles,
        settingsDialogStyles,
        suggestionDialogStyles
    ].join('\n');
    document.head.appendChild(style);
}

/**
 * Import dependencies and categorized rules.
 * This function injects styles, initializes i18n, and loads source categorization data.
 * @returns {Promise<Record<string, Object[]>>}
 */
async function importDependencies() {
    injectStyles();
    if (!window.jschardet) {
        await mw.loader.getScript('//gitlab-content.toolforge.org/kevinpayravi/jschardet/-/raw/main/dist/jschardet.min.js?mime=text/javascript');
    }
    await initializeConvByVar();
    return await loadCategorizedRules();
}

// ===============================
// INITIALIZATION
// ===============================

function init() {
    // Singleton
    if (window._citeUnseenInitialized) {
        return;
    }
    window._citeUnseenInitialized = true;

    console.time('[Cite Unseen] Dependency runtime');

    // Import source categorization data
    importDependencies().then(function () {
        initializeCategoryDefaults();
        // Import user custom rules
        importCustomRules().then(function () {
            console.timeEnd('[Cite Unseen] Dependency runtime');

            // Run on every wikipage.content hook. This is to support gadgets like QuickEdit.
            mw.hook('wikipage.content').add(function () {
                if (window.citeUnseenLoaded) {
                    return;
                }
                window.citeUnseenLoaded = true;
                console.time('[Cite Unseen] Render runtime');

                findCitations().then(function () {
                    if (getRefs().length === 0) {
                        console.timeEnd('[Cite Unseen] Render runtime');
                        return;
                    }

                    // Add icons to citations
                    addIcons();

                    for (const reflistData of getReflists()) {
                        if (window.cite_unseen_dashboard !== false) {
                            // Create dashboards for each reflist that has citations
                            createDashboardForReflist(reflistData);
                        }

                        // Create buttons for each reflist that has a dashboard
                        createButtons(reflistData);
                    }

                    console.timeEnd('[Cite Unseen] Render runtime');
                });
            });
        });
    });
}

init();
