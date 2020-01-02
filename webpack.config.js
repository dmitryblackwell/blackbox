// import path from "path";
const path = require('path');
// const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: path.join(__dirname, 'src', 'main', 'webapp', 'index.js'),
    output:{
        path: path.join(__dirname, 'src', 'main', 'resources', 'static', 'build'),
        filename: "bundle.js"
    },
    devServer: {
        contentBase: './target/webpack-dev-server',
        compress: true,
        port: 8000,
        allowedHosts: [
            'localhost:9000'
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ["@babel/plugin-proposal-class-properties"]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [{loader: 'style-loader'}, {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                        modules: true
                    }
                }],
            },
            {
                test: /\.(jpg|jpeg|png|gif|mp3)$/,
                loaders: ["file-loader"]
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
        ]
    },
    resolve: {
        modules: [
            path.join(__dirname, 'src', 'main', 'resources', 'static', 'build'),
            path.join(__dirname, 'node_modules'),
        ],
    }
};