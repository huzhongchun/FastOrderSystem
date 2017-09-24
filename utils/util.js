const config = require('../config/config.js');

//克隆原始对象自身的值，deep为true则克隆包括它继承的值。
function cloneObject(origin,deep) {
    if(deep) {
        let originProto = Object.getPrototypeOf(origin);
        return Object.assign(Object.create(originProto), origin);
    }else{
        return Object.assign({}, origin);

    }
}

//json对象判断
function isObject(obj) {
    return obj && (typeof(obj) === "object") && !(obj instanceof Array)
}

//数组判断
function isArray(array){
    return array instanceof Array
}

//对象合并
function extend(target, source, deep) {
    for (let key in source) {
        if (deep && (isObject(source[key]) || isArray(source[key]))) {
            if (isObject(source[key]) && !isObject(target[key]))
                target[key] = {};
            if (isArray(source[key]) && !isArray(target[key]))
                target[key] = [];
            extend(target[key], source[key], deep);
        }else if (source[key] !== undefined)
            target[key] = source[key];
    }

    return target;
}

function formatTime(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDate(date, split) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return [year, month, day].map(formatNumber).join(split || '')
}

function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n
}

function UAString() {
    let res = wx.getSystemInfoSync();

    return config.appName+'/'+config.version+' ('+ res.model+';WeChat;'+res.version+';'+res.language +';weapp;'+config.version+';cn;weapp;;'+res.windowWidth+'*'+res.windowHeight+') native/1.0';
}


module.exports = {
    formatTime,
    formatDate,
    UAString,
    isObject,
    isArray,
    extend,
    cloneObject
};
