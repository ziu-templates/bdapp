/**
 * 验证
 */
let ruleFns = require('./rule/index');
var Validator = function () {
    this.cache = [];
}
Validator.prototype = {
    constructor: Validator,
    addRule: function (val, rules) {
        var _this = this;
        rules.forEach(function (rule) {
            var ruleArr = rule.rule.split(':'),
                    errMsg = rule.errMsg;
            _this.cache.push(function () {
                var ruleFn = ruleArr.shift();
                ruleArr.unshift(val);
                ruleArr.push(errMsg);
                return ruleFns[ruleFn].apply(_this, ruleArr);
            });
        }, this);
    },
    start: function () {
    	for (let i = 0, ruleFn; ruleFn = this.cache[i++];) {
		    var errMsg = ruleFn();
		    if (errMsg) {
			    return errMsg;
		    }
	    }
    },
    clear: function () {
        this.cache = [];
    }
};

/*
    let valiObj = new Validator();
    let values = 11;
    valiObj.clear();
    valiObj.addRule(values, [
        {
            rule: 'isNoEmpty',
            errMsg: '请填写验证码'
        }
    ]);
    valiObj.start();
    
*/

module.exports =  Validator;
