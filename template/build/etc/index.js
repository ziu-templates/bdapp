/**
 * 项目编译配置文件
 */
const path = require('path');

function getPrjConfig({
                          UglifyJs = true,
                          codePath = path.resolve(process.cwd(), 'dist'),
                          dirname = 'dist'
                      } = {}) {
    return {
        UglifyJs,
        codePath,
        dirname
    };
}

module.exports = {
    globalVariable: ['App', 'Page', 'getApp', 'swan'],
    xmlType: /\.(wxml|axml|swan)(\?.*)?$/,
    cssSuffix: 'css',
    development: getPrjConfig({
        UglifyJs: false,
        codePath: path.resolve(process.cwd(), 'dev'),
        dirname: 'dev'
    }),
    testing: getPrjConfig(),
    staging: getPrjConfig(),
    production: getPrjConfig()
};