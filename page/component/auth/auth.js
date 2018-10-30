var app = getApp();
Page({
  onGotUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      wx.switchTab({
        url: '../index',
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '为不影响您的使用请授权',
        showCancel: false
      });
    }
  },

  onLoad: function (options) {
    
    if (options.fx_muser_id) {
      app.globalData.fxMuserId = options.fx_muser_id
    }

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              app.globalData.userInfo = res.userInfo;
              wx.switchTab({
                url: '../index',
              });
            }
          })
        }
      }
    })
  }
})

