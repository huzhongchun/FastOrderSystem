/**
 * Created by huzhongchun on 2017/7/15.
 */
const _config = require('../config/config.js');
const _api = require('../lib/api.js');
const Promise = require('../lib/Promise.js');
const _utils = require('util.js');


//  公用方法
module.exports = {
    login: function () {
        return new Promise((resolve,reject)=>{
            wx.login({
                success: function (resp) {
                    wx.request({
                        url: _api.getUrl('getSession'),
                        data: {
                            'code': resp.code,
                            'session_id': wx.getStorageSync('session_id') || ''
                        },
                        header: {
                            'WX_UA': _utils.UAString(),
                            'WX_AUTH': _config.authString
                        },
                        method: 'POST',
                        success: function(data) {
                            wx.setStorageSync('session_id', data.data.result.session_id);
                            resolve && resolve(data);
                        },
                        fail: function (err) {
                            reject && reject(err);
                        }
                    })
                }
            });
        })
    }
}