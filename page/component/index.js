var cxt_arc = wx.createCanvasContext('canvasArc');//创建并返回绘图上下文context对象。
var authsign = require('/utils/authsign.js') 
var app = getApp()
Page({
  data: {
    stepNum: 0,
    openId:0,
    coinNum:0,
    userId:0,
    imageWidth:80,
    newUserGoods: [],
    darenGoods: [],
    jingpinGoods: [],
    friends: ['/image/touxiang.png', '/image/touxiang.png', '/image/touxiang.png', '/image/touxiang.png'],
    fxMuserId:0,
    jiaChen:0,
    jiaChenStep:0,
    rewardStep:0
  },
  onLoad: function (options) {

    // options.fx_muser_id = 22

    var that = this;
    var userInfo = app.globalData.userInfo;
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          imageWidth: res.windowWidth
        })
      }
    })

    if (app.globalData.fxMuserId) {
      that.setData({
        fxMuserId: app.globalData.fxMuserId
      })
      app.globalData.fxMuserId = null;
    }

    wx.showShareMenu({
      withShareTicket: true,
      success: function () { },
      fail: function () { }
    })

    // 页面渲染完成 
    cxt_arc.setLineWidth(6);
    cxt_arc.setStrokeStyle('#f5f6f5');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath();//开始一个新的路径 
    cxt_arc.arc(that.data.imageWidth / 4, 88, 78, 0, 2 * Math.PI, false);
    cxt_arc.stroke();//对当前路径进行描边

    // 登录
    wx.login({
      success: function (res) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var params5 = {};
        params5.code = res.code;
        params5.province = userInfo.province;
        params5.avatarUrl = userInfo.avatarUrl;
        params5.nickName = userInfo.nickName;
        params5.country = userInfo.country;
        params5.city = userInfo.city;
        params5.gender = userInfo.gender;
        params5.sign = authsign.auth_sign(params5);
        wx.request({
          url: 'https://www.aiwsport.com/go/onlogin.json',
          data: params5,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            var obj = res.data;
            
            var re = /([0-9]+.[0-9]{2})[0-9]*/;
            var aNew = obj.coinnum.replace(re, "$1");

            that.setData({
              coinNum: aNew,
              userId: obj.userid
            })

            if (that.data.fxMuserId != 0) {
              var paramsShare = {
                mUserId: that.data.fxMuserId,
                sUserId: obj.userid
              }
              paramsShare.sign = authsign.auth_sign(paramsShare);
              wx.request({
                url: 'https://www.aiwsport.com/step/add_share.json',
                data: paramsShare,
                method: 'GET',
                success: function (res) {
                  console.log(res);
                  
                }
              });
            } 

            var paramsFx = {
              mUserId: obj.userid
            }
            paramsFx.sign = authsign.auth_sign(paramsFx);
            wx.request({
              url: 'https://www.aiwsport.com/step/get_share_user.json',
              data: paramsFx,
              method: 'GET',
              success: function (res) {
                console.log(res);
                that.setData({
                  friends: res.data.data
                })
              }
            });

            wx.setStorageSync('userId', obj.userid)

            //2、调用小程序API: wx.getWeRunData获取微信运动数据（加密的）；
            wx.getWeRunData({
              success(resRun) {
                //3、解密步骤2的数据；
                var params6 = {
                  encryptedData: resRun.encryptedData,
                  iv: resRun.iv,
                  userId: obj.userid,
                  sessionKey: obj.session_key
                  //token: '用户token,如果你只是小程序开发，传openid即：res.data.openid', 
                  //days: 3      //传要协调的天数
                };
                params6.sign = authsign.auth_sign(params6);
                wx.request({
                  url: 'https://www.aiwsport.com/step/decrypt.json',
                  data: params6,
                  method: 'GET',
                  success: function (resDecrypt) {
                    console.log(resDecrypt);
                    var toDayStep = Number(resDecrypt.data.data.toDayStep);
                    var JiaChenStep = Number(resDecrypt.data.data.JiaChenStep);
                    var rewardStep = Number(resDecrypt.data.data.rewardStep);

                    var stepShow = toDayStep + JiaChenStep + rewardStep;

                    app.globalData.daySumStep = resDecrypt.data.data.daySumStep;
                      
                    cxt_arc.beginPath();
                    cxt_arc.arc(that.data.imageWidth / 4, 88, 72, 0, 2 * Math.PI, false);
                    var gradient1 = cxt_arc.createLinearGradient(200, 100, 100, 200);
                    gradient1.addColorStop("0", "#FFCCCC");
                    gradient1.addColorStop("1", "#FF99CC");
                    cxt_arc.setFillStyle(gradient1);
                    cxt_arc.fill()
                  

                    cxt_arc.beginPath();//开始一个新的路径
                    cxt_arc.arc(that.data.imageWidth / 4, 88, 78, -Math.PI / 2, 2 * Math.PI * (stepShow / 30000) - Math.PI / 2 , false);
                    cxt_arc.setLineWidth(6);
                    var gradient = cxt_arc.createLinearGradient(200, 150, 80, 180);
                    gradient.addColorStop("0", "#5956CC");
                    gradient.addColorStop("0.4", "#40ED94");
                    gradient.addColorStop("1.0", "#9933FF");
                    cxt_arc.setStrokeStyle(gradient);
                    cxt_arc.setLineCap('round');
                    cxt_arc.stroke();//对当前路径进行描边
                    
                    cxt_arc.setFillStyle('#635BA2');
                    cxt_arc.setFontSize(24)
                    cxt_arc.setTextAlign('center')
                    cxt_arc.fillText(stepShow, that.data.imageWidth / 4 + 2, 92)
                    


                    cxt_arc.setFillStyle('#F8F8F8')
                    cxt_arc.setFontSize(14)
                    cxt_arc.fillText('点击兑换火币', that.data.imageWidth / 4 + 2, 120)
                   


                    // cxt_arc.setFillStyle('#00CC33');
                    // cxt_arc.stroke();//对当前路径进行描边
                    cxt_arc.draw();
                    that.setData({
                      stepNum: toDayStep,
                      openId: obj.openid,
                      jiaChen: resDecrypt.data.data.JiaChen,
                      JiaChenStep: JiaChenStep,
                      rewardStep: rewardStep
                    })
                  }
                });
              }
            })
          }
        })
      }
    }); 

    var self = this;
    var params1 = {
      type: "1"
    };
    params1.sign = authsign.auth_sign(params1);
    wx.request({
      url: 'https://www.aiwsport.com/step/get_goods_by_type.json',
      data: params1,
      method: 'GET',
      success: function (res) {
        self.setData({
          newUserGoods: res.data.data
        });
      }
    });

    var params2 = {
      type: "2"
    };
    params2.sign = authsign.auth_sign(params2);
    wx.request({
      url: 'https://www.aiwsport.com/step/get_goods_by_type.json',
      data: params2,
      method: 'GET',
      success: function (res) {
        self.setData({
          darenGoods: res.data.data
        });
      }
    });

    var params3 = {
      type: "3"
    };
    params3.sign = authsign.auth_sign(params3);
    wx.request({
      url: 'https://www.aiwsport.com/step/get_goods_by_type.json',
      data: params3,
      method: 'GET',
      success: function (res) {
        self.setData({
          jingpinGoods: res.data.data
        });
      }
    });
  },

  /* 转发*/
  onShareAppMessage: function (ops) {
    var self = this 
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '步易',
      path: 'page/component/auth/auth?fx_muser_id=' + self.data.userId,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));

      },
      fail: function (res) {
        console.log("转发失败:" + JSON.stringify(res));
        if (res.errMsg == 'shareAppMessage:fail cancel') {
　　　　　  // 用户取消转发
          console.log(res);
　　　　　} else if (res.errMsg == 'shareAppMessage:fail') {
　　　　　　// 转发失败，其中 detail message 为详细失败信息
          console.log("转发失败:" + JSON.stringify(res));
　　　　　}
      }
    }
  },

  onShow: function () {
    var self = this
    var params4 = {
      userId: self.data.userId
    };
    params4.sign = authsign.auth_sign(params4);
    wx.request({
      url: 'https://www.aiwsport.com/step/get_user.json',
      data: params4,
      method: 'GET',
      success: function (res) {
        var user = res.data.data
        var re = /([0-9]+.[0-9]{2})[0-9]*/;
        var aNew = (user.coinnum+"").replace(re, "$1");
        self.setData({
          coinNum: aNew
        })
      }
    });
  },

  changeCoin: function(){
    var that = this
    var cacheStepNum = Number(this.data.stepNum);
    var cacheJiaChenStep = Number(this.data.JiaChenStep);
    var cacheRewardStep = Number(this.data.rewardStep);

    var sumDHStep = cacheStepNum + cacheJiaChenStep + cacheRewardStep;

    if (sumDHStep == 0) {
      return;
    }
    var params7 = {
      step: cacheStepNum,
      jiaChenStep: cacheJiaChenStep,
      rewardStep: cacheRewardStep,
      openId: this.data.openId,
      userId: this.data.userId
    };
    params7.sign = authsign.auth_sign(params7);
    wx.request({
      url: 'https://www.aiwsport.com/step/change_coin.json',         //记得更改
      data: params7,
      method: 'GET',
      success: function (res) {
        console.info(res);
        if (res.statusCode == 200) {
          cxt_arc.beginPath();//开始一个新的路径
          cxt_arc.setLineWidth(6);
          cxt_arc.setStrokeStyle('#f5f6f5');
          cxt_arc.setLineCap('round')
          cxt_arc.arc(that.data.imageWidth / 4, 88, 78, 0, 2 * Math.PI, false);//设置一个原点(106,106)，半径为100的圆的路径到当前路径 
          cxt_arc.stroke();//对当前路径进行描边 
          
          cxt_arc.beginPath();
          cxt_arc.arc(that.data.imageWidth / 4, 88, 72, 0, 2 * Math.PI, false);
          var gradient1 = cxt_arc.createLinearGradient(200, 100, 100, 200);
          gradient1.addColorStop("0", "#FFF0F5");
          gradient1.addColorStop("1", "#FFFAF0");
          cxt_arc.setFillStyle(gradient1);
          cxt_arc.fill()

          cxt_arc.beginPath();
          cxt_arc.setLineWidth(6);
          cxt_arc.setStrokeStyle('#3ea6ff');
          cxt_arc.setLineCap('round')
          cxt_arc.beginPath();//开始一个新的路径 
          cxt_arc.arc(that.data.imageWidth / 4, 88, 78, - Math.PI / 2, 2 * Math.PI * (100 / 30000) - Math.PI / 2, false);
          cxt_arc.stroke();//对当前路径进行描边 

          cxt_arc.setFillStyle('#635BA2')
          cxt_arc.setFontSize(24)
          cxt_arc.setTextAlign('center')
          cxt_arc.fillText(0, that.data.imageWidth / 4 + 2, 92)
          cxt_arc.setFillStyle('#d2d2d2')
          cxt_arc.setFontSize(14)
          cxt_arc.fillText('点击兑换火币', that.data.imageWidth / 4 + 2, 120)         
          cxt_arc.draw();

          var re = /([0-9]+.[0-9]{2})[0-9]*/;
          var aNew = (res.data.coinnum + "").replace(re, "$1");

          that.setData({
            stepNum: 0,
            JiaChenStep:0,
            rewardStep:0,
            coinNum: aNew
          });

          var num = sumDHStep * 0.0005;
          var result = ("" + num).substring(0, ("" + num).indexOf(".") + 5);
          wx.showModal({
            title: '提示',
            content: '您使用' + sumDHStep +'步数 兑换到了' +result+'能量',
            showCancel: false
          });
        }
      } 
    });
  }
})
