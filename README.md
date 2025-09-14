# Cite Unseen

**Cite Unseen** is a user script that adds categorical icons to Wikipedia citations, providing readers and editors a quick initial evaluation of citations at a glance.

Full documentation can be found here:
https://meta.wikimedia.org/wiki/Meta:Cite_Unseen

## Usage
Cite Unseen is deployed on Meta-Wiki on the following page:
https://meta.wikimedia.org/wiki/User:SuperHamster/CiteUnseen.js

See the [on-wiki installation instructions](https://meta.wikimedia.org/wiki/Meta:Cite_Unseen#Installing) for how to install this user script for yourself, either globally on Meta-Wiki or on individual language versions of Wikipedia.

## Code Structure
### Unbundled
- **main.js**: The entry point.
  - Pulls rest of the files below through `gitlab-content.toolforge.org`.
- **styles.css**: Handles all visual styling except categorization icons.
- **sources.js**:
  - Loads and processes the categorized source lists maintained on Meta-Wiki ([Meta:Cite Unseen/sources](https://meta.wikimedia.org/wiki/Meta:Cite_Unseen/sources)).
  - Also pulls latest reviewed revision IDs from [cite-unseen-revids](https://gitlab.wikimedia.org/kevinpayravi/cite-unseen-revids) through `gitlab-content.toolforge.org`.
  - Stores category descriptions and icons.
- **i18n.js**: Stores translation and localization for international use.
### Bundled
Each [release](https://gitlab.wikimedia.org/kevinpayravi/cite-unseen/-/releases) updates the [`deploy`](https://gitlab.wikimedia.org/kevinpayravi/cite-unseen/-/tree/deploy) branch with a bundled version of the script, called [`cite-unseen-bundled.js`](https://gitlab.wikimedia.org/kevinpayravi/cite-unseen/-/blob/deploy/cite-unseen-bundled.js?ref_type=heads). This single script files includes the contents of `main.js`, `sources.js`, `i18n.js`, and `styles.css`.

## License
This project is licensed under **[Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](/LICENSE)**.