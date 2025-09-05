# Cite Unseen

**Cite Unseen** is a user script that adds categorical icons to Wikipedia citations, providing readers and editors a quick initial evaluation of citations at a glance.

## Usage

- **Installation**: Add to your `global.js` (Meta) or `common.js` (per-wiki) using:

```js
mw.loader.load( '//gitlab-content.toolforge.org/kevinpayravi/cite-unseen/-/raw/main/main.js?mime=text/javascript' );  // Backlink: [[m:Meta:Cite Unseen]]
```

## Code Structure

- **main.js**: The entry point.
  - Pulls rest of the files also through `gitlab-content.toolforge.org`.
- **styles.css**: Handles all visual styling except categorization icons.
- **sources.js**:
  - Loads and processes the categorized source lists maintained on Meta-Wiki ([Meta:Cite Unseen/sources](https://meta.wikimedia.org/wiki/Meta:Cite_Unseen/sources)).
  - Also pulls latest reviewed revision IDs from [cite-unseen-revids](https://gitlab.wikimedia.org/kevinpayravi/cite-unseen-revids) through `gitlab-content.toolforge.org`.
  - Stores category descriptions and icons.
- **i18n.js**: Stores translation and localization for international use.

The script builds its UI via DOM manipulation and dialogs using the Wikimedia Codex library.

## License

This project is licensed under **[Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](/LICENSE)**.