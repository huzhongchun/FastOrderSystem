//index.js
const _p = require('../../lib/logPrinter.js');
const wxParser = require('../../wxParser/index');

let _app = getApp();
Page({
    data: {
        id: 0,
        userInfo: wx.getStorageSync('user_info'),
        nodes: '',
        itemInfo: null,
        tableID: 1406
    },
    onLoad: function (query) {
        let _this = this;
        _this.setData({
            'id': parseInt(query.id)
        });
        _this.tableObject = new wx.BaaS.TableObject(_this.data.tableID);
        _app.checkLoginStatus(function () {
            let objects = {
                richTextID: _this.data.id
            };
            wx.BaaS.getContent(objects).then( (res) => {

                let content = res.data.content;
                _this.setData({
                    'nodes': content,
                    'itemInfo': res.data
                });

                //直接使用rich-text组件，不用解析器，图片会出现尺寸的问题
                wxParser.parse({
                    bind: 'richText',
                    html: content,
                    target: _this,
                    enablePreviewImage: false, // 禁用图片预览功能
                    tapLink: (url) => { // 点击超链接时的回调函数
                        // url 就是 HTML 富文本中 a 标签的 href 属性值
                        // 这里可以自定义点击事件逻辑，比如页面跳转
                        wx.navigateTo({
                            url
                        });
                    }
                });
            }, (err) => {
                _p.e('获取内容失败',err);
            });


            _this.findReadHistory().then((data)=>{

            }).catch((err)=>{

            });

        });


    },
    insertReadHistory: function () {
        let _this = this;
        // 向 tableID 为 10 的数据表插入一条记录
        let table = _this.tableObject.create();
        let data = {
            ifanr_u_id: _this.data.userInfo.uid,
            article_id: _this.data.itemInfo.id,
            article_title: _this.data.itemInfo.title,
            article_desc: _this.data.itemInfo.description,
            article_cover: _this.data.itemInfo.cover,
        }
        table.set(data).save().then((res) => {
            // success
        }, (err) => {
            // err
        });
    },
    findReadHistory: function () {
        let _this = this;
        return new Promise((resolve,reject)=>{

            // 实例化查询对象
            let query1 = new wx.BaaS.Query();
            query1.compare('ifanr_u_id', '=',  _this.data.userInfo.uid);
            let query2 = new wx.BaaS.Query();
            query2.compare('article_id', '=',  _this.data.id);

            // and 查询
            let andQuery = wx.BaaS.Query.and(query1, query2);

            _this.tableObject.setQuery(andQuery).find().then( (res) => {
                _p.i('查询浏览记录结果',res.data.objects);
                resolve && resolve(res.data);
            }, (err) => {
                _p.e('查询浏览记录失败',err);
                reject && reject(err);
            })
        })


    }
});
