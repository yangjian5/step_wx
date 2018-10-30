// page/component/new-pages/user/user.js
var authsign = require('../utils/authsign.js') 
Page({
  data:{
    thumb:'',
    nickname:'',
    orders:[],
    hasAddress:false,
    address:{},
    userId:0,
    isUserShow:true
  },
  onLoad(){
    var self = this;
    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function(res){
        self.setData({
          thumb: res.userInfo.avatarUrl,
          nickname: res.userInfo.nickName
        })
      }
    })
  },
  onShow(){
    var self = this;
    wx.getStorage({
      key: 'userId',
      success: function(res){
        self.setData({
          userId:res.data
        });

        var params = {
          userId: res.data,
          enterType: '4'
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
                isUserShow: false
              });
            }
          }
        });

      }
    })
  }
})