/**
 * Created by huzhongchun on 2017/6/19.
 */


module.exports = {
    //启动日志,只记录启动时间
    getStartLogs: function() {
        return wx.getStorageSync('start_logs') || [];
    },
    setStartLogs: function() {
        let startLogs = wx.getStorageSync('start_logs') || [];
        if(startLogs.length >= 20000){ //最多记录2W条日志，避免缓存数据过大
            startLogs.length = 100;
        }
        startLogs.unshift(Date.now());
        wx.setStorageSync('start_logs', startLogs);
    }
};