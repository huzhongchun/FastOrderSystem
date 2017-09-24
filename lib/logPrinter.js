/**
 * Created by huzhongchun on 2017/7/27.
 */
const _config = require('../config/config.js');

module.exports = {
    console: function (type = 'default',tips,data) {
        if(_config.debug) {
            let text = typeof tips === 'string' ? tips : JSON.stringify(tips);
            if (typeof data === 'string') {
                text += ' ' + data;
            }
            console.log('\n');
            switch (type) {
                case 'success':
                    console.log('%c [Success] ' + text, 'color: #1ab394');
                    break;
                case 'info':
                    console.log('%c [Info] ' + text, 'color: #1a7bb9');
                    break;
                case 'warn':
                    console.log('%c [Warn] ' + text, 'color: #f8ac59');
                    break;
                case 'error':
                    console.log('%c [Error] ' + text, 'color: #ed5565');
                    break;
                case 'default':
                default:
                    console.log('%c [Default] ' + text, 'color: #000000');
            }
            if (typeof data !== 'string')
                console.log(data);
        }
    },
    s: function (tips,data) {
        this.console('success',tips,data);
    },
    i: function (tips,data) {
        this.console('info',tips,data);
    },
    w: function (tips,data) {
        this.console('warn',tips,data);
    },
    e: function (tips,data) {
        this.console('error',tips,data);
    },
    d: function (tips,data) {
        this.console('default',tips,data);
    },
    clear: function () {
        console.clear();
    }
};