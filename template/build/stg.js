
process.env.NODE_ENV = 'production';
const buildFn = require('./build'),
    env = require('../config/env.staging.js');
buildFn(env);
