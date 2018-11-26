/**
 *
 */
process.env.NODE_ENV = 'development';
const path = require('path'),
    rm = require('rimraf'),
    webpack = require('webpack'),
    env = require('../config/env.dev.js'),
    temp = require('../build/temp.js'),
    baseWebpackConfigs = require('./webpack.base.js'),
    commonWebpack = require('./webpack.common.js');

let appConfig = baseWebpackConfigs.appConfig,
    compilerTimes = 1;
baseWebpackConfigs.commonConfig.output = appConfig.output = {
    filename: '[name].js',
    path: path.resolve(__dirname, '../', 'dev')
};
/**
 * 注入环境变量
 */
appConfig.plugins.push(new webpack.DefinePlugin({
    'process.env': env
}));
rm('dev/**/*', {
    glob: true
}, function(err) {
    if (err) {
        console.log(err);
    }
    temp(function(endFn) {
        commonWebpack(appConfig, function(compiler) {
            /**
             * [监听watch]
             */
            watching = compiler.watch({
                aggregateTimeout: 300,
                poll: 1000
            }, (err, stats) => {
                if (err) {
                    throw err;
                }
                // console.log(stats.toString())
                if (compilerTimes !== 1) {
                    console.log(`Compilation success! ${compilerTimes} times \n`);
                }
                console.log('watching...\n');
                /**
                 * [删除编译scss生成的js]
                 */
                rm('dev/**/*_scss.js', {
                    glob: true
                }, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
                ++compilerTimes;
            });
            endFn(watching);
            console.log(`First Compilation success! ${compilerTimes} times \n`);
        });
    });
});
