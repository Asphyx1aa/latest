const path = require('path');

module.exports = {
    entry: './src/js/script.js',
    output: {
        path: path.resolve(__dirname, './build/js'),
        filename: "script.js"
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: '/node_modules/'
        }]

    }
}