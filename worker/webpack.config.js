const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
    {
        context: path.resolve(__dirname),
        entry: './index.ts',
        target: 'electron-renderer',
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    include: /./,
                    use: [{ loader: 'ts-loader' }],
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'public'),
        },
        plugins: [new HtmlWebpackPlugin()],
    },
];
