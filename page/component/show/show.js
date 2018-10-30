
var authsign = require('../utils/authsign.js') 
import { promisify } from '../utils/promise.util'
import { $init, $digest } from '../utils/common.util'
const wxUploadFile = promisify(wx.uploadFile)

var show = false;
var item = {};
Page({
  data:{
    userId:0,
    titleCount: 0,
    contentCount: 0,
    title: '',
    content: '',
    images: []
  },
  onShow(){
    
  },
  onLoad(options){
    $init(this)

    var self = this;

    wx.getStorage({
      key: 'userId',
      success: function (res) {
        var params = {
          userId: res.data
        };
        params.sign = authsign.auth_sign(params);
        console.log(params)
        wx.request({
          url: 'https://www.aiwsport.com/step/get_step_for_4.json',
          data: params,
          method: 'GET',
          success: function (res) {
            console.log(res)
            if (res.data.code == 200) {
              if (res.data.data) {
                self.setData({
                  title: res.data.data.title,
                  content: res.data.data.showdesc
                })
              }
              if (res.data.data.showurl) {
                self.setData({
                  images: res.data.data.showurl.split(",")
                })
              }
            }
          }
        });

        self.setData({
          userId: res.data
        });
      }
    });
  },
  handleTitleInput(e) {
    const value = e.detail.value
    this.data.title = value
    this.data.titleCount = value.length
    $digest(this)
  },

  handleContentInput(e) {
    const value = e.detail.value
    this.data.content = value
    this.data.contentCount = value.length
    $digest(this)
  },

  chooseImage(e) {
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log(res.tempFiles);
        const images = this.data.images.concat(res.tempFilePaths)
        this.data.images = images.length <= 3 ? images : images.slice(0, 3)
        $digest(this)
      }
    })
  },

  removeImage(e) {
    console.log(e);
    var self = this;
    var params = {
      urlImg: e.target.dataset.url,
      userId: self.data.userId
    };
    params.sign = authsign.auth_sign(params);
    console.log(params)
    wx.request({
      url: 'https://www.aiwsport.com/step/del_img.do',
      data: params,
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data == "sucess") {
            const idx = e.target.dataset.idx
            self.data.images.splice(idx, 1)
            $digest(self)
          }
        } else {
          wx.showToast({
            title: '删除失败，请重试',
            icon: 'none',
            duration: 1000
          });
        }
      }
    });    
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images

    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },

  submitForm(e) {
    var self = this;
    const title = this.data.title
    const content = this.data.content

    if (title && content) {
      var params = {
        userId: self.data.userId,
        title: title,
        showDesc: content
      };
      params.sign = authsign.auth_sign(params);
      wx.request({
        url: 'https://www.aiwsport.com/step/add_show_info.json',
        data: params,
        method: 'GET',
        success: function (res) {
          if (res.data.code == 403) {
            console.log('add_show_info is fail');
          }
        }
      });
    }

    var tempFilePaths = this.data.images;
    if (tempFilePaths.length > 0) {
      console.log(tempFilePaths);
      self.uploadimg(tempFilePaths, 0);
    }
  },
  uploadimg(tempFilePaths, index) {
    var self = this;
    console.log(tempFilePaths[index] + '====' + index)

    if (tempFilePaths[index].indexOf("www.aiwsport.com") > 0) {
      // 图片修改情况，不需要修改的图片
      index++;
      if (index == tempFilePaths.length) {   //当图片传完时，停止调用 
        index = 0;
        console.log('1执行完毕');
        wx.showToast({
          title: '图片上传成功',
          icon: 'none',
          duration: 1000
        });
      } else {//若图片还没有传完，则继续调用函数
        self.uploadimg(tempFilePaths, index);
      }
      return;
    }

    var canName = 'attendCanvasId' + index;
    var ctx = wx.createCanvasContext(canName);
    ctx.drawImage(tempFilePaths[index], 0, 0, 600, 800)
    ctx.draw();

    var showIndex = index + 1
    wx.showToast({
      title: '第' + showIndex + '图片上传中',
      icon: 'loading',
      duration: 10000
    });

    setTimeout(function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 600,
        height: 800,
        destWidth: 600,
        destHeight: 800,
        canvasId: canName,
        success: function (res) {
          console.log(res)
          wx.uploadFile({
            url: 'https://www.aiwsport.com/go/upload_img.do',      //此处换上你的接口地址
            filePath: res.tempFilePath,
            name: 'file',
            timeout: 10000,
            header: {
              "Content-Type": "multipart/form-data",
              'accept': 'application/json'
            },
            formData: {
              userId: self.data.userId,
              realUrl: tempFilePaths[index]
            },
            success: function (res) {
              var data = res.data;
              console.log(data);
            },
            fail: function (res) {
              console.log('fail');
              console.log(res);
              wx.showToast({
                title: '失败~',
                icon: 'none',
                duration: 500
              });
            },
            complete: function () {
              index++;
              wx.hideToast()

              if (index == tempFilePaths.length) {   //当图片传完时，停止调用 
                index = 0;
                console.log('执行完毕');
                wx.showToast({
                  title: '图片上传成功',
                  icon: 'none',
                  duration: 1000
                });
              } else {//若图片还没有传完，则继续调用函数
                console.log(index);
                self.uploadimg(tempFilePaths, index);
              }
            }
          });
        },
        fail: function (res) {
          console.log(res);
        }
      })
    }, 3000);
  }
})