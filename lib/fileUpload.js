const _config = require('../config/config.js');
const Promise = require('Promise.js');
let _utils = require('../utils/util.js');

module.exports = (options) => {
    return new Promise((resolve, reject) => {
        if(!options.url){
            throw new Error('未设置请求url');
        }
        let session_id = wx.getStorageSync('session_id') || '';
        let opt = _utils.extend({
            url: '',
            filePath: '',
            formData:{
                appid: _config.appid,
                session_id: session_id
            },
            header: {
                'WX_UA': _utils.UAString(),
                'WX_AUTH': _config.authString
            },
            success: function(result) {
                if (parseInt(result.statusCode) === 200) {
                    resolve(result.data);
                } else {
                    reject(result);
                }
            },
            fail: typeof reject === 'function'? reject : function () {}
        },options);
        wx.uploadFile(opt);
    });
};