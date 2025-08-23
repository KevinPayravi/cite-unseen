mw.util.addCSS(`
  /* ==========================================================================
     DASHBOARD COMPONENTS
     ========================================================================== */

  /* Dashboard container */
  .cite-unseen-dashboard {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    margin-bottom: 1em;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 0.8em;
    text-align: center;
  }

  /* Dashboard header */
  .cite-unseen-dashboard-header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 0.5em;
  }

  /* Dashboard total counter */
  .cite-unseen-dashboard-total {
    text-align: left;
    font-weight: bold;
  }

  /* Dashboard categories container */
  .cite-unseen-dashboard-cats {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5em 1em;
    text-align: center;
  }

  /* Dashboard category item */
  .cite-unseen-category-item {
    padding: 2px 4px;
    border: 1px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .cite-unseen-category-item:hover:not(.cite-unseen-filter-selected) {
    border-color: rgba(0, 123, 255, 0.2);
    background-color: rgba(0, 123, 255, 0.05);
  }

  /* Dashboard filter selection styling */
  .cite-unseen-filter-selected {
    position: relative;
    padding: 2px 4px;
    border: 2px solid #007bff;
    border-radius: 4px;
    background-color: rgba(0, 123, 255, 0.15);
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.3);
  }

  .cite-unseen-filter-selected img,
  .cite-unseen-filter-selected span {
    font-weight: bold;
  }

  .cite-unseen-filter-selected:hover {
    border-color: #0056b3;
    background-color: rgba(0, 123, 255, 0.2);
  }

  /* ==========================================================================
     BUTTONS AND LINKS
     ========================================================================== */

  /* Base button styling */
  .cite-unseen-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    margin-bottom: 0.5em;
    padding: 0 0.5em;
    border-radius: 5px;
    font-size: 0.8em;
    font-family: inherit;
    background-color: #f8f9fa;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .cite-unseen-button:hover {
    border-color: #a2a9b1;
    background-color: #e8e9ea;
  }

  .cite-unseen-button span {
    font-weight: 500;
  }

  .cite-unseen-button.suggestions-active {
    border-color: #28a745;
    color: #155724;
    background-color: #d4edda;
  }

  /* Clear all button styling */
  .cite-unseen-clear-all {
    margin-left: 10px;
    padding: 3px 8px;
    border: 1px solid #dc3545;
    border-radius: 3px;
    font-size: 0.75em;
    color: white;
    background: #dc3545;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .cite-unseen-clear-all:hover {
    border-color: #bd2130;
    background: #c82333;
    transform: translateY(-1px);
  }

  /* Clear all button in header styling */
  .cite-unseen-clear-all-header {
    padding: 2px 6px;
    border: 1px solid transparent;
    border-radius: 3px;
    font-size: 0.9em;
    color: #dc3545;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .cite-unseen-clear-all-header:hover {
    border-color: rgba(220, 53, 69, 0.2);
    color: #c82333;
    text-decoration: underline;
    background-color: rgba(220, 53, 69, 0.1);
  }

  /* Edit-style link styling */
  .cite-unseen-edit-style {
    color: #0645ad;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .cite-unseen-edit-style:hover {
    text-decoration: underline;
  }

  .cite-unseen-edit-style:visited {
    color: #0645ad;
  }

  /* Suggestions link states */
  .cite-unseen-suggestions-active {
    font-weight: bold;
    color: #28a745 !important;
  }

  .cite-unseen-suggestions-default {
    font-weight: normal;
    color: #0645ad;
  }

  /* ==========================================================================
     ICONS AND VISUAL ELEMENTS
     ========================================================================== */

  /* Citation icon styling */
  .cite-unseen-icon {
    width: 17px;
    height: 17px;
    max-width: 17px;
    object-fit: contain;
  }

  .cite-unseen-icon-link {
    display: contents;
  }

  /* Icons container */
  .cite-unseen-icons {
    display: inline-flex;
    gap: 0 5px;
    padding-right: 5px;
    vertical-align: middle;
  }

  /* Category icon styling */
  .cite-unseen-category-icon {
    max-height: 18px;
  }

  /* Suggestion plus sign */
  .cite-unseen-suggestion-plus {
    float: right;
    margin-top: .2em;
    font-size: 14px;
    line-height: 1;
    color: #28a745;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .cite-unseen-suggestion-plus:hover {
    transform: scale(1.2);
  }

  .cite-unseen-suggestion-plus:not(:hover) {
    transform: scale(1);
  }

  /* ==========================================================================
     FILTERING AND TRANSITIONS
     ========================================================================== */

  /* Citation container transitions */
  .references li, .reflist li {
    transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
  }

  .cite-unseen-filtered-out {
    opacity: 0;
    transform: scale(0.95);
  }

  /* Dashboard category hover effects */
  [data-category] {
    position: relative;
    border: 1px solid transparent;
    transition: all 0.2s ease-in-out;
  }

  [data-category]:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  /* ==========================================================================
     VISIBILITY AND LAYOUT
     ========================================================================== */

  /* Hidden/visible element states */
  .cite-unseen-hidden {
    display: none;
  }

  .cite-unseen-visible {
    display: inline-block;
  }

  /* Clear All header button visibility */
  .cite-unseen-clear-all-header.cite-unseen-hidden {
    display: none;
  }

  .cite-unseen-clear-all-header.cite-unseen-visible {
    display: inline;
  }

  /* List item visibility */
  .cite-unseen-list-hidden {
    display: none !important;
  }

  /* Finished loading marker */
  .cite-unseen-finished-loading {
    display: none;
  }

  /* ==========================================================================
     SPACING AND LAYOUT
     ========================================================================== */

  /* Section spacing */
  .cite-unseen-section {
    white-space: nowrap;
  }

  /* Edit section margin */
  .cite-unseen-edit-section {
    margin-right: 0.5em;
  }

  /* Category text spacing */
  .cite-unseen-category-text {
    padding-left: 5px;
  }

  /* Codex tabs content padding */
  .cite-unseen-dialog .cdx-tabs__content {
    padding-top: 16px;
  }

  /* ==========================================================================
     SETTINGS DIALOG STYLES
     ========================================================================== */

  /* Dialog header layout */
  .cite-unseen-dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .cite-unseen-dialog-header > span {
    font-size: 1.2em;
    font-weight: 600;
  }

  /* Documentation link */
  .cite-unseen-dialog-docs-link {
    font-size: 14px;
    font-weight: 500;
    color: #0645ad;
    text-decoration: none;
  }

  /* Tab guidance boxes */
  .cite-unseen-tab-guidance {
    margin-bottom: 20px;
    padding: 12px !important;
    border: 1px solid #eaecf0;
    border-radius: 4px;
    font-size: 0.9em;
    color: #54595d;
    background: #f8f9fa;
  }

  /* Category item containers */
  .cite-unseen-category-container {
    margin: 10px 0;
  }

  .cite-unseen-domain-category-container {
    margin: 15px 0;
  }

  /* Category labels */
  .cite-unseen-category-label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  /* Target selection section */
  .cite-unseen-target-section {
    margin-top: 20px;
    padding-top: 16px;
  }

  .cite-unseen-target-controls {
    display: flex;
    align-items: center;
    gap: 1em;
    font-size: 14px;
  }

  .cite-unseen-target-label {
    font-weight: 600;
    color: #54595d;
  }

  .cite-unseen-radio-option {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }

  .cite-unseen-radio-option input[type="radio"] {
    margin: 0;
  }

  /* Loading text styling */
  .cite-unseen-loading-text {
    font-weight: normal;
    color: #72777d;
  }

  /* ==========================================================================
     SUGGESTION DIALOG STYLES
     ========================================================================== */

  /* Form sections */
  .cite-unseen-form-section {
    margin-bottom: 20px;
  }

  /* Input labels */
  .cite-unseen-input-label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .cite-unseen-checkbox-label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
  }

  /* Full width input */
  .cite-unseen-full-width-input {
    width: 100%;
  }

  /* Category grid */
  .cite-unseen-category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 8px;
  }

  /* Custom edit section divider for Cite Unseen buttons */
  .cite-unseen-editsection-divider {
    color: #54595d;
  }
`);