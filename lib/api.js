let config = require('../config/config.js');

module.exports = {
    routes: {

        /**
         * 通过js_code获取session
         *
         * 参数：{code: js_code}
         */
        getSession: '/api/user/get_session',

        /**
         * 同步用户信息到服务器
         *
         * 参数：{user_data: getUserInfo,session_id: }
         */
        loginPath: '/api/user/login',

        /**
         * 获取用户的信息
         */
        getUserInfoPath: '/api/user/get_user_info',

        /**
         * 建立socket连接
         */
        socketConnectPath: '/wss/',

        /**
         * 获取聊天记录
         */
        getGroupHistoryPath:'/api/message/get_group_history',

        /**
         * 上传文件
         */
        'uploadFilePath':'/v1/upload/file'

    },
    getUrl(route,type) {
        return (type === 'socket' ? config.wssProxy : config.httpProxy)+config.host+this.routes[route];
    }
};