// page/component/details/details.js
var authsign = require('../utils/authsign.js') 
Page({
  data:{
    goods: {},
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false,
    userId: 0,
    goodId:0,
    changeGoodLogs:[]
  },

  addToCart() {
    var self = this;
    wx.showModal({
      title: '提示',
      content: "确认兑换？",
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          var params1 = {
            userId: self.data.userId,
            goodId: self.data.goodId
          };
          params1.sign = authsign.auth_sign(params1);
          wx.request({
            url: 'https://www.aiwsport.com/step/change_good.json',
            data: params1,
            method: 'GET',
            success: function (res) {
              wx.showModal({
                title: '提示',
                content: res.data.message,
                showCancel: false
              })
            }
          });
        }
      }
    })
  },
  onLoad: function (option) {
    var self = this;

    wx.getStorage({
      key: 'userId',
      success: function (res) {
        console.log("asdasd" + res.data);
        self.setData({
          userId: res.data
        })
      }
    })

    self.setData({
      goodId: option.goodId
    });

    var params2 = {
      goodId: self.data.goodId
    };
    params2.sign = authsign.auth_sign(params2);
    wx.request({
      url: 'https://www.aiwsport.com/step/get_good.json',
      data: params2,
      method: 'GET',
      success: function (res) {
        self.setData({
          goods: res.data.data
        });
      }
    });

    var params3 = {
      goodId: self.data.goodId
    };
    params3.sign = authsign.auth_sign(params3);
    wx.request({
      url: 'https://www.aiwsport.com/step/get_good_change_log.json',
      data: params3,
      method: 'GET',
      success: function (res) {
        self.setData({
          changeGoodLogs: res.data.data
        });
        
      }
    });
  },
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }
})