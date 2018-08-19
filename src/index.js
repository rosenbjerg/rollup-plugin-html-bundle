'use strict';
import fs from 'fs';
import path from 'path';

/**
 * Generates a html file from a template that either has the bundle included using a script-tag with src or inlined in a script-tag.
 * Will by default use a script-tag with src and place a query string with v = Date.now() at the end of the path, to avoid using a cached bundle.js in dev.
 * @param {Object} userOptions The options object.
 * @return {Object} The rollup code object.
 */
export default function bundle(userOptions = {}) {
    const options = {
        template: 'src/template.html',
        target: 'dist/index.html',
        targetElement: 'body',
        timestamp: true,
        inline: false,
        async: false,
        defer: false
    };
    Object.assign(options, userOptions);
    return {
        name: 'html-bundle',
        onwrite: writeOptions => {
            const bundle = writeOptions.file;
            return new Promise((accept, reject) => {
                fs.readFile(path.resolve(options.template), 'utf8', (err, templateContent) => {
                    if (err) reject(err);
                    const targetIndex = templateContent.lastIndexOf(`</${options.targetElement}>`);
                    if (targetIndex === -1) this.error("invalid targetElement");

                    const attr = [(options.async ? 'async' : ''), (options.defer ? 'defer' : '')].join(" ").trim();
                    let bundledContent;
                    if (options.inline) {
                        const script = `<script ${attr}>\n${writeOptions.bundle.code}\n</script>\n`;
                        bundledContent = templateContent.substr(0, targetIndex) + script + templateContent.substr(targetIndex);
                    }
                    else {
                        const src = path.basename(bundle) + (options.timestamp ? `?v=${Date.now()}` : '');
                        const script = `<script ${attr} src="${src}"></script>\n`;
                        bundledContent = templateContent.substr(0, targetIndex) + script + templateContent.substr(targetIndex);
                    }
                    fs.writeFile(path.resolve(options.target), bundledContent, err => {
                        if (err) reject(err);
                        else accept();
                    });
                });
            })
        },
    };
}