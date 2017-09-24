"use strict";

const _util = require('../../utils/util.js');
const _request = require('../../lib/request.js');
const _api = require('../../lib/api.js');
let _app = getApp();
Page({
    data: {
        userInfo: wx.getStorageSync('user_info'),
        tableID: 1406,
        historyList: []
    },
    onLoad: function () {
        let _this = this;
        _app.checkLoginStatus(function () {
            _this.getHistoryList();
        });

    },
    getHistoryList: function () {
        let _this = this;
        let params = {
            tableID: _this.data.tableID
        };
        //获取表数据
        wx.BaaS.getRecordList(params).then((res) => {
            _p.s('获取表数据成功',res);
            let data = _this.data.historyList;
            let resultData  =res.data.objects;
            _this.setData({
                'historyList': data.concat(resultData)
            })
        }, (err) => {
            _p.e('获取表数据失败',err);
        });
    },
});
