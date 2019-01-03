/**
 * 清除旧文件
 * 环境变量
 * scss
 * eslint
 */
process.env.NODE_ENV = 'production';
const buildFn = require('./build'),
    env = require('../config/env.prod.js');
buildFn(env);
