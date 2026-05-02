#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";
import { minify as minifyHtml } from "html-minifier-terser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildDir = path.join(__dirname, "build");
const bundledPath = path.join(buildDir, "cite-unseen-bundled.js");
const buildReadmePath = path.join(buildDir, "README.md");
const releaseLabel =
    process.env.CI_COMMIT_TAG ||
    `dev-${process.env.CI_COMMIT_SHORT_SHA || "local"}`;
const buildTimestamp = new Date().toISOString();
const i18nModuleName = "cite-unseen-i18n-files";
const i18nNamespace = "cite-unseen-i18n";
const cssFilter = /\.css$/;
const vueTemplateFilter = /\.template\.vue$/;

function createBanner() {
    return `// Cite Unseen - Bundled Version
// Maintainers: SuperHamster and SuperGrey
// Repository: https://gitlab.wikimedia.org/kevinpayravi/cite-unseen
// Release: ${releaseLabel}
// Timestamp: ${buildTimestamp}
// <nowiki>`;
}

function createFooter() {
    return "// </nowiki>";
}

function createI18nPlugin() {
    return {
        name: "cite-unseen-i18n",
        setup(build) {
            build.onResolve({ filter: new RegExp(`^${i18nModuleName}$`) }, () => ({
                path: i18nModuleName,
                namespace: i18nNamespace,
            }));

            build.onLoad({ filter: /.*/, namespace: i18nNamespace }, () => {
                const i18nDir = path.join(__dirname, "i18n");
                const files = fs
                    .readdirSync(i18nDir)
                    .filter((file) => file.endsWith(".json"))
                    .sort();

                const bundledFiles = files.map((file) => {
                    const filePath = path.join(i18nDir, file);
                    return {
                        name: file,
                        path: `i18n/${file}`,
                        type: "blob",
                        content: JSON.parse(fs.readFileSync(filePath, "utf8")),
                    };
                });

                return {
                    contents: `export default ${JSON.stringify(bundledFiles)};`,
                    loader: "js",
                    watchFiles: files.map((file) => path.join(i18nDir, file)),
                };
            });
        },
    };
}

async function minifyVueTemplate(template) {
    return minifyHtml(template, {
        caseSensitive: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        ignoreCustomFragments: [/\{\{[\s\S]*?\}\}/],
        keepClosingSlash: true,
        minifyCSS: false,
        minifyJS: false,
        removeAttributeQuotes: false,
        removeComments: true,
        removeOptionalTags: false,
    });
}

function createVueTemplatePlugin() {
    return {
        name: "cite-unseen-vue-templates",
        setup(build) {
            build.onLoad({ filter: vueTemplateFilter }, async (args) => {
                const template = fs.readFileSync(args.path, "utf8");
                const minifiedTemplate = await minifyVueTemplate(template);
                return {
                    contents: `export default ${JSON.stringify(minifiedTemplate)};`,
                    loader: "js",
                    watchFiles: [args.path],
                };
            });
        },
    };
}

function minifyCss(css) {
    return esbuild.transformSync(css, {
        loader: "css",
        minify: true,
    }).code;
}

function createCssTextPlugin() {
    return {
        name: "cite-unseen-css-text",
        setup(build) {
            build.onLoad({ filter: cssFilter }, (args) => {
                const css = fs.readFileSync(args.path, "utf8");
                return {
                    contents: `export default ${JSON.stringify(minifyCss(css))};`,
                    loader: "js",
                    watchFiles: [args.path],
                };
            });
        },
    };
}

async function buildBundle() {
    await esbuild.build({
        entryPoints: [path.join(__dirname, "src", "main.js")],
        bundle: true,
        charset: "utf8",
        format: "iife",
        outfile: bundledPath,
        platform: "browser",
        target: ["es2019"],
        banner: {
            js: createBanner(),
        },
        footer: {
            js: createFooter(),
        },
        plugins: [createI18nPlugin(), createVueTemplatePlugin(), createCssTextPlugin()],
        minify: false,
    });
}

function writeDeployReadme(bundledSize) {
    const deployReadme = `# Cite Unseen - Deploy Branch

This branch contains the bundled version of Cite Unseen.

## Usage

The bundled file is called \`cite-unseen-bundled.js\`.

The file can be pulled directly using \`gitlab-content.toolforge.org\`:
\`\`\`javascript
await mw.loader.getScript('//gitlab-content.toolforge.org/kevinpayravi/cite-unseen/-/raw/deploy/cite-unseen-bundled.js?mime=text/javascript');
\`\`\`

## Build Info

- Release: ${releaseLabel}
- Built from commit: ${process.env.CI_COMMIT_SHA || "local"}
- Build timestamp: ${buildTimestamp}
- Bundled size: ${bundledSize} bytes
`;

    fs.writeFileSync(buildReadmePath, deployReadme);
}

async function main() {
    console.log("Building Cite Unseen bundled version...");

    fs.mkdirSync(buildDir, { recursive: true });
    await buildBundle();

    const bundledSize = fs.statSync(bundledPath).size;
    writeDeployReadme(bundledSize);

    console.log("Build completed!");
    console.log(`Bundled file: ${bundledSize} bytes`);
    console.log("Files created:");
    console.log("- build/cite-unseen-bundled.js");
    console.log("- build/README.md");
}

main().catch((error) => {
    console.error("Build failed.");
    console.error(error);
    process.exitCode = 1;
});
