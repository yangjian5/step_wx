// page/component/new-pages/user/address/address.js
var authsign = require('../utils/authsign.js') 
Page({
  data:{
    changeGoodLogs: [],
    isShow:true
  },
  onLoad(options){
    var self = this;
    var params = {
      userId: options.userId
    };
    params.sign = authsign.auth_sign(params);
    wx.request({
      url: 'https://www.aiwsport.com/step/get_user_change_log.json',
      data: params,
      method: 'GET',
      success: function (res) {
        var isShow = true;
        console.log(res.data.data.length)
        if (res.data.data.length > 0) {
          isShow = false;
        }
        self.setData({
          changeGoodLogs: res.data.data,
          isShow: isShow
        });
      }
    });
  }
})