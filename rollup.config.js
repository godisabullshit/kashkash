import resolve from 'rollup-plugin-node-resolve'

export default {
    input: './src/index.js',
    output: {
        file: 'dist/main.js',
        format: 'cjs'
    },
    plugins: [resolve({
        customResolveOptions: {
            moduleDirectory: 'node_modules',
        },
    })]
}