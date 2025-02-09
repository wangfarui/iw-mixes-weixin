Page({
  data: {
    // 页面初始数据
  },
  onLoad: function(options) {
    // 页面加载时执行
  },
  onSubmit() {
    wx.removeStorageSync('iwtoken')
    wx.reLaunch({
      url: '/pages/login/login'
    });
  }
})
