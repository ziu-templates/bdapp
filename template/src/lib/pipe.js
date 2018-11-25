
/**
 * @param data 存储数据到this
 */
const cloneDeep = require('../utils/clone.js');
function getType(val) {
    if (val && val.toString && val.toString().slice(1, 7).toLowerCase() === 'object') {
        return val.toString().slice(8, -1).toLowerCase();
    }
    return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
}

function merge2this(_this = {}, source) {
    Object.keys(source).forEach((key) => {
        if (getType(_this[key]) !== 'undefined') {
            throw new Error(`Duplicate ${key} in this`);
        }
        _this[key] = source[key];
    });
    return cloneDeep(_this);
}

class Pipe {
    constructor({fnObj = {}, _this = {}, data = {}} = {}) {
        data = cloneDeep(data);
        _this = merge2this(cloneDeep(_this), data);
        merge2this(this, _this);
    }

    get funcStack() {
        return [];
    }

    next(handler) {
        let funcStack = this.funcStack;
        delete this.funcStack;
        if (typeof handler !== 'function') {
            throw new Error(`Next Handle Not a Function in next!`);
        }
        funcStack.push(handler);
        Object.defineProperty(this, 'funcStack', {
            get() {
                return funcStack;
            },
            configurable: true
        });
        return this;
    }

    start() {
        setTimeout(() => {
            this.step();
        }, 100);
        return this;
    }

    get then() {
        return (cb) => {
            Object.defineProperty(this, '_end', {
                get() {
                    return () => {
                        this._finally(this);
                        (cb || (() => {})).bind(this)(this);
                    };
                },
                configurable: true
            });
            setTimeout(() => {
                this.step();
            }, 0);
            return this;
        };
    }

    get finally() {
        return (cb) => {
            Object.defineProperty(this, '_finally', {
                get() {
                    return (cb || (() => {})).bind(this);
                },
                configurable: true
            });
            return this;
        };
    }

    catch(cb) {
        Object.defineProperty(this, 'errHandle', {
            get() {
                return (e) => {
                    this._finally(this);
                    (cb || (() => {})).bind(this)(e, this);
                };
            },
            configurable: true
        });
        return this;
    }

    get _finally() {
        return () => {};
    }

    get errHandle() {
        return () => {};
    }

    get step() {
        return (err) => {
            if (err) {
                return this.errHandle(err, this);
            }
            let fn = this.funcStack.shift();
            if (typeof fn !== 'function') {
                return this._end(this);
            }
            let fnType = getType(fn).toLowerCase();
            if (fnType === 'asyncfunction' || fnType === 'promise') {
                return fn.call(this, this).catch((e) => {
                    this.errHandle(e, this);
                });
            }
            try {
                fn.call(this, this);
            } catch (e) {
                this.errHandle(e, this);
            }
        };
    }
}

// let test = new Pipe({
//     data: {
//         dd: 23
//     }
// });
// test.next(function() {
//     console.log('test1');
//     this.step();
// }).next(function() {
//     console.log('test2');
//     this.step('errrrr');
// }).start()
// .end(function() {
//     console.log('_end');
// }).
// catch(function(err) {
//     console.log(err);
// });
module.exports = function(opts) {
    return new Pipe(opts);
};
