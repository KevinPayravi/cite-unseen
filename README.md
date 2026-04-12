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
The CI pipeline automatically builds a bundled version of the script (`cite-unseen-bundled.js`) that combines `main.js`, `sources.js`, `i18n.js`, and `styles.css` into a single file. Three deploy branches are maintained:

| Branch | Updated on | Purpose |
|---|---|---|
| [`deploy`](https://gitlab.wikimedia.org/kevinpayravi/cite-unseen/-/tree/deploy) | Every [release tag](https://gitlab.wikimedia.org/kevinpayravi/cite-unseen/-/releases) | Stable production bundle |
| [`deploy-dev`](https://gitlab.wikimedia.org/kevinpayravi/cite-unseen/-/tree/deploy-dev) | Every commit to `main` | Latest development bundle |
| `deploy-mr-##` | Every commit to a merge request | Per-MR preview bundle (e.g. `deploy-mr-42`) |

> **Note:** `deploy-mr-##` branches contain unreviewed code from merge requests and should be tested/used with caution.

## License
This project is licensed under **[Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](/LICENSE)**.