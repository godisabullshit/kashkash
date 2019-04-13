import resolve from 'rollup-plugin-node-resolve'
import sourcemaps from 'rollup-plugin-sourcemaps'

export default {
    input: './src/index.js',
    output: {
        file: 'dist/main.js',
        format: 'cjs'
    },
    sourceMap: true,
    plugins: [
        resolve({
            customResolveOptions: {
                moduleDirectory: 'node_modules',
            }
        }),
        sourcemaps()
    ]
}