// Cite Unseen - Bundled Version
// Repository: https://gitlab.wikimedia.org/kevinpayravi/cite-unseen
// Release: 2.0.3
// Timestamp: 2025-09-14T03:51:21.442Z

(function() {
    'use strict';
    
    // Inject CSS styles
    const css = `/* ==========================================================================
   DASHBOARD COMPONENTS
   ========================================================================== */

/* Dashboard container */
.cite-unseen-dashboard {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 0.8em;
    text-align: center;
}

/* Dashboard header */
.cite-unseen-dashboard-header {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-right: 1em;
}

/* Bold styling */
.cite-unseen-dashboard-total,
.cite-unseen-category-label,
.cite-unseen-input-label,
.cite-unseen-checkbox-label {
    font-weight: bold;
}

/* Dashboard total counter */
.cite-unseen-dashboard-total {
    text-align: left;
}

/* Dashboard categories container */
.cite-unseen-dashboard-cats {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0 0.5em;
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
    border: 1px solid #007bff;
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
    margin: 0 1em;
    font-size: 0.9em;
    color: #dc3545;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

.cite-unseen-clear-all-header:hover {
    text-decoration: underline;
}

/* Edit-style link styling */
.cite-unseen-edit-style {
    text-decoration: none;
    transition: all 0.2s ease;
}

.cite-unseen-edit-style:hover {
    text-decoration: underline;
}

/* Suggestions link states */
.cite-unseen-suggestions-active {
    font-weight: bold;
    color: #28a745 !important;
}

.cite-unseen-suggestions-default {
    font-weight: normal;
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
    width: 17px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.cite-unseen-suggestion-plus:hover {
    transform: scale(1.2);
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
.cite-unseen-hidden,
.cite-unseen-list-hidden,
.cite-unseen-finished-loading {
    display: none;
}

.cite-unseen-list-hidden {
    display: none !important;
}

.cite-unseen-visible {
    display: inline-block;
}

.cite-unseen-clear-all-header.cite-unseen-visible {
    display: inline;
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
}

.cite-unseen-checkbox-label {
    display: block;
    margin-bottom: 10px;
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
}`;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    document.head.appendChild(style);
    
    // Load i18n data
window.CiteUnseenI18n = {
    // Dashboard and UI
    "totalCitations": {
        "en": "Total ",
        "hant": "共 ",
        "hans": "共 ",
        "ja": "合計 "
    },
    "citationSingular": {
        "en": " citation",
        "hant": " 個來源",
        "hans": " 个来源",
        "ja": " 件の引用"
    },
    "citationPlural": {
        "en": " citations",
        "hant": " 個來源",
        "hans": " 个来源",
        "ja": " 件の引用"
    },
    "showing": {
        "en": "Showing ",
        "hant": "顯示 ",
        "hans": "显示 ",
        "ja": "表示中 "
    },
    "of": {
        "en": " of ",
        "hant": " / ",
        "hans": " / ",
        "ja": " / "
    },
    "filtersActive": {
        "en": " filters active",
        "hant": " 個篩選生效",
        "hans": " 个筛选生效",
        "ja": " つのフィルタが有効"
    },
    "clearAllFilters": {
        "en": "Clear All",
        "hant": "清除全部",
        "hans": "清除全部",
        "ja": "全てクリア"
    },
    "clearAllFiltersTooltip": {
        "en": "Clear all active filters",
        "hant": "清除所有活動篩選",
        "hans": "清除所有活动筛选",
        "ja": "全てのアクティブフィルタをクリア"
    },
    "filterToggleTooltip": {
        "en": "Click to toggle this category filter. You can select multiple categories. Press Escape to clear all filters.",
        "hant": "點擊以切換此類別篩選。您可以選擇多個類別。按 Escape 清除所有篩選。",
        "hans": "点击以切换此类别筛选。您可以选择多个类别。按 Escape 清除所有筛选。",
        "ja": "このカテゴリフィルタを切り替えるにはクリックしてください。複数のカテゴリを選択できます。Escape キーで全てのフィルタをクリアします。"
    },
    // Settings button and dialog
    "settingsButton": {
        "en": "Cite Unseen Settings",
        "hant": "Cite Unseen 設定",
        "hans": "Cite Unseen 设置",
        "ja": "Cite Unseen 設定"
    },
    "settingsButtonTooltip": {
        "en": "Configure Cite Unseen settings.",
        "hant": "設定 Cite Unseen 設定。",
        "hans": "配置 Cite Unseen 设置。",
        "ja": "Cite Unseen 設定。"
    },
    "settingsDialogTitle": {
        "en": "Cite Unseen Settings",
        "hant": "Cite Unseen 設定",
        "hans": "Cite Unseen 设置",
        "ja": "Cite Unseen 設定"
    },
    "documentationLink": {
        "en": "Documentation",
        "hant": "幫助文檔",
        "hans": "帮助文档",
        "ja": "ドキュメント"
    },
    "viewSettingsFrom": {
        "en": "View settings from:",
        "hant": "檢視設定：",
        "hans": "检视设置：",
        "ja": "設定を表示："
    },
    "loading": {
        "en": "Loading...",
        "hant": "載入中……",
        "hans": "加载中……",
        "ja": "読み込み中..."
    },
    "metaWikiGlobal": {
        "en": "Meta-Wiki (global)",
        "hant": "元維基 (全域)",
        "hans": "元维基 (全域)",
        "ja": "メタウィキ (グローバル)"
    },
    "local": {
        "en": "local",
        "hant": "本地",
        "hans": "本地",
        "ja": "ローカル"
    },
    "localSettingGuidance": {
        "en": "Local wiki settings override global settings.",
        "hant": "本地維基設定會覆蓋全域設定。",
        "hans": "本地维基设置会覆盖全域设置。",
        "ja": "ローカルウィキの設定はグローバル設定を上書きします。"
    },
    // Dialog tabs
    "tabGeneral": {
        "en": "General",
        "hant": "一般",
        "hans": "常规",
        "ja": "全般"
    },
    "tabCategories": {
        "en": "Categories",
        "hant": "類別",
        "hans": "类别",
        "ja": "カテゴリ"
    },
    "tabIgnoreDomains": {
        "en": "Ignore Domains",
        "hant": "忽略網域",
        "hans": "忽略域名",
        "ja": "ドメインを無視"
    },
    "tabAdditionalDomains": {
        "en": "Additional Domains",
        "hant": "額外網域",
        "hans": "额外域名",
        "ja": "追加ドメイン"
    },
    "tabAdditionalStrings": {
        "en": "Additional URL Strings",
        "hant": "額外網址字串",
        "hans": "额外网址字符串",
        "ja": "追加URL文字列"
    },
    // Tab guidance text
    "categoriesTabGuidance": {
        "en": "Enable or disable specific categories of citations. Disabled categories will not show icons or appear in the dashboard.",
        "hant": "啟用或停用特定引用類別。停用的類別將不會顯示圖示或出現在儀表板中。",
        "hans": "启用或禁用特定引用类别。禁用的类别将不会显示图标或出现在仪表板中。",
        "ja": "特定の引用カテゴリを有効または無効にします。無効にしたカテゴリはアイコンが表示されず、ダッシュボードにも表示されません。"
    },
    "ignoreDomainsTabGuidance": {
        "en": "Enter domains to exclude from each category. Sources from these domains will not be marked with the corresponding category icon. Enter one domain per line in the format 'example.com'.",
        "hant": "輸入要從各類別中排除的網域。來自這些網域的來源將不會標記對應的類別圖示。每行輸入一個網域，格式為 'example.com'。",
        "hans": "输入要从各类别中排除的域名。来自这些域名的来源将不会标记对应的类别图标。每行输入一个域名，格式为 'example.com'。",
        "ja": "各カテゴリから除外するドメインを入力します。これらのドメインからの情報源には対応するカテゴリアイコンが表示されません。1行に1つのドメインを 'example.com' の形式で入力してください。"
    },
    "additionalDomainsTabGuidance": {
        "en": "Add custom domains to include in each category. Sources from these domains will be marked with the corresponding category icon. Enter one domain per line in the format 'example.com'.",
        "hant": "新增要包含在各類別中的自訂網域。來自這些網域的來源將標記對應的類別圖示。每行輸入一個網域，格式為 'example.com'。",
        "hans": "添加要包含在各类别中的自定义域名。来自这些域名的来源将标记对应的类别图标。每行输入一个域名，格式为 'example.com'。",
        "ja": "各カテゴリに含めるカスタムドメインを追加します。これらのドメインからの情報源には対応するカテゴリアイコンが表示されます。1行に1つのドメインを 'example.com' の形式で入力してください。"
    },
    "additionalStringsTabGuidance": {
        "en": "Add custom URL patterns to include in each category. Sources containing these URL patterns will be marked with the corresponding category icon. Enter one pattern per line (e.g., '/search?q=', '/article/', '?page=news').",
        "hant": "新增要包含在各類別中的自訂網址模式。包含這些網址模式的來源將標記對應的類別圖示。每行輸入一個模式（例如 '/search?q='、'/article/'、'?page=news'）。",
        "hans": "添加要包含在各类别中的自定义网址模式。包含这些网址模式的来源将标记对应的类别图标。每行输入一个模式（例如 '/search?q='、'/article/'、'?page=news'）。",
        "ja": "各カテゴリに含めるカスタムURLパターンを追加します。これらのURLパターンを含む情報源には対応するカテゴリアイコンが表示されます。1行に1つのパターンを入力してください（例：'/search?q='、'/article/'、'?page=news'）。"
    },
    // Dialog content
    "enableDisableCategories": {
        "en": "Enable/Disable Categories",
        "hant": "啟用/停用類別",
        "hans": "启用/禁用类别",
        "ja": "カテゴリの有効/無効"
    },
    "showDashboard": {
        "en": "Show dashboard above reflists",
        "hant": "在參考文獻區段上方顯示儀表板",
        "hans": "在参考文献区段上方显示仪表板",
        "ja": "参考文献セクションの上にダッシュボードを表示"
    },
    "showSuggestionsButton": {
        "en": "Show suggestions button",
        "hant": "顯示建議按鈕",
        "hans": "显示建议按钮",
        "ja": "提案ボタンを表示"
    },
    "domainsToIgnore": {
        "en": "Domains to Ignore (one per line)",
        "hant": "要忽略的網域（每行一個）",
        "hans": "要忽略的域名（每行一个）",
        "ja": "無視するドメイン（1行に1つ）"
    },
    "additionalDomains": {
        "en": "Additional Domains (one per line)",
        "hant": "額外網域（每行一個）",
        "hans": "额外域名（每行一个）",
        "ja": "追加ドメイン（1行に1つ）"
    },
    "additionalUrlStrings": {
        "en": "Additional URL Strings (one per line)",
        "hant": "額外網址字串（每行一個）",
        "hans": "额外网址字符串（每行一个）",
        "ja": "追加URL文字列（1行に1つ）"
    },
    // Dialog buttons
    "save": {
        "en": "Save",
        "hant": "儲存",
        "hans": "保存",
        "ja": "保存"
    },
    "cancel": {
        "en": "Cancel",
        "hant": "取消",
        "hans": "取消",
        "ja": "キャンセル"
    },
    "saving": {
        "en": "Saving...",
        "hant": "儲存中……",
        "hans": "保存中……",
        "ja": "保存中..."
    },
    // Success and error messages
    "settingsSavedSuccess": {
        "en": "Settings saved successfully! Reload the page to apply changes?",
        "hant": "設定已成功儲存！重新載入頁面以套用變更？",
        "hans": "设置已成功保存！重新加载页面以应用更改？",
        "ja": "設定が保存されました！変更を適用するためにページを再読み込みしますか？"
    },
    "settingsSaveError": {
        "en": "Error saving settings: ",
        "hant": "儲存設定時發生錯誤：",
        "hans": "保存设置时出错：",
        "ja": "設定の保存中にエラーが発生しました："
    },
    "dialogLoadError": {
        "en": "Failed to load dialog. Please try again.",
        "hant": "載入對話方塊失敗。請重試。",
        "hans": "加载对话框失败。请重试。",
        "ja": "ダイアログの読み込みに失敗しました。もう一度お試しください。"
    },
    // Citation tooltips and labels
    "citationTooltipPrefix": {
        "en": "From ",
        "hant": "來自 ",
        "hans": "来自 ",
        "ja": "出典 "
    },
    "citationTooltipSuffix": {
        "en": ": ",
        "hant": "：",
        "hans": "：",
        "ja": "："
    },
    "citationTooltipAction": {
        "en": " Click the icon to open the checklist page to view details.",
        "hant": " 點擊圖示可打開檢查表頁面以查看詳情。",
        "hans": " 点击图标可打开检查表页面以查看详情。",
        "ja": " アイコンをクリックすると、チェックリストページを開いて詳細を確認できます。"
    },
    // Categorization suggestions
    "suggestionsToggleButton": {
        "en": "Suggest Categories",
        "hant": "建議分類",
        "hans": "建议分类",
        "ja": "分類を提案"
    },
    "suggestionsToggleTooltip": {
        "en": "Enable suggestion mode to propose categorization for citations",
        "hant": "啟用建議模式以為引用提議分類",
        "hans": "启用建议模式以为引用提议分类",
        "ja": "引用の分類を提案するための提案モードを有効にする"
    },
    "suggestCategorization": {
        "en": "Suggest categorization for this citation",
        "hant": "為此引用建議分類",
        "hans": "为此引用建议分类",
        "ja": "この引用の分類を提案"
    },
    "suggestionDialogTitle": {
        "en": "Suggest Categorization",
        "hant": "建議分類",
        "hans": "建议分类",
        "ja": "分類の提案"
    },
    "suggestionsDialogGuidance": {
        "en": "Select one or more categories for this citation and optionally provide a comment. A new tab will open with a pre-filled edit form on Meta Wiki where you can submit your suggestion for review.",
        "hant": "為此引用選擇一或多個類別，並可選擇性地提供意見。將開啟一個新分頁，其中包含 Meta Wiki 上預填的編輯表單，您可以在此提交建議供社群審查。",
        "hans": "为此引用选择一个或多个类别，并可选择性地提供意见。将打开一个新标签页，其中包含 Meta Wiki 上预填的编辑表单，您可以在此提交建议供社区审查。",
        "ja": "この引用に対して1つ以上のカテゴリを選択し、オプションでコメントを提供してください。Meta Wikiの事前入力された編集フォームで新しいタブが開き、コミュニティレビューのために提案を提出できます。"
    },
    "sourceUrl": {
        "en": "Source URL",
        "hant": "來源網址",
        "hans": "来源网址",
        "ja": "ソースURL"
    },
    "suggestedCategories": {
        "en": "Suggested Categories",
        "hant": "建議類別",
        "hans": "建议类别",
        "ja": "提案カテゴリ"
    },
    "selectAtLeastOneCategory": {
        "en": "Please select at least one category",
        "hant": "請至少選擇一個類別",
        "hans": "请至少选择一个类别",
        "ja": "少なくとも1つのカテゴリを選択してください"
    },
    "optionalComment": {
        "en": "Optional Comment",
        "hant": "可選意見",
        "hans": "可选意见",
        "ja": "オプションコメント"
    },
    "commentPlaceholder": {
        "en": "Additional information about why this categorization is appropriate...",
        "hant": "關於為何此分類合適的額外資訊……",
        "hans": "关于为何此分类合适的额外信息……",
        "ja": "この分類が適切である理由についての追加情報..."
    },
    "suggestionsDialogReliabilityGuidance": {
        "en": "For reliability categories (blacklisted, deprecated, generally reliable, generally unreliable, marginally reliable, no consensus), please seek the opportunity to reach consensus on one of the following project pages. The reliability categories are updated regularly based on community consensus documented on these pages.",
        "hant": "對於可靠性類別（列入黑名單、應停用、通常可靠、通常不可靠、半可靠、無共識），請尋求在以下專案頁面上達成共識的機會。可靠性類別會根據這些頁面上記錄的社群共識定期更新。",
        "hans": "对于可靠性类别（列入黑名单、应停用、通常可靠、通常不可靠、半可靠、无共识），请寻求在以下项目页面上达成共识的机会。可靠性类别会根据这些页面上记录的社区共识定期更新。",
        "ja": "信頼性カテゴリ（ブラックリスト入り、非推奨、通常信頼できる、通常信頼できない、限られた信頼性、コンセンサスなし）については、以下のプロジェクトページでコンセンサスに達する機会を探してください。これらのページに記録されたコミュニティのコンセンサスに基づいて、信頼性カテゴリは定期的に更新されます。"
    },
    "reliabilityProjects": {
        "en": "Reliability Project Pages",
        "hant": "可靠性專案頁面",
        "hans": "可靠性项目页面",
        "ja": "信頼性プロジェクトページ"
    },
    "submit": {
        "en": "Open Edit Form",
        "hant": "開啟編輯表單",
        "hans": "打开编辑表单",
        "ja": "編集フォームを開く"
    },
    "submitting": {
        "en": "Opening...",
        "hant": "開啟中……",
        "hans": "打开中……",
        "ja": "開いています..."
    },
    "suggestionSubmitted": {
        "en": "Edit form opened in new tab! The content should be pre-filled automatically. If not, the suggestion content has been copied to your clipboard.",
        "hant": "編輯表單已在新分頁中開啟！內容應自動預填。如未預填，建議內容已複製到您的剪貼簿。",
        "hans": "编辑表单已在新标签页中打开！内容应自动预填。如未预填，建议内容已复制到您的剪贴板。",
        "ja": "編集フォームが新しいタブで開かれました！内容は自動的に事前入力されるはずです。されていない場合は、提案内容がクリップボードにコピーされています。"
    },
    "suggestionSubmitError": {
        "en": "Error opening suggestion form: ",
        "hant": "開啟建議表單時發生錯誤：",
        "hans": "打开建议表单时出错：",
        "ja": "提案フォームを開く際にエラーが発生しました："
    },
    // Domain validation messages
    "domainsCorrectedMessage": {
        "en": "The following domains were automatically corrected:\n\n",
        "hant": "以下網域已自動修正：\n\n",
        "hans": "以下域名已自动修正：\n\n",
        "ja": "以下のドメインが自動修正されました：\n\n"
    },
    "invalidDomainFormatMessage": {
        "en": "Invalid domain format detected. Domains should be in format \"name.tld\" (e.g., example.com):\n\n",
        "hant": "偵測到無效的網域格式。網域應為 \"name.tld\" 格式（如 example.com）：\n\n",
        "hans": "检测到无效的域名格式。域名应为 \"name.tld\" 格式（如 example.com）：\n\n",
        "ja": "無効なドメイン形式が検出されました。ドメインは \"name.tld\" 形式（例：example.com）である必要があります：\n\n"
    },
    // Category labels and hints
    "categoryLabels": {
        "advocacy": {
            "en": "advocacy",
            "hant": "宣傳機構",
            "hans": "宣传机构",
            "ja": "アドボカシー"
        },
        "blogs": {
            "en": "blog post(s)",
            "hant": "部落格",
            "hans": "博客",
            "ja": "ブログ"
        },
        "books": {
            "en": "books",
            "hant": "書刊",
            "hans": "书刊",
            "ja": "出版物"
        },
        "community": {
            "en": "community",
            "hant": "社群新聞",
            "hans": "社群新闻",
            "ja": "コミュニティ"
        },
        "editable": {
            "en": "editable",
            "hant": "可編輯",
            "hans": "可编辑",
            "ja": "編集可能"
        },
        "government": {
            "en": "government",
            "hant": "政府",
            "hans": "政府",
            "ja": "政府"
        },
        "news": {
            "en": "news",
            "hant": "新聞",
            "hans": "新闻",
            "ja": "ニュース"
        },
        "opinions": {
            "en": "opinion piece(s)",
            "hant": "觀點",
            "hans": "观点",
            "ja": "意見"
        },
        "predatory": {
            "en": "predatory journal(s)",
            "hant": "掠奪性期刊",
            "hans": "掠夺性期刊",
            "ja": "ハゲタカジャーナル"
        },
        "press": {
            "en": "press release(s)",
            "hant": "新聞稿",
            "hans": "新闻稿",
            "ja": "プレスリリース"
        },
        "satire": {
            "en": "satirical",
            "hant": "幽默",
            "hans": "幽默",
            "ja": "風刺"
        },
        "social": {
            "en": "social media",
            "hant": "社群媒體",
            "hans": "社交媒体",
            "ja": "ソーシャルメディア"
        },
        "sponsored": {
            "en": "sponsored",
            "hant": "宣傳稿",
            "hans": "宣传稿",
            "ja": "スポンサー付き"
        },
        "tabloids": {
            "en": "tabloid(s)",
            "hant": "小報",
            "hans": "小报",
            "ja": "タブロイド"
        },
        "tvPrograms": {
            "en": "TV program(s)",
            "hant": "電視節目",
            "hans": "电视节目",
            "ja": "テレビ番組"
        },
        "blacklisted": {
            "en": "blacklisted",
            "hant": "列入黑名單",
            "hans": "列入黑名单",
            "ja": "ブラックリスト入り"
        },
        "deprecated": {
            "en": "deprecated",
            "hant": "應停用",
            "hans": "应停用",
            "ja": "非推奨"
        },
        "generallyReliable": {
            "en": "generally reliable",
            "hant": "通常可靠",
            "hans": "通常可靠",
            "ja": "通常信頼できる"
        },
        "generallyUnreliable": {
            "en": "generally unreliable",
            "hant": "通常不可靠",
            "hans": "通常不可靠",
            "ja": "通常信頼できない"
        },
        "marginallyReliable": {
            "en": "marginally reliable",
            "hant": "半可靠",
            "hans": "半可靠",
            "ja": "限られた信頼性"
        },
        "multi": {
            "en": "no consensus",
            "hant": "無共識",
            "hans": "无共识",
            "ja": "コンセンサスなし"
        },
        "unknown": {
            "en": "unknown links",
            "hant": "未知連結",
            "hans": "未知链接",
            "ja": "不明なリンク"
        }
    },
    "categoryHints": {
        "advocacy": {
            "en": "This source is an advocacy organization.",
            "hant": "此來源為宣傳機構。",
            "hans": "此来源为宣传机构。",
            "ja": "この情報源はアドボカシー組織です。"
        },
        "blogs": {
            "en": "This source is a blog post.",
            "hant": "此來源為部落格文章。",
            "hans": "此来源为博客文章。",
            "ja": "この情報源はブログ記事です。"
        },
        "books": {
            "en": "This source is a publication such as a book, journal, or other printed material.",
            "hant": "此來源為出版書籍、期刊或其他出版物。",
            "hans": "此来源为出版书籍、期刊或其他出版物。",
            "ja": "この情報源は書籍、ジャーナル、またはその他の印刷物などの出版物です。"
        },
        "community": {
            "en": "This source is community-created news.",
            "hant": "此來源為社群創作的新聞。",
            "hans": "此来源为社群创作的新闻。",
            "ja": "この情報源はコミュニティが作成したニュースです。"
        },
        "editable": {
            "en": "This source is editable by the community (e.g., a wiki or database).",
            "hant": "此來源可由社群編輯（例如 Wiki 或資料庫）。",
            "hans": "此来源可由社群编辑（例如 Wiki 或数据库）。",
            "ja": "この情報源はコミュニティによって編集可能です（例：ウィキやデータベース）。"
        },
        "government": {
            "en": "This source is identified as a state-owned or state-run media, or a government source.",
            "hant": "此來源已被識別為國有或國營媒體，或為政府來源。",
            "hans": "此来源已被识别为国有或国营媒体，或为政府来源。",
            "ja": "この情報源は国有または国営メディア、または政府の情報源として識別されています。"
        },
        "news": {
            "en": "This source is a news article from a reputable news organization.",
            "hant": "此來源為來自知名新聞機構的新聞文章。",
            "hans": "此来源为来自知名新闻机构的新闻文章。",
            "ja": "この情報源は信頼できるニュース組織からのニュース記事です。"
        },
        "opinions": {
            "en": "This source is an opinion piece.",
            "hant": "此來源為觀點文章。",
            "hans": "此来源为观点文章。",
            "ja": "この情報源は意見記事です。"
        },
        "predatory": {
            "en": "This source is from a predatory journal.",
            "hant": "此來源來自掠奪性期刊。",
            "hans": "此来源来自掠夺性期刊。",
            "ja": "この情報源はハゲタカジャーナルからのものです。"
        },
        "press": {
            "en": "This source is a press release.",
            "hant": "此來源為新聞稿。",
            "hans": "此来源为新闻稿。",
            "ja": "この情報源はプレスリリースです。"
        },
        "satire": {
            "en": "This source publishes satirical or parody content.",
            "hant": "此來源發表諷刺、惡搞內容。",
            "hans": "此来源发表讽刺、恶搞内容。",
            "ja": "この情報源は風刺やパロディのコンテンツを公開しています。"
        },
        "social": {
            "en": "This source is a social media website, possibly a social media post.",
            "hant": "此來源為社群媒體網站，可能是社群媒體貼文。",
            "hans": "此来源为社交媒体网站，可能是社交媒体贴文。",
            "ja": "この情報源はソーシャルメディアのウェブサイトで、ソーシャルメディアの投稿である可能性があります。"
        },
        "sponsored": {
            "en": "This source is a sponsored content or promotional material.",
            "hant": "此來源為商單、宣傳稿。",
            "hans": "此来源为商单、宣传稿。",
            "ja": "この情報源はスポンサー付きのコンテンツまたはプロモーション資料です。"
        },
        "tabloids": {
            "en": "This source is a tabloid or gossip news.",
            "hant": "此來源為小報或八卦新聞。",
            "hans": "此来源为小报或八卦新闻。",
            "ja": "この情報源はタブロイドまたはゴシップニュースです。"
        },
        "tvPrograms": {
            "en": "This source is a TV or radio program. Its reliability depends on the individual program.",
            "hant": "此來源為電視或廣播節目。其可靠性取決於個別節目。",
            "hans": "此来源为电视或广播节目。其可靠性取决于个别节目。",
            "ja": "この情報源はテレビまたはラジオ番組です。その信頼性は個々の番組によって異なります。"
        },
        "blacklisted": {
            "en": "This source has been blacklisted due to persistent abuse, typically in the form of spam external links.",
            "hant": "由於持續濫用（通常以垃圾外部連結的形式），此來源已被列入黑名單。",
            "hans": "由于持续滥用（通常以垃圾外部链接的形式），此来源已被列入黑名单。",
            "ja": "この情報源は、持続的な濫用（通常はスパム外部リンクの形で）によりブラックリスト入りしています。"
        },
        "deprecated": {
            "en": "This source is deprecated and should not be used. It may still be used for non-controversial self-descriptions or expert self-published content.",
            "hant": "此來源已棄用，不應使用。它仍可用於無爭議的自我描述，或來自專家的自行發表內容。",
            "hans": "此来源已弃用，不应使用。它仍可用于无争议的自我描述，或来自专家的自行发表内容。",
            "ja": "この情報源は非推奨であり、使用しないでください。無争議の自己記述や専門家による自己出版コンテンツには引き続き使用できます。"
        },
        "generallyReliable": {
            "en": "Editors generally agree that this source is reliable on topics in its area of expertise.",
            "hant": "編輯們一致認為此來源在其專業領域的主題上通常可靠。",
            "hans": "编辑们一致认为此来源在其专业领域的主题上通常可靠。",
            "ja": "編集者は一般的に、この情報源がその専門分野のトピックにおいて信頼できると考えています。"
        },
        "generallyUnreliable": {
            "en": "This source is generally considered unreliable by the community. It may still be used for non-controversial self-descriptions or expert self-published content.",
            "hant": "社群共識認為此來源通常不可靠。它仍可用於無爭議的自我描述，或來自專家的自行發表內容。",
            "hans": "社区共识认为此来源通常不可靠。它仍可用于无争议的自我描述，或来自专家的自行发表内容。",
            "ja": "この情報源はコミュニティによって通常信頼できないと考えられています。無争議の自己記述や専門家による自己出版コンテンツには引き続き使用できます。"
        },
        "marginallyReliable": {
            "en": "This source is marginally reliable. It may be necessary to review it on a case-by-case basis to determine its reliability in each context.",
            "hant": "此來源半可靠。可能有必要在每次使用該來源時逐個進行審查，視情境決定是否可靠。",
            "hans": "此来源半可靠。可能有必要在每次使用该来源时逐个进行审查，视情境决定是否可靠。",
            "ja": "この情報源は限られた信頼性があります。各コンテキストでの信頼性を判断するために、個別にレビューする必要があるかもしれません。"
        },
        "multi": {
            "en": "There is no consensus in the community about the reliability of this source. Its reliability may be affected by one or more factors, such as the subject area, author, or publication time.",
            "hant": "社群對此來源的可靠性沒有共識。其可靠性可能受到一個或多個因素影響（例如主題領域、作者或出版時間）。",
            "hans": "社区对此来源的可靠性没有共识。其可靠性可能受到一个或多个因素影响（例如主题领域、作者或出版时间）。",
            "ja": "この情報源の信頼性についてコミュニティ内でコンセンサスがありません。その信頼性は、主題領域、著者、または出版時間など、1つ以上の要因によって影響を受ける可能性があります。"
        },
        "unknown": {
            "en": "This source is not yet evaluated.",
            "hant": "此來源尚未評估。",
            "hans": "此来源尚未评估。",
            "ja": "この情報源はまだ評価されていません。"
        }
    }
};

    // Load sources data  
var CiteUnseenData = {
    _sourceRevisions: null, // Stores revision IDs fetched from cite-unseen-revids

    /**
     * Definition page names for source lists. Prefixed with "Meta:Cite Unseen/sources/".
     * @type {Array.<string>}
     * @constant
     */
    citeUnseenSources: [
        'medium',
        'type',
        'influence',
        'advocacy/1',
        'advocacy/2',
        'zhRSP',
        'zhVGS',
        'zhACGS',
        'enRSP',
        'enVGS',
        'enAMS',
        'enJAPANS',
        'enKOREAS',
        'enAS',
        'enNPPSG/1',
        'enNPPSG/2',
    ],

    /**
     * Revision IDs for source pages. When specified, these revision IDs will be used
     * instead of fetching the latest revision. Set to null to use latest revision.
     * @type {Promise<Object.<string, number>>}
     * @constant
     */
    citeUnseenSourceRevisions: async function () {
        const revidJsonUrl = 'https://gitlab-content.toolforge.org/kevinpayravi/cite-unseen-revids/-/raw/main/revids.json?mime=text/plain';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        try {
            const response = await fetch(revidJsonUrl, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch revision IDs: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Failed to fetch revision IDs: Request timed out after 5 seconds');
            }
            throw error;
        }
    },

    /**
     * Source lists grouped by reliability category.
     * @type {Array.<Array.<string>>}
     * @constant
     */
    citeUnseenChecklists: [
        [
            "generallyReliable", [
                ["enAMS", "enAmsGenerallyReliable"],
                ["enAS", "enAsGenerallyReliable"],
                ["enJAPANS", "enJapansGenerallyReliable"],
                ["enKOREAS", "enKoreasGenerallyReliable"],
                ["enNPPSG/2", "enNppsgGenerallyReliable"],
                ["enRSP", "enRspGenerallyReliable"],
                ["enVGS", "enVgsGenerallyReliable"],
                ["zhACGS", "zhAcgsGenerallyReliable"],
                ["zhRSP", "zhRspGenerallyReliable"],
                ["zhVGS", "zhVgsGenerallyReliable"]
            ],
        ], [
            "marginallyReliable", [
                ["enAMS", "enAmsMarginallyReliable"],
                ["enJAPANS", "enJapansMarginallyReliable"],
                ["enKOREAS", "enKoreasMarginallyReliable"],
                ["enRSP", "enRspMarginallyReliable"],
                ["enVGS", "enVgsMarginallyReliable"],
                ["zhACGS", "zhAcgsMarginallyReliable"],
                ["zhRSP", "zhRspMarginallyReliable"],
                ["zhVGS", "zhVgsMarginallyReliable"]
            ],
        ], [
            "generallyUnreliable", [
                ["enAMS", "enAmsGenerallyUnreliable"],
                ["enAS", "enAsGenerallyUnreliable"],
                ["enJAPANS", "enJapansGenerallyUnreliable"],
                ["enKOREAS", "enKoreasGenerallyUnreliable"],
                ["enNPPSG/1", "enNppsgGenerallyUnreliable"],
                ["enRSP", "enRspGenerallyUnreliable"],
                ["enVGS", "enVgsGenerallyUnreliable"],
                ["zhACGS", "zhAcgsGenerallyUnreliable"],
                ["zhRSP", "zhRspGenerallyUnreliable"],
                ["zhVGS", "zhVgsGenerallyUnreliable"]
            ],
        ], [
            "deprecated", [
                ["enRSP", "enRspDeprecated"],
                ["zhRSP", "zhRspDeprecated"]
            ],
        ], [
            "blacklisted", [
                ["enKOREAS", "enKoreasBlacklisted"],
                ["enRSP", "enRspBlacklisted"],
                ["zhRSP", "zhRspBlacklisted"]
            ],
        ], [
            "multi", [
                ["enNPPSG/2", "enNppsgMulti"],
                ["enRSP", "enRspMulti"],
                ["enVGS", "enVgsMulti"],
                ["zhACGS", "zhAcgsMulti"],
                ["zhRSP", "zhRspMulti"],
                ["zhVGS", "zhVgsMulti"]
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
     * Mapping from source page names to their corresponding categories.
     * This allows multiple source pages to map to a single category.
     *
     * @type {Object.<string, string>}
     * @constant
     */
    citeUnseenSourceToCategoryMapping: {
        'advocacy1': 'advocacy',
        'advocacy2': 'advocacy'
    },

    /**
     * Mapping from source names to their corresponding wiki page links.
     *
     * @type {Object.<string, string>}
     * @constant
     */
    citeUnseenSourceToPageMapping: {
        'enAS': 'en:Wikipedia:WikiProject Albums/Sources',
        'enAMS': 'en:Wikipedia:WikiProject Anime and manga/Online reliable sources',
        'enJAPANS': 'en:Wikipedia:WikiProject Japan/Reliable sources',
        'enKOREAS': 'en:Wikipedia:WikiProject Korea/Reliable sources',
        'enNPPSG/1': 'en:Wikipedia:New pages patrol source guide',
        'enNPPSG/2': 'en:Wikipedia:New pages patrol source guide',
        'enRSP': 'en:Wikipedia:Reliable sources/Perennial sources',
        'enVGS': 'en:Wikipedia:WikiProject Video games/Sources',
        'zhACGS': 'zh:维基专题:ACG/來源考量',
        'zhRSP': 'zh:维基百科:可靠来源/常见有争议来源列表',
        'zhVGS': 'zh:维基专题:电子游戏/来源考量'
    },

    /**
     * Resolve a source page name to its corresponding category.
     * If no mapping exists, returns the original page name.
     * @param {string} sourcePageName - The source page name to resolve.
     * @returns {string} The resolved category name.
     */
    resolveSourceToCategory: function (sourcePageName) {
        return this.citeUnseenSourceToCategoryMapping[sourcePageName] || sourcePageName;
    },

    /**
     * Get all source pages that map to a specific category.
     * @param {string} categoryName - The category name to find source pages for.
     * @returns {Array.<string>} Array of source page names that map to the category.
     */
    getSourcePagesForCategory: function (categoryName) {
        const sourcePages = [];
        for (const [sourcePage, category] of Object.entries(this.citeUnseenSourceToCategoryMapping)) {
            if (category === categoryName) {
                sourcePages.push(sourcePage);
            }
        }
        return sourcePages;
    },

    /**
     * Create API instance based on current wiki context.
     * @returns {mw.Api|mw.ForeignApi} The appropriate API instance.
     */
    createApiInstance: function() {
        if (mw.config.get('wgServer') === "//meta.wikimedia.org") {
            return new mw.Api({ userAgent: 'CiteUnseen' });
        } else {
            return new mw.ForeignApi("//meta.wikimedia.org/w/api.php", { userAgent: 'CiteUnseen' });
        }
    },

    /**
     * Process API response pages into fulltext string.
     * @param {Object} response - API response object.
     * @returns {string} Combined fulltext from all pages.
     */
    processApiResponse: function(response) {
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
     * Process fulltext into categorized rules.
     * @param {string} fulltext - The complete wikitext.
     * @returns {Object.<string, Object[]>} Categorized rules object.
     */
    processCategorizedRules: function(fulltext) {
        let sections = this.getSections(fulltext);
        let categorizedRules = {};
        for (const [cat, section] of Object.entries(sections)) {
            const entries = Array.from(section.matchAll(/{{\s*CULink\s*\|\s*([^}]+?)\s*}}/g), match => match[1]);
            const resolvedCat = this.resolveSourceToCategory(cat);
            if (!categorizedRules[resolvedCat]) {
                categorizedRules[resolvedCat] = [];
            }
            categorizedRules[resolvedCat].push(...entries.map(this.parseRuleTemplates).filter(Boolean));
        }
        return categorizedRules;
    },

    /**
     * Resolve a source name to its corresponding wiki page link.
     * If no mapping exists, returns null to use default linking behavior.
     * @param {string} sourceName - The source name to resolve.
     * @returns {string|null} The resolved wiki page link or null if no mapping exists.
     */
    resolveSourceToPageLink: function (sourceName) {
        return this.citeUnseenSourceToPageMapping[sourceName] || null;
    },

    /**
     * Get the full wikitext.
     * @returns {Promise<string>} A Promise containing the full wikitext.
     */
    getFullText: async function () {
        // Add 'Meta:Cite_Unseen/sources/' to the beginning each of the source names, then join them with '|'.
        let source_titles = this.citeUnseenSources.map(source => `Meta:Cite_Unseen/sources/${source}`).join('|');

        var api = this.createApiInstance();
        var response = await api.get({
            action: 'query', titles: source_titles, prop: 'revisions', rvslots: '*', rvprop: 'content', indexpageids: 1,
        });

        return this.processApiResponse(response);
    },

    /**
     * Get the full wikitext from specific revision IDs.
     * @param {Array.<number>} revisionIds - Array of revision IDs to fetch.
     * @returns {Promise<string>} A Promise containing the full wikitext.
     */
    getFullTextFromRevisions: async function (revisionIds) {
        var api = this.createApiInstance();

        var response = await api.get({
            action: 'query',
            revids: revisionIds.join('|'),
            prop: 'revisions',
            rvslots: '*',
            rvprop: 'content',
            indexpageids: 1,
        });

        return this.processApiResponse(response);
    },

    /**
     * Get categorized rules from specific revision IDs.
     * @param {Array.<number>} revisionIds - Array of revision IDs to fetch.
     * @returns {Promise<Object.<string, Object[]>>} An object containing categories and their corresponding rules.
     */
    getCategorizedRulesFromRevisions: async function (revisionIds) {
        const fulltext = await this.getFullTextFromRevisions(revisionIds);
        return this.processCategorizedRules(fulltext);
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
     * Get revision IDs for sources that have them specified.
     * @returns {Promise<Array.<number>>} Array of revision IDs to fetch, or empty array if none specified.
     */
    getSpecifiedRevisionIds: async function () {
        const revisionIds = [];
        try {
            if (this._sourceRevisions === null) {
                this._sourceRevisions = await this.citeUnseenSourceRevisions();
            }
            for (const source of this.citeUnseenSources) {
                const revisionId = this._sourceRevisions[source];
                if (revisionId !== null && revisionId !== undefined) {
                    revisionIds.push(revisionId);
                }
            }
        } catch (error) {
            // If call for revision IDs fails, return empty array
            console.warn('Failed to fetch revision IDs:', error.message);
            return [];
        }
        return revisionIds;
    },

    /**
     * Check if any sources have revision IDs specified.
     * @returns {Promise<boolean>} True if any sources have revision IDs, false otherwise.
     */
    hasSpecifiedRevisions: async function () {
        return (await this.getSpecifiedRevisionIds()).length > 0;
    },

    /**
     * Get categorized rules.
     * Uses specified revision IDs when available, otherwise fetches latest revisions.
     * @returns {Promise<Object.<string, Object[]>>} An object containing categories and their corresponding rules.
     */
    getCategorizedRules: async function () {
        // Check if we have any revision IDs specified
        const revisionIds = await this.getSpecifiedRevisionIds();

        if (revisionIds.length > 0) {
            // Use revision-specific method if any revision IDs are specified
            return await this.getCategorizedRulesFromRevisions(revisionIds);
        } else {
            // Fall back to latest revisions
            const fulltext = await this.getFullText();
            return this.processCategorizedRules(fulltext);
        }
    },

    /**
     * Default toggle settings for categories. Unstated categories will be default to true (CiteUnseen.init).
     * @type {Object.<string, boolean>}
     * @constant
     */
    citeUnseenCategories: {
        "unknown": true,
    },

    /**
     * Category data, icons, and counters in use.
     * Labels and hints are now externalized to CiteUnseenI18n for better internationalization.
     * @type {Object.<string, Object>}
     * @constant
     */
    citeUnseenCategoryData: {
        // Advocacy groups
        "advocacy": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAPCAMAAAA1b9QjAAAAbFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0Iv+qAAAAI3RSTlMA1A5E+vZW38mMJx7s2aOZjWdaQzoUCvHkyrmvhXx2bWBTMqn0tOoAAAB/SURBVBjTZc9XDoQwDARQZzc9lKVub/j+d8SMAIGYH8svsSXTLt1D7WFwzKctfAxD4hmx4camUiKB1zwjTWIYUeGXiERamt8v0kLyg7hl6v7+d5CGSl6ii4TN1H6l87YqM77WEIoihdT+pVlDepEce5tsvsILWVDyDrWW3xBkBEQGDke/jOMVAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Blog posts
        "blogs": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAclBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACa4vOeAAAAJXRSTlMA+/J3Bq43Mxb3x7OnnJl8Xkoc6ubLoVhNPCgj3dzDkI1ycVZUCH5LxQAAAJZJREFUGBkFwYVhAgEAALG84A51t9t/xSaG2/3DeQ0AVQ27ZwCqqnavAD9f+7uqxkcALI9D1QlYXme8LqpOoMb9E6ah+oWqtiv+hhqvqKrNmalaYL2a3qse2VVLME9DbVZehloAnob64FibtXk6XJiqi+fq7KG6mN9qz60OxurIqUYWtXVffbOsrj7rzst2PMysq5Wpxn9NeBK2TnaptgAAAABJRU5ErkJggg==",
            "count": 0,
        },

        // Book publications
        "books": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAMCAMAAACz+6aNAAAAWlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACLSV5RAAAAHXRSTlMAqt7QCRnpffrWSSry7cehoHVuRD0sJuLamGkfHurrquoAAABVSURBVAjXvYjJEYAgEMBWQO5bxHP7b1OBsQXzSSago5KSHAWq8NzRqIHnC1hN1lthGNwnBwKdgnoE/Q7D+ZdjlrWd5nY2wRGRZEz7aycUhKmjJB0RHg2VBO5eX4k3AAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Community-created news
        "community": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAMAAADH72RtAAAAaVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnbPKNAAAAInRSTlMAmWPM27eThIB/06+fjV0lD/r1yLuzqaRzTD8dmGpTUBYCKhLQsAAAAH1JREFUGNONi0kOAjEMBGMgCUy22VfW/v8jiU3EaQ5TUkvlkqz2qI3fRDYfapEAjCIDYEUM4NRc6aSBIOU9ufQCUKVhkq94JzIWmYWIHh+1gjnldSNbVOyobOz92jVZr1Jmc2b0sy2lyRN6XUp7K+XiuDD/wsfhstAPq3b5AqlTD1RMmHJ5AAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Community-maintained sources (editable)
        "editable": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAPCAMAAADeWG8gAAAAvVBMVEUAAABMTEw1NTUdHR0+Pj7o6Oj///8/Pz8pKSkuLi5TU1NXV1dcXFxiYmKMjIywsLDExMT///////9tbW0xMTFfX19KSkpFRUVUVFRMTExHR0dZWVlgYGBra2taWlp2dnaEhIRsbGxmZmZ8fHygoKCOjo6Dg4OqqqqXl5ekpKSmpqacnJyhoaG7u7unp6ezs7O7u7vHx8ft7e3///////8AAAAjIyMGBgZUVFRHR0cLCwtlZWVOTk4iIiIVFRWrycPlAAAANXRSTlMA9P7++R8F/v798+rm3rFcOwkC/v38+PHt7e3r6efi397e1My6uberoZOLh4Z9cnFZMSggDCg5MJMAAACOSURBVBgZXcGFEoJQAATAe6SUgt3dXUcZ//9ZMgYM7iJ1HRzxZ0L/jExJ2AuyiIwq0X+wqyFVHpF3Go11GT8r8sagTdonfLgyw4A9JuSlhoRn8lmlKPKtub8AM7JG2dUEP2KUAlbIrXoo8AsmdSmSCjFT2A31kDnAnFHdUBRFiJZl9R1nDHT8DfK8qYq8F7oKGQbJNCvvAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // State-affiliated or government sources
        "government": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAQAAABaOFzUAAAA2ElEQVQoz4XRPUoDURTF8d+MMG8gCpbRBWghlmLjIuwsrdyErY32U/mxA1MJCgpauAEFKzuLIJEQVFCCMo7FTGQSkngut3jnfzivuNS16MCTfQvGatmRvkKh0HdoaRiva8krPJjcqbUSz7oZgfW51ojMaNqxMfbzW8eeY7m2K5zL9NzJPHiRucSFtp8y3VTYwqMMJ+6xrTAPMQh/G5BIa14VSarnAIbKS4dbUiT/t4SRljC5JdS8KkLHt1jPJz684kunpBE27ZmkXWes6k45QNdK5N2caXr7BW+yUjtO1UbwAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // News articles
        "news": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAYFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD6T+iNAAAAH3RSTlMAupk7insrItNVS0O/F28fZWFF48uxSDIMCO+0oIAO/8GCqwAAAIBJREFUGNOdy9sSwiAMRdEDFGmQS6Gttd74/78UkXTGV9dDZrInQXK3RTCXAAhkjcPqgTtOA/LYELQCxuk5wJ8b3wpRGKK1dld1mE9B/ZpKKYZCCNtP8THGFxclpfS6jswFBy4X0dG/N1yS/FpW2ctjM50DcBXYHZq2VOTmWTD1Bls+BmmlzBpEAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Opinion pieces
        "opinions": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAMAAAD+MweGAAAAb1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABt6r1GAAAAJHRSTlMA+xH1Iph8OCYY3MWiLe/p1sq8lI53cGxiV0EM6rGwj2pNSjP1ocsVAAAAgUlEQVQIHV3BRQLCMABFwZ+m7q447/5nJC3dwIzizODYetYpA0yfbN5BjgHGV8qXzTcBdWyBISkaIBCQP4DWu84FUCmFIARugxljwOhpCUJ2U5IBRrqzhOyiDsdIfaiJXdfglNJbig1OFODkOiwXoLRA6+mU+E6RsuqXX636E0X6AFnuEKR6+rcNAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Predatory journals
        "predatory": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAMAAAAVBLyFAAAAmVBMVEUAAAC/AADAAADAAADAAAC/AAC+AAC/AAC/AAC/AAC/AADAAAC/AAC/AAC/AADAAAC/AADAAAC/AAC/AADEAAC/AADXYWHRS0vMOTnGHh7AAADAAAC+AAC/AAC/AADGAAC/AAD////XXFzHHx/++vr77u733NzQRETMNDTJJibDEBD99vb78PD55ubzzs7xyMjuurrSTEzBCQmtvS+6AAAAIHRSTlMApFWZXe5mRPU1085j39zWnol3Jw/49PPy8ObFloBsCQk/Lh0AAACMSURBVBjTVY7nDsIwDAYdoNCkaeliL6fpZvP+D0djBZHer9NZlj6QU+KUXc5HI7EEFs8NqYjCcO/56DNgMyAyDwnvnyDCd4td4aZlU96Ku1q7qX8qpeqdkwQ2Qxo9irZSpbpunBTo+qFf1dZNqHv8dOYxWRh4HqCBpqKduLLCgE+Iw3CXZBwseZr8/AvR2g1q3xyaTQAAAABJRU5ErkJggg==",
            "count": 0,
        },

        // Press releases
        "press": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAMAAAD+MweGAAAAPFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQLyYwAAAAE3RSTlMAzHczU/m4lm8wHL6timZBPQwdu570zwAAAFxJREFUCNetyDkOw0AMBEGS5p663f//q1eioUCxKhhgWi4lAanI7WBx94Xjep9ho46tbOcRnt4sOhEm/Zd1J+zrWVTVm4bmY6SatW6hN7MqGeZCKDNk+eYEt5T7D9g7DD/ysJyVAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Satirical or parody content
        "satire": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAARCAYAAAAG/yacAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wceCDI64ByhXQAAAPFJREFUKM+V0zFKQ0EQBuBvn4pWClaWYiF6Ck+Qy+Qi6VLkFNbpxEOYMoQQrCRqY0h8azML6+NJ4g/LMjP/zD/8y8IYLR4x0I9B1FuME3KH8IoXfOAc97iqCQnfcW9j0lmP0hcanCAXpTaSBduI2yAWtGiKUtMzfYfjnnwrlDadQq5OjQ1yUVg7DOt6jYwJbjDqKI0iP4l4l6piOkApI9XvtKucPIohuTIqFWNSceMfSmAVwXxPwzx4qwazSH7uaSr1GQwrM6Z/NEwrzjDhNLqvg/COJ7zhEg+4qFa8K5Nusei8T/csgteLZyzjaywj/oUf7bdVPf0Xy7cAAAAASUVORK5CYII=",
            "count": 0,
        },

        // Social media
        "social": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALNSURBVDhPjVNLSFRhFD7/f++MzIyZRrUxrUUR1JhE0QPaBBUIFW0KeiwqcvKZjxY9iEwoCFroOD7CFAJpUSatWriQEqGEICjLIkyamewlhOaM8/De//Td21VmUdgHwzn/Od//3XPOf4Yy0UAN8vCGBjcRCyf0X7DJp9d3LdFcsVa4BxCIMwlDCEowcVyQiFkW1JiAZaZfyE0Sk9eXbd5oGj6f0C0R3R3vhpnx+cx8K2jFFkPA37QzHtM74J4U1WuDOUkP/3CZ+vL20arYHwpROlSw1SSZ7akOP010rF6jDN7iq470OWkbpf7m3qShlcmUm3MFi2SmgAWDaC9ms9/y2TB3SMFH7UQmhJj26KkV0vJZsGYHgVhLfvFsqLBfCFHPRLWzoYI02D3MoiQeKhxKtq065FBxkV0sslxS6VKDii1mwcue97pUV8D4gLGP43cVgx7GUFNC48uzM+4nDhUQmOmcS7oNiGRUImvGUu7Kzy9A+A6hqLcqehMCLyGW9lZEh5ZdHJ92qOiGXFLqujRQCypZEEk2569Lhgpvw92O+Da0Mwr2cZyXJloLehLthXtsIoCnd5FhoB3NQCW00E4W65OQHGDmd9iZMAQGQX+FfZkgRQM4jzlUXBO6EppuXwZZWNtq+3XhqayKSC/m8AiXH3qrIuWK+Ba++txzLnrXUx7+ZPEsYPBZLE1NqmROBIT016K83U7ORtoQ9+bUXJvl/0zRoDLVJTvhoKa4KRdms1tzf7TXPuBvvo4vVxKpdnT2jSV/ufO61l6sM/7gESkoV5FiTQmFf5VCS160exaDfdY5UltmiwCi1B88BXsMgQLYlZ1vavIC/mA9Xu4aduQVisdlMgWTiTbi2K3H+SNT3Y3UqOZFFlC6MbhPCH6gmE5IKfqUUge73tb1O+m/YuFV5sG6OYHWfCj1Po4XFhP4JwKbmneVFrWUOMdFQPQbGOYih834xvIAAAAASUVORK5CYII=",
            "count": 0,
        },

        // Sponsored content
        "sponsored": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAASCAYAAAC9+TVUAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wceCRIMu+B6UQAAAUVJREFUOMuN079KXFEQx/HPVQwqEgIpU2yRzpSBFG7lK+QNtjeNQjqxCYivkCovkfRWQdhlCx9ALGyWgIWBsFl3b5o5MjneKw4Md5j5zu/8m8v/9gXXWGBc1caRvw6u0y7Rhq9SfNuTvyyNa0nkPL4tmtTwKgk0EWf+kR0HtIymVUfcBvdgTYrXA9rCi2iqbQ1/8Sfxj2yUzvyUj/qOcvRMgeJHtcAw3cU8tjyvmnK+3M0wi0wiuaie8gc+4meVL9wki+RC+X7GS7wJ5rSHe3idktxIc/Ia+3iLA9xhN9UL38A0CvfpXlp8iwU28ClEcr3wU2msVx2jfYUPGOBdD3fbhOJ6NfLwHnvYwTbO8LuDW8JNzza/YjMWGOB7z7Fv4CLNQVsBv2I651U+8xdw2POrL6phu+/hDsucnGDWAayS1wKz6PMP8f7HxLFPnyIAAAAASUVORK5CYII=",
            "count": 0,
        },

        // Tabloids
        "tabloids": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAe1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC9eBywAAAAKHRSTlMA33YN9+rLup5pZkU+8drRtKqTjF9aUyslHxsF4tXDwqujmYaBXBQIt6ZAsgAAAH1JREFUGBl1wVUWwjAABMBNUndXXPf+J4TIa39gBv9cCykVdmPIrxa7mloFvOE01DygnWFF1Dyl4jushVoNmQVwyuB88ZMkfQo4vS+jg+qG/ghrbkiKeE2zEEaa0zi9xg7alNMJYUXcZDAENw8YiUenmGAtcVX6IrgNK376AFE7D6Mmxn6bAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // TV programs
        "tvPrograms": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARAgMAAABGA69pAAAADFBMVEUAAACoqKgAAAA1NTWxW1e8AAAAAnRSTlMAWWQkJGgAAAA4SURBVAjXY2BgaGhgAIJGMPnoAIhUYwABayBmWrVqAQMD16pVKxgYNIAMILlqVRd+EqISogtqAgBQEBiFRNOi6QAAAABJRU5ErkJggg==",
            "count": 0,
        },

        // Reliability: Blacklisted
        "blacklisted": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAWlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////u7u7o6OgpKSkMDAy0tLT7+/v5+fl+fn58fHw5OTklJSUhISG1tbWsrKyjo6MkJCR7e3s8PDxKkGAPAAAACnRSTlMAvI4+GrPi4bSxfq7qvQAAAHZJREFUCNddj0sSwjAMQ/MtICexk/QDFO5/TXDpgol2b0a2JKPyLkbnzU/B4pANB03gLtIZk7LFO1WimhbY7x04PdacyzMxvHHotWAvWNsMZ664Uy7AlkkQTfzH22nedhQ1D680aEmNqGnQWWMWeTEuYSw5TPgAC+IHcILUzWIAAAAASUVORK5CYII=",
            "count": 0,
        },

        // Reliability: Deprecated
        "deprecated": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAq1BMVEUAAAAUBQUTBQWzJCT///+uIyOwIyOsIiJKEBBLDw9wFhZsFRVHDg67u7tgLS2OIiLLy8ttWVlkPj5kKyv6+vry8vLu7u7j4+Pc3NzX19e3t7eysrKdmJhpVFRhNzdWNDR6IyOhISHp6eno5+fY1tbDw8O6tbWqqamoqKiakJCQkJCQhYWKfX1lSkpYPj5aNTVEMjJnMDBcLy99KiqDKCimISGWICBAHBwsGRlV2YqAAAAAA3RSTlMAp597gGAlAAAAqklEQVQY02XQ1xKCMBAFUHE3BBUSlCLSsffe/v/LTLIjL9ynzJk7s5vt6fTdgY5rqTfBiNs6fGi1ACBFA8AUGWDAg2v4fRqiRvPxc9wXQORygGCTeOiNQYW7PYcBlLOpkccNmGNkQiKPJ7CV2Er8beZlxTkWbSdBxGi5OLz/nVLBPMXwAqpDsyLEFHEn9Syzj8wRVxhX7YoM7mtEv3oR0Na1EDUj6P69e58fVvYMNLFQgRAAAAAASUVORK5CYII=",
            "count": 0,
        },

        // Reliability: Generally reliable
        "generallyReliable": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAbFBMVEUAAAAsoCwsoSw+qD4toS0roCstoi0uoS4snyw8qDwtoC0toC0soCwuny4toC0toC3///8voi8toS0soCzo9egyozLp9enj8+PD5MORzZGOzI5GrEa/4r/e8N7M6Mxxv3FBqkH0+vTy+fLE5cSRPYNXAAAAEHRSTlMAsxr9vo4/5JD9wbw/PeaP9lvV4AAAAIVJREFUCNclzlsWgyAMBFBQRKu1TXgp+Gy7/z2WgfniHpKTEchzkHLQoqYZrWlbY1VT9OIYiELkHh55pZKVVd6zser8JKvFYEL985cznZAtfU+i3W8LPSR4+V8R+DZhuT1DGNY20nFvjoiSnYVQ+dAB7TyhRs8pyyXUgFUtOUGI7qTsZrz+IPgKG81qz+sAAAAASUVORK5CYII=",
            "count": 0,
        },

        // Reliability: Generally unreliable
        "generallyUnreliable": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAASFBMVEUAAADMAADMAADPAADMAADMAADMAADNAADMAADNAAD////MAAD99fXsnp7pj4/nhobib2/RGBjia2vojY3jcXHYPz/YPDzRGhqXVefLAAAACnRSTlMA8c8VVPOChINSyGF/kwAAAHJJREFUCNc9z9sSwyAIRVGQaFLAVs3t//+0gE3325pxnANYtKac00YQLXgftbaOS0hOZUuHmAlP2TkaSLDe+pZPUHuBdDA/bgly5b8rAhrDk6nxz/F46/rYvyIcHO1yIfmMMWdc8poje4uRJo+Kn1D8hC/MLAbL8liTMwAAAABJRU5ErkJggg==",
            "count": 0,
        },

        // Reliability: Marginally reliable
        "marginallyReliable": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAMAAAAR8Wy4AAAAjVBMVEUAAAD2eQD1eQD2eQD1eQD1eQD1eQD1eAD0eQD0eAD4egDycwD/gAD/cgD1egD1eQD1eQD1eQD1eQD2eQD2eQD0egD0eAD////4nUX1eQD2fgn3kSz3jCTj4N/96tf82LWYmJj7yJb7xI6Li4v5tG9ra2tZWVlISEj2hBT+9+/+9u7GxsbFxcVHR0dGRkYfNpgQAAAAF3RSTlMAu/lq7uDVenUuJBQJBMOvrZaUVFJHRoWjpJIAAAB/SURBVAgdVcEHFoIwEAXAJaEXu3429I71/sczKvJghiZS0oovhE9LW6V2tHDmuuYLzSI7ybLUjuhPcvEcCpY0CcwYrwGxGdDPXuXoe+TqQF+eaIGuA1rh0cdmvAKPO3AbDdKOXAFoGgAVn4hCK4FWltASKySX03iWskuOseK8AfKLCvyhOfkVAAAAAElFTkSuQmCC",
            "count": 0,
        },

        // Reliability: No consensus
        "multi": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAtFBMVEUAAAAJrd8gteIPsOAAqt0Aq90Aqt0Aqts4veUkt+IWsuAuuuMErN4FrN4ErN4Cq94Cq90Aqt0Aqt8Aqd4Aqt4AqtwApt8Zs+EEq94FrN0Dqt0Dq94AqdwAq90Aqd0Aqd4AqtkAqt8AgP////8Aqt1NxOj1/P74/f7m9/zb8/rE6/e86faq4/Sn4vOc3vKQ2vB70+5Xx+k+v+bs+fzk9vvU8fnO7/iW3PFozetYyOkktuIas+C+oCNVAAAAI3RSTlMA/fv7oJuWI/v7+/rh0MO4tXZGNScSC/vuzb6pjH9xTRsYAtfMWVAAAACbSURBVAjXJctXEsJQCEBRXmKipjd7F9J77Lr/fYnP+8HMGQC480Fz1noA/8Y2TV+9Qs5RajktMMuwXFgn5kq5JDFRnFwNFyCgEjtR16LDikLQFcS2QewHRHUHboxcevs8EScj8CRjemeSW0NySPhE+BBSxSwKHg+KADw15y2/3MUIAGaW2qR5nrTCnsPPGxKmKUhjySJf0/dj4L7guBKsqi+5hQAAAABJRU5ErkJggg==",
            "count": 0,
        },

        // Unknown
        "unknown": {
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJNSURBVDhPVVJNTxNRFJ33prCAdood6EIpi35YKjUsaGzqUjclRsrCXWHjD5CFphJYuBIo3UiiwQTDgoWkC2lNbGJioiEGIhBDFwLFNKGV8GG0KRlMEWbePO+dQmNPcpPzbs65Lzn3EqEOT2hLi/mOrusReHigdEKEbc7JgqLEPsCbowpRM1oscQ+l5DXQgM8nM7/fLnCQZbOHQj5fFoF/FkUaLZcf7VYdAEkac1ut8Z+BwCttdXVP5YCdnbJeKBwx5IuLBdXvf8kkabIoy/HL5zZOwPSlp2eGlUoVXVH+6pFIklmtkxwLOfYODo41n28a+vH3hg2mhFGwvPxDw+kjIx9Ze/szlkrl1HR6W0U+OvrJ+DmT+a6hVpImblBCeJ/LdYmFQg4RB9ntTWR8/JbQ3+81RSJXTb29br62tmdkEQ67aWtrEwRG71LIx9nV1YZ9A0NDQTIwcJ3iD8Xikba0tEtcLpuRJoRHOjtl4NwNRoExpmO/DoODb0l394wJ1kGGh2/W0q9qCcPJufX1Q4gew69HMHiFr6zcFzo6rIbx7EzjGxu/CSi30Phmf/+PmMnkmaE+RywWEhKJ26S5ubH2WzK5hQkTOJAFowERv/N4XjDYnZEeIhpNGXWBzc1fmsMxBeuYmDNMCLP5aRvEnHM6n7P5+W/a6amGy+dYJyeqPjubVdEEq/tqs01J6Pnv5MZkSk3TQO9ZLI3c65W5rnMhlyuRSkXFDOYaGoQHpdLjY9TXjBcwmxPXKOV9QOHI4bwJyXEuphXlYb6qQAjCP3DDM2e6XmppAAAAAElFTkSuQmCC",
            "count": 0,
        }
    },
};


    // Main script with modified importDependencies function
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
         * Parse date rule string into predicate function
         * @param {string} ruleString - Date rule, e.g. "<2022-01-01,>2020-01-01"
         * @returns {Function|null} Predicate function or null if invalid
         */
        parseDateRule: function (ruleString) {
            const trimmedRule = ruleString.trim();
            if (!trimmedRule) {
                return null;
            }

            const conditionStrings = trimmedRule.split(',').map(s => s.trim()).filter(Boolean);
            const predicates = [];

            for (let cond of conditionStrings) {
                let operator = '=';
                if (['<', '>', '='].includes(cond[0])) {
                    operator = cond[0];
                    cond = cond.substring(1).trim();
                }

                const targetDate = new Date(cond);
                if (isNaN(targetDate.getTime())) {
                    console.warn(`[Cite Unseen] Invalid date in rule: ${cond}`);
                    return null;
                }

                const predicate = {
                    '<': date => date < targetDate,
                    '>': date => date > targetDate,
                    '=': date => date.getTime() === targetDate.getTime()
                }[operator];

                predicates.push(predicate);
            }

            return (inputDate) => {
                const date = inputDate instanceof Date ? inputDate : new Date(inputDate);
                return !isNaN(date.getTime()) && predicates.every(fn => fn(date));
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
            if (!rule['date']) return true;

            const predicate = CiteUnseen.parseDateRule(rule['date']);
            if (!predicate) {
                console.warn(`[Cite Unseen] Invalid date rule: ${rule['date']}`);
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
         * Find the first matching reliability category for a citation.
         * @param {Object} coins - COinS object
         * @param {Object} filteredCategorizedRules - Filtered rules by category
         * @returns {Object|null} Match object with type and name, or null if no match
         */
        findReliabilityMatch: function (coins, filteredCategorizedRules) {
            for (const checklistTypeData of CiteUnseen.citeUnseenChecklists) {
                const checklistType = checklistTypeData[0];
                for (const checklist of checklistTypeData[1]) {
                    const [checklistName, checklistID] = checklist;
                    if (filteredCategorizedRules[checklistID]) {
                        for (const rule of filteredCategorizedRules[checklistID]) {
                            if (CiteUnseen.match(coins, rule)) {
                                if (CiteUnseen.citeUnseenCategories[checklistID]) {
                                    return { type: checklistType, name: checklistName };
                                }
                                return null; // Found match but category disabled
                            }
                        }
                    } else {
                        console.log('[Cite Unseen] ' + checklistID + ' is not in the ruleset.');
                    }
                }
            }
            return null;
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
                    const reliabilityMatch = CiteUnseen.findReliabilityMatch(ref.coins, filteredCategorizedRules);
                    if (reliabilityMatch && !processedCategories.has(reliabilityMatch.type)) {
                        CiteUnseen.processIcon(iconsDiv, reliabilityMatch.type, reliabilityMatch.name);
                        processedCategories.add(reliabilityMatch.type);
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
         * @returns {Element} The iconNode element
         */
        processIcon: function (node, type, checklist = null) {
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
            selectedCategoriesArray.forEach(function(category) {
                const nodes = reflistData.categories[category];
                if (nodes) {
                    nodes.forEach(function(citeElement) {
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
            containerToCategoriesMap.forEach(function(categoriesSet, container) {
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

            // CSS already injected above
            // i18n.js already loaded above
            // sources.js already loaded above
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
                            return mw.config.get('wbCurrentSiteDetails').shortName + ' ' + mw.config.get('wgSiteName');
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
                                projects.push({ page: pageLink, url: `//${lang}.wikipedia.org/wiki/${fullPagePath}`});
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
})();