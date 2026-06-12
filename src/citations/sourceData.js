// Sources used for icon classification (blogs, news, advocacy, etc.).
// Entries with subPages expand to multiple source pages that share a category.
export const categorySourceData = [
  { id: "advocacy", category: "advocacy", subPages: ["1", "2", "3", "4"] },
  { id: "aiGenerated" },
  { id: "aiReferred" },
  { id: "blogs" },
  { id: "books" },
  { id: "community" },
  { id: "editable" },
  { id: "government" },
  {
    id: "news",
    category: "news",
    subPages: ["Americas", "Europe", "Africa", "Asia", "Oceania"],
  },
  { id: "opinions" },
  {
    id: "predatory",
    category: "predatory",
    subPages: ["publishers", "standaloneJournals"],
  },
  { id: "press" },
  { id: "satire" },
  { id: "social" },
  { id: "sponsored" },
  { id: "tabloids" },
  { id: "tvPrograms" },
];

// Wikipedia project pages that classify domains into reliability tiers.
// Priority breaks ties when two sources match at equal specificity (higher wins, default 0).
export const checklistSourceData = [
  {
    id: "enRSP",
    page: "en:Wikipedia:Reliable sources/Perennial sources",
    priority: 10,
    checklists: {
      blacklisted: "enRspBlacklisted",
      deprecated: "enRspDeprecated",
      generallyUnreliable: "enRspGenerallyUnreliable",
      marginallyReliable: "enRspMarginallyReliable",
      multi: "enRspMulti",
      generallyReliable: "enRspGenerallyReliable",
    },
  },
  {
    id: "enVGS",
    page: "en:Wikipedia:WikiProject Video games/Sources",
    priority: 8,
    checklists: {
      generallyUnreliable: "enVgsGenerallyUnreliable",
      marginallyReliable: "enVgsMarginallyReliable",
      multi: "enVgsMulti",
      generallyReliable: "enVgsGenerallyReliable",
    },
  },
  {
    id: "enAMS",
    page: "en:Wikipedia:WikiProject Anime and manga/Online reliable sources",
    checklists: {
      generallyUnreliable: "enAmsGenerallyUnreliable",
      marginallyReliable: "enAmsMarginallyReliable",
      generallyReliable: "enAmsGenerallyReliable",
    },
  },
  {
    id: "enJAPANS",
    page: "en:Wikipedia:WikiProject Japan/Reliable sources",
    checklists: {
      generallyUnreliable: "enJapansGenerallyUnreliable",
      marginallyReliable: "enJapansMarginallyReliable",
      generallyReliable: "enJapansGenerallyReliable",
    },
  },
  {
    id: "enKOREAS",
    page: "en:Wikipedia:WikiProject Korea/Reliable sources",
    checklists: {
      blacklisted: "enKoreasBlacklisted",
      generallyUnreliable: "enKoreasGenerallyUnreliable",
      marginallyReliable: "enKoreasMarginallyReliable",
      generallyReliable: "enKoreasGenerallyReliable",
    },
  },
  {
    id: "enAS",
    page: "en:Wikipedia:WikiProject Albums/Sources",
    checklists: {
      generallyUnreliable: "enAsGenerallyUnreliable",
      generallyReliable: "enAsGenerallyReliable",
    },
  },
  {
    id: "enFILMR",
    page: "en:Wikipedia:WikiProject Film/Resources",
    checklists: {
      generallyUnreliable: "enFilmrGenerallyUnreliable",
      generallyReliable: "enFilmrGenerallyReliable",
    },
  },
  {
    id: "enNPPSG/1",
    page: "en:Wikipedia:New pages patrol source guide",
    priority: 6,
    checklists: {
      generallyUnreliable: "enNppsgGenerallyUnreliable",
    },
  },
  {
    id: "enNPPSG/2",
    page: "en:Wikipedia:New pages patrol source guide",
    priority: 6,
    checklists: {
      multi: "enNppsgMulti",
      generallyReliable: "enNppsgGenerallyReliable",
    },
  },
  {
    id: "enTAMBAYS",
    page: "en:Wikipedia:Tambayan Philippines/Sources",
    checklists: {
      generallyUnreliable: "enTambaysGenerallyUnreliable",
      marginallyReliable: "enTambaysMarginallyReliable",
      multi: "enTambaysMulti",
      generallyReliable: "enTambaysGenerallyReliable",
    },
  },
  {
    id: "enBGS",
    page: "en:Wikipedia:WikiProject Board and table games/Sources",
    checklists: {
      generallyUnreliable: "enBgsGenerallyUnreliable",
      marginallyReliable: "enBgsMarginallyReliable",
      generallyReliable: "enBgsGenerallyReliable",
    },
  },
  {
    id: "enCHARTS",
    page: "en:Wikipedia:Record charts",
    checklists: {
      deprecated: "enChartsDeprecated",
      generallyUnreliable: "enChartsGenerallyUnreliable",
      generallyReliable: "enChartsGenerallyReliable",
    },
  },
  {
    id: "enVSAFES",
    page: "en:Wikipedia:Vaccine safety/Perennial sources",
    checklists: {
      blacklisted: "enVsafesBlacklisted",
      generallyUnreliable: "enVsafesGenerallyUnreliable",
      marginallyReliable: "enVsafesMarginallyReliable",
      multi: "enVsafesMulti",
      generallyReliable: "enVsafesGenerallyReliable",
    },
  },
  {
    id: "frJVS",
    page: "fr:Projet:Jeu vidéo/Sources",
    checklists: {
      generallyUnreliable: "frJvsGenerallyUnreliable",
      marginallyReliable: "frJvsMarginallyReliable",
      generallyReliable: "frJvsGenerallyReliable",
    },
  },
  {
    id: "ruAIKI",
    page: "ru:Проект:Компьютерные игры/Авторитетные источники по тематике компьютерных игр",
    checklists: {
      generallyUnreliable: "ruAikiGenerallyUnreliable",
      generallyReliable: "ruAikiGenerallyReliable",
    },
  },
  {
    id: "zhRSP",
    page: "zh:维基百科:可靠来源/常见有争议来源列表",
    priority: 10,
    checklists: {
      blacklisted: "zhRspBlacklisted",
      deprecated: "zhRspDeprecated",
      generallyUnreliable: "zhRspGenerallyUnreliable",
      marginallyReliable: "zhRspMarginallyReliable",
      multi: "zhRspMulti",
      generallyReliable: "zhRspGenerallyReliable",
    },
  },
  {
    id: "zhVGS",
    page: "zh:维基专题:电子游戏/来源考量",
    priority: 8,
    checklists: {
      generallyUnreliable: "zhVgsGenerallyUnreliable",
      marginallyReliable: "zhVgsMarginallyReliable",
      multi: "zhVgsMulti",
      generallyReliable: "zhVgsGenerallyReliable",
    },
  },
  {
    id: "zhACGS",
    page: "zh:维基专题:ACG/來源考量",
    priority: 8,
    checklists: {
      generallyUnreliable: "zhAcgsGenerallyUnreliable",
      marginallyReliable: "zhAcgsMarginallyReliable",
      multi: "zhAcgsMulti",
      generallyReliable: "zhAcgsGenerallyReliable",
    },
  },
  {
    id: "viDSNDTC",
    page: "vi:Wikipedia:Danh sách nguồn đáng tin cậy",
    checklists: {
      blacklisted: "viDsndtcBlacklisted",
      generallyUnreliable: "viDsndtcGenerallyUnreliable",
      marginallyReliable: "viDsndtcMarginallyReliable",
      multi: "viDsndtcMulti",
      generallyReliable: "viDsndtcGenerallyReliable",
    },
  },
];

/* Derived: [checklistType, [[sourceId, checklistKey], ...]] */
export const citeUnseenChecklists = (() => {
  const typeMap = new Map();
  for (const source of checklistSourceData) {
    for (const [type, key] of Object.entries(source.checklists)) {
      (typeMap.get(type) ?? typeMap.set(type, []).get(type)).push([
        source.id,
        key,
      ]);
    }
  }
  return [...typeMap.entries()];
})();

/* Derived: { sourceId → priority } for sources that declare a priority */
export const citeUnseenChecklistPriorities = Object.fromEntries(
  checklistSourceData.filter((s) => s.priority).map((s) => [s.id, s.priority]),
);
