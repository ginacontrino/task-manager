const path = require('path')

module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'build')
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    }
}