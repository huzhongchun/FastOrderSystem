//index.js
const _p = require('../../lib/logPrinter.js');

let _app = getApp();
Page({
    data: {
        userInfo: _app.globalData.userInfo,
        coverTouchPositionInfo: {
            moveY: 0,
            animate: false,
            moveYCss: '0px',
            display: 'block'
        },
        windowInfo: {
            width: 750,
            height: 0
        },
        productList: []
    },
    onLoad: function () {
        let _this = this;
        _app.checkLoginStatus(function () {
            _this.getProductList();
        });
    },
    getProductList: function () {
        let tableID = 358, _this = this;
        let params = {tableID};
        //获取表信息
        // wx.BaaS.getTable(params).then((res) => {
        //     _p.s('获取表信息成功',res);
        // }, (err) => {
        //     _p.e('获取数据表信息失败',err);
        // });
        //获取表数据
        wx.BaaS.getRecordList(params).then((res) => {
            _p.s('获取表数据成功',res);
            let data = _this.data.productList;
            let resultData  =res.data.objects;
            _this.setData({
                'productList': data.concat(resultData)
            })
        }, (err) => {
            _p.e('获取表数据失败',err);
        });

        //获取数据项详情
        let recordID = '598928c2afb776574b59c94e';
        let objects = {
            tableID,
            recordID
        };
        wx.BaaS.getRecord(objects).then( (res) => {
            // success
            _p.s('获取数据项详情成功',res);
        }, (err) => {
            // err
        })


    },
    eventPayment: function () {
        let tableID = 358, _this = this;
        let params = {};
        params.merchandiseSchemaID = 358;
        params.merchandiseRecordID = '598928c2afb776574b59c94e';
        params.totalCost = 1;
        params.merchandiseDescription = '幼猫猫粮';
        // params.merchandiseSnapshot = [];

debugger;
        wx.BaaS.pay(params).then((res) => {
            _p.s('支付成功',res);
            // success. 支付请求成功响应。
            /* 如果支付成功, 则可以在 res 中拿到 transaction_no 和支付结果信息
             如果支付失败, 则可以获取失败原因
             注: 只要是服务器有返回的情况都会进入 success, 即便是 4xx，5xx 都会进入
             所以非系统级别错误导致的支付失败也会进入这里, 例如用户取消，参数错误等
             这是微信的处理方式与 BaaS 服务(器)无关
             */
        }, (err) => {
            _p.e('支付失败',err);
            // err. 系统级别错误导致失败。只有发生网络异常等其他系统级错误才会进入这里
            // 这是微信服务器的处理方式与 BaaS 服务(器)无关
        });
    }
});
