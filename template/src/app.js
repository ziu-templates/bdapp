/**
 * 全局
 */
App({
    onLaunch(opts) {},
    onShow(opts) {
        console.log(process.env)
    },
    onError(msg) {
        console.log(msg, ' -----> onError')
    },
    pageOnLoad(pageLoadFn) {
        let app = this;
        return {
            onLoad() {
                let temp = Array.prototype.slice.apply(arguments);
                temp.push(app);
                pageLoadFn.apply(this, arguments);
            }
        };
    },
    pageOnShow(pageShowFn) {
        let app = this;
        return {
            onShow() {
                let temp = Array.prototype.slice.apply(arguments);
                temp.push(app);
                pageShowFn.apply(this, temp);
            }
        };
    },
    globalData: {
        initData: null
    }
});
