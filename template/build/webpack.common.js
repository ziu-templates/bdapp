/**
 * 清除旧文件
 * 环境变量
 * scss
 * eslint
 */
const path = require('path'),
    fs = require('fs'),
    exists = fs.existsSync,
    rm = require('rimraf'),
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    baseWebpackConfigs = require('./webpack.base.js');

let commonConfig = baseWebpackConfigs.commonConfig,
    appBaseConfig = baseWebpackConfigs.appConfig,
    configs = [],
    compiler = null,
    compilerTimes = 1;

module.exports = function (appConfig = appBaseConfig, cb = () => {}) {
    if (!exists(path.resolve(__dirname, '_temp'))) {
        return false;
    }
    /**
    * [遍历所有_temp下的文件]
    */
    fs.readdirSync(path.resolve(__dirname, '_temp')).forEach(function (file) {
        let jsName = /([\w\-]*\.js)$/.exec(file)[0],
            name = jsName.replace('.js', ''),
            entry = {},
            pathnames = file.replace(/([\w\-]*\.js)$/, '').split('.');
        pathnames.shift();
        name = file.replace('.js', '').replace(/\./g, '-');
        entry[name] = `./build/_temp/${file}`;
        let temp = {
            entry,
            plugins: [
                new ExtractTextPlugin(path.join(pathnames.join('/'), `${/([\w]*_scss)$/.exec(name)[0].split('_')[0]}.css`), {
                    allChunks: true
                })
            ]
        };
        Object.keys(commonConfig).forEach(function (key) {
            if (key === 'plugins') {
                temp[key] = [].concat(temp[key], commonConfig[key]);
                return true;
            }
            temp[key] = commonConfig[key];
        });
        configs.push(temp);
    });
    /**
     * 注入webpack配置
     */
    configs.push(appConfig);
    /**
     * [compiler 初始化webpack配置]
     */
    compiler = webpack(configs);
    /**
     * [启动编译]
     */
    compiler.run((err, stats) => {
        if (err) {
            throw err;
        }
        cb(compiler);
    });
};
