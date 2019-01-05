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
    conf = require('../config');

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
        path: path.resolve(__dirname, '../', 'dist')
    },
    module: {
        rules: [
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                context: path.resolve(__dirname, '../', 'src'),
                from: '**/*',
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
                    return content;
                }
            }
        ])
    ]
};
module.exports = {
    commonConfig: common,
    appConfig
};