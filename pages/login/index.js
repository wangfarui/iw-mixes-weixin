// pages/login/login.js
const request = require('../../utils/request.js');
const dictUtil = require('../../utils/dictUtil.js');

Page({
  data: {
    // 登录模式：可取值 'password'（密码登录）、'verify'（验证码登录）、'register'（注册账号）
    loginMode: 'password',
    account: '',
    password: '',
    verifyCode: '',
    countdown: 0
  },

  // 获取验证码逻辑
  getVerifyCode() {
    if (this.data.countdown > 0) return;
    // 判断手机号是否填写
    if (!this.data.account) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }
    // 校验手机号是否为11位纯数字
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(this.data.account)) {
      wx.showToast({
        title: '请输入正确的11位手机号',
        icon: 'none'
      });
      return;
    }

    const url = '/auth-service/register/getVerificationCode?phoneNumber=' + this.data.account;
    // 使用不带授权的请求
    request.getNoAuth(url)
      .then(data => {
        // 请求成功，提示验证码已发送
        wx.showToast({
          title: '验证码已发送',
          icon: 'success'
        });
        this.startCountdown();
      });
  },

  // 倒计时逻辑
  startCountdown() {
    this.setData({
      countdown: 60
    });
    let interval = setInterval(() => {
      if (this.data.countdown <= 1) {
        clearInterval(interval);
        this.setData({
          countdown: 0
        });
      } else {
        this.setData({
          countdown: this.data.countdown - 1
        });
      }
    }, 1000);
  },

  // 底部左侧按钮点击处理
  switchToLeft() {
    // 当当前模式为【密码登录】时，左按钮为“验证码登录”，点击后切换到验证码登录模式
    // 否则（当前为验证码登录或注册账号模式），点击后切换到密码登录模式
    if (this.data.loginMode === 'password') {
      this.setData({
        loginMode: 'verify'
      });
    } else {
      this.setData({
        loginMode: 'password'
      });
    }
    // 切换按钮后清空已输入的数据
    this.setData({
      account: '',
      password: '',
      verifyCode: ''
    })
  },

  // 底部右侧按钮点击处理
  switchToRight() {
    // 当当前模式为【注册账号】时，右按钮为“验证码登录”，点击后切换到验证码登录模式
    // 否则（当前为密码登录或验证码登录），点击后切换到注册账号模式
    if (this.data.loginMode === 'register') {
      this.setData({
        loginMode: 'verify'
      });
    } else {
      this.setData({
        loginMode: 'register'
      });
    }
    // 切换按钮后清空已输入的数据
    this.setData({
      account: '',
      password: '',
      verifyCode: ''
    })
  },

  // 提交（登录或注册）处理
  onSubmit() {
    if (!this.data.account) {
      wx.showToast({
        title: '请输入账号',
        icon: 'none'
      });
      return;
    }

    // 根据不同模式校验必填项 并 获取请求地址
    let loginUrl;
    if (this.data.loginMode === 'password') {
      if (!this.data.password) {
        wx.showToast({
          title: '请输入密码',
          icon: 'none'
        });
        return;
      }
      loginUrl = '/auth-service/login/password';
    } else if (this.data.loginMode === 'verify') {
      if (!this.data.verifyCode) {
        wx.showToast({
          title: '请输入验证码',
          icon: 'none'
        });
        return;
      }
      loginUrl = '/auth-service/login/verificationCode';
    } else if (this.data.loginMode === 'register') {
      if (!this.data.verifyCode) {
        wx.showToast({
          title: '请输入验证码',
          icon: 'none'
        });
        return;
      }
      if (!this.data.password) {
        wx.showToast({
          title: '请输入密码',
          icon: 'none'
        });
        return;
      }
      loginUrl = '/auth-service/register/form';
    }

    const loginForm = {
      account: this.data.account,
      password: this.data.password,
      phoneNumber: this.data.account,
      verificationCode: this.data.verifyCode
    }
    request.postNoAuth(loginUrl, loginForm)
      .then(res => {
        wx.showToast({
          title: this.data.loginMode === 'register' ? '注册/登录成功' : '登录成功',
          icon: 'success'
        });
        this.loginSuccessAfter(res);
      })
  },

  loginSuccessAfter(res) {
    const userInfo = res.data
    wx.setStorageSync('iwtoken', userInfo.tokenValue)
    wx.setStorageSync('userInfo', userInfo)

    // 加载字典数据接口
    request.get('/auth-service/dict/getDictTypeList')
      .then(res => {
        dictUtil.setDictTypes(res.data)
      })

    request.get('/auth-service/dict/getAllDictList')
      .then(res => {
        dictUtil.setDictValuesMap(res.data);
        // 跳转到首页
        wx.switchTab({
          url: '/pages/menu/index'
        });
      });
  }
});