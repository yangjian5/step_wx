// page/component/new-pages/user/user.js
var authsign = require('../utils/authsign.js') 

Page({
  data:{
    enterType:"0",
    userId:"0",
    btn_state:"",
    btn_msg:"报名参加",
    zaoqibtnShow:false
  },
  onLoad(options){
    var self = this;
    self.setData({
      enterType: options.type
    })

    wx.getStorage({
      key: 'userId',
      success: function (res) {
        self.setData({
          userId: res.data
        })

        var params = {
          userId: self.data.userId,
          enterType: self.data.enterType
        };
        params.sign = authsign.auth_sign(params);
        wx.request({
          url: 'https://www.aiwsport.com/step/is_join_active.json',
          data: params,
          method: 'GET',
          success: function (res) {
            console.log(res);
            if (res.data.data == "1") {
              self.setData({
                btn_state: "true",
                btn_msg: "您已报名"
              });
            }
            if (res.data.data == "3") {
              self.setData({
                btn_state: "true",
                btn_msg: "您已报名",
                zaoqibtnShow:true
              });
            }
          }
        });
      }
    });  
  },
  dakaEnter: function () {
    var self = this;
    var params = {
      userId: self.data.userId
    };
    params.sign = authsign.auth_sign(params);
    wx.request({
      url: 'https://www.aiwsport.com/step/do_sign.json',
      data: params,
      method: 'GET',
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: res.data.data,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              self.setData({
                zaoqibtnShow: false
              });
            }
          }
        });
      }
    });
  },
  submitEnter: function () {
    var self = this;
    var params3 = {
      userId: self.data.userId,
      enterType: self.data.enterType
    };
    params3.sign = authsign.auth_sign(params3);
    wx.request({
      url: 'https://www.aiwsport.com/step/create_active.json',
      data: params3,
      method: 'GET',
      success: function (res) {

        var isSuccess = res.data.message == "createActiveOk";

        wx.showModal({
          title: '提示',
          content: res.data.data,
          showCancel: false,
          success: function(res){
            if (isSuccess) {
              if (res.confirm) {
                if (self.data.enterType == "4") {
                  console.log(self.data.enterType);
                  wx.redirectTo({
                    url: '../show/show?type=enter',
                  });
                } else {
                  wx.navigateBack();
                }
              }
            }
          }
        }); 
        
      }
    });
  }
})