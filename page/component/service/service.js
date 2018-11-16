// page/component/new-pages/user/user.js
var authsign = require('../utils/authsign.js') 
Page({
  data:{
  },
  onLoad(options){
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: ['https://www.aiwsport.com/test/byql.png'] // 需要预览的图片http链接列表
    })
  }
})