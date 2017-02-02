'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
    //entry: './app/tt.js',
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bui.js',
        publicPath: 'http://localhost:8080/build/'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    entry: {
        // app: ['webpack/hot/dev-server', './app/tt.js']
        app: ['webpack/hot/dev-server', './appF/js/mainFrame.js']
    },
    devServer: {
        contentBase: './public',
        publicPath: 'http://localhost:8080/build/'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel?presets[]=react,presets[]=es2015']
            }, {
                test: /\.less$/,
                loaders: ['style', 'css', 'less']
            }, {
                test: /\.css$/,
                loaders: ['style', 'css']
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
                loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
            },
            { test: /\.json$/, loader: "json-loader" }
        ]
    },
    target: "electron",
    plugins: [
        new webpack.HotModuleReplacementPlugin()
        //new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$"))
    ]
};