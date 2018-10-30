var authsign = require('../utils/authsign.js') 
Page({
  data: {
    actives:{},
    activeFirsts: {},
    active10s: {},
    active15s: {},
    active20s: {}
  },
  onLoad(options) {
    var self = this;
    var params = {
      enterType: "4"
    };
    params.sign = authsign.auth_sign(params);
    wx.request({
      url: 'https://www.aiwsport.com/step/get_active_info.json',
      data: params,
      method: 'GET',
      success: function (res) {
        console.log(res);
        self.setData({
          actives: res.data.data
        });
      }
    });

    var params1 = {
      enterType: "1"
    };
    params1.sign = authsign.auth_sign(params1);
    wx.request({
      url: 'https://www.aiwsport.com/step/get_active_info.json',
      data: params1,
      method: 'GET',
      success: function (res) {
        console.log(res);
        self.setData({
          active10s: res.data.data
        });
      }
    });

    var params2 = {
      enterType: "2"
    };
    params2.sign = authsign.auth_sign(params2);
    wx.request({
      url: 'https://www.aiwsport.com/step/get_active_info.json',
      data: params2,
      method: 'GET',
      success: function (res) {
        console.log(res);
        self.setData({
          active15s: res.data.data
        });
      }
    });


    var params3 = {
      enterType: "3"
    };
    params3.sign = authsign.auth_sign(params3);
    wx.request({
      url: 'https://www.aiwsport.com/step/get_active_info.json',
      data: params3,
      method: 'GET',
      success: function (res) {
        console.log(res);
        self.setData({
          active20s: res.data.data
        });
      }
    });

    var params5 = {
      enterType: "5"
    };
    params5.sign = authsign.auth_sign(params5);
    wx.request({
      url: 'https://www.aiwsport.com/step/get_active_info.json',
      data: params5,
      method: 'GET',
      success: function (res) {
        console.log(res);
        self.setData({
          activeFirsts: res.data.data
        });
      }
    });
  },
  onReady() {
   
  }
})