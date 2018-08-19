'use strict';

import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'

export default {
    input: 'src/index.js',
    external: ['fs', 'path'],
    output: {
        file: 'dist/rollup-plugin-asset-sync.js',
        format: 'cjs'
    },
    plugins: [
        buble(),
        commonjs(),
    ]
}