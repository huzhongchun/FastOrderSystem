
const _util = require('../../utils/util.js');
const _logs = require('../../lib/logs.js');

Page({
    data: {
        logs: []
    },
    onLoad: function () {
        let startLogs = _logs.getStartLogs();
        this.setData({
            logs: startLogs.map(function (log) {
                return _util.formatTime(new Date(log))
            })
        })
    }
});
