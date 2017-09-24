//index.js
const _p = require('../../lib/logPrinter.js');

let _app = getApp();
Page({
    data: {
        userInfo: _app.globalData.userInfo,
        storeId: '59be9eaa09a8051142309e19',
        itemTableId: 1685,
        groupTableId: 1686,
        selectedItemList: [],
        totalItemListData: null,
        contentScroll: {
            scroll_into_view: ''
        },
        navScroll: {
            scroll_into_view: ''
        },
    },
    onLoad: function () {
        let _this = this;
        _app.checkLoginStatus(function () {
            _this.groupTableObject = new wx.BaaS.TableObject(_this.data.groupTableId);
            _this.itemTableObject = new wx.BaaS.TableObject(_this.data.itemTableId);
            _this.getGroupList();
        });
    },
    //获取分组列表
    getGroupList: function () {
        let _this = this;
        let query = new wx.BaaS.Query();

        query.compare('store_id', '=', _this.data.storeId);

        _this.groupTableObject.setQuery(query).find().then( (res) => {
            // success
            _p.i('index.js：分组列表：',res);
            _this.groupList = res.data.objects;
            _this.getGroupItemList();
        }, (err) => {
            _p.e('index.js：获取分组列表失败',err);

        })
    },
    //获取分组下的商品列表
    getGroupItemList: function () {
        let _this = this;
        let itemRequestPromiseList = [], selectedItemList = [];
        for(let i = 0;i < _this.groupList.length;i++){
            //删除额外的信息
            delete _this.groupList[i].acl_gid;
            delete _this.groupList[i].acl_permission;
            delete _this.groupList[i].created_at;
            delete _this.groupList[i].created_by;
            delete _this.groupList[i]._id;
            itemRequestPromiseList.push(_this.getItemList(_this.groupList[i].id,i));
            let temp = [];
            temp[_this.groupList[i].id]= {item_list: []};
            selectedItemList.push(temp);
            _this.setData({
                'selectedItemList': selectedItemList
            })
        }
console.log(_this.data.selectedItemList);
        Promise.all(itemRequestPromiseList).then((res)=>{
            _p.i('index.js：分组的商品列表',_this.groupList);
            _this.setData({
                'totalItemListData': _this.groupList
            })
        }).catch((err)=>{
            _p.e('index.js：同时获取多个分组的商品列表失败',err);
        });
    },
    getItemList: function (groupId,index) {
        let _this = this;
        return new Promise((resolve,reject)=>{
            let query1 = new wx.BaaS.Query();
            query1.compare('group_id','=',groupId);
            let query2 = new wx.BaaS.Query();
            query2.compare('store_id','=',_this.data.storeId);
            // and 查询
            let andQuery = wx.BaaS.Query.and(query1, query2);
            _this.itemTableObject.setQuery(andQuery).find().then((res)=>{
                _p.i('index.js：商品列表：',res);
                _this.groupList[index].item_list = res.data.objects;
                resolve && resolve();
            }).catch((err)=>{
                _p.e('index.js：获取商品列表失败',err);
                reject && reject();
            });
        })
    },

    //减去商品数量
    eventItemSub: function (e) {
        let _this = this;
        let data = e.target.dataset;
        let totalItemList = _this.data.totalItemListData;
        let groupTotalCount = totalItemList[data.group_index].count;
        if(!groupTotalCount || groupTotalCount <= 1){
            groupTotalCount = 0;
        }else{
            --groupTotalCount;
        }
        let numb = totalItemList[data.group_index].item_list[data.item_index].count;
        if(!numb || numb <= 1){
            numb = 0;
        }else{
            --numb;
        }
        totalItemList[data.group_index].count = groupTotalCount;
        totalItemList[data.group_index].item_list[data.item_index].count = numb;
        _this.setData({
            "totalItemListData": totalItemList
        })
    },
    //增加商品数量
    eventItemAdd: function (e) {
        let _this = this;
        let data = e.target.dataset;
        let totalItemList = _this.data.totalItemListData;
        let groupTotalCount = totalItemList[data.group_index].count;
        if(!groupTotalCount || groupTotalCount < 0){
            groupTotalCount = 1;
        }else{
            ++groupTotalCount;
        }

        let numb = totalItemList[data.group_index].item_list[data.item_index].count;
        if(!numb || numb < 0){
            numb = 1;
        }else{
            ++numb;
        }
        totalItemList[data.group_index].count = groupTotalCount;
        totalItemList[data.group_index].item_list[data.item_index].count = numb;
        _this.setData({
            "totalItemListData": totalItemList
        })

    },
    eventContentScroll: function (e) {
        // console.log(e);
    },
    eventGroupItemTap: function (e) {
        let _this = this;
        let data = e.target.dataset;
        _this.setData({
            'contentScroll.scroll_into_view': 'group-id-'+data.group_id
        });
        console.log(_this.data.contentScroll);
    }

});
