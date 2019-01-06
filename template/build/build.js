/**
 * 清除旧文件
 * 环境变量
 * scss
 * eslint
 */
process.env.NODE_ENV = 'production';
const rm = require('rimraf'),
    webpack = require('webpack'),
    temp = require('../build/temp.js'),
    baseWebpackConfigs = require('./webpack.base.js'),
    commonWebpack = require('./webpack.common.js'),
    UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let env = require('../config/env.prod.js'),
    foutput = {
        filename: '[name].js',
        path: path.resolve(__dirname, '../', 'dist')
    };
module.exports = function(buildEnv) {
    env = buildEnv || env;
    let appConfig = baseWebpackConfigs.appConfig;
    /**
     * 注入环境变量
     */
    appConfig.plugins.push(new webpack.DefinePlugin({
        'process.env': env
    }), new UglifyJsPlugin({
        uglifyOptions: {
            mangle: {
                eval: true
            },
            output: {
                comments: false,
                beautify: false,
            },
            compress: {
                warnings: false
            }
        },
        sourceMap: false,
        parallel: 4
    }));
    rm('dist/**/*', function(err) {
        if (err) {
            throw err;
        }
        temp(function(endFn) {
            commonWebpack(appConfig, function(compiler) {
                endFn();
                /**
                 * [删除编译scss生成的js]
                 */
                rm('dist/**/*_scss.js', {
                    glob: true
                }, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
                console.log('build production success!');
            }, foutput);
        });
    });
};
