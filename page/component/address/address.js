// page/component/new-pages/user/address/address.js
var authsign = require('../utils/authsign.js') 
var model = require('../model/model.js')
var show = false;
var item = {};
Page({
  data:{
    address:{
      id:'',
      username:'',
      telnum:'',
      addressinfo:'',
      cityinfo:'',
      item: {
        show: show
      },
    },
    cityinfo:'',
    userId:0
  },
  onLoad(options){
    var self = this;
    self.setData({
      userId :options.userId
    })

    var params = {
      userId: this.data.userId
    };
    params.sign = authsign.auth_sign(params);
    wx.request({
      url: 'https://www.aiwsport.com/step/get_address.json',
      data: params,
      method: 'GET',
      success: function (res) {
        
        if (res.data.code == 200) {
          self.setData({
            address: res.data.data,
            cityinfo: res.data.data.cityinfo
          })
        }
      }
    });
  },
  formSubmit(e){
    const value = e.detail.value;
    if (value.name && value.phone && value.detail && value.cityInfo){
      var params = {
        addressId: this.data.address.id,
        userId: this.data.userId,
        addressInfo: value.detail,
        telNum: value.phone,
        userName: value.name,
        cityInfo: value.cityInfo
      };
      console.log(params);
      params.sign = authsign.auth_sign(params);
      wx.request({
        url: 'https://www.aiwsport.com/step/save_address.json',  
        data: params,
        method: 'GET',
        success: function (res) {
          wx.showModal({
            title: '提示',
            content: res.data.data,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack();
              }
            }
          })
        }
      });
    }else{
      wx.showModal({
        title:'提示',
        content:'请填写完整资料',
        showCancel:false
      })
    }
  },
  //生命周期函数--监听页面初次渲染完成
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
  },
  //点击选择城市按钮显示picker-view
  translate: function (e) {
    model.animationEvents(this, 0, true, 400);
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    model.animationEvents(this, 200, false, 400);
  },
  //滑动事件
  bindChange: function (e) {
    model.updateAreaData(this, 1, e);
    item = this.data.item;
    this.setData({
      cityinfo: item.provinces[item.value[0]].name + ' ' + item.citys[item.value[1]].name + ' ' + item.countys[item.value[2]].name
    });
  },
  onReachBottom: function () {
  },
  nono: function () { }
})