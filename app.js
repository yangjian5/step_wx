App({
  onLaunch: function () {
  },
  onShow: function () {
    console.log('App Show start')
  },
  onHide: function () {
    console.log('App Hide')
  }, 
  globalData: {
    hasLogin: false,
    userInfo:{}
  }
})
