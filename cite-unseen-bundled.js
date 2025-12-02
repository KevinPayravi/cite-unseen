// Cite Unseen - Bundled Version
// Maintainers: SuperHamster and SuperGrey
// Repository: https://gitlab.wikimedia.org/kevinpayravi/cite-unseen
// Release: 2.1.11
// Timestamp: 2025-12-02T06:39:15.850Z

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
    overflow: hidden;
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

/* Minerva button styling */
.cite-unseen-minerva-settings-icon {
    mask-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCI+DQoJPHRpdGxlPg0KCQlzZXR0aW5ncw0KCTwvdGl0bGU+DQoJPGcgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEwIDEwKSI+DQoJCTxwYXRoIGlkPSJhIiBkPSJNMS41LTEwaC0zbC0xIDYuNWg1bTAgN2gtNWwxIDYuNWgzIi8+DQoJCTx1c2UgeGxpbms6aHJlZj0iI2EiIHRyYW5zZm9ybT0icm90YXRlKDQ1KSIvPg0KCQk8dXNlIHhsaW5rOmhyZWY9IiNhIiB0cmFuc2Zvcm09InJvdGF0ZSg5MCkiLz4NCgkJPHVzZSB4bGluazpocmVmPSIjYSIgdHJhbnNmb3JtPSJyb3RhdGUoMTM1KSIvPg0KCTwvZz4NCgk8cGF0aCBkPSJNMTAgMi41YTcuNSA3LjUgMCAwIDAgMCAxNSA3LjUgNy41IDAgMCAwIDAtMTV2NGEzLjUgMy41IDAgMCAxIDAgNyAzLjUgMy41IDAgMCAxIDAtNyIvPg0KPC9zdmc+);
}

.cite-unseen-minerva-suggestions-icon {
    mask-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+DQoJPGcgaWQ9InF1b3Rlcy1hZGQiPg0KCQk8cGF0aCBpZD0icXVvdGUiIGQ9Ik01LjkgMTAuNGMtLjQ0Ni41NS0xLjk3NCAyLjYtMS45IDUuN1YxOWg0LjdjLjkgMCAxLjU5My0uNyAxLjYtMS42VjEzSDcuMnMuMDUtLjc0LjYtMS40Yy40NTMtLjU0MyAxLS45IDEuNi0xLjIuMi0uMS40Ny0uMjEyLjYtLjUuMTI3LS4yODIuMi0uNS4yLS45di0uNmMtMSAuMi0xLjc0NC4xOTctMi42LjYtLjg1Ni40MDMtMS4yNzIuODczLTEuNyAxLjR6Ii8+DQoJCTxwYXRoIGlkPSJxdW90ZTIiIGQ9Ik0xNSA5LjM0NGMtLjQ3Ni4zMi0uNzguNjc3LTEuMDk0IDEuMDYyQTguNzYgOC43NiAwIDAgMCAxMiAxNi4wOTRWMTloNC42ODhhMS42IDEuNiAwIDAgMCAxLjYyNS0xLjU5NFYxM0gxNVY5LjM0NHoiLz4NCgkJPHBhdGggaWQ9ImFkZCIgZD0iTTE4IDZWMmgtMnY0aC00djJoNHY0aDJWOGg0VjZ6Ii8+DQoJPC9nPg0KPC9zdmc+);
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

