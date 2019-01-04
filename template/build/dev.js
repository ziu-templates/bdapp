/**
 *
 */
process.env.NODE_ENV = 'development';
const path = require('path'),
    rm = require('rimraf'),
    webpack = require('webpack'),
    env = require('../config/env.dev.js'),
    temp = require('../build/temp.js'),
    conf = require('../config'),
    CLIEngine = require("eslint").CLIEngine,
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
            {{#lint}}
            /**
             * eslint
             */
            let eslintCli = new CLIEngine({
                    extensions: ['.js']
                }),
                formatter = require('eslint-friendly-formatter'),
                results = null;
            {{/lint}}
            watching = compiler.watch({
                aggregateTimeout: 300,
                poll: 1000
            }, (err, stats) => {
                if (err) {
                    throw err;
                }
                {{#lint}}
                /**
                 * eslint
                 */
                const globalVariable = conf.globalVariable;
                results = eslintCli.executeOnFiles(['src/']).results;
                if (results.length) {
                    results = results.filter((result) => {
                        let messages = result.messages,
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
                        result.messages = messages;
                        return result.messages && result.messages.length;
                    });
                }
                setTimeout(() => {
                    if (results.length) {
                        clearConsole();
                    }
                    console.log(formatter(results));
                }, 0);
                if (!results.length) {
                    clearConsole('Eslint error: ' + results.length);
                }
                {{/lint}}
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

function clearConsole(msg) {
    const clear = "\x1B[2J\x1B[3J\x1B[H";
    const output = msg ? clear + msg + "\n\n" : clear;
    process.stdout.write(output);
}
