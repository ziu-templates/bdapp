/**
 * 清除旧文件
 * 环境变量
 * scss
 * eslint
 */
const path = require('path'),
    conf = require('../config'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

const globalVariable = conf.globalVariable;

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
            {
                test: /\.js$/,
                include: [resolve('src')],
                loader: 'eslint-loader',
                enforce: 'pre',
                options: {
                    formatter: function(results) {
                        if (results[0] && results[0].messages.length) {
                            let messages = results[0].messages,
                                reg = /\'+[a-zA-Z0-9_-]+\'/;
                            messages = messages.filter((msg) => {
                                if (msg.ruleId == 'no-undef') {
                                    let results = reg.exec(msg.message),
                                        variable = /[a-zA-Z0-9_-]+/g.exec(results[0] || ''),
                                        idx = globalVariable.indexOf(variable[0] || '');
                                    if (idx < 0) {
                                        return true;
                                    }
                                    return false;
                                }
                                return true;
                            });
                            results[0].messages = messages;
                        }
                        let formatter = require('eslint-friendly-formatter');
                        setTimeout(() => {
                            console.log(formatter(results));
                        }, 1000);
                    },
                    emitWarning: true
                }
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                context: path.resolve(__dirname, '../', 'src'),
                from: '**/*',
                ignore: ['**/*.scss']
            }
        ])
    ]
};
module.exports = {
    commonConfig: common,
    appConfig
};