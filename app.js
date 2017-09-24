"use strict";

const _request = require('/lib/request.js');
const _api = require('/lib/api.js');
const _p = require('/lib/logPrinter.js');
const _logs = require('/lib/logs.js');
const _congfig = require('/config/config.js');
const _authLogin = require('/config/auth/login.js');

App({
    onLaunch: function() {
        let _this = this;
        //打开日志
        _logs.setStartLogs();
        //知晓云sdk
        console.log(_congfig.zxySdkVersion);
        require('./ifanr/'+_congfig.zxySdkVersion);
        //初始化sdk
        wx.BaaS.init('a576d8b11cf54f7aae12');

        //获取系统信息
        _this.getSystemInfo();
    },
    getCurrentRoute: function () {
        let routeStack = getCurrentPages(); //获取页面栈，第一个元素为首页，最后一个元素为当前页面
        return routeStack[routeStack.length-1];
    },
    checkLoginStatus: function (callback) {
        let _this = this,
            curRoute = _this.getCurrentRoute(),
            notCheckLoginRoutes = _authLogin.not_check_login_route;
        if(!notCheckLoginRoutes.includes(curRoute)) {
            //检测当前用户登录态是否有效
            wx.checkSession({
                success: function (resp) {
                    _p.s('checkSession：success wx登录状态保持',resp);
                    //session 未过期，并且在本生命周期一直有效
                    //@todo checkSession的bug一直会返回success
                    // _this.baasLogin(callback)
                    callback && callback();
                },
                fail: function (resp) {
                    _p.e('checkSession：fail wx登录状态过期',resp);
                    //登录态过期
                    _this.baasLogin(callback)
                }
            })
        }else{
            callback && callback();
        }
    },
    //调用的微信的登录
    baasLogin: function (callback) {
        let _this = this;
        wx.BaaS.login().then((res) => {
            // 登录成功
            _p.i('登录成功',res);
            _this.globalData.userInfo = res;
            _this.globalData.userInfo.uid = wx.BaaS.storage.get('uid');
            wx.setStorage({
                key: 'user_info',
                data: _this.globalData.userInfo
            });
            callback && callback(res);
        }, (err) => {
            // 系统级错误
            _p.e('登录失败',err);
        });
    },
    //获取系统信息
    getSystemInfo: function () {
        let _this = this;
        wx.getSystemInfo({
            success: function (res) {
                _this.globalData.systemInfo = res;
            }
        });
    },
    globalData: {
        config: _congfig,
        userInfo: wx.getStorageSync('user_info'),
        systemInfo: null
    }
});