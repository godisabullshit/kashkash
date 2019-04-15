import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
    input: './src/index.js',
    output: {
        file: 'dist/main.js',
        format: 'iife',
        sourcemap: true
    },
    plugins: [
        resolve({
            customResolveOptions: {
                moduleDirectory: 'node_modules',
            }
        }),
        production && terser()
    ]
}