#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Building Cite Unseen bundled version...');

// Read all source files
const styles = fs.readFileSync('styles.css', 'utf8');
const i18n = fs.readFileSync('i18n.js', 'utf8');
const sources = fs.readFileSync('sources.js', 'utf8');
const main = fs.readFileSync('main.js', 'utf8');

// Create the bundled content
let bundled = `// Cite Unseen - Bundled Version
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
${i18n}

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

// Calculate file sizes
const originalSize = fs.statSync('main.js').size + 
                    fs.statSync('i18n.js').size + 
                    fs.statSync('sources.js').size + 
                    fs.statSync('styles.css').size;

const bundledSize = fs.statSync('build/cite-unseen-bundled.js').size;

console.log('Build completed!');
console.log(`Original files total: ${originalSize} bytes`);
console.log(`Bundled file: ${bundledSize} bytes`);
console.log(`Compression ratio: ${((originalSize - bundledSize) / originalSize * 100).toFixed(1)}%`);

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
