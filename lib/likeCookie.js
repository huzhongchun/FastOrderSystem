let _config = require('../config/config.js');
let _likeCookieStorageName = config.likeCookieStorageName;

//更新likecookie，清除过期的cookie
function updateLikeCookies() {
    let likeCookies = wx.getStorageSync(_likeCookieStorageName) ? wx.getStorageSync(_likeCookieStorageName) : {length:0};
    let curTime = +new Date();
    if(likeCookies){
        for(let k in likeCookies){
            let itemTime = likeCookies[k].expir;
            if(itemTime <= curTime){
                likeCookies.length--;
                delete likeCookies[k];
            }
        }
    }
    wx.setStorage({
        key: _likeCookieStorageName,
        data: likeCookies
    });
}
//设置cookie，默认过期时间：1天
function setCookie(name,value,expiration) {
    if(name && value) {
        let expir = isNaN(parseInt(expiration)) ? 1 : expiration;
        let cookieName = 'cookie_' + name;
        let likeCookies = wx.getStorageSync(_likeCookieStorageName) ? wx.getStorageSync(_likeCookieStorageName) : {length: 0};
        if (expir >= 0) {
            let targetTime = (+new Date()) + expir * 24 * 60 * 60 * 1000;
            if(!likeCookies[cookieName]){
                likeCookies.length++;
            }
            likeCookies[cookieName] = {
                value: value,
                expir: targetTime
            };
        } else {
            if(likeCookies[cookieName]) {
                delete likeCookies[cookieName];
                likeCookies.length--;
            }
        }

        wx.setStorage({
            key: _likeCookieStorageName,
            data: likeCookies
        });
    }
}

//移除cookie
function removeCookie(name) {
    let cookieName = 'cookie_'+name;
    let likeCookies = wx.getStorageSync(_likeCookieStorageName) ? wx.getStorageSync(_likeCookieStorageName) : {length:0};
    if(likeCookies[cookieName]) {
        delete likeCookies[cookieName];
        likeCookies.length--;
        wx.setStorage({
            key: _likeCookieStorageName,
            data: likeCookies
        });
    }
}

//获取cookie
function getCookie(name) {
    let cookieName = 'cookie_'+name;
    let likeCookies = wx.getStorageSync(_likeCookieStorageName) ? wx.getStorageSync(_likeCookieStorageName) : {length:0};
    let cookieInfo = likeCookies && likeCookies[cookieName] ?  likeCookies[cookieName] : '';
    let value = '';
    if(cookieInfo){
        let expir = cookieInfo.expir;
        if(expir <= +new Date()){
            delete likeCookies[cookieName];
            likeCookies.length--;
            wx.setStorage({
                key: _likeCookieStorageName,
                data: likeCookies
            });
        }else{
            value = cookieInfo.value;
        }
    }

    return value;
}

//清除所有cookie
function clearCookie() {
    wx.removeStorage(_likeCookieStorageName);
}

module.exports = {
    updateLikeCookies,
    setCookie,
    getCookie,
    removeCookie,
    clearCookie
};