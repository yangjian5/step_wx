
var app = getApp()
var authsign = require('../utils/authsign.js') 
var that
var animation = wx.createAnimation({
  duration: 300,
  timingFunction: 'linear',
  delay: 0,
})

Page({
  /**
   * 页面的初始数据
   */
  data: {
    sollText:{},
    showUserId:0,
    activeStepId:0,
    inputContent:'',
    name_focus:false,
    hiddenmodalput: true,  
    up_text_hidden: true,
    DataSource: [1],
    icon: '',
    nickname:'',
    content: '',
    resource: [],
    zanSource: ['张三', '李四', '王五'],
    comments: [],
    createTime:'',
    photoWidth: wx.getSystemInfoSync().windowWidth / 3.6,

    popTop: 0, //弹出点赞评论框的位置
    popWidth: 0, //弹出框宽度
    isShow: true, //判断是否显示弹出框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    that = this

    var showUserId = option.showUserId
    that.setData({
      showUserId: showUserId
    });

    var params = {
      userId: showUserId
    };
    params.sign = authsign.auth_sign(params);
    wx.request({
      url: 'https://www.aiwsport.com/step/get_step_for_4.json',
      data: params,
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) {
          if (res.data.data) {
            that.setData({
              content: res.data.data.showdesc,
              activeStepId: res.data.data.id,
              createTime: res.data.data.createtime,
              icon: option.avatarurl,
              nickname: option.nickname
            })
          }
          if (res.data.data.showurl) {
            that.setData({
              resource: res.data.data.showurl.split(",")
            })
          }
          that.getComments(res.data.data.id);
        }
      }
    });
  },
  getComments: function (activeStepId) {
    var params1 = {
      activeStepId: activeStepId
    };
    params1.sign = authsign.auth_sign(params1);
    console.log(params1)
    wx.request({
      url: 'https://www.aiwsport.com/step/get_comments.json',
      data: params1,
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          if (res.data.data) {
            that.setData({
              comments: res.data.data
            })
          }
        }
      }
    });
  },
  // 点击图片进行大图查看
  LookPhoto: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.photurl,
      urls: this.data.resource,
    })
  },

  // 删除朋友圈
  // delete: function () {
  //   wx.showToast({
  //     title: '删除成功',
  //   })
  // },

  // 点击了点赞评论
  TouchDiscuss: function (e) {
    // this.data.isShow = !this.data.isShow
 
    that.setData({
      sollText: e
    })

    if (that.data.isShow == false) {
      that.setData({
        popTop: e.target.offsetTop + 8 - (e.detail.y - e.target.offsetTop) / 2,
        popWidth: 0,
        isShow: true
      })

      // 0.3秒后滑动
      setTimeout(function () {
        animation.width(0).opacity(1).step()
        that.setData({
          animation: animation.export(),
          up_text_hidden:true
        })
      }, 100)
    } else {
      // 0.3秒后滑动
      setTimeout(function () {
        animation.width(80).opacity(1).step()
        that.setData({
          animation: animation.export(),
          up_text_hidden: false
        })
      }, 100)

      that.setData({
        popTop: e.target.offsetTop + 8 - (e.detail.y - e.target.offsetTop) / 2,
        popWidth: 0,
        isShow: false
      })
    }
  },
  modalinput: function () {
    that.setData({
      hiddenmodalput: !that.data.hiddenmodalput,
      name_focus:true
    })

    var e = that.data.sollText
    that.setData({
      popTop: e.target.offsetTop + 8 - (e.detail.y - e.target.offsetTop) / 2,
      popWidth: 0,
      isShow: true
    })

    // 0.3秒后滑动
    setTimeout(function () {
      animation.width(0).opacity(1).step()
      that.setData({
        animation: animation.export(),
        up_text_hidden: true
      })
    }, 100)
  },
  bindKeyInput: function (e) {
    that.setData({
      inputContent: e.detail.value
    })
  },
  createConent: function () {
    if (that.data.inputContent) {
      wx.getStorage({
        key: 'userId',
        success: function (res) {
          var params1 = {
            userId: res.data,
            activeStepId: that.data.activeStepId,
            content: that.data.inputContent
          };
          params1.sign = authsign.auth_sign(params1);
          console.log(params1)
          wx.request({
            url: 'https://www.aiwsport.com/step/create_comment.json',
            data: params1,
            method: 'GET',
            success: function (res) {
              if (res.data.code == 200) {
                that.setData({
                  inputContent: '',
                  hiddenmodalput: !that.data.hiddenmodalput
                })
                that.getComments(that.data.activeStepId);
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                  duration: 1500,
                  mask: true
                });
              }
            }
          });
        }
      }); 
    }
  }
})