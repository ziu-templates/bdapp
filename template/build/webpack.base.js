/**
 * 清除旧文件
 * 环境变量
 * scss
 * eslint
 */
const path = require('path'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    minify = require('html-minifier').minify,
    UglifyJS = require('uglify-es'),
    conf = require('../config'),
    FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

let common = {
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../', 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(scss|sass)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [`css-loader${ process.env.NODE_ENV === 'production' ? '?minimize' : ''}`, 'sass-loader']
                    // use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    name: '/assets/imgs/[name].[ext]'
                }
            }
        ]
    }
};
let appConfig = {
    entry: {
        app: './src/app.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../', 'build/_temp')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                context: path.resolve(__dirname, '../', 'src'),
                from: '**/*',
                to: process.env.NODE_ENV === 'development' ? path.resolve(__dirname, '../', 'dev') : path.resolve(__dirname, '../', 'dist'),
                ignore: ['**/*.scss'],
                transform (content, path) {
                    if (conf.xmlType.exec(path) && process.env.NODE_ENV != 'development') {
                        return minify(content.toString(), {
                            removeComments: true,
                            collapseWhitespace: true,
                            collapseInlineTagWhitespace: true,
                            sortAttributes: true
                        });
                    }
                    if (/\.(js)$/.exec(path) && process.env.NODE_ENV != 'development') {
                        let result = UglifyJS.minify(content.toString());
                        if (result.error) {
                            return content;
                        }
                        return result.code;
                    }
                    return content;
                }
            }
        ]),
        new FriendlyErrorsPlugin()
    ]
};
module.exports = {
    commonConfig: common,
    appConfig
};