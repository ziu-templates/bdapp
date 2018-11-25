/**
 * 验证规则
 */
module.exports = {
    isNoEmpty: function (val, errMsg) {
        if (!val || val === '') {
            return errMsg;
        }
    },
    minLength: function (val, length, errMsg) {
        if (val.length < length) {
            return errMsg;
        }
    },
    minValue: function (val, minValue, errMsg) {
        if (val < minValue) {
            return errMsg;
        }
    },
    isMobile: function (val, errMsg) {
        if (!/(^1[0-9]{10}$)/.test(val)) {
            return errMsg;
        }
    },
    isEmail: function (val, errMsg) {
        if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(val)) {
            return errMsg;
        }
    }
};
