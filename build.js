#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Building Cite Unseen bundled version...');

// Read all source files
const styles = fs.readFileSync('styles.css', 'utf8');
const sources = fs.readFileSync('sources.js', 'utf8');
const main = fs.readFileSync('main.js', 'utf8');

// Read i18n JSON files and create i18n object
const i18nDir = 'i18n';
const i18nFiles = fs.readdirSync(i18nDir).filter(file => file.endsWith('.json'));
const i18nData = {};
for (const file of i18nFiles) {
    const lang = path.basename(file, '.json');
    const content = fs.readFileSync(path.join(i18nDir, file), 'utf8');
    const langKey = lang.startsWith('zh-') ? lang.substring(3) : lang;  // 'zh-hans' -> 'hans', 'zh-hant' -> 'hant'
    i18nData[langKey] = JSON.parse(content);
}

// Convert flat i18n structure back to nested structure
const nestedI18n = {};
for (const [lang, translations] of Object.entries(i18nData)) {
    for (const [key, value] of Object.entries(translations)) {
        const keyParts = key.split('.');
        let current = nestedI18n;
        
        for (let i = 0; i < keyParts.length - 1; i++) {
            const part = keyParts[i];
            if (!current[part]) {
                current[part] = {};
            }
            current = current[part];
        }
        
        const finalKey = keyParts[keyParts.length - 1];
        if (!current[finalKey]) {
            current[finalKey] = {};
        }
        current[finalKey][lang] = value;
    }
}
const i18nJs = `window.CiteUnseenI18n = ${JSON.stringify(nestedI18n, null, 4)};`;

// Create the bundled content
let bundled = `// Cite Unseen - Bundled Version
// Maintainers: SuperHamster and SuperGrey
// Repository: https://gitlab.wikimedia.org/kevinpayravi/cite-unseen
// Release: ${process.env.CI_COMMIT_TAG}
// Timestamp: ${new Date().toISOString()}

(function() {
    'use strict';
    
    // Inject CSS styles
    const css = \`${styles.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    document.head.appendChild(style);
    
    // Load i18n data
${i18nJs}

    // Load sources data  
${sources}

    // Main script with modified importDependencies function
`;

// Modify the main.js content to remove external dependencies
const modifiedMain = main.replace(
    /await mw\.loader\.load\('\/\/gitlab-content\.toolforge\.org\/kevinpayravi\/cite-unseen\/-\/raw\/main\/styles\.css[^']*',\s*'text\/css'\);?\s*/g,
    '// CSS already injected above\n            '
).replace(
    /await mw\.loader\.getScript\('\/\/gitlab-content\.toolforge\.org\/kevinpayravi\/cite-unseen\/-\/raw\/main\/i18n\.js[^']*'\);?\s*/g,
    '// i18n.js already loaded above\n            '
).replace(
    /await mw\.loader\.getScript\('\/\/gitlab-content\.toolforge\.org\/kevinpayravi\/cite-unseen\/-\/raw\/main\/sources\.js[^']*'\);?\s*/g,
    '// sources.js already loaded above\n            '
);

bundled += modifiedMain;
bundled += '\n})();';

// Create build directory
if (!fs.existsSync('build')) {
    fs.mkdirSync('build');
}

// Write bundled file
fs.writeFileSync('build/cite-unseen-bundled.js', bundled);

const bundledSize = fs.statSync('build/cite-unseen-bundled.js').size;

console.log('Build completed!');
console.log(`Bundled file: ${bundledSize} bytes`);

// Create deployment README
const deployReadme = `# Cite Unseen - Deploy Branch

This branch contains the bundled version of Cite Unseen.

## Usage

The bundled file is called \`cite-unseen-bundled.js\`.

The file can be pulled directly using \`gitlab-content.toolforge.org\`:
\`\`\`javascript
await mw.loader.getScript('//gitlab-content.toolforge.org/kevinpayravi/cite-unseen/-/raw/deploy/cite-unseen-bundled.js?mime=text/javascript');
\`\`\`

## Build Info

- Release: ${process.env.CI_COMMIT_TAG}
- Built from commit: ${process.env.CI_COMMIT_SHA || 'local'}
- Build timestamp: ${new Date().toISOString()}
- Bundled size: ${bundledSize} bytes
`;

fs.writeFileSync('build/README.md', deployReadme);

console.log('Files created:');
console.log('- build/cite-unseen-bundled.js');
console.log('- build/README.md');
