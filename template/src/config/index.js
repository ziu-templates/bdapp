/**
 * Created by Gary.zhou on 2018/2/08.
 */
const ENV = typeof process !== 'undefined' && process && process.env && process.env.API_ENV ? process.env.API_ENV : 'production',
    conf = {
    env: ENV,
    apiEnv: 'weapp',
    appId: 'xxxxx',
    componentAppid: '',
    development: 'http://xxxxx.cn',
    test: 'http://xxxxx.cn',
    production: 'http://xxxxx.cn'
};
const BASE_URL = true ? conf['test'] : conf[conf.env];

module.exports = {
    get env() {
        return conf.env;
    },
    get apiEnv() {
        return conf.apiEnv;
    },
    get app_id() {
        return conf.appId;
    },
    get component_appid() {
        return conf.componentAppid;
    },
    get baseURL() {
        return BASE_URL || conf.production;
    }
};