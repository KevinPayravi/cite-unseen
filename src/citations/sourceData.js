/**
 * Definition page names for source lists. Prefixed with "Cite Unseen/sources/".
 * @type {Array.<string>}
 * @constant
 */
export let citeUnseenSources = [
    'advocacy/1',
    'advocacy/2',
    'advocacy/3',
    'advocacy/4',
    'aiGenerated',
    'aiReferred',
    "blogs",
    "books",
    "community",
    "editable",
    "government",
    "news/Americas",
    "news/Europe",
    "news/Africa",
    "news/Asia",
    "news/Oceania",
    "opinions",
    "predatory/publishers",
    "predatory/standaloneJournals",
    "press",
    "satire",
    "social",
    "sponsored",
    "tabloids",
    "tvPrograms",
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
    'enTAMBAYS',
    'frJVS',
    'ruAIKI',
    'enBGS',
    'enCHARTS',
    'enVSAFES',
    'viDSNDTC'
];

/**
 * Source lists grouped by reliability category.
 * @type {Array.<Array.<string, Array.<Array.<string, string>>>>}
 * @constant
 */
export let citeUnseenChecklists = [
    [
        "blacklisted", [
            ["enRSP", "enRspBlacklisted"],
            ["zhRSP", "zhRspBlacklisted"],
            ["enKOREAS", "enKoreasBlacklisted"],
            ["enVSAFES", "enVsafesBlacklisted"],
            ["viDSNDTC", "viDsndtcBlacklisted"]
        ],
    ], [
        "deprecated", [
            ["enRSP", "enRspDeprecated"],
            ["zhRSP", "zhRspDeprecated"],
            ["enCHARTS", "enChartsDeprecated"]
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
            ["enFILMR", "enFilmrGenerallyUnreliable"],
            ["frJVS", "frJvsGenerallyUnreliable"],
            ["ruAIKI", "ruAikiGenerallyUnreliable"],
            ["enTAMBAYS", "enTambaysGenerallyUnreliable"],
            ["enBGS", "enBgsGenerallyUnreliable"],
            ["enCHARTS", "enChartsGenerallyUnreliable"],
            ["enVSAFES", "enVsafesGenerallyUnreliable"],
            ["viDSNDTC", "viDsndtcGenerallyUnreliable"]
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
            ["zhVGS", "zhVgsMarginallyReliable"],
            ["frJVS", "frJvsMarginallyReliable"],
            ["enTAMBAYS", "enTambaysMarginallyReliable"],
            ["enBGS", "enBgsMarginallyReliable"],
            ["enVSAFES", "enVsafesMarginallyReliable"],
            ["viDSNDTC", "viDsndtcMarginallyReliable"]
        ],
    ], [
        "multi", [
            ["enRSP", "enRspMulti"],
            ["zhRSP", "zhRspMulti"],
            ["enNPPSG/2", "enNppsgMulti"],
            ["enVGS", "enVgsMulti"],
            ["zhACGS", "zhAcgsMulti"],
            ["zhVGS", "zhVgsMulti"],
            ["enTAMBAYS", "enTambaysMulti"],
            ["enVSAFES", "enVsafesMulti"],
            ["viDSNDTC", "viDsndtcMulti"]
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
            ["enFILMR", "enFilmrGenerallyReliable"],
            ["frJVS", "frJvsGenerallyReliable"],
            ["ruAIKI", "ruAikiGenerallyReliable"],
            ["enTAMBAYS", "enTambaysGenerallyReliable"],
            ["enBGS", "enBgsGenerallyReliable"],
            ["enCHARTS", "enChartsGenerallyReliable"],
            ["enVSAFES", "enVsafesGenerallyReliable"],
            ["viDSNDTC", "viDsndtcGenerallyReliable"]
        ],
    ],
];

/**
 * Mapping from source page names to their corresponding categories.
 * This allows multiple source pages to map to a single category.
 *
 * @type {Object.<string, string>}
 * @constant
 */
export let citeUnseenSourceToCategoryMapping = {
    'advocacy1': 'advocacy',
    'advocacy2': 'advocacy',
    'advocacy3': 'advocacy',
    'advocacy4': 'advocacy',
    'news/Americas': 'news',
    'news/Europe': 'news',
    'news/Africa': 'news',
    'news/Asia': 'news',
    'news/Oceania': 'news',
    'predatory/publishers': 'predatory',
    'predatory/standaloneJournals': 'predatory'
};

/**
 * Mapping from source names to their corresponding wiki page links.
 *
 * @type {Object.<string, string>}
 * @constant
 */
export let citeUnseenSourceToPageMapping = {
    'enAMS': 'en:Wikipedia:WikiProject Anime and manga/Online reliable sources',
    'enAS': 'en:Wikipedia:WikiProject Albums/Sources',
    'enBGS': 'en:Wikipedia:WikiProject Board and table games/Sources',
    'enCHARTS': 'en:Wikipedia:Record charts',
    'enFILMR': 'en:Wikipedia:WikiProject Film/Resources',
    'enJAPANS': 'en:Wikipedia:WikiProject Japan/Reliable sources',
    'enKOREAS': 'en:Wikipedia:WikiProject Korea/Reliable sources',
    'enNPPSG/1': 'en:Wikipedia:New pages patrol source guide',
    'enNPPSG/2': 'en:Wikipedia:New pages patrol source guide',
    'enRSP': 'en:Wikipedia:Reliable sources/Perennial sources',
    'enTAMBAYS': 'en:Wikipedia:Tambayan Philippines/Sources',
    'enVGS': 'en:Wikipedia:WikiProject Video games/Sources',
    'enVSAFES': 'en:Wikipedia:Vaccine safety/Perennial sources',
    'frJVS': 'fr:Projet:Jeu vidéo/Sources',
    'ruAIKI': 'ru:Проект:Компьютерные игры/Авторитетные источники по тематике компьютерных игр',
    'viDSNDTC': 'vi:Wikipedia:Danh sách nguồn đáng tin cậy',
    'zhACGS': 'zh:维基专题:ACG/來源考量',
    'zhRSP': 'zh:维基百科:可靠来源/常见有争议来源列表',
    'zhVGS': 'zh:维基专题:电子游戏/来源考量'
};

