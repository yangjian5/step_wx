// page/component/new-pages/cart/cart.js
var app = getApp()
Page({
  data: {
    // userId:0,
    daySumStep:0,
    img: "/image/paobu.jpg",
    canvasWidth: 0,
    canvasHeight: 0
  },
  onShow() {
    // var self = this;
    


    // wx.getStorage({
    //   key: 'userId',
    //   success: function (res) {
    //     self.setData({
    //       userId: res.data,
    //       daySumStep: app.globalData.daySumStep
    //     });
    //   }
    // });
  },
  // saveImg: function () {
  //   var self = this;
  //   var imgUrl = 'http://127.0.0.1:8866/build_img.json?daySumStep=' + self.data.daySumStep + '&userId=' + self.data.userId;
  //   console.log(imgUrl)
  //   wx.downloadFile({
  //     url: imgUrl,
  //     success: function (res) {
  //       wx.saveImageToPhotosAlbum({
  //         filePath: res.tempFilePath,
  //         success(res) {
  //           console.log(res)
  //         },
  //         fail(res) {
  //           console.log(2222)
  //           console.log(res)
  //         },
  //         complete(res) {
  //           console.log(3333)
  //           console.log(res)
  //         }
  //       })
  //     }, fail: function (res) {
  //       console.log(res)
  //     }
  //   })
  // },






  onLoad: function (options) {
    //需要注意的是：我们展示图片的域名需要在后台downfile进行配置，并且画到canvas里面前需要先下载存储到data里面
    let that = this;
    var self = this;

    self.setData({
      img: app.globalData.userInfo.avatarUrl,
      daySumStep: app.globalData.daySumStep
    });

    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          canvasWidth: res.windowWidth-60,
          canvasHeight: res.windowHeight-100
        })
      },
    })

    //先下载下来，比如我们的logo
    wx.downloadFile({
      url: that.data.img,
      success: function (res) {
        console.log(res);
        that.setData({
          img: res.tempFilePath
        });
        that.canvasImg();
      }
    })
  },
  canvasImg() {
    const ctx = wx.createCanvasContext('myCanvas');
    ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);  
    ctx.drawImage("/image/paobu.jpg", 0, 0, this.data.canvasWidth, this.data.canvasHeight-50);
    
    ctx.setFillStyle("#fff");
    ctx.setFontSize(14);                               //字大小
    ctx.setTextAlign('center');   
    var str = app.globalData.userInfo.nickName + "  --今日行走 " + this.data.daySumStep+" 步";
    ctx.fillText(str, 200, 120);
    ctx.drawImage(this.data.img, 20, 30, 40, 40);
    ctx.draw();
  },
  saveImg() {
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '保存成功'
            })
          }
        })
      }
    })
  }
})