.cite-unseen-suggestions-active .cite-unseen-minerva-suggestions-icon {
    background-color: #28a745;
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

/* Icon container for language indicators */
.cite-unseen-icon-container {
    position: relative;
    display: flex;
}

.cite-unseen-lang-indicator {
    position: absolute;
    bottom: -4px;
    right: -3px;
    font-size: 8px;
    font-weight: bold;
    color: #000;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 2px;
    padding: 0 1px;
    line-height: 1;
    z-index: 10;
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

.cite-unseen-edit-section.cite-unseen-minerva-edit-section {
    /* Minerva mw-editsection has a margin-right of -12px, so we have to add 12px left space to make even. */
    margin-left: 12px;
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
    "@metadata": {
        "ar": {
            "authors": [
                "Meno25"
            ]
        },
        "ja": {
            "authors": [
                "SuperGrey"
            ]
        },
        "kg": {
            "authors": [
                "Marphy 123"
            ]
        },
        "ln": {
            "authors": [
                "Marphy 123"
            ]
        },
        "mk": {
            "authors": [
                "Bjankuloski06"
            ]
        },
        "pl": {
            "authors": [
                "Ironupiwada"
            ]
        },
        "pms": {
            "authors": [
                "Borichèt"
            ]
        },
        "ps": {
            "authors": [
                "شاه زمان پټان"
            ]
        },
        "pt": {
            "authors": [
                "Mansil alfalb"
            ]
        },
        "tr": {
            "authors": [
                "Hedda"
            ]
        },
        "ur": {
            "authors": [
                "امین اکبر"
            ]
        },
        "hans": {
            "authors": [
                "SuperGrey"
            ]
        },
        "hant": {
            "authors": [
                "Kly",
                "LowensteinYang",
                "SuperGrey"
            ]
        }
    },
    "additionalDomains": {
        "ar": "المجالات الإضافية (واحد لكل سطر)",
        "en": "Additional Domains (one per line)",
        "ja": "追加ドメイン（1行に1つ）",
        "ln": "Ba Domaines ya kobakisa (moko na ligne moko) .",
        "mk": "Дополнителни домени (по еден во секој ред)",
        "pl": "Dodatkowe domeny (jedna na linię)",
        "pms": "Domini adissionaj (un për linia)",
        "ps": "زياتي واک‌سيمې (په هره کرښه کې يو)",
        "pt": "Domínios adicionais (um por linha)",
        "tr": "Ek Alan Adları (her satıra bir tane)",
        "ur": "اضافی ڈومینز (ایک فی لائن)",
        "hans": "额外域名（每行一个）",
        "hant": "額外網域（每行一個）"
    },
    "additionalDomainsTabGuidance": {
        "ar": "أضف نطاقات مخصصة لتضمينها في كل فئة. سيتم تمييز المصادر من هذه النطاقات برمز الفئة المقابلة. أدخل نطاقًا واحدًا في كل سطر بالتنسيق \"example.com\".",
        "en": "Add custom domains to include in each category. Sources from these domains will be marked with the corresponding category icon. Enter one domain per line in the format 'example.com'.",
        "ja": "各カテゴリに含めるカスタムドメインを追加します。これらのドメインからの情報源には対応するカテゴリアイコンが表示されます。1行に1つのドメインを 'example.com' の形式で入力してください。",
        "ln": "Bakisa ba domaines personnalisés mpo na kokotisa na catégorie moko na moko. Ba sources oyo ewutaka na ba domaines wana ekozala marqué na icône ya catégorie oyo ekokani. Tyá domaine moko na ligne moko na format 'example.com'.",
        "mk": "Додајте прилагодени домени за вклучување во секоја категорија. Изворите од овие домени ќе бидат обележани со соодветната категориска икона. Внесете по еден домен во секој нов ред, во форматот „example.com“.",
        "pl": "Dodaj niestandardowe domeny do uwzględnienia w każdej kategorii. Źródła z tych domen będą oznaczone odpowiednią ikoną kategorii. Wprowadź jedną domenę na linię w formacie 'przykład.com'.",
        "pms": "Gionté ij domini përsonalisà da anclude an minca na categorìa. Le sorgiss da costi domini a saran marcà con la plancia ëd categorìa corëspondenta. Anserì un domini pËr linia ant ël formà 'esempi.com'.",
        "pt": "Adicione domínios personalizados para incluir em cada categoria. As fontes destes domínios serão marcadas com o ícone de categoria correspondente. Insira um domínio por linha no formato 'example.com'.",
        "tr": "Her kategoriye eklemek üzere özel alan adları ekleyin. Bu alan adlarından gelen kaynaklar ilgili kategori simgesiyle işaretlenecektir. Her satıra bir alan adı olacak şekilde 'example.com' biçiminde girin.",
        "hans": "添加要包含在各类别中的自定义域名。来自这些域名的来源将标记对应的类别图标。每行输入一个域名，格式为 'example.com'。",
        "hant": "新增要包含在各類別中的自訂網域。來自這些網域的來源將標記對應的類別圖示。每行輸入一個網域，格式為 'example.com'。"
    },
    "additionalStringsTabGuidance": {
        "ar": "أضف أنماط عناوين URL مخصصة لتضمينها في كل فئة. سيتم تمييز المصادر التي تحتوي على أنماط عناوين URL هذه بأيقونة الفئة المقابلة. أدخل نمطًا واحدًا في كل سطر (مثل: '/search?q='، '/article/'، '?page=news').",
        "en": "Add custom URL patterns to include in each category. Sources containing these URL patterns will be marked with the corresponding category icon. Enter one pattern per line (e.g., '/search?q=', '/article/', '?page=news').",
        "ja": "各カテゴリに含めるカスタムURLパターンを追加します。これらのURLパターンを含む情報源には対応するカテゴリアイコンが表示されます。1行に1つのパターンを入力してください（例：'/search?q='、'/article/'、'?page=news'）。",
        "ln": "Bakisa ba modèles ya URL personnalisé mpo na kokotisa na catégorie moko na moko. Ba sources oyo ezali na ba modèles ya URL oyo ekozala na elembo ya catégorie oyo ekokani. Tyá motindo moko na molɔngɔ moko (ndakisa, '/search?q=', '/article/', '?page=nsango').",
        "mk": "Додајте прилагодени URL-шами за вклучување во секоја категорија. Изворите што ги содржат овие шеми ќе бидат обележани со соодветната категориска икона. Внесете по една шема во секој нов ред (како на пр. „/search?q=“, „/article/“, „?page=news“).",
        "pl": "Dodaj niestandardowe wzorce URL do uwzględnienia w każdej kategorii. Źródła zawierające te wzorce URL będą oznaczone odpowiednią ikoną kategorii. Wprowadź jeden wzorzec na linię (np. '/search?q=', '/article/', '?page=news').",
        "pms": "Gionté djë schema përsonalisà d'URL da include an ògni categorìa. Le sorgiss ch'a conten-o costi schema d'URL a saran marcà con la plancia ëd categorìa rëspondenta. Buté un ëschema për linia (per es., '/search?q=', '/article/', '?page=news').",
        "pt": "Adicione padrões de URL personalizados para incluir em cada categoria. As fontes com estes padrões de URL serão marcadas com o ícone de categoria correspondente. Insira um padrão por linha (por exemplo, '/search?q=', '/article/', '?page=news').",
        "tr": "Her kategoriye dahil etmek için özel URL desenleri ekleyin. Bu URL desenlerini içeren kaynaklar ilgili kategori simgesiyle işaretlenecektir. Her satıra bir desen olacak şekilde girin. (örneğin '/search?q=', '/article/', '?page=news').",
        "hans": "添加要包含在各类别中的自定义网址模式。包含这些网址模式的来源将标记对应的类别图标。每行输入一个模式（例如 '/search?q='、'/article/'、'?page=news'）。",
        "hant": "新增要包含在各類別中的自訂網址模式。包含這些網址模式的來源將標記對應的類別圖示。每行輸入一個模式（例如 '/search?q='、'/article/'、'?page=news'）。"
    },
    "additionalUrlStrings": {
        "ar": "سلاسل عناوين URL إضافية (واحدة لكل سطر)",
        "en": "Additional URL Strings (one per line)",
        "ja": "追加URL文字列（1行に1つ）",
        "kg": "Bansinga ya nkaka ya URL (mosi na ndonga mosi)",
        "ln": "Ba nsinga mosusu ya URL (moko na molongo)",
        "mk": "Дополнителни URL-низи (по една во секој ред)",
        "pl": "Dodatkowe ciągi URL (jeden na linię)",
        "pms": "Stringhe d'URL suplementar (un-a për linia)",
        "pt": "Strings de URL adicionais (uma por linha)",
        "tr": "Ek URL Dizeleri (her satıra bir tane)",
        "ur": "اضافی یو آر ایل سٹرنگز (ایک فی لائن)",
        "hans": "额外网址字符串（每行一个）",
        "hant": "額外網址字串（每行一個）"
    },
    "cancel": {
        "ar": "إلغاء",
        "en": "Cancel",
        "ja": "キャンセル",
        "ln": "Kolongola",
        "mk": "Откажи",
        "pl": "Anuluj",
        "pms": "Anulé",
        "ps": "ناگارل",
        "pt": "Cancelar",
        "tr": "İptal",
        "ur": "منسوخ",
        "hans": "取消",
        "hant": "取消"
    },
    "categoriesTabGuidance": {
        "ar": "تفعيل أو تعطيل فئات محددة من الاستشهادات. لن تظهر الفئات المعطلة في لوحة المعلومات أو أيقوناتها.",
        "en": "Enable or disable specific categories of citations. Disabled categories will not show icons or appear in the dashboard.",
        "ja": "特定の引用カテゴリを有効または無効にします。無効にしたカテゴリはアイコンが表示されず、ダッシュボードにも表示されません。",
        "ln": "Activer to désactiver ba catégories spécifiques ya ba citations. Ba catégories désactivées ekolakisa ba icônes te to ekobima na tableau de bord te.",
        "mk": "Овозможете или оневозможете одредени категории на наводи. Оневозможените категории нема да покажуваат икони и нема да се појавуваат во управувачницата.",
        "pl": "Włącz lub wyłącz określone kategorie cytowań. Wyłączone kategorie nie będą pokazywać ikon ani pojawiać się na pulpicie.",
        "pms": "Abilité o disabilité dle categorìe spessìfiche ëd sitassion. Le categorìe disabilità a smonëran nen dle plance nì a compariran ant ël cruscòt.",
        "pt": "Ative ou desative categorias específicas de citações. As categorias desativadas não mostrarão ícones ou aparecerão no painel.",
        "tr": "Belirli alıntı kategorilerini etkinleştirin veya devre dışı bırakın. Devre dışı bırakılan kategoriler simge göstermeyecek ve panoda görünmeyecektir.",
        "hans": "启用或禁用特定引用类别。禁用的类别将不会显示图标或出现在仪表板中。",
        "hant": "啟用或停用特定引用類別。停用的類別將不會顯示圖示或出現在儀表板中。"
    },
    "categoryHints": {
        "advocacy": {
            "ar": "هذا المصدر هو منظمة للدفاع عن حقوق الإنسان.",
            "en": "This source is an advocacy organization.",
            "ja": "この情報源はアドボカシー組織です。",
            "kg": "Nto yai kele kimvuka ya ke nwaninaka banswa ya bantu.",
            "ln": "Source oyo ezali organisation ya défense.",
            "mk": "Овој извор е застапничка организација.",
            "pl": "To źródło jest organizacją rzeczniczą.",
            "pms": "Costa sorgiss a l'é n'organisassion ëd part.",
            "ps": "دا سرچينه يو مدافع ټولنه ده.",
            "pt": "Esta fonte é uma organização de advocacia.",
            "tr": "Bu kaynak, bir savunma/çıkar grubu kuruluşudur.",
            "hans": "此来源为宣传机构。",
            "hant": "此來源為宣傳機構。"
        },
        "blacklisted": {
            "ar": "لقد تمت إضافة هذا المصدر إلى القائمة السوداء بسبب الإساءة المستمرة، عادةً في شكل روابط خارجية غير مرغوب فيها.",
            "en": "This source has been blacklisted due to persistent abuse, typically in the form of spam external links.",
            "ja": "この情報源は、持続的な濫用（通常はスパム外部リンクの形で）によりブラックリスト入りしています。",
            "kg": "Bo me tula nto yai na ndonga ya mbi sambu na mambu ya mbi yina ke landa kusalama, mingi-mingi na mutindu ya bansangu ya mbi ya nganda.",
            "ln": "Source oyo etiemaki na liste noire mpo na abuse persistant, typiquement na forme ya ba liens externes ya spam.",
            "mk": "Овој извор е на црниот список поради постојана злоупотреба, обично во облик на спамирање со надворешни врски.",
            "pl": "To źródło zostało umieszczone na czarnej liście z powodu uporczywego nadużywania, zazwyczaj w formie spamowych linków zewnętrznych.",
            "pms": "Costa sorgiss a l'é stàita butà ant la lista nèira për via d'abus përsistent, ëd sòlit ant la forma ëd liure esterne ëd rumenta.",
            "pt": "Esta fonte foi incluída na lista negra devido ao abuso persistente, normalmente na forma de hiperligações externas de lixo eletrónico.",
            "tr": "Bu kaynak, sürekli kötüye kullanım nedeniyle kara listeye alınmıştır; bu genellikle spam dış bağlantılar şeklinde gerçekleşir.",
            "ur": "اس ماخذ کو مسلسل غلط استعمال کی وجہ سے بلیک لسٹ کیا گیا ہے، عام طور پر سپیم بیرونی لنکس کی شکل میں۔",
            "hans": "由于持续滥用（通常以垃圾外部链接的形式），此来源已被列入黑名单。",
            "hant": "由於持續濫用（通常以垃圾外部連結的形式），此來源已被列入黑名單。"
        },
        "blogs": {
            "ar": "هذا المصدر عبارة عن تدوينة.",
            "en": "This source is a blog post.",
            "ja": "この情報源はブログ記事です。",
            "ln": "Source oyo ezali poste ya blog.",
            "mk": "Овој извор е блоговска објава.",
            "pl": "To źródło jest wpisem na blogu.",
            "pms": "Costa sorgiss a l'é n'artìcol dë scartari.",
            "ps": "دا سرچينه يو بلاگ خپرونه ده.",
            "pt": "Esta fonte é um artigo de blogue.",
            "tr": "Bu kaynak bir blog yazısıdır.",
            "ur": "یہ ماخذ ایک بلاگ پوسٹ ہے۔",
            "hans": "此来源为博客文章。",
            "hant": "此來源為部落格文章。"
        },
        "books": {
            "ar": "هذا المصدر هو منشور مثل كتاب أو مجلة أو أي مادة مطبوعة أخرى.",
            "en": "This source is a publication such as a book, journal, or other printed material.",
            "ja": "この情報源は書籍、ジャーナル、またはその他の印刷物などの出版物です。",
            "ln": "Eutelo oyo ezali mokanda lokola buku, zulunalo, to mikanda misusu.",
            "mk": "Овој извор е публикација како книга, стручно списание или друг печатен материјал.",
            "pl": "To źródło jest publikacją taką jak książka, czasopismo lub inny materiał drukowany.",
            "pms": "Costa sorgiss a l'é na publicassion tanme un lìber, un giornal o d'àutr material ëstampà.",
            "pt": "Esta fonte é uma publicação, tais como, um livro, revista, ou outro material impresso.",
            "tr": "Bu kaynak bir kitap, dergi ya da başka tür basılı yayın gibi bir yayındır.",
            "ur": "یہ ماخذ ایک اشاعت، جیسے کتاب، جریدہ، یا دیگر مطبوعہ مواد سے متعلقہ ہے۔",
            "hans": "此来源为出版书籍、期刊或其他出版物。",
            "hant": "此來源為出版書籍、期刊或其他出版物。"
        },
        "community": {
            "ar": "هذا المصدر هو أخبار تم إنشاؤها بواسطة المجتمع.",
            "en": "This source is community-created news.",
            "ja": "この情報源はコミュニティが作成したニュースです。",
            "kg": "Nto yai kele bansangu ya kimvuka.",
            "ln": "Liziba oyo ezali nsango ya mboka.",
            "mk": "Овој извор е вест создаден од заедница.",
            "pl": "To źródło to wiadomości tworzone przez społeczność.",
            "pms": "Costa sorgiss a l'é n'anformassion creà da na comunità.",
            "ps": "دا سرچينه خبر جوړوونکې ټولنه ده.",
            "pt": "Esta fonte são notícias criadas pela comunidade.",
            "tr": "Bu kaynak topluluk tarafından oluşturulmuş bir haber içeriğidir.",
            "ur": "یہ ماخذ کمیونٹی کی تخلیق کردہ خبریں ہیں۔",
            "hans": "此来源为社群创作的新闻。",
            "hant": "此來源為社群創作的新聞。"
        },
        "deprecated": {
            "ar": "هذا المصدر مُهمَل ولا يُنصح باستخدامه. مع ذلك، يُمكن استخدامه للوصف الذاتي غير المثير للجدل أو المحتوى الذي ينشره الخبراء بأنفسهم.",
            "en": "This source is deprecated and should not be used. It may still be used for non-controversial self-descriptions or expert self-published content.",
            "ja": "この情報源は非推奨であり、使用しないでください。無争議の自己記述や専門家による自己出版コンテンツには引き続き使用できます。",
            "kg": "Bo ke sadilaka ve nto yai mpi bo fwete sadila yo ve. Bo lenda sadila yo sambu na kutendula yo mosi kukonda ntembe to mambu yina bantu ya mayele ke basisa bo mosi.",
            "ln": "Liziba oyo ezali lisusu na ntina te mpe esengeli kosalelama te. Ekoki kaka kosalelama mpo na kolobela makambo oyo bato bazali na yango to makambo oyo bato ya mayele babimisaka bango moko.",
            "mk": "Овој извор е застарен и не треба да се користи. Може сепак да се употребува за неспорни самоописи или содржина самообјавена од стручњаци.",
            "pl": "To źródło jest wycofane z użycia i nie powinno być stosowane z wyjątkiem niekontrowersyjnych samoopisów lub treści samodzielnie publikowanych przez ekspertów.",
            "pms": "Costa sorgiss a l'é veja e a dovrìa nen esse dovrà. A peul istess esse dovrà për dj'àuto-descrission nen controverse o dël contnù àuto-publicà da dj'espert.",
            "tr": "Bu kaynak artık kullanılmamaktadır ve kullanılmamalıdır. Ancak tartışma konusu olmayan öz tanımlamalar veya uzmanlarca yayımlanmış içerikler için hâlâ kullanılabilir.",
            "hans": "此来源已弃用，不应使用。它仍可用于无争议的自我描述，或来自专家的自行发表内容。",
            "hant": "此來源已棄用，不應使用。它仍可用於無爭議的自我描述，或來自專家的自行發表內容。"
        },
        "editable": {
            "ar": "هذا المصدر قابل للتعديل بواسطة المجتمع (على سبيل المثال، ويكي أو قاعدة بيانات).",
            "en": "This source is editable by the community (e.g., a wiki or database).",
            "ja": "この情報源はコミュニティによって編集可能です（例：ウィキやデータベース）。",
            "kg": "Bantu lenda yidika nto yai (mu mbandu, wiki to base de données).",
            "ln": "Liziba oyo ekoki kobongisama na lisanga (ndakisa, wiki to base de données).",
            "mk": "Овој извор е уредлив од заедницата (на пр. вики или база на податоци).",
            "pl": "To źródło może być edytowane przez społeczność (np. wiki lub baza danych).",
            "pms": "Costa sorgiss a l'é modificàbil da la comunità (për es., na wiki o na base ëd dàit).",
            "tr": "Bu kaynak topluluk tarafından düzenlenebilir (örneğin bir wiki veya veritabanı).",
            "ur": "یہ ماخذ کمیونٹی کے ذریعہ قابل ترمیم ہے (مثال کے طور پر، ایک ویکی یا ڈیٹا بیس) ۔",
            "hans": "此来源可由社群编辑（例如 Wiki 或数据库）。",
            "hant": "此來源可由社群編輯（例如 Wiki 或資料庫）。"
        },
        "generallyReliable": {
            "ar": "يتفق المحررون عمومًا على أن هذا المصدر موثوق به فيما يتعلق بالموضوعات التي تقع في مجال تخصصه.",
            "en": "Editors generally agree that this source is reliable on topics in its area of expertise.",
            "ja": "編集者は一般的に、この情報源がその専門分野のトピックにおいて信頼できると考えています。",
            "ln": "Ba rédacteurs bandimaka mingi que source oyo ezali fiable na ba sujets na domaine ya expertise na yango.",
            "mk": "Уредниците начелно се согласуваат дека овој извор е меродавен на теми во неговата област на стручност.",
            "pl": "Redaktorzy generalnie zgadzają się, że to źródło jest wiarygodne w tematach z jego obszaru wiedzy specjalistycznej.",
            "pms": "J'editor a son an general d'acòrd che costa sorgiss a l'é fidà an sj'argoment ëd soa àrea ëd competensa.",
            "tr": "Editörler genellikle bu kaynağın kendi uzmanlık alanındaki konularda güvenilir olduğu konusunda hemfikirdir.",
            "hans": "编辑们一致认为此来源在其专业领域的主题上通常可靠。",
            "hant": "編輯們一致認為此來源在其專業領域的主題上通常可靠。"
        },
        "generallyUnreliable": {
            "ar": "يُعتبر هذا المصدر عمومًا غير موثوق به من قِبل المجتمع. مع ذلك، يُمكن استخدامه للوصف الذاتي غير المثير للجدل أو المحتوى الذي ينشره الخبراء بأنفسهم.",
            "en": "This source is generally considered unreliable by the community. It may still be used for non-controversial self-descriptions or expert self-published content.",
            "ja": "この情報源はコミュニティによって通常信頼できないと考えられています。無争議の自己記述や専門家による自己出版コンテンツには引き続き使用できます。",
            "kg": "Bantu mingi ke monaka nde mukanda yai kele ve ya kutudila ntima. Bo lenda sadila yo sambu na kutendula yo mosi kukonda ntembe to mambu yina bantu ya mayele ke basisa bo mosi.",
            "ln": "Mingimingi, liziba oyo etalelami lokola oyo ekoki kotyelama motema te na bato ya mboka. Ekoki naino kosalelama mpo na komilobela oyo ezali na ntembe te to makambo oyo bato ya mayele bamibimisi.",
            "mk": "Заедницата начелно го смета овој извор за немеродавен. Може сепак да се употребува за неспорни самоописи или содржина самообјавена од стручњаци.",
            "pl": "To źródło jest generalnie uznawane za niewiarygodne przez społeczność. Może nadal być używane do niekontrowersyjnych samoopisów własnych lub treści samodzielnie publikowanych przez ekspertów.",
            "pms": "Costa sorgiss a l'é an general considerà nen fidà da la comunità. A peul istess esse dovrà për dj'àuto-descrission nen controverse o dël contnù àuto-publicà da dj'espert.",
            "tr": "Bu kaynak, topluluk tarafından genel olarak güvenilmez kabul edilmektedir. Ancak tartışma konusu olmayan öz tanımlamalar veya uzmanlarca yayımlanmış içerikler için hâlâ kullanılabilir.",
            "hans": "社区共识认为此来源通常不可靠。它仍可用于无争议的自我描述，或来自专家的自行发表内容。",
            "hant": "社群共識認為此來源通常不可靠。它仍可用於無爭議的自我描述，或來自專家的自行發表內容。"
        },
        "government": {
            "ar": "يتم تحديد هذا المصدر على أنه وسيلة إعلام مملوكة للدولة أو تديرها الدولة، أو مصدر حكومي.",
            "en": "This source is identified as a state-owned or state-run media, or a government source.",
            "ja": "この情報源は国有または国営メディア、または政府の情報源として識別されています。",
            "ln": "Liziba oyo emonisami lokola bopanzi sango ya leta to ya leta, to liziba ya leta.",
            "mk": "Овој извор медиум во државна сопственост или контрола, или пак владин извор.",
            "pl": "To źródło jest zidentyfikowane jako medium państwowe, rządowe lub dofinansowywane przez instytucje państwowe.",
            "pms": "Costa sorgiss a l'é indentificà tanme un mojen possedù o controlà da lë stat, o na sorgiss governamental.",
            "tr": "Bu kaynak, devlet tarafından sahip olunan veya devletçe işletilen bir medya kuruluşu ya da bir devlet kaynağıdır.",
            "ur": "اس ماخذ کی شناخت سرکاری ملکیت یا سرکاری میڈیا، یا سرکاری ذرائع کے طور پر کی جاتی ہے۔",
            "hans": "此来源已被识别为国有或国营媒体，或为政府来源。",
            "hant": "此來源已被識別為國有或國營媒體，或為政府來源。"
        },
        "marginallyReliable": {
            "ar": "هذا المصدر ذو موثوقية محدودة. قد يلزم مراجعته على أساس كل حالة على حدة لتحديد مدى موثوقيته في كل سياق.",
            "en": "This source is marginally reliable. It may be necessary to review it on a case-by-case basis to determine its reliability in each context.",
            "ja": "この情報源は限られた信頼性があります。各コンテキストでの信頼性を判断するために、個別にレビューする必要があるかもしれません。",
            "kg": "Mukanda yai kele ya kutudila ntima. Yo lenda vanda mfunu na kutomisa yo na kutadila diambu mosi-mosi sambu na kuzaba kana yo kele ya kutudila ntima na konso mambu.",
            "ln": "Liziba oyo ezali mwa kotyela motema. Ekoki kozala na ntina kotalela yango na kotalela likambo mokomoko mpo na koyeba soki ekoki kotyelama motema na likambo mokomoko.",
            "mk": "Овој извор е маргинално веродостоен. Можеби е неопходно да се проверува од случај до случај за да се одреди неговата веродостојност во секој даден контекст.",
            "pl": "To źródło jest ledwo wiarygodne. Może być konieczne przejrzenie go przypadek po przypadku, aby określić jego wiarygodność w każdym kontekście.",
            "pms": "Costa sorgiss a l'é pòch fidàbil. A peul essie damanca ëd controlela cas për cas për determiné sò afidament an minca 'n contest.",
            "tr": "Bu kaynak, sınırlı düzeyde güvenilirdir. Her bağlamda güvenilirliğini belirlemek için duruma göre ayrı ayrı incelenmesi gerekebilir.",
            "hans": "此来源半可靠。可能有必要在每次使用该来源时逐个进行审查，视情境决定是否可靠。",
            "hant": "此來源半可靠。可能有必要在每次使用該來源時逐個進行審查，視情境決定是否可靠。"
        },
        "multi": {
            "ar": "لا يوجد إجماع في المجتمع حول موثوقية هذا المصدر. قد تتأثر موثوقيته بعامل أو أكثر، مثل مجال الموضوع، أو المؤلف، أو تاريخ النشر.",
            "en": "There is no consensus in the community about the reliability of this source. Its reliability may be affected by one or more factors, such as the subject area, author, or publication time.",
            "ja": "この情報源の信頼性についてコミュニティ内でコンセンサスがありません。その信頼性は、主題領域、著者、または出版時間など、1つ以上の要因によって影響を受ける可能性があります。",
            "kg": "Bantu ke ndimaka ve kana nto yai kele ya kutudila ntima. Kutula ntima na yo lenda vanda na bupusi na diambu mosi to mingi, bonso kisika ya ntu-diambu, nsoniki, to ntangu ya kubasika.",
            "ln": "Boyokani ezali te na kati ya lisanga mpo na bondimi ya source oyo. Bondimi na yango ekoki kozala na bopusi na likambo moko to mingi, lokola esika ya lisolo, mokomi, to ntango ya kobimisa mikanda.",
            "mk": "Нема консензус во заедницата за меродавноста на овој извор. Неговата мероавност може да биде засегната од еден или повеќе чинители, како на пр. тематиката, авторот или времето на објавување.",
            "pl": "Nie ma konsensusu w społeczności co do wiarygodności tego źródła. Na jego wiarygodność może wpływać jeden lub więcej czynników, takich jak obszar tematyczny, autor lub czas publikacji.",
            "pms": "A-i é nen d'acòrd ant la comunità a propòsit dl'afidament ëd costa sorgiss. Sò afidament a peul esse anfluensà da un o vàire fator, tanme l'argoment, l'autor o ël temp ëd publicassion.",
            "tr": "Topluluk içinde bu kaynağın güvenilirliği konusunda bir görüş birliği yoktur. Güvenilirliği; konu alanı, yazar veya yayımlanma zamanı gibi bir ya da birden fazla faktörden etkilenebilir.",
            "hans": "社区对此来源的可靠性没有共识。其可靠性可能受到一个或多个因素影响（例如主题领域、作者或出版时间）。",
            "hant": "社群對此來源的可靠性沒有共識。其可靠性可能受到一個或多個因素影響（例如主題領域、作者或出版時間）。"
        },
        "news": {
            "ar": "هذا المصدر عبارة عن مقالة إخبارية من مؤسسة إخبارية مرموقة.",
            "en": "This source is a news article from a reputable news organization.",
            "ja": "この情報源は信頼できるニュース組織からのニュース記事です。",
            "ln": "Eutelo oyo ezali lisolo ya bansango ya ebongiseli moko ya bansango oyo eyebani mingi.",
            "mk": "Овој извор е статија со вести од реноимрана новинска организација.",
            "pl": "To źródło to artykuł informacyjny z renomowanej organizacji prasowej.",
            "pms": "Costa sorgiss a l'é n'artìcol ëd neuve da n'organisassion d'anformassion rëspetàbil.",
            "pt": "Esta fonte é um artigo de notícias de uma organização de notícias respeitável.",
            "tr": "Bu kaynak, saygın bir haber kuruluşuna ait bir haber makalesidir.",
            "ur": "یہ ماخذ ایک معروف خبر رساں تنظیم کا ایک نیوز آرٹیکل ہے۔",
            "hans": "此来源为来自知名新闻机构的新闻文章。",
            "hant": "此來源為來自知名新聞機構的新聞文章。"
        },
        "opinions": {
            "ar": "هذا المصدر عبارة عن مقالة رأي.",
            "en": "This source is an opinion piece.",
            "ja": "この情報源は意見記事です。",
            "kg": "Nto yai kele kitini ya ngindu.",
            "ln": "Source oyo ezali pièce ya opinion.",
            "mk": "Овој извор е колумна.",
            "pl": "To źródło to artykuł opiniotwórczy.",
            "pms": "Costa a l'é na sorgiss d'opinion.",
            "ps": "دا سرچينه يو اند ټوټه ده.",
            "pt": "Esta fonte é um artigo de opinião.",
            "tr": "Bu kaynak bir görüş yazısıdır.",
            "hans": "此来源为观点文章。",
            "hant": "此來源為觀點文章。"
        },
        "predatory": {
            "ar": "هذا المصدر من مجلة مفترسة.",
            "en": "This source is from a predatory journal.",
            "ja": "この情報源はハゲタカジャーナルからのものです。",
            "kg": "Mukanda yai me katuka na zulunalu mosi ya ke tubilaka mambu ya mbi.",
            "ln": "Liziba oyo euti na zulunalo moko oyo elyaka banyama mosusu.",
            "mk": "Овој извор е од предаторски часопис.",
            "pl": "To źródło pochodzi z drapieżnego czasopisma.",
            "pms": "Costa sorgiss a l'é da 'n giornal predatòri.",
            "ps": "دا سرچينه د يو ښکارۍ مهالنۍ بڼه ده.",
            "pt": "Esta fonte é de uma revista predatória.",
            "tr": "Bu kaynak, yırtıcı (predatory) bir dergiden alınmıştır.",
            "hans": "此来源来自掠夺性期刊。",
            "hant": "此來源來自掠奪性期刊。"
        },
        "press": {
            "ar": "هذا المصدر عبارة عن بيان صحفي.",
            "en": "This source is a press release.",
            "ja": "この情報源はプレスリリースです。",
            "ln": "Source oyo ezali communiqué ya presse.",
            "mk": "Овој извор е изјава за печат.",
            "pl": "To źródło to komunikat prasowy.",
            "pms": "Costa sorgiss a l'é un comunicà stampa.",
            "ps": "دا سرچينه يوه چاپي اعلاميه ده.",
            "pt": "Esta fonte é um comunicado de imprensa.",
            "tr": "Bu kaynak bir basın bültenidir.",
            "ur": "یہ ماخذ ایک پریس ریلیز ہے۔",
            "hans": "此来源为新闻稿。",
            "hant": "此來源為新聞稿。"
        },
        "satire": {
            "ar": "ينشر هذا المصدر محتوى ساخرًا أو محاكاة ساخرة.",
            "en": "This source publishes satirical or parody content.",
            "ja": "この情報源は風刺やパロディのコンテンツを公開しています。",
            "kg": "Kisika yai ke basisaka mambu ya satirique to parody.",
            "ln": "Eutelo oyo ebimisaka makambo ya satirique to ya parody.",
            "mk": "Овој извор објавува сатирични и пародиски содржини.",
            "pl": "To źródło publikuje treści satyryczne lub parodystyczne.",
            "pms": "Costa sorgiss a pùblich dël contnù satìrich o ëd parodìa.",
            "ps": "دا سرچينه ټوکې ټکالې يا تمثيلي مواد خپروي.",
            "pt": "Esta fonte publica conteúdo satírico ou de paródia.",
            "tr": "Bu kaynak, hiciv veya parodi içerik yayımlar.",
            "ur": "یہ ماخذ طنزیہ یا پیروڈی مواد شائع کرتا ہے۔",
            "hans": "此来源发表讽刺、恶搞内容。",
            "hant": "此來源發表諷刺、惡搞內容。"
        },
        "social": {
            "ar": "هذا المصدر هو موقع تواصل اجتماعي، وربما منشور على إحدى وسائل التواصل الاجتماعي.",
            "en": "This source is a social media website, possibly a social media post.",
            "ja": "この情報源はソーシャルメディアのウェブサイトで、ソーシャルメディアの投稿である可能性があります。",
            "ln": "Eutelo oyo ezali site ya social media, mbala mosusu poste ya social media.",
            "mk": "Овој извор е од друштвен медиум, можеби објава.",
            "pl": "To źródło to strona mediów społecznościowych, możliwie post w mediach społecznościowych.",
            "pms": "Costa sorgiss a l'é un sit ëd mojen sossiaj, peul desse n'artìcol ëd mojen sossial.",
            "pt": "Esta fonte é um ''site'' da Web de multimédia social, possivelmente uma publicação das redes sociais.",
            "tr": "Bu kaynak, bir sosyal medya sitesinden alınmıştır; muhtemelen bir sosyal medya gönderisidir.",
            "ur": "یہ ماخذ ایک سوشل میڈیا ویب سائٹ ہے، ممکنہ طور پر ایک سوشل میڈیا پوسٹ۔",
            "hans": "此来源为社交媒体网站，可能是社交媒体贴文。",
            "hant": "此來源為社群媒體網站，可能是社群媒體貼文。"
        },
        "sponsored": {
            "ar": "هذا المصدر عبارة عن محتوى برعاية أو مادة ترويجية.",
            "en": "This source is a sponsored content or promotional material.",
            "ja": "この情報源はスポンサー付きのコンテンツまたはプロモーション資料です。",
            "ln": "Source oyo ezali contenus sponsorisé to matériel promotionnel.",
            "mk": "Овој извор е спонзорирана содржина или промотивен материјал.",
            "pl": "To źródło to treść sponsorowana lub materiał promocyjny.",
            "pms": "Costa sorgiss a l'é un contnù d'areclam o dël material promossional.",
            "pt": "Esta fonte é um conteúdo patrocinado ou material promocional.",
            "tr": "Bu kaynak, sponsorlu bir içerik ya da tanıtım materyalidir.",
            "ur": "یہ ماخذ ایک اسپانسر شدہ مواد یا تشہیری مواد ہے۔",
            "hans": "此来源为商单、宣传稿。",
            "hant": "此來源為商單、宣傳稿。"
        },
        "tabloids": {
            "ar": "هذا المصدر هو صحيفة صفراء أو أخبار شائعة.",
            "en": "This source is a tabloid or gossip news.",
            "ja": "この情報源はタブロイドまたはゴシップニュースです。",
            "ln": "Source oyo eza tabloïde to sango ya bilobaloba.",
            "mk": "Овој извор е таблоид или озборувачка вест.",
            "pl": "To źródło to tabloid lub wiadomości plotkarskie.",
            "pms": "Costa sorgiss a l'é un giornal ëd costume e petegolum.",
            "pt": "Esta fonte é um tablóide ou uma notícia de fofocas.",
            "tr": "Bu kaynak, bir tabloid ya da magazin haberidir.",
            "hans": "此来源为小报或八卦新闻。",
            "hant": "此來源為小報或八卦新聞。"
        },
        "tvPrograms": {
            "ar": "هذا المصدر هو برنامج تلفزيوني أو إذاعي. تعتمد موثوقيته على كل برنامج.",
            "en": "This source is a TV or radio program. Its reliability depends on the individual program.",
            "ja": "この情報源はテレビまたはラジオ番組です。その信頼性は個々の番組によって異なります。",
            "ln": "Liziba oyo ezali programme ya TV to ya radio. Bondimi na yango etali programme ya moto na moto.",
            "mk": "Овој извор е TV- или радиоемисија. Неговата меродавност зависи од поединечната емисија.",
            "pl": "To źródło to program telewizyjny lub radiowy. Jego wiarygodność zależy od konkretnego programu.",
            "pms": "Costa sorgiss a l'é un programa dla television o dla radio. Sò afidament a dipend dal programa particolar.",
            "pt": "Esta fonte é um programa de TV ou de rádio. A sua fiabilidade depende do programa individual.",
            "tr": "Bu kaynak, bir TV ya da radyo programıdır. Güvenilirliği, ilgili programa bağlıdır.",
            "hans": "此来源为电视或广播节目。其可靠性取决于个别节目。",
            "hant": "此來源為電視或廣播節目。其可靠性取決於個別節目。"
        },
        "unknown": {
            "ar": "لم يتم تقييم هذا المصدر بعد.",
            "en": "This source is not yet evaluated.",
            "ja": "この情報源はまだ評価されていません。",
            "ln": "Liziba oyo etalelami naino te.",
            "mk": "Овој извор сè уште не е оценет.",
            "pl": "To źródło nie zostało jeszcze ocenione.",
            "pms": "Costa sorgiss a l'é ancor nen valutà.",
            "ps": "دا سرچينه لاارزول شوې نه ده.",
            "pt": "Esta fonte ainda não foi avaliada.",
            "tr": "Bu kaynak henüz değerlendirilmemiştir.",
            "hans": "此来源尚未评估。",
            "hant": "此來源尚未評估。"
        }
    },
    "categoryLabels": {
        "advocacy": {
            "ar": "المناصرة",
            "en": "advocacy",
            "ja": "アドボカシー",
            "ln": "kosunga",
            "mk": "застапништво",
            "pl": "rzecznictwo",
            "pms": "sostegn",
            "ps": "استازولي",
            "pt": "advocacia",
            "tr": "savunma",
            "hans": "宣传机构",
            "hant": "宣傳機構"
        },
        "blacklisted": {
            "ar": "مُدرج في القائمة السوداء",
            "en": "blacklisted",
            "ja": "ブラックリスト入り",
            "ln": "na liste ya moindo",
            "mk": "на црн список",
            "pl": "na czarnej liście",
            "pms": "ant la lista nèira",
            "ps": "تورلېست‌شوي",
            "pt": "na lista negra",
            "tr": "kara listeye alınmış",
            "hans": "列入黑名单",
            "hant": "列入黑名單"
        },
        "blogs": {
            "ar": "تدوينات المدونة",
            "en": "blog post(s)",
            "ja": "ブログ",
            "ln": "post(s) ya blog .",
            "mk": "блоговска објава",
            "pl": "wpis(y) na blogu",
            "pms": "artìcoj dë scartari",
            "ps": "بلاگ پوست(ونه)",
            "pt": "artigo(s) de blogue",
            "tr": "blog yazıları",
            "ur": "بلاگ پوسٹ",
            "hans": "博客",
            "hant": "部落格"
        },
        "books": {
            "ar": "كتب",
            "en": "books",
            "ja": "出版物",
            "kg": "mikanda",
            "ln": "mikanda",
            "mk": "книги",
            "pl": "książki",
            "pms": "lìber",
            "ps": "کتابونه",
            "pt": "livros",
            "tr": "kitaplar",
            "ur": "کتابیں",
            "hans": "书刊",
            "hant": "書刊"
        },
        "community": {
            "ar": "مجتمع",
            "en": "community",
            "ja": "コミュニティ",
            "ln": "esika bofandi",
            "mk": "заедница",
            "pl": "społeczność",
            "pms": "comunità",
            "ps": "ټولنه",
            "pt": "comunidade",
            "tr": "topluluk",
            "hans": "社群新闻",
            "hant": "社群新聞"
        },
        "deprecated": {
            "ar": "مُهمَل",
            "en": "deprecated",
            "ja": "非推奨",
            "kg": "yina bo me bikisaka",
            "ln": "esili kozanga kosalelama",
            "mk": "застарено",
            "pl": "wycofane z użycia",
            "pms": "dësconsejà",
            "pt": "descontinuado",
            "tr": "artık geçerli olmayan",
            "ur": "مسترد شدہ",
            "hans": "应停用",
            "hant": "應停用"
        },
        "editable": {
            "ar": "قابلة للتحرير",
            "en": "editable",
            "ja": "編集可能",
            "ln": "ekoki kobongisama",
            "mk": "уредливо",
            "pl": "edytowalne",
            "pms": "modificàbil",
            "ps": "سمون‌وړ",
            "pt": "editável",
            "tr": "düzenlenebilir",
            "ur": "قابل ترمیم",
            "hans": "可编辑",
            "hant": "可編輯"
        },
        "generallyReliable": {
            "ar": "موثوقة بشكل عام",
            "en": "generally reliable",
            "ja": "通常信頼できる",
            "kg": "mingi-mingi ya kutudila ntima",
            "ln": "mingimingi ekoki kotyelama motema",
            "mk": "начелно меродавно",
            "pl": "ogólnie wiarygodne",
            "pms": "an general fidà",
            "ps": "ټولواله توگه باوري",
            "pt": "geralmente confiável",
            "tr": "genel olarak güvenilir",
            "ur": "عام طور پر قابل اعتماد",
            "hans": "通常可靠",
            "hant": "通常可靠"
        },
        "generallyUnreliable": {
            "ar": "غير موثوق بها بشكل عام",
            "en": "generally unreliable",
            "ja": "通常信頼できない",
            "kg": "Mbala mingi bo lenda tudila yo ve ntima",
            "ln": "mingimingi ekoki kotyelama motema te",
            "mk": "начелно немеродавно",
            "pl": "ogólnie niewiarygodne",
            "pms": "an general nen fidà",
            "ps": "ټولواله توگه بې‌باوره",
            "pt": "geralmente não confiável",
            "tr": "genellikle güvenilmez",
            "ur": "عام طور پر ناقابل اعتماد",
            "hans": "通常不可靠",
            "hant": "通常不可靠"
        },
        "government": {
            "ar": "حكومة",
            "en": "government",
            "ja": "政府",
            "ln": "boyangeli",
            "mk": "владино",
            "pl": "rządowe",
            "pms": "goern",
            "ps": "حکومت",
            "pt": "governo",
            "tr": "devlet",
            "ur": "حکومت",
            "hans": "政府",
            "hant": "政府"
        },
        "marginallyReliable": {
            "ar": "موثوق بها بشكل هامشي",
            "en": "marginally reliable",
            "ja": "限られた信頼性",
            "ln": "oyo ekoki kotyelama motema na ndenge ya moke",
            "mk": "маргинално веродостоен",
            "pl": "ledwo wiarygodne",
            "pms": "marginalmant fidàbil",
            "ps": "لږ د باور وړ",
            "pt": "marginalmente confiável",
            "tr": "kısmen güvenilir",
            "hans": "半可靠",
            "hant": "半可靠"
        },
        "multi": {
            "ar": "لا يوجد إجماع",
            "en": "no consensus",
            "ja": "コンセンサスなし",
            "kg": "bo me ndima ve",
            "ln": "boyokani moko te",
            "mk": "нема консензус",
            "pl": "brak konsensusu",
            "pms": "gnun acòrd",
            "pt": "sem consenso",
            "tr": "fikir birliği yok",
            "ur": "کوئی اتفاق نہیں",
            "hans": "无共识",
            "hant": "無共識"
        },
        "news": {
            "ar": "أخبار",
            "en": "news",
            "ja": "ニュース",
            "kg": "bansangu",
            "ln": "bansango",
            "mk": "вести",
            "pl": "wiadomości",
            "pms": "neuve",
            "ps": "خبرونه",
            "pt": "notícias",
            "tr": "haberler",
            "ur": "خبریں",
            "hans": "新闻",
            "hant": "新聞"
        },
        "opinions": {
            "ar": "مقالة رأي",
            "en": "opinion piece(s)",
            "ja": "意見",
            "kg": "Bangindu ya bantu",
            "ln": "eteni(s) ya makanisi .",
            "mk": "колумна/ни",
            "pl": "artykuł(y) opiniotwórczy(e)",
            "pms": "tòch d'opinion",
            "ps": "اند ټوټه(ې)",
            "pt": "artigo(s) de opinião",
            "tr": "görüş yazıları",
            "hans": "观点",
            "hant": "觀點"
        },
        "predatory": {
            "ar": "المجلات المفترسة",
            "en": "predatory journal(s)",
            "ja": "ハゲタカジャーナル",
            "ln": "(ba) zulunalo oyo elyaka banyama mosusu .",
            "mk": "предаторски часопис(и)",
            "pl": "drapieżne czasopismo(a)",
            "pms": "giornal predatòri",
            "ps": "ښکار مهالنۍ",
            "pt": "revista(s) predatória(s)",
            "tr": "yırtıcı dergiler",
            "hans": "掠夺性期刊",
            "hant": "掠奪性期刊"
        },
        "press": {
            "ar": "بيان صحفي",
            "en": "press release(s)",
            "ja": "プレスリリース",
            "ln": "communiqué(s) ya bapanzi sango .",
            "mk": "соопштение за печат",
            "pl": "komunikat(y) prasowy(e)",
            "pms": "comunicà dë stampa",
            "ps": "چاپي اعلاميه(ې)",
            "pt": "comunicado(s) de imprensa",
            "tr": "basın bültenleri",
            "ur": "پریس ریلیز",
            "hans": "新闻稿",
            "hant": "新聞稿"
        },
        "satire": {
            "ar": "ساخر",
            "en": "satirical",
            "ja": "風刺",
            "ln": "ya satirique",
            "mk": "сатирично",
            "pl": "satyryczne",
            "pms": "satìrich",
            "ps": "خنداوړ",
            "pt": "satírico",
            "tr": "hicivsel",
            "ur": "طنزیہ",
            "hans": "幽默",
            "hant": "幽默"
        },
        "social": {
            "ar": "وسائل التواصل الاجتماعي",
            "en": "social media",
            "ja": "ソーシャルメディア",
            "kg": "basite ya bansangu",
            "ln": "ba réseaux sociaux",
            "mk": "друштвен медиум",
            "pl": "media społecznościowe",
            "pms": "mojen sossial",
            "ps": "ټولنیزه رسنۍ",
            "pt": "redes sociais",
            "tr": "sosyal medya",
            "ur": "سوشل میڈیا",
            "hans": "社交媒体",
            "hant": "社群媒體"
        },
        "sponsored": {
            "ar": "برعاية",
            "en": "sponsored",
            "ja": "スポンサー付き",
            "kg": "bo ke pesaka mbongo",
            "ln": "oyo esungami",
            "mk": "спонзорирано",
            "pl": "sponsorowane",
            "pms": "areclam",
            "ps": "ملاتړشوی",
            "pt": "patrocinado",
            "tr": "sponsorlu",
            "ur": "سپانسر شدہ",
            "hans": "宣传稿",
            "hant": "宣傳稿"
        },
        "tabloids": {
            "ar": "صحيفة(ات) شعبية",
            "en": "tabloid(s)",
            "ja": "タブロイド",
            "ln": "(ba) tabloïde .",
            "mk": "таблоид(и)",
            "pl": "tabloid(y)",
            "pms": "spetegolum",
            "pt": "tablóide(s)",
            "tr": "tabloid gazeteler",
            "hans": "小报",
            "hant": "小報"
        },
        "tvPrograms": {
            "ar": "البرامج التلفزيونية",
            "en": "TV program(s)",
            "ja": "テレビ番組",
            "kg": "Programe ya TV",
            "ln": "Programme(s) ya TV .",
            "mk": "ТВ-емисија",
            "pl": "program(y) telewizyjny(e)",
            "pms": "programa ëd television",
            "ps": "تلوېزيوني خپرونه(ې)",
            "pt": "programa(s) de TV",
            "tr": "TV programları",
            "hans": "电视节目",
            "hant": "電視節目"
        },
        "unknown": {
            "ar": "روابط غير معروفة",
            "en": "unknown links",
            "ja": "不明なリンク",
            "kg": "ba lien ya me zabana ve",
            "ln": "ba liens oyo eyebani te",
            "mk": "непознати врски",
            "pl": "nieznane linki",
            "pms": "liure sconossùe",
            "ps": "نامالوم تړوني",
            "pt": "hiperligações desconhecidas",
            "tr": "bilinmeyen bağlantılar",
            "hans": "未知链接",
            "hant": "未知連結"
        }
    },
    "citationPlural": {
        "ar": "الاستشهادات",
        "en": " citations",
        "ja": " 件の引用",
        "ln": "ba citations oyo elobami",
        "mk": " наводи",
        "pl": " cytowania",
        "pms": "sitassion",
        "ps": "اخځونه",
        "pt": "citações",
        "tr": "alıntılar",
        "hans": " 个来源",
        "hant": " 個來源"
    },
    "citationSingular": {
        "ar": "الاستشهاد",
        "en": " citation",
        "ja": " 件の引用",
        "ln": "citation ya kotanga",
        "mk": " навод",
        "pl": " cytowanie",
        "pms": " sitassion",
        "ps": "اخځ",
        "pt": "citação",
        "tr": "alıntı",
        "hans": " 个来源",
        "hant": " 個來源"
    },
    "citationTooltipAction": {
        "ar": "انقر على الرمز لفتح صفحة قائمة التحقق لعرض التفاصيل.",
        "en": " Click the icon to open the checklist page to view details.",
        "ja": " アイコンをクリックすると、チェックリストページを開いて詳細を確認できます。",
        "kg": "Findilaka kidimbu sambu na kukangula lutiti ya lisiti sambu na kutala mambu ya nkaka.",
        "ln": "Finá elembo mpo na kofungola lokasa ya liste ya makambo mpo na komona makambo mosusu.",
        "mk": "Стиснете на иконата за да отворите страница со контролен список за да ги видите подробностите.",
        "pl": " Kliknij ikonę, aby otworzyć stronę listy kontrolnej i zobaczyć szczegóły.",
        "pms": " Sgnaché an sla plancia për duverté la pàgina dla lista ëd verìfica pr'ësmon-e ij detaj.",
        "pt": "Clique no ícone para abrir a página de lista de verificação para ver os detalhes.",
        "tr": "Ayrıntıları görüntülemek için simgeye tıklayarak kontrol listesi sayfasını açın.",
        "hans": " 点击图标可打开检查表页面以查看详情。",
        "hant": " 點擊圖示可打開檢查表頁面以查看詳情。"
    },
    "citationTooltipPrefix": {
        "ar": "من",
        "en": "From ",
        "ja": "出典",
        "kg": "Na nima ya kukatuka na",
        "ln": "Euti na",
        "mk": "Од",
        "pl": "Z",
        "pms": "Da",
        "ps": "له",
        "pt": "De",
        "hans": "来自",
        "hant": "來自"
    },
    "citationTooltipSuffix": {
        "ar": ":",
        "en": ": ",
        "ja": "：",
        "kg": ":",
        "ln": ":",
        "mk": ":",
        "pl": ":",
        "pms": ":",
        "ps": ":",
        "pt": ":",
        "tr": ":",
        "hans": "：",
        "hant": "："
    },
    "clearAllFilters": {
        "ar": "مسح الكل",
        "en": "Clear All",
        "ja": "全てクリア",
        "ln": "Effacer Nionso",
        "mk": "Исчисти сè",
        "pl": "Wyczyść wszystkie",
        "pms": "Dëscancelé tut",
        "ps": "ټول سپينول",
        "pt": "Limpar Tudo",
        "tr": "Tümünü Temizle",
        "hans": "清除全部",
        "hant": "清除全部"
    },
    "clearAllFiltersTooltip": {
        "ar": "مسح جميع المرشحات النشطة",
        "en": "Clear all active filters",
        "ja": "全てのアクティブフィルタをクリア",
        "ln": "Effacer ba filtres nionso oyo ezali active",
        "mk": "Исчисти ги сите активни филтри",
        "pl": "Wyczyść wszystkie aktywne filtry",
        "pms": "Dëscancelé tuti ij filtr ativ",
        "ps": "ټول کارنده چاڼگر سپينول",
        "pt": "Limpar todos os filtros ativos",
        "tr": "Tüm etkin filtreleri temizle",
        "hans": "清除所有活动筛选",
        "hant": "清除所有活動篩選"
    },
    "commentPlaceholder": {
        "ar": "معلومات إضافية حول سبب ملاءمة هذا التصنيف...",
        "en": "Additional information about why this categorization is appropriate...",
        "ja": "この分類が適切である理由についての追加情報...",
        "ln": "Ba informations ya kobakisa pona nini categorisation oyo ebongi...",
        "mk": "Дополнителни информации за тоа зошто оваа категоризациај е соодветна...",
        "pl": "Dodatkowe informacje o tym, dlaczego ta kategoryzacja jest odpowiednia...",
        "pms": "Anformassion adissionaj an sël përchè costa categorisassion a va bin...",
        "pt": "Informação adicional sobre o motivo para a classificação ser apropriada...",
        "tr": "Bu kategorizasyonun neden uygun olduğuna dair ek bilgi...",
        "hans": "关于为何此分类合适的额外信息……",
        "hant": "關於為何此分類合適的額外資訊……"
    },
    "dialogLoadError": {
        "ar": "فشل تحميل الحوار. يُرجى المحاولة مرة أخرى.",
        "en": "Failed to load dialog. Please try again.",
        "ja": "ダイアログの読み込みに失敗しました。もう一度お試しください。",
        "kg": "Kukonda kukotisa masolo. Beto ke lomba nge na kumeka diaka.",
        "ln": "Elongi te ko charger dialogue. Svp meka lisusu.",
        "mk": "Не успеав да го вчитам дијалогот. Обидете се повторно.",
        "pl": "Nie udało się załadować okna dialogowego. Spróbuj ponownie.",
        "pms": "Falì a carié ël diàlogh. Për piasì, ch'a preuva torna.",
        "pt": "Não foi possível carregar a janela. Por favor, tente novamente.",
        "tr": "İletişim kutusu yüklenemedi. Lütfen tekrar deneyin.",
        "hans": "加载对话框失败。请重试。",
        "hant": "載入對話方塊失敗。請重試。"
    },
    "documentationLink": {
        "ar": "التوثيق",
        "en": "Documentation",
        "ja": "ドキュメント",
        "kg": "Mikanda",
        "ln": "Mikanda ya kosala mikanda",
        "mk": "Документација",
        "pl": "Dokumentacja",
        "pms": "Documentassion",
        "ps": "لاسوند",
        "pt": "Documentação",
        "tr": "Belgeleme",
        "hans": "帮助文档",
        "hant": "幫助文檔"
    },
    "domainsCorrectedMessage": {
        "ar": "تم تصحيح المجالات التالية تلقائيًا:",
        "en": "The following domains were automatically corrected:",
        "ja": "以下のドメインが自動修正されました：",
        "ln": "Ba domaines oyo elandi e corrigé automatiquement:",
        "mk": "Следниве домени беа автоматски исправени:",
        "pl": "Następujące domeny zostały automatycznie poprawione:",
        "pms": "Ij domini sì-dapress a son ëstait coregiù an automàtich:",
        "pt": "Os domínios seguintes foram corrigidos automaticamente:",
        "tr": "Aşağıdaki alan adları otomatik olarak düzeltildi:",
        "hans": "以下域名已自动修正：",
        "hant": "以下網域已自動修正："
    },
    "domainsToIgnore": {
        "ar": "المجالات التي يجب تجاهلها (مجال واحد لكل سطر)",
        "en": "Domains to Ignore (one per line)",
        "ja": "無視するドメイン（1行に1つ）",
        "kg": "Bisika ya Kuvila (mosi na ndonga mosi)",
        "ln": "Ba domaines oyo esengeli ko ignorer (moko na ligne moko) .",
        "mk": "Домени за занемарување (по еден во секој ред)",
        "pl": "Domeny do ignorowania (jedna na linię)",
        "pms": "Domini da ignoré (un për linia)",
        "pt": "Domínios a Ignorar (um por linha)",
        "tr": "Yok sayılacak alan adları (her satıra bir tane)",
        "hans": "要忽略的域名（每行一个）",
        "hant": "要忽略的網域（每行一個）"
    },
    "enableDisableCategories": {
        "ar": "تمكين/تعطيل الفئات",
        "en": "Enable/Disable Categories",
        "ja": "カテゴリの有効/無効",
        "ln": "Activer/Desactiver ba Catégories",
        "mk": "Овозможи/Оневозможи категории",
        "pl": "Włącz/Wyłącz kategorie",
        "pms": "Ativé o disativé le categorìe",
        "pt": "Ativar/Desativar Categorias",
        "tr": "Kategorileri Etkinleştir/Devre Dışı Bırak",
        "hans": "启用/禁用类别",
        "hant": "啟用/停用類別"
    },
    "filterToggleTooltip": {
        "ar": "انقر لتبديل مرشح هذه الفئة. يمكنك تحديد فئات متعددة. اضغط على مفتاح \"Escape\" لمسح جميع المرشحات.",
        "en": "Click to toggle this category filter. You can select multiple categories. Press Escape to clear all filters.",
        "ja": "このカテゴリフィルタを切り替えるにはクリックしてください。複数のカテゴリを選択できます。Escape キーで全てのフィルタをクリアします。",
        "kg": "Pusa sambu na kusoba filtre ya kitini yai. Nge lenda pona bitini mingi. Kupesa bansangu sambu na kukatula ba filtre yonso.",
        "ln": "Finá mpo na kobongola filtre ya catégorie oyo. Okoki kopona biteni mingi. Press Escape mpo na kolongola ba filtre nyonso.",
        "mk": "Стиснете за префрлање на овој категориски филтер. Можете да изберете повеќе категории. Стиснете на Escape за да ги исчистите сите филтри.",
        "pl": "Kliknij, aby przełączyć ten filtr kategorii. Możesz wybrać wiele kategorii. Naciśnij Escape, aby wyczyścić wszystkie filtry.",
        "pms": "Sgnaché për ativé o disativé cost filtr ëd categorìa. A peul selessioné vàire categorìe. Sgnaché su Scapé për dëscancelé tuti ij filtr.",
        "pt": "Clique para alternar este filtro de categoria. Pode selecionar várias categorias. Pressione \"Escape\" para limpar todos os filtros.",
        "tr": "Bu kategori filtresini açıp kapatmak için tıklayın. Birden fazla kategori seçebilirsiniz. Tüm filtreleri temizlemek için Escape tuşuna basın.",
        "hans": "点击以切换此类别筛选。您可以选择多个类别。按 Escape 清除所有筛选。",
        "hant": "點擊以切換此類別篩選。您可以選擇多個類別。按 Escape 清除所有篩選。"
    },
    "filtersActive": {
        "ar": "المرشحات النشطة",
        "en": " filters active",
        "ja": " つのフィルタが有効",
        "ln": "ba filtres oyo ezali kosala",
        "mk": " активни филтри",
        "pl": " aktywnych filtrów",
        "pms": "filtr ativ",
        "pt": "filtros ativos",
        "tr": "filtreler aktif",
        "hans": " 个筛选生效",
        "hant": " 個篩選生效"
    },
    "hideSocialMediaReliabilityRatings": {
        "ar": "إخفاء تقييمات الموثوقية لروابط وسائل التواصل الاجتماعي من الناشرين غير المصنفين",
        "en": "Hide reliability ratings for social media links from unrated publishers",
        "ja": "未識別の発行元によるソーシャルメディアの情報源について、信頼性評価を非表示にする",
        "mk": "Скриј оценки на меродавност за врски до друштвени медиуми од неоценети објавувачи",
        "pl": "Ukryj oceny wiarygodności linków do mediów społecznościowych, gdzie instytucje odpowiedzialne za linki nie zostały ocenione",
        "pms": "Stërmé le valutassion ëd fidabilità për le liure a dij mojen sossiaj da editor nen valutà",
        "hans": "对于未识别发布者的社交媒体来源，隐藏可靠性评级",
        "hant": "對於未識別發佈者的社群媒體來源，隱藏可靠性評級"
    },
    "ignoreDomainsTabGuidance": {
        "ar": "أدخل النطاقات التي ترغب في استبعادها من كل فئة. لن تُميّز المصادر من هذه النطاقات بأيقونة الفئة المقابلة. أدخل نطاقًا واحدًا في كل سطر بالتنسيق \"example.com\".",
        "en": "Enter domains to exclude from each category. Sources from these domains will not be marked with the corresponding category icon. Enter one domain per line in the format 'example.com'.",
        "ja": "各カテゴリから除外するドメインを入力します。これらのドメインからの情報源には対応するカテゴリアイコンが表示されません。1行に1つのドメインを 'example.com' の形式で入力してください。",
        "ln": "Tyá ba domaines oyo okolongola na catégorie moko na moko. Ba sources oyo ewutaka na ba domaines oyo ekozala marqué te na icône ya catégorie oyo ekokani. Tyá domaine moko na ligne moko na format 'example.com'.",
        "mk": "Внесете домени за изземање од секоја категорија. Изворите од овие домени нема да се означуваат со соодветната категориска икона. Внесувајте по еден домен во секој ред, во форматот „example.com“.",
        "pl": "Wprowadź domeny do wykluczenia z każdej kategorii. Źródła z tych domen nie będą oznaczone odpowiednią ikoną kategorii. Wprowadź jedną domenę na linię w formacie 'przykład.com'.",
        "pms": "Gionté ij domini da esclude da tute le categorìe. Le sorgiss da costi domini a saran pa marcà con la plancia ëd categorìa corëspondenta. Anserì un domini për linia ant ël formà 'esempi.com'.",
        "tr": "Her kategori için hariç tutulacak alan adlarını girin. Bu alan adlarından gelen kaynaklar ilgili kategori simgesiyle işaretlenmeyecektir. Her satıra bir alan adı olacak şekilde 'example.com' biçiminde girin.",
        "hans": "输入要从各类别中排除的域名。来自这些域名的来源将不会标记对应的类别图标。每行输入一个域名，格式为 'example.com'。",
        "hant": "輸入要從各類別中排除的網域。來自這些網域的來源將不會標記對應的類別圖示。每行輸入一個網域，格式為 'example.com'。"
    },
    "invalidDomainFormatMessage": {
        "ar": "تم اكتشاف تنسيق نطاق غير صالح. يجب أن تكون النطاقات بصيغة \"name.tld\" (مثل example.com):",
        "en": "Invalid domain format detected. Domains should be in format \"name.tld\" (e.g., example.com):",
        "ja": "無効なドメイン形式が検出されました。ドメインは \"name.tld\" 形式（例：example.com）である必要があります：",
        "kg": "Bo me mona mutindu ya mbote ya kusala mambu. Bisika fwete vanda na mutindu ya \"name.tld\" (mu mbandu, example.com):",
        "ln": "Format ya domaine ya mabe ezwami. Ba domaines esengeli kozala na format \"name.tld\" (ndakisa, example.com):",
        "mk": "Пронајден е неважечки формат за домен. Домените треба да бидат во форматот „name.tld“ (на пр. example.com):",
        "pl": "Wykryto nieprawidłowy format domeny. Domeny powinny być w formacie \"nazwa.tld\" (np. przykład.com):",
        "pms": "Formà ëd domini nen bon trovà. Ij domini a dovrìo esse ant ël formà «nom.tld» (për es., esempi.com):",
        "tr": "Geçersiz alan adı biçimi algılandı. Alan adları \"name.tld\" biçiminde olmalıdır (örneğin, example.com):",
        "hans": "检测到无效的域名格式。域名应为 \"name.tld\" 格式（如 example.com）：",
        "hant": "偵測到無效的網域格式。網域應為 \"name.tld\" 格式（如 example.com）："
    },
    "loading": {
        "ar": "تحميل...",
        "en": "Loading...",
        "ja": "読み込み中...",
        "kg": "Bo me tula yo na valere...",
        "ln": "Kokotisa biloko...",
        "mk": "Вчитувам...",
        "pl": "Ładowanie...",
        "pms": "A caria...",
        "ps": "بارېږي...",
        "pt": "A carregar...",
        "tr": "Yükleniyor...",
        "hans": "加载中……",
        "hant": "載入中……"
    },
    "local": {
        "ar": "محلي",
        "en": "local",
        "ja": "ローカル",
        "ln": "ya bana-mboka",
        "mk": "месни",
        "pl": "lokalne",
        "pms": "local",
        "ps": "سيمه‌ييز",
        "pt": "local",
        "tr": "yerel",
        "hans": "本地",
        "hant": "本地"
    },
    "localSettingGuidance": {
        "ar": "إعدادات wiki المحلية تتغلب على الإعدادات العالمية.",
        "en": "Local wiki settings override global settings.",
        "ja": "ローカルウィキの設定はグローバル設定を上書きします。",
        "ln": "Bobongisi ya wiki ya mboka elongolaka bobongisi ya mokili mobimba.",
        "mk": "Месните викинагодувања ги заменуваат глобалните.",
        "pl": "Lokalne ustawienia wiki zastępują ustawienia globalne.",
        "pms": "Ij paràmeter wiki locaj a l'ha la precedensa an sij paràmeter globaj.",
        "pt": "As definições locais da wiki substituem as definições globais.",
        "tr": "Yerel wiki ayarları, küresel ayarları geçersiz kılar.",
        "hans": "本地维基设置会覆盖全域设置。",
        "hant": "本地維基設定會覆蓋全域設定。"
    },
    "metaWikiGlobal": {
        "ar": "ميتا ويكي (عالمي)",
        "en": "Meta-Wiki (global)",
        "ja": "メタウィキ (グローバル)",
        "ln": "Meta-Wiki (ya mokili mobimba) .",
        "mk": "Мета (глобално)",
        "pl": "Meta-Wiki (globalne)",
        "pms": "Meta-Wiki (global)",
        "ps": "مېټا-ويکي (ټوليز)",
        "pt": "Meta-Wiki (global)",
        "tr": "Meta-Wiki (küresel)",
        "hans": "元维基 (全域)",
        "hant": "元維基 (全域)"
    },
    "of": {
        "ar": "ل",
        "en": " of ",
        "ja": " /",
        "kg": "ya",
        "ln": "ya",
        "mk": " од",
        "pl": " z",
        "pms": " ëd",
        "ps": "د",
        "pt": "de",
        "hans": " /",
        "hant": " /"
    },
    "optionalComment": {
        "ar": "تعليق اختياري",
        "en": "Optional Comment",
        "ja": "オプションコメント",
        "kg": "Mambu ya nge lenda tuba",
        "ln": "Commentaire oyo okoki kopona",
        "mk": "Незадолж. коментар",
        "pl": "Opcjonalny komentarz",
        "pms": "Coment opsional",
        "ps": "اختياري څرگندونه",
        "pt": "Comentário Opcional",
        "tr": "İsteğe Bağlı Yorum",
        "hans": "可选意见",
        "hant": "可選意見"
    },
    "reliabilityProjects": {
        "ar": "صفحات مشروع الموثوقية",
        "en": "Reliability Project Pages",
        "ja": "信頼性プロジェクトページ",
        "kg": "Lutiti ya Kisalu ya Kutula Ntima",
        "ln": "Lokasa ya mosala",
        "mk": "Проектни страници за меродавност",
        "pl": "Strony projektów wiarygodności",
        "pms": "Pàgine dël proget ëd fidabilità",
        "ps": "باوري پروژې مخونه",
        "pt": "Páginas do Projeto de Confiabilidade",
        "tr": "Güvenilirlik Projesi Sayfaları",
        "hans": "可靠性项目页面",
        "hant": "可靠性專案頁面"
    },
    "save": {
        "ar": "يحفظ",
        "en": "Save",
        "ja": "保存",
        "ln": "Kobikisa",
        "mk": "Зачувај",
        "pl": "Zapisz",
        "pms": "Argistré",
        "ps": "خوندي‌کول",
        "pt": "Guardar",
        "tr": "Kaydet",
        "hans": "保存",
        "hant": "儲存"
    },
    "saving": {
        "ar": "توفير...",
        "en": "Saving...",
        "ja": "保存中...",
        "ln": "Kobomba...",
        "mk": "Зачувувам...",
        "pl": "Zapisywanie...",
        "pms": "A argistra...",
        "ps": "خوندي کېږي...",
        "pt": "A guardar...",
        "tr": "Kaydediliyor...",
        "hans": "保存中……",
        "hant": "儲存中……"
    },
    "selectAtLeastOneCategory": {
        "ar": "الرجاء تحديد فئة واحدة على الأقل",
        "en": "Please select at least one category",
        "ja": "少なくとも1つのカテゴリを選択してください",
        "ln": "Svp pona ata catégorie moko",
        "mk": "Изберете барем една категорија",
        "pl": "Wybierz przynajmniej jedną kategorię",
        "pms": "Për piasì, ch'a selession-a almanch na categorìa",
        "pt": "Por favor, selecione pelo menos uma categoria",
        "tr": "Lütfen en az bir kategori seçin",
        "hans": "请至少选择一个类别",
        "hant": "請至少選擇一個類別"
    },
    "settingsButton": {
        "ar": "استشهد بالإعدادات غير المرئية",
        "en": "Cite Unseen Settings",
        "ja": "Cite Unseen 設定",
        "ln": "Citer Paramètres oyo emonanaka te",
        "mk": "Нагодувања на Cite Unseen",
        "pl": "Ustawienia Cite Unseen",
        "pms": "Paràmeter ëd Cite Unseen",
        "pt": "Definições de Cite Unseen",
        "tr": "Kaynağı Görmeden Alıntılama Ayarları",
        "hans": "Cite Unseen 设置",
        "hant": "Cite Unseen 設定"
    },
    "settingsButtonTooltip": {
        "ar": "تكوين إعدادات Cite Unseen.",
        "en": "Configure Cite Unseen settings.",
        "ja": "Cite Unseen 設定。",
        "ln": "Configurer ba paramètres ya Cite Unseen.",
        "mk": "Поставете ги нагодувањата на Cite Unseen.",
        "pl": "Skonfiguruj ustawienia Cite Unseen.",
        "pms": "Configuré ij paràmeter ëd Cite Unseen.",
        "pt": "Configure as definições de Cite Unseen.",
        "tr": "Kaynağı Görmeden Alıntılama ayarlarını yapılandırın.",
        "hans": "配置 Cite Unseen 设置。",
        "hant": "設定 Cite Unseen 設定。"
    },
    "settingsDialogTitle": {
        "ar": "استشهد بالإعدادات غير المرئية",
        "en": "Cite Unseen Settings",
        "ja": "Cite Unseen 設定",
        "kg": "Bisika ya Ke Monanaka Ve",
        "ln": "Kotanga bisika oyo emonanaka te",
        "mk": "Нагодувања на Cite Unseen",
        "pl": "Ustawienia Cite Unseen",
        "pms": "Paràmeter ëd Cite Unseen",
        "pt": "Definições de Cite Unseen",
        "tr": "Kaynağı Görmeden Alıntılama Ayarları",
        "hans": "Cite Unseen 设置",
        "hant": "Cite Unseen 設定"
    },
    "settingsSaveError": {
        "ar": "خطأ في حفظ الإعدادات:",
        "en": "Error saving settings: ",
        "ja": "設定の保存中にエラーが発生しました：",
        "kg": "Bametode ya kubumba bifu:",
        "ln": "Ba paramètres ya kobomba mabunga:",
        "mk": "Грешка при зачувувањето на нагодувањата:",
        "pl": "Błąd zapisywania ustawień:",
        "pms": "Eror ant l'argistrassion dij paràmeter:",
        "pt": "Erro ao guardar as definições:",
        "tr": "Ayarlar kaydedilirken hata oluştu:",
        "hans": "保存设置时出错：",
        "hant": "儲存設定時發生錯誤："
    },
    "settingsSavedSuccess": {
        "ar": "تم حفظ الإعدادات بنجاح! هل تريد إعادة تحميل الصفحة لتطبيق التغييرات؟",
        "en": "Settings saved successfully! Reload the page to apply changes?",
        "ja": "設定が保存されました！変更を適用するためにページを再読み込みしますか？",
        "kg": "Bo me taninaka yo mbote-mbote! Tula diaka lutiti sambu na kusala bansoba?",
        "ln": "Paramètres ebombami malamu! Recharger page pona ko appliquer ba changements?",
        "mk": "Нагодувањата се успешно зачувани! Да ја превчитам страницата за да ги применам промените?",
        "pl": "Ustawienia zapisane pomyślnie! Przeładować stronę, aby zastosować zmiany?",
        "pms": "Ij paràmeter a son ëstàit argistrà për da bin. Veul-lo carié torna la pàgine për apliché le modìfiche?",
        "pt": "Definições guardadas com sucesso! Recarregar a página para aplicar as alterações?",
        "tr": "Ayarlar başarıyla kaydedildi! Değişiklikleri uygulamak için sayfayı yeniden yüklemek ister misiniz?",
        "hans": "设置已成功保存！重新加载页面以应用更改？",
        "hant": "設定已成功儲存！重新載入頁面以套用變更？"
    },
    "showDashboard": {
        "ar": "إظهار لوحة المعلومات أعلى القوائم المرجعية",
        "en": "Show dashboard above reflists",
        "ja": "参考文献セクションの上にダッシュボードを表示",
        "ln": "Komonisa etanda ya liboso na likolo",
        "mk": "Прикажи управувачница над списоците со наводи",
        "pl": "Pokaż pulpit powyżej list przypisów",
        "pms": "Smon-e ël cruscòt dzora la lista dj'arferiment",
        "pt": "Mostrar o painel acima das listas de referência",
        "tr": "Kaynakça listelerinin üzerinde kontrol panelini göster",
        "hans": "在参考文献区段上方显示仪表板",
        "hant": "在參考文獻區段上方顯示儀表板"
    },
    "showSuggestionsButton": {
        "ar": "زر إظهار الاقتراحات",
        "en": "Show suggestions button",
        "ja": "提案ボタンを表示",
        "kg": "Songa bangindu",
        "ln": "Bouton ya kolakisa makanisi",
        "mk": "Прикажи копче за предлози",
        "pl": "Pokaż przycisk sugestii",
        "pms": "Smon-e ël boton dij sugeriment",
        "pt": "Mostrar botão de sugestões",
        "tr": "Öneriler butonunu göster",
        "hans": "显示建议按钮",
        "hant": "顯示建議按鈕"
    },
    "showing": {
        "ar": "عرض",
        "en": "Showing ",
        "ja": "表示中",
        "kg": "Kumonisa",
        "ln": "Komonisama",
        "mk": "Се прикажува",
        "pl": "Pokazuje",
        "pms": "Smon-e",
        "ps": "ښودل",
        "pt": "A mostrar",
        "tr": "Gösteriliyor",
        "hans": "显示",
        "hant": "顯示"
    },
    "sourceUrl": {
        "ar": "رابط المصدر",
        "en": "Source URL",
        "ja": "ソースURL",
        "kg": "Source URL",
        "ln": "URL ya source",
        "mk": "Изворна URL",
        "pl": "URL źródła",
        "pms": "Sorgiss URL",
        "ps": "سرچينې وېبتړ",
        "pt": "URL Fonte",
        "tr": "Kaynak URL'si",
        "hans": "来源网址",
        "hant": "來源網址"
    },
    "submit": {
        "ar": "فتح نموذج التحرير",
        "en": "Open Edit Form",
        "ja": "編集フォームを開く",
        "ln": "Fungola Formulaire ya Bobongisi",
        "mk": "Отвори образец за уредување",
        "pl": "Otwórz formularz edycji",
        "pms": "Duverté ël formolari ëd modìfica",
        "ps": "سمون فورمه پرانېستل",
        "pt": "Abrir Formulário de Edição",
        "tr": "Düzenleme Formunu Aç",
        "hans": "打开编辑表单",
        "hant": "開啟編輯表單"
    },
    "submitting": {
        "ar": "افتتاح...",
        "en": "Opening...",
        "ja": "開いています...",
        "ln": "Kofungola...",
        "mk": "Отворам...",
        "pl": "Otwieranie...",
        "pms": "An camin ch'as duverta...",
        "ps": "پرانېستل...",
        "pt": "A abrir...",
        "tr": "Açılıyor...",
        "hans": "打开中……",
        "hant": "開啟中……"
    },
    "suggestCategorization": {
        "ar": "اقترح تصنيفًا لهذا الاقتباس",
        "en": "Suggest categorization for this citation",
        "ja": "この引用の分類を提案",
        "kg": "Beto baka ngindu ya kukabisa na bitini sambu na mambu yai",
        "ln": "Pesa likanisi ya kosala categorisation mpo na citation oyo",
        "mk": "Предложи категоризација за овој навод",
        "pl": "Zasugeruj kategoryzację dla tego cytowania",
        "pms": "Sugerì na categorisassion për costa sitassion",
        "ps": "د دې اخځ ډلبندۍ لپاره وړانديز کول",
        "pt": "Sugerir a categorização para esta citação",
        "tr": "Bu kaynak için kategori öner",
        "hans": "为此引用建议分类",
        "hant": "為此引用建議分類"
    },
    "suggestedCategories": {
        "ar": "الفئات المقترحة",
        "en": "Suggested Categories",
        "ja": "提案カテゴリ",
        "ln": "Ba catégories oyo ba proposer",
        "mk": "Предложени категории",
        "pl": "Sugerowane kategorie",
        "pms": "Categorìe sugerìe",
        "ps": "وړانديز شوې وېشنيزې",
        "pt": "Categorias Sugeridas",
        "tr": "Önerilen Kategoriler",
        "hans": "建议类别",
        "hant": "建議類別"
    },
    "suggestionDialogTitle": {
        "ar": "اقتراح التصنيف",
        "en": "Suggest Categorization",
        "ja": "分類の提案",
        "kg": "Bangindu ya kukabisa na bimvuka",
        "ln": "Likanisi ya kokabola yango na biteni",
        "mk": "Предложи категоризација",
        "pl": "Zasugeruj kategoryzację",
        "pms": "Categorisassion sugerìa",
        "ps": "وړانديز شوې ډلبندي",
        "pt": "Sugerir Categorização",
        "tr": "Kategorizasyon Önerisi",
        "hans": "建议分类",
        "hant": "建議分類"
    },
    "suggestionSubmitError": {
        "ar": "حدث خطأ أثناء فتح نموذج الاقتراح:",
        "en": "Error opening suggestion form: ",
        "ja": "提案フォームを開く際にエラーが発生しました：",
        "ln": "Libunga na kofungola formulaire ya likanisi:",
        "mk": "Грешка при отворањето на образецот за предлози:",
        "pl": "Błąd otwierania formularza sugestii:",
        "pms": "Eror ant la duvertura dël formolari ëd sugeriment:",
        "tr": "Öneri formu açılırken hata oluştu:",
        "hans": "打开建议表单时出错：",
        "hant": "開啟建議表單時發生錯誤："
    },
    "suggestionSubmitted": {
        "ar": "تم فتح نموذج التعديل في علامة تبويب جديدة! يجب ملء المحتوى مسبقًا تلقائيًا. إذا لم يكن كذلك، فقد تم نسخ محتوى الاقتراح إلى الحافظة.",
        "en": "Edit form opened in new tab! The content should be pre-filled automatically. If not, the suggestion content has been copied to your clipboard.",
        "ja": "編集フォームが新しいタブで開かれました！内容は自動的に事前入力されるはずです。されていない場合は、提案内容がクリップボードにコピーされています。",
        "ln": "Formulaire ya éditer efungwami na onglet ya sika! Esengeli kotondisa liboso makambo oyo ezali na kati yango moko. Soki te, makambo oyo ezali na makanisi esalemi kopi na tableau de bord na yo.",
        "mk": "Образецот за уредување е отворен во ново јазиче! Содржината треба да е автоматски пополнета. Ако не е, содржината на предлогот е прекопирана во вашиот меѓусклад.",
        "pl": "Formularz edycji otwarty w nowej karcie! Zawartość powinna być automatycznie wypełniona. Jeśli nie, zawartość sugestii została skopiowana do schowka.",
        "pms": "Ël formolari ëd modìfica a l'é duvertasse an na neuva scheda! Ël contnù a dovrìa esse già compilà an automàtich. Dësnò, ël contnù dël sugeriment a l'é stàit copià su soa taulëtta.",
        "tr": "Düzenleme formu yeni sekmede açıldı! İçerik otomatik olarak önceden doldurulmuş olmalı. Aksi takdirde öneri içeriği panonuza kopyalanmıştır.",
        "hans": "编辑表单已在新标签页中打开！内容应自动预填。如未预填，建议内容已复制到您的剪贴板。",
        "hant": "編輯表單已在新分頁中開啟！內容應自動預填。如未預填，建議內容已複製到您的剪貼簿。"
    },
    "suggestionsDialogGuidance": {
        "ar": "اختر فئةً واحدةً أو أكثر لهذا الاستشهاد، ويمكنك إضافة تعليقٍ إن شئت. ستُفتح لك علامة تبويب جديدة على ميتا ويكي تحتوي على نموذج تعديل مُعبأ مسبقًا، حيث يمكنك إرسال اقتراحك للمراجعة.",
        "en": "Select one or more categories for this citation and optionally provide a comment. A new tab will open with a pre-filled edit form on Meta Wiki where you can submit your suggestion for review.",
        "ja": "この引用に対して1つ以上のカテゴリを選択し、オプションでコメントを提供してください。Meta Wikiの事前入力された編集フォームで新しいタブが開き、コミュニティレビューのために提案を提出できます。",
        "kg": "Pona kitini mosi to mingi sambu na mambu yai mpi pesa komantere. Tab ya mpa ta kanguka ti formilere ya kutomisa yina bo me fulusa na ntwala na Meta Wiki kisika nge lenda tinda ngindu na nge sambu na kutomisa yo.",
        "ln": "Pona catégorie moko to ebele pona citation oyo pe na option pesa commentaire. Onglet ya sika ekofungwama na formulaire ya bobongisi oyo etondisami liboso na Meta Wiki esika okoki kotinda likanisi na yo mpo na botali.",
        "mk": "Изберете една или повеќе категории за овој навод и, по желба, внесете коментар. Ќе се отвори ново јазиче со веќе пополнет образец за уредување на Мета, каде ќе можете да го поднесете предлогот на разгледување.",
        "pl": "Wybierz jedną lub więcej kategorii dla tego cytowania i opcjonalnie podaj komentarz. Otworzy się nowa karta z wstępnie wypełnionym formularzem edycji na Meta Wiki, gdzie możesz przesłać swoją sugestię do przeglądu.",
        "pms": "Ch'a selession-a un-a o pi catergorìe për costa sitassion e, ëd fasson opsional, ch'a fornissa un coment. As duvertërà na neuva scheda con un formolari ëd modìfica già compilà su Meta Wiki, andoa a peul mandé sò sugeriment për na revision.",
        "tr": "Bu kaynak için bir veya daha fazla kategori seçin ve isteğe bağlı olarak bir yorum ekleyin. Meta Wiki'de, önerinizi incelemeye gönderebileceğiniz önceden doldurulmuş bir düzenleme formu içeren yeni bir sekme açılacaktır.",
        "hans": "为此引用选择一个或多个类别，并可选择性地提供意见。将打开一个新标签页，其中包含 Meta Wiki 上预填的编辑表单，您可以在此提交建议供社区审查。",
        "hant": "為此引用選擇一或多個類別，並可選擇性地提供意見。將開啟一個新分頁，其中包含 Meta Wiki 上預填的編輯表單，您可以在此提交建議供社群審查。"
    },
    "suggestionsDialogReliabilityGuidance": {
        "ar": "بالنسبة لفئات الموثوقية (المحظورة، المهملة، الموثوقة عمومًا، غير الموثوقة عمومًا، الموثوقة بشكل طفيف، لا يوجد إجماع)، يُرجى البحث عن فرصة للتوصل إلى إجماع في إحدى صفحات المشروع التالية. يتم تحديث فئات الموثوقية بانتظام بناءً على إجماع المجتمع الموثق في هذه الصفحات.",
        "en": "For reliability categories (blacklisted, deprecated, generally reliable, generally unreliable, marginally reliable, no consensus), please seek the opportunity to reach consensus on one of the following project pages. The reliability categories are updated regularly based on community consensus documented on these pages.",
        "ja": "信頼性カテゴリ（ブラックリスト入り、非推奨、通常信頼できる、通常信頼できない、限られた信頼性、コンセンサスなし）については、以下のプロジェクトページでコンセンサスに達する機会を探してください。これらのページに記録されたコミュニティのコンセンサスに基づいて、信頼性カテゴリは定期的に更新されます。",
        "kg": "Sambu na bitini ya kutudila ntima (yina kele na lisiti ya mbi, yina bo me sadila diaka ve, yina bo lenda tudila ntima ve, yina bantu lenda tudila ve ntima, yina bo ke ndimaka ve), beto ke lomba nge na kusosa dibaku ya kuwakana na mosi ya balutiti ya kisalu ya ke landa. Bo ke tomisaka bitini ya kutudila ntima mbala na mbala na kutadila kuwakana ya bantu yina bo me sonikaka na balutiti yai.",
        "ln": "Mpo na biteni ya bondimi (oyo ezali na liste ya moindo, oyo esili kosalelama te, oyo ezali mingimingi ya kotyela motema, oyo ezali mingimingi ya kotyela motema te, oyo ezali na bondimi moke, boyokani te), tosengi yo oluka libaku ya kozwa boyokani na moko ya nkasa ya mosala oyo elandi. Ba catégories ya bondimi ezongisami na mikolo na tango na kotalaka boyokani ya baimboka oyo ekomami na nkasa oyo.",
        "mk": "За категории на меродавност (на црн список, застарени, начелно меродавни, начелно немеродавни, маргинално меродавни, нема консензус), трудете се да постигнете консензус на една од следниве проектни страници. Категориите на меродавност се подновуваат редовно, во согласност со консензусот на заедницата документиран на овие страници.",
        "pl": "Dla kategorii wiarygodności (na czarnej liście, wycofane z użycia, ogólnie wiarygodne, ogólnie niewiarygodne, ledwo wiarygodne, brak konsensusu), prosimy o poszukanie możliwości osiągnięcia konsensusu na jednej z następujących stron projektu. Kategorie wiarygodności są regularnie aktualizowane na podstawie konsensusu społeczności udokumentowanego na tych stronach.",
        "pms": "Për le categorìe d'afidament (ant la lista nèira, dësconsejà, an general fidàbil, an general nen fidàbil, fidàbil ëd fasson marginal, gnun consens), për piasì sërché ëd rivé a 'n consens ansima a un-a dle pàgine ëd proget sì-dapress. Le categorìe d'afidament a son agiornà ëd fasson regolar basand-se an sël consens documentà su coste pàgine.",
        "tr": "Güvenilirlik kategorileri (kara listeye alınmış, kullanımdan kaldırılmış, genel olarak güvenilir, genel olarak güvenilmez, kısmen güvenilir, fikir birliği yok) için lütfen aşağıdaki proje sayfalarından birinde fikir birliğine varma fırsatını arayın. Güvenilirlik kategorileri, bu sayfalarda belgelenen topluluk fikir birliğine dayanarak düzenli olarak güncellenmektedir.",
        "hans": "对于可靠性类别（列入黑名单、应停用、通常可靠、通常不可靠、半可靠、无共识），请寻求在以下项目页面上达成共识的机会。可靠性类别会根据这些页面上记录的社区共识定期更新。",
        "hant": "對於可靠性類別（列入黑名單、應停用、通常可靠、通常不可靠、半可靠、無共識），請尋求在以下專案頁面上達成共識的機會。可靠性類別會根據這些頁面上記錄的社群共識定期更新。"
    },
    "suggestionsToggleButton": {
        "ar": "اقتراح الفئات",
        "en": "Suggest Categories",
        "ja": "分類を提案",
        "ln": "Pesá makanisi ya Catégories",
        "mk": "Предложи категории",
        "pl": "Zasugeruj kategorie",
        "pms": "Sugerì dle categorìe",
        "ps": "وړانديز شوې وېشنيزې",
        "pt": "Categorias Sugeridas",
        "tr": "Kategorileri Öner",
        "hans": "建议分类",
        "hant": "建議分類"
    },
    "suggestionsToggleTooltip": {
        "ar": "تمكين وضع الاقتراح لاقتراح تصنيف الاستشهادات",
        "en": "Enable suggestion mode to propose categorization for citations",
        "ja": "引用の分類を提案するための提案モードを有効にする",
        "kg": "Kupesa ngindu sambu na kupesa ngindu ya kukabisa na bitini sambu na mambu ya bo me vutukila",
        "ln": "Kopesa likanisi mpo na kopesa likanisi ya kokabola maloba",
        "mk": "Овозможи то режмот за предлози за да ви се предлагаат категории за наводи",
        "pl": "Włącz tryb sugestii, aby zaproponować kategoryzację dla cytowań",
        "pms": "Ativé ël meud ëd sugeriment për propon-e la categorisassion për le sitassion",
        "pt": "Ativar o modo de sugestão para propor categorização para as citações",
        "tr": "Kaynaklara yönelik kategorizasyon önermek için öneri modunu etkinleştirin",
        "hans": "启用建议模式以为引用提议分类",
        "hant": "啟用建議模式以為引用提議分類"
    },
    "tabAdditionalDomains": {
        "ar": "المجالات الإضافية",
        "en": "Additional Domains",
        "ja": "追加ドメイン",
        "kg": "Bisika ya Nkaka",
        "ln": "Ba Domaines ya kobakisa",
        "mk": "Дополнителни домени",
        "pl": "Dodatkowe domeny",
        "pms": "Domini adissionaj",
        "ps": "زياتي واک‌سيمې",
        "pt": "Domínios Adicionais",
        "tr": "Ek Alan Adları",
        "hans": "额外域名",
        "hant": "額外網域"
    },
    "tabAdditionalStrings": {
        "ar": "سلاسل عناوين URL الإضافية",
        "en": "Additional URL Strings",
        "ja": "追加URL文字列",
        "ln": "Ba nsinga mosusu ya URL",
        "mk": "Дополнителни URL-низи",
        "pl": "Dodatkowe ciągi URL",
        "pms": "Stringhe URL adissionaj",
        "pt": "Strings de URL Adicionais",
        "tr": "Ek URL Dizeleri",
        "hans": "额外网址字符串",
        "hant": "額外網址字串"
    },
    "tabCategories": {
        "ar": "فئات",
        "en": "Categories",
        "ja": "カテゴリ",
        "ln": "Ba catégories",
        "mk": "Категории",
        "pl": "Kategorie",
        "pms": "Categorìe",
        "ps": "وېشنيزې",
        "pt": "Categorias",
        "tr": "Kategoriler",
        "hans": "类别",
        "hant": "類別"
    },
    "tabGeneral": {
        "ar": "عام",
        "en": "General",
        "ja": "全般",
        "ln": "Mbala mingi",
        "mk": "Општо",
        "pl": "Ogólne",
        "pms": "General",
        "ps": "ټولواله",
        "pt": "Geral",
        "tr": "Genel",
        "hans": "常规",
        "hant": "一般"
    },
    "tabIgnoreDomains": {
        "ar": "تجاهل المجالات",
        "en": "Ignore Domains",
        "ja": "ドメインを無視",
        "kg": "Kuvila Bisika",
        "ln": "Ignorer ba Domaines",
        "mk": "Занемари домени",
        "pl": "Ignoruj domeny",
        "pms": "Ignoré ij domini",
        "ps": "واک‌سيمې له پامه غورځول",
        "pt": "Ignorar Domínios",
        "tr": "Alan Adlarını Yoksay",
        "hans": "忽略域名",
        "hant": "忽略網域"
    },
    "totalCitations": {
        "ar": "المجموع",
        "en": "Total ",
        "ja": "合計",
        "kg": "Ntalu na yo",
        "ln": "Mobimba",
        "mk": "Вкупно",
        "pl": "Łącznie",
        "pms": "Total",
        "ps": "ټولټال",
        "pt": "Total",
        "tr": "Toplam",
        "hans": "共",
        "hant": "共"
    },
    "viewSettingsFrom": {
        "ar": "عرض الإعدادات من:",
        "en": "View settings from:",
        "ja": "設定を表示：",
        "ln": "Tala ba paramètres uta na:",
        "mk": "Погл. нагодувања од:",
        "pl": "Zobacz ustawienia z:",
        "pms": "Smon-e ij paràmeter da:",
        "ps": "له لاندې ځای څخه د اوڼنو کتل:",
        "pt": "Ver definições de:",
        "tr": "Ayarları şuradan görüntüleyin:",
        "hans": "检视设置：",
        "hant": "檢視設定："
    }
};

    // Load sources data  
var CiteUnseenData = {
    _sourceRevisions: null, // Stores revision IDs fetched from cite-unseen-revids

    /**
     * Definition page names for source lists. Prefixed with "Cite Unseen/sources/".
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
        'enFILMR',
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
            "blacklisted", [
                ["enRSP", "enRspBlacklisted"],
                ["zhRSP", "zhRspBlacklisted"],
                ["enKOREAS", "enKoreasBlacklisted"]
            ],
        ], [
            "deprecated", [
                ["enRSP", "enRspDeprecated"],
                ["zhRSP", "zhRspDeprecated"]
            ],
        ], [
            "generallyUnreliable", [
                ["enRSP", "enRspGenerallyUnreliable"],
                ["zhRSP", "zhRspGenerallyUnreliable"],
                ["enAMS", "enAmsGenerallyUnreliable"],
                ["enAS", "enAsGenerallyUnreliable"],
                ["enJAPANS", "enJapansGenerallyUnreliable"],
                ["enKOREAS", "enKoreasGenerallyUnreliable"],
                ["enNPPSG/1", "enNppsgGenerallyUnreliable"],
                ["enVGS", "enVgsGenerallyUnreliable"],
                ["zhACGS", "zhAcgsGenerallyUnreliable"],
                ["zhVGS", "zhVgsGenerallyUnreliable"],
                ["enFILMR", "enFilmrGenerallyUnreliable"]
            ],
        ], [
            "marginallyReliable", [
                ["enRSP", "enRspMarginallyReliable"],
                ["zhRSP", "zhRspMarginallyReliable"],
                ["enAMS", "enAmsMarginallyReliable"],
                ["enJAPANS", "enJapansMarginallyReliable"],
                ["enKOREAS", "enKoreasMarginallyReliable"],
                ["enVGS", "enVgsMarginallyReliable"],
                ["zhACGS", "zhAcgsMarginallyReliable"],
                ["zhVGS", "zhVgsMarginallyReliable"]
            ],
        ], [
            "multi", [
                ["enRSP", "enRspMulti"],
                ["zhRSP", "zhRspMulti"],
                ["enNPPSG/2", "enNppsgMulti"],
                ["enVGS", "enVgsMulti"],
                ["zhACGS", "zhAcgsMulti"],
                ["zhVGS", "zhVgsMulti"]
            ],
        ], [
            "generallyReliable", [
                ["enRSP", "enRspGenerallyReliable"],
                ["zhRSP", "zhRspGenerallyReliable"],
                ["enAMS", "enAmsGenerallyReliable"],
                ["enAS", "enAsGenerallyReliable"],
                ["enJAPANS", "enJapansGenerallyReliable"],
                ["enKOREAS", "enKoreasGenerallyReliable"],
                ["enNPPSG/2", "enNppsgGenerallyReliable"],
                ["enVGS", "enVgsGenerallyReliable"],
                ["zhACGS", "zhAcgsGenerallyReliable"],
                ["zhVGS", "zhVgsGenerallyReliable"],
                ["enFILMR", "enFilmrGenerallyReliable"]
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
        'enFILMR': 'en:Wikipedia:WikiProject Film/Resources',
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
    createApiInstance: function () {
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
    processApiResponse: function (response) {
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
    processCategorizedRules: function (fulltext) {
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
        // Add 'Cite_Unseen/sources/' to the beginning each of the source names, then join them with '|'.
        let source_titles = this.citeUnseenSources.map(source => `Cite_Unseen/sources/${source}`).join('|');

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
        const headerRegex = /^(={3})([^=]+)\1$/gm;
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
            if (key) {
                if (rest.length) {
                    // Key-value pair; if key is '1', map to 'url'.
                    rule[key.trim() === '1' ? 'url' : key.trim()] = rest.join('=').trim();
                } else {
                    // Only a single value without '='.
                    rule['url'] = key.trim();
                }
            }
        });
        return Object.keys(rule).length ? rule : null;  // Empty object should be falsy
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
            console.warn('[Cite Unseen][sources] Failed to fetch revision IDs:', error.message);
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
     * Validate the structure of the data object.
     * @param data {Object} The data object to validate.
     * @returns {boolean} True if valid, false otherwise.
     */
    isValidData: function (data) {
        if (!data || typeof data !== 'object') return false;
        if (!data.getCategorizedRules || typeof data.getCategorizedRules !== 'function') return false;
        if (!data.citeUnseenCategories || typeof data.citeUnseenCategories !== 'object') return false;
        if (!data.citeUnseenCategoryTypes || !Array.isArray(data.citeUnseenCategoryTypes)) return false;
        if (!data.citeUnseenChecklists || !Array.isArray(data.citeUnseenChecklists)) return false;
        if (!data.citeUnseenCategoryData || typeof data.citeUnseenCategoryData !== 'object') return false;
        return true;
    },

    /**
     * Get categorized rules.
     * Uses specified revision IDs when available, otherwise fetches latest revisions.
     * @returns {Promise<Object.<string, Object[]>>} An object containing categories and their corresponding rules.
     */
    getCategorizedRules: async function () {
        const CACHE_KEY = 'CiteUnseenSourcesCache';
        const CACHE_TTL_MS = 3 * 60 * 60 * 1000; // 3 hours

        // Try cache first
        let cached;
        try {
            const raw = sessionStorage.getItem(CACHE_KEY);
            if (raw) {
                cached = JSON.parse(raw);
                if (cached && cached.timestamp && (Date.now() - cached.timestamp) < CACHE_TTL_MS && cached.data && this.isValidData(cached.data)) {
                    return cached.data;
                }
            }
        } catch (e) {
            console.warn('[Cite Unseen][sources] Cache read failed', e);
        }

        // Build fresh data
        let data;
        try {
            // Check if we have any revision IDs specified
            const revisionIds = await this.getSpecifiedRevisionIds();
            if (revisionIds.length > 0) {
                // Use revision-specific method if any revision IDs are specified
                data = await this.getCategorizedRulesFromRevisions(revisionIds);
            } else {
                // Fall back to latest revisions
                const fulltext = await this.getFullText();
                data = this.processCategorizedRules(fulltext);
            }
        } catch (e) {
            console.error('[Cite Unseen][sources] Failed to fetch source data', e);

            // On failure but we may still have stale cache
            if (cached && cached.data && this.isValidData(cached.data)) {
                return cached.data;
            }
            throw e; // rethrow original error
        }

        // Write cache
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
        } catch (e) {
            console.warn('[Cite Unseen][sources] Cache write failed', e);
        }

        return data;
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
        vueApp: null,
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
                'cite_unseen_show_suggestions',
                'cite_unseen_hide_social_media_reliability_ratings'
            ],

            mergeableProps: ['categories', 'domainIgnore', 'additionalDomains', 'additionalStrings'],
            booleanProps: ['dashboard', 'showSuggestions', 'hideSocialMediaReliabilityRatings'],

            globalMapping: {
                categories: 'cite_unseen_categories',
                domainIgnore: 'cite_unseen_domain_ignore',
                additionalDomains: 'cite_unseen_additional_domains',
                additionalStrings: 'cite_unseen_additional_strings',
                dashboard: 'cite_unseen_dashboard',
                showSuggestions: 'cite_unseen_show_suggestions',
                hideSocialMediaReliabilityRatings: 'cite_unseen_hide_social_media_reliability_ratings'
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
            const coinsAuthor = coins['rft.au'] || coins['rft.aulast'];  // Also consider author fields as potential publisher names
            if (!(coinsPub || coinsAuthor) || !rule['pub']) return false;
            const coinsPubCombined = CiteUnseen.ensureArray(coinsPub).concat(CiteUnseen.ensureArray(coinsAuthor));

            if (!rule._cachedPublisherRegex) {
                rule._cachedPublisherRegex = new RegExp(rule['pub'], 'i');
            }
            return CiteUnseen.ensureArray(coinsPubCombined).some(publisher =>
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
            if (typeof rule['url'] !== 'string' || rule['url'] === '') return false;
            const rftIds = CiteUnseen.ensureArray(coins['rft_id']);
            if (rftIds.length === 0) return false;
            return rftIds.some(rftId => CiteUnseen.urlRegex(rule['url']).test(rftId));
        },

        /**
         * Check if source's URL string matches rule
         * @param {Object} coins - COinS object
         * @param {Object} rule - Rule object
         * @returns {boolean} Whether URL string matches
         */
        matchUrlString: function (coins, rule) {
            if (typeof rule['url_str'] !== 'string' || rule['url_str'] === '') return false;
            const rftIds = CiteUnseen.ensureArray(coins['rft_id']);
            if (rftIds.length === 0) return false;
            return rftIds.some(rftId => rftId.includes(rule['url_str']));
        },

        /**
         * Find matching reliability categories for a citation, prioritizing current language.
         * Returns one match for current language, or all matches from other languages if none for current language.
         * When there are conflicting evaluations within a language, defer to the one that has more conditions.
         * @param {Object} coins - COinS object
         * @param {Object} filteredCategorizedRules - Filtered rules by category
         * @returns {Array} Array of match objects with type, name, and language
         */
        findReliabilityMatch: function (coins, filteredCategorizedRules) {
            const currentLanguage = mw.config.get('wgContentLanguage');
            const languageMatches = {}, languageMultiCandidates = {}, languageCache = new Map();

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
                    let hasDirectMatch = false, hasConstrainedMatch = false;

                    for (const rule of rules) {
                        const specificity = (Boolean(rule['author']) ? 1.5 : 0) + (Boolean(rule['date']) ? 1 : 0) + (Boolean(rule['pub']) ? 0.7 : 0);
                        if (CiteUnseen.match(coins, rule)) {
                            hasDirectMatch = true;
                            addMatch(languageMatches, language, {
                                type: checklistType,
                                name: checklistName,
                                language: language,
                                spec: specificity
                            });
                            if (specificity === 0) break;  // No need to check further if matched with no conditions
                        } else if (specificity > 0 && (CiteUnseen.matchUrl(coins, rule) || CiteUnseen.matchUrlString(coins, rule))) {
                            hasConstrainedMatch = true;
                        }
                    }

                    // Track multi candidates if no direct match but has constrained potential
                    if (!hasDirectMatch && hasConstrainedMatch) {
                        addMatch(languageMultiCandidates, language, {
                            type: 'multi',
                            name: checklistName,
                            language: language,
                            spec: -1  // Constrained match takes the least priority
                        });
                    }
                }
            }

            // Function to select best match from multiple candidates
            const selectBestMatch = (matches) => {
                return matches.length === 1 ? matches[0] :
                    matches.reduce((best, current) => (current.spec > best.spec ? current : best));
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

            // Process multi candidates for languages without direct matches but has constrained potential
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
                    // Find reliability and type matches
                    const reliabilityMatches = CiteUnseen.findReliabilityMatch(ref.coins, filteredCategorizedRules);
                    const typeMatches = CiteUnseen.findTypeMatches(ref.coins, filteredCategorizedRules, typeCategories);
                    const hideSocialMediaReliabilityRating = window.cite_unseen_hide_social_media_reliability_ratings === true && typeMatches.includes('social');

                    // Process reliability categories
                    for (const reliabilityMatch of reliabilityMatches) {
                        // If hiding social media reliability ratings, skip generic (spec=0) matches
                        if (hideSocialMediaReliabilityRating && reliabilityMatch.spec === 0) {
                            continue;
                        }

                        // We can show multiple icons from various language source evaluations,
                        // if current language wiki has none.
                        const reliabilityKey = `${reliabilityMatch.type}_${reliabilityMatch.language}`;
                        if (!processedCategories.has(reliabilityKey)) {
                            CiteUnseen.processIcon(iconsDiv, reliabilityMatch.type, reliabilityMatch.name, reliabilityMatch.language);
                            processedCategories.add(reliabilityKey);
                            processedCategories.add(reliabilityMatch.type);
                        }
                    }

                    // Process type categories
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
                message = CiteUnseen.convByVar(CiteUnseenI18n.citationTooltipPrefix) + ' ' + displayName +
                    CiteUnseen.convByVar(CiteUnseenI18n.citationTooltipSuffix) + message + ' ' +
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
         * @param {boolean} minerva - Whether the Minerva skin is used
         * @returns {Element} The settings button element
         */
        createSettingsButton: function (minerva) {
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
                label.textContent = CiteUnseen.convByVar(CiteUnseenI18n.settingsButton);
                settingsButton.appendChild(label);
            }

            settingsButton.onclick = function (e) {
                e.preventDefault();
                CiteUnseen.openSettingsDialog();
            };

            settingsButton.setAttribute('title', CiteUnseen.convByVar(CiteUnseenI18n.settingsButtonTooltip));

            return settingsButton;
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
            const categoryTypes = CiteUnseen.getAllCategoryTypes(); // Order doesn't matter here

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
         * Get all category types used in the system.
         * The order only matters when displaying in the dashboard.
         * @returns {Array} Array of all category type strings
         */
        getAllCategoryTypes: function () {
            return [...CiteUnseen.citeUnseenChecklists.flatMap(x => x[0]).toReversed(), ...CiteUnseen.citeUnseenCategoryTypes.flatMap(x => x[1]), 'unknown'];
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
            const categoryTypes = CiteUnseen.getAllCategoryTypes(); // Order matters here
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
            // Find closest li element
            const listItem = citationElement.closest('li');

            // Return the list item if found, otherwise use the citation element itself
            return listItem || citationElement;
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
                totalElement.innerText = baseText + CiteUnseen.convByVar(CiteUnseenI18n.totalCitations) + ' ' + totalCount + ' ' + citationText;
            } else {
                const filterInfo = dashboard.reflistData.selectedCategories.size > 1 ?
                    " (" + dashboard.reflistData.selectedCategories.size + ' ' + CiteUnseen.convByVar(CiteUnseenI18n.filtersActive) + ")" :
                    "";

                totalElement.innerText = baseText +
                    CiteUnseen.convByVar(CiteUnseenI18n.showing) + ' ' + visibleCount + ' ' +
                    CiteUnseen.convByVar(CiteUnseenI18n.of) + ' ' + totalCount + ' ' +
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
            const userName = mw.config.get('wgUserName');

            if (!userName) {
                return null;
            }

            const encodedUserName = encodeURIComponent(userName);
            const scriptUrl = `//${wikiHost}/w/index.php?title=User:${encodedUserName}/CiteUnseen-Rules.js&ctype=text/javascript&action=raw`;

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
                // Check if logged in
                const userName = mw.config.get('wgUserName');
                if (!userName) {
                    return;
                }

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
                    showSuggestions: metaState.showSuggestions !== undefined ? metaState.showSuggestions : true,
                    hideSocialMediaReliabilityRatings: metaState.hideSocialMediaReliabilityRatings === true || false
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
                    showSuggestions: localRules?.showSuggestions !== undefined ? localRules.showSuggestions : true,
                    hideSocialMediaReliabilityRatings: localRules?.hideSocialMediaReliabilityRatings === true || false
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
         * Decode a URI component, handling potential encoding issues.
         * @param str - The URI component string to decode
         * @returns {string} Decoded string
         */
        decodeURIComponent: async function (str) {
            try {  // First try the built-in function
                return decodeURIComponent(str);
            } catch (e) { }  // Fallback to detection and decoding

            if (!window.jschardet) {
                await mw.loader.getScript('//gitlab-content.toolforge.org/kevinpayravi/jschardet/-/raw/main/dist/jschardet.min.js?mime=text/javascript');
            }

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
        },

        /**
         * Find all <cite> tags and parse them into COinS objects; locate the position of {{reflist}}.
         */
        findCitations: async function () {
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
                    let coinsString = await CiteUnseen.decodeURIComponent(coinsTag.getAttribute('title'));
                    coinsObject = CiteUnseen.parseCoinsString(coinsString);

                    // Fallback to rfr_id if rft_id is missing
                    if (!coinsObject['rft_id'] && coinsObject['rfr_id']) {
                        coinsObject['rft_id'] = coinsObject['rfr_id'];
                    }

                    // As a last resort, try to get the href attribute of the <a> tag inside the cite
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
                    CiteUnseen.refLinks.push(...CiteUnseen.ensureArray(coinsObject['rft_id']));
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
            const reflists = [
                ...Array.from(
                    // div>ol.references captures most standard reference lists inside a containing div
                    // div.refbegin captures reference lists using Template:Refbegin
                    document.querySelectorAll(`#mw-content-text .mw-parser-output div>ol.references,
                        #mw-content-text .mw-parser-output div.refbegin>ul`),
                    (reflist) => reflist.parentNode // Use parent node as reflist element
                ),
                ...Array.from(
                    // Captures ol.references lists at the "root" level i.e. no containing div
                    document.querySelectorAll(`#mw-content-text .mw-parser-output > ol.references`)
                )
            ];
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
                showSuggestions: true,
                hideSocialMediaReliabilityRatings: false
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
                showSuggestions: true,
                hideSocialMediaReliabilityRatings: false
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
                        hideSocialMediaReliabilityRatings: CiteUnseen.convByVar(CiteUnseenI18n.hideSocialMediaReliabilityRatings),
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
                                showSuggestions: true,
                                hideSocialMediaReliabilityRatings: false
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
                                showSuggestions: true,
                                hideSocialMediaReliabilityRatings: false
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
                                            showSuggestions: true,
                                            hideSocialMediaReliabilityRatings: false
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
                                            showSuggestions: true,
                                            hideSocialMediaReliabilityRatings: false
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
                                this.settings.hideSocialMediaReliabilityRatings = targetRules.hideSocialMediaReliabilityRatings === true;
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

                                this.settings.hideSocialMediaReliabilityRatings = targetRules.hideSocialMediaReliabilityRatings !== undefined ?
                                    targetRules.hideSocialMediaReliabilityRatings :
                                    (metaRules.hideSocialMediaReliabilityRatings === true);
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
                                showSuggestions: this.settings.showSuggestions,
                                hideSocialMediaReliabilityRatings: this.settings.hideSocialMediaReliabilityRatings
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

                                const correctionMessage = CiteUnseen.convByVar(CiteUnseenI18n.domainsCorrectedMessage) + '\n\n' + correctionMessages.join('\n');

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
                                const errorMessage = CiteUnseen.convByVar(CiteUnseenI18n.invalidDomainFormatMessage) + '\n\n' + validationErrors.join('\n');

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
                                    <a href="https://meta.wikimedia.org/wiki/Cite_Unseen" target="_blank" class="cite-unseen-dialog-docs-link">
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
                                    <cdx-checkbox v-model="settings.hideSocialMediaReliabilityRatings">
                                        {{ $options.i18n.hideSocialMediaReliabilityRatings }}
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

                if (settings.hideSocialMediaReliabilityRatings === true) {
                    content += `\n// Hide social media reliability ratings setting
cite_unseen_hide_social_media_reliability_ratings = ${settings.hideSocialMediaReliabilityRatings};`;
                }
            } else {
                // For local wiki, include boolean settings if they differ from Meta settings
                const metaRules = CiteUnseen.getMetaRulesFromGlobals();

                const metaDashboard = metaRules.dashboard !== false; // Meta default logic
                const metaShowSuggestions = metaRules.showSuggestions !== false; // Meta default logic
                const metaRulesHideSocialMedia = metaRules.hideSocialMediaReliabilityRatings === true; // Meta default logic

                if (settings.dashboard !== metaDashboard) {
                    content += `\n\n// Dashboard visibility setting
cite_unseen_dashboard = ${settings.dashboard};`;
                }

                if (settings.showSuggestions !== metaShowSuggestions) {
                    content += `\n\n// Suggestions button visibility setting
cite_unseen_show_suggestions = ${settings.showSuggestions};`;
                }

                if (settings.hideSocialMediaReliabilityRatings !== metaRulesHideSocialMedia) {
                    content += `\n\n// Hide social media reliability ratings setting
cite_unseen_hide_social_media_reliability_ratings = ${settings.hideSocialMediaReliabilityRatings};`;
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
         * @param {boolean} minerva - Whether Minerva skin is active
         * @param {Object} reflistData - Reference list data
         * @return {HTMLElement} The suggestions toggle button element
         */
        createSuggestionsToggleButton: function (minerva, reflistData) {
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
                label.textContent = CiteUnseen.convByVar(CiteUnseenI18n.suggestionsToggleButton);
                suggestionsToggleButton.appendChild(label);
            }

            suggestionsToggleButton.onclick = function (e) {
                e.preventDefault();

                suggestionsToggleButton.classList.toggle('cite-unseen-suggestions-active');
                suggestionsToggleButton.classList.toggle('cite-unseen-suggestions-default');

                const suggestionsMode = suggestionsToggleButton.classList.contains('cite-unseen-suggestions-active');
                CiteUnseen.toggleSuggestionPlusSigns(suggestionsMode, reflistData);
            };

            suggestionsToggleButton.setAttribute('title', CiteUnseen.convByVar(CiteUnseenI18n.suggestionsToggleTooltip));

            return suggestionsToggleButton;
        },

        /**
         * Show or hide plus signs next to citations for suggestions
         * @param {boolean} suggestionsMode - Whether suggestions mode is active
         * @param {Object} reflistData - Reference list data
         */
        toggleSuggestionPlusSigns: function (suggestionsMode, reflistData) {
            reflistData.refs.forEach(ref => {
                // Get the citation container (usually the <li> element)
                const citationContainer = CiteUnseen.getCitationContainer(ref.cite);
                if (!citationContainer) return;

                let plusSign = citationContainer.querySelector('.cite-unseen-suggestion-plus');

                if (suggestionsMode) {
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

                    let editUrl = baseUrl + '?title=' + encodeURIComponent('Talk:Cite_Unseen/Suggestions');
                    editUrl += '&action=edit';
                    editUrl += '&section=new';
                    editUrl += '&preload=' + encodeURIComponent('Cite_Unseen/Suggestions/Template');
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
         * Used to insert settings + suggest buttons in header
         * @param {Element} reflistElement - The reflist element to search from
         * @returns {Element|null} The header element before reflist, or null if not found
         */
        findHeaderBeforeReflist: function (reflistElement) {
            let searchElement = reflistElement;

            // Traverse backwards to find the nearest preceding header
            for (let level = 0;; level++) {
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
        },

        /**
         * Create a button section with Cite Unseen buttons
         * @param {string} sectionClass - CSS class for the section
         * @param {Object} reflistData - The reflist data object
         * @returns {Element} The created button section element
         */
        createButtonSection: function (sectionClass, reflistData) {
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
            section.appendChild(CiteUnseen.createSettingsButton(minerva));

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
                section.appendChild(CiteUnseen.createSuggestionsToggleButton(minerva, reflistData));
            }

            // Create closing bracket
            if (!minerva) {
                const closingBracket = document.createElement('span');
                closingBracket.className = 'mw-editsection-bracket';
                closingBracket.textContent = ']';
                section.appendChild(closingBracket);
            }

            return section;
        },
        /**
         * Create buttons in the header before a specific reflist
         * @param {Object} reflistData - The reflist data object
         * @returns {boolean} Success status
         */
        createButtons: function (reflistData) {
            const header = CiteUnseen.findHeaderBeforeReflist(reflistData.element);
            if (!header) return false;

            // Check if buttons already exist
            if (header.querySelector('.cite-unseen-section')) return true;

            const editSection = header.querySelector('.mw-editsection');
            const sectionClass = editSection ? 'cite-unseen-edit-section' : 'cite-unseen-fallback-section';
            const buttonSection = CiteUnseen.createButtonSection(sectionClass, reflistData);

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
            if (Array.isArray(value)) return value.filter(v => typeof v === 'string' && v !== '');
            if (typeof value === 'string' && value !== '') return [value];
            return [];
        },

        // ===============================
        // INITIALIZATION
        // ===============================

        init: function () {
            // Singleton
            if (window._citeUnseenInitialized) {
                return;
            }
            window._citeUnseenInitialized = true;

            console.time('[Cite Unseen] Dependency runtime');

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
                    console.timeEnd('[Cite Unseen] Dependency runtime');

                    // Run on every wikipage.content hook. This is to support gadgets like QuickEdit.
                    mw.hook('wikipage.content').add(function () {
                        if (document.querySelector('#cite-unseen-finished-loading')) {
                            return;
                        }
                        console.time('[Cite Unseen] Render runtime');

                        CiteUnseen.findCitations().then(function () {
                            if (CiteUnseen.refs.length === 0) {
                                console.timeEnd('[Cite Unseen] Render runtime');
                                return;
                            }

                            // Add icons to citations
                            CiteUnseen.addIcons();

                            for (const reflistData of CiteUnseen.reflists) {
                                if (window.cite_unseen_dashboard !== false) {
                                    // Create dashboards for each reflist that has citations
                                    CiteUnseen.createDashboardForReflist(reflistData);
                                }

                                // Create buttons for each reflist that has a dashboard
                                CiteUnseen.createButtons(reflistData);
                            }

                            console.timeEnd('[Cite Unseen] Render runtime');
                            let finishedLoading = document.createElement('div');
                            finishedLoading.id = 'cite-unseen-finished-loading';
                            finishedLoading.classList.add('cite-unseen-finished-loading');
                            document.querySelector('#mw-content-text .mw-parser-output').appendChild(finishedLoading);
                        });
                    });
                });
            });
        }

    };

    CiteUnseen.init();

})();

// </nowiki>
})();