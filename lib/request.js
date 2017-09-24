const _api = require('api.js');
const _p = require('logPrinter.js');
const _config = require('../config/config.js');
const _common = require('../utils/common.js');
const Promise = require('Promise.js');
let utils = require('../utils/util.js');

module.exports = function(options) {
    return new Promise((resolve, reject) => {
    let session_id = wx.getStorageSync('session_id') || '';
        if(!options.url){
            throw new Error('未设置请求url');
            return false;
        }
        let opt = utils.extend({
            url: '',
            method: 'POST',
            data: {
                appid: _config.appid,
                session_id: session_id
            },
            dataType: 'json',
            header: {
                'WX_UA': utils.UAString(),
                'WX_AUTH': _config.authString
            },
            success:  (result) => {
                _p.i('request.js：',[opt,result.data]);
                if (parseInt(result.statusCode) === 200) {
                    resolve(result.data);
                }else {
                    //code为60000，则是需要登录获取新的session_id
                    if (parseInt(result.data.code) === 60000) {
                        _p.e('request.js：60000 未登录');
                        _common.login().then(function () {
                            opt.data.session_id = wx.getStorageSync('session_id') || '';
                            wx.request(opt);
                        })
                    } else {
                        reject(result);
                    }
                }
            },
            fail: (typeof reject === 'function') ? reject: undefined
        },options,true);

        wx.request(opt);
    });
};