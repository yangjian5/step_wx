var authsign = require('../utils/authsign.js')
var WxSearch = require('../wxSearchView/wxSearchView.js');

Page({
  data: {
    rankList:[],
    userId:0
  },
  onLoad: function (options) {
    var self = this;

    WxSearch.init(
      self,  // 本页面一个引用
      [], // 热点搜索推荐，[]表示不使用
      [],// 搜索匹配，[]表示不使用
      self.mySearchFunction, // 提供一个搜索回调函数
      self.myGobackFunction //提供一个返回回调函数
    );

    wx.getStorage({
      key: 'userId',
      success: function (res) {
        var params = {
          flag: 1,
          userId: res.data,
          opType:'get'
        };
        params.sign = authsign.auth_sign(params);
        wx.request({
          url: 'https://www.aiwsport.com/step/get_active_top.json',
          data: params,
          method: 'GET',
          success: function (res) {
            console.log(res)
            self.setData({
              rankList: res.data.data
            })
          }
        });

        self.setData({
          userId: res.data
        });
      }
    });
  },
  submitZan: function (event) {
    var self = this;
    var params = {
      userId: event.currentTarget.id,
      zanUserId: self.data.userId
    };
    
    params.sign = authsign.auth_sign(params);
    wx.request({
      url: 'https://www.aiwsport.com/step/zan_active.json',
      data: params,
      method: 'GET',
      success: function (res) {
        var iconText = "success";
        if (res.data.code == 403) {
          iconText = "none";
        }

        wx.showToast({
          title: res.data.message,
          icon: iconText,
          duration: 2000,
          mask: true
        })
      }
    });
  },
  // 转发函数,固定部分
  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数
  getFocus: WxSearch.getFocus,
  getBlur: WxSearch.getBlur,

  // 搜索回调函数  
  mySearchFunction: function (value) {
    self = this;
    var params = {
      flag: 1,
      userId: value,
      opType: 'search'
    };
    params.sign = authsign.auth_sign(params);
    wx.request({
      url: 'https://www.aiwsport.com/step/get_active_top.json',
      data: params,
      method: 'GET',
      success: function (res) {
        console.log(res)
        self.setData({
          rankList: res.data.data
        })
      }
    });
  },

  // 返回回调函数
  myGobackFunction: function () {
    self = this;
    // 生命周期函数--监听页面显示
    var params = {
      flag: 1,
      userId: self.data.userId,
      opType: 'get'
    };
    params.sign = authsign.auth_sign(params);
    wx.request({
      url: 'https://www.aiwsport.com/step/get_active_top.json',
      data: params,
      method: 'GET',
      success: function (res) {
        console.log(res)
        self.setData({
          rankList: res.data.data
        })
      }
    });
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
    
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
  }
})
