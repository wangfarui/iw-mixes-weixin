// app.js
App({
  onLaunch: function () {
    // 小程序启动时的逻辑
  }
})

// 全局覆盖 Page 方法，为所有页面统一添加登录状态检查
const originalPage = Page;
Page = function(pageObject) {
  // 保存原有 onShow 方法（如果有）
  const originalOnShow = pageObject.onShow;
  pageObject.onShow = function() {
    // 如果当前页面不是登录页面，则进行登录检查
    if (this.route !== 'pages/login/login') {
      const token = wx.getStorageSync('iwtoken');
      if (!token) {
        // 没有登录 token，则跳转到登录页面
        wx.redirectTo({
          url: '/pages/login/login'
        });
        return; // 结束当前页面后续逻辑
      }
    }
    // 调用页面原有的 onShow 方法（如果有）
    if (originalOnShow) {
      originalOnShow.apply(this, arguments);
    }
  }
  // 调用原始 Page 方法创建页面
  originalPage(pageObject);
}
