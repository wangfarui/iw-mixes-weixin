/**
 * 请求工具封装
 *
 * 固定前缀：
 *   开发环境: 'http://localhost:18000'
 *   生产环境: 'https://api.itwray.com'
 *
 * 后端接口返回数据格式固定为：
 *   { code: number, message: string, data: any }
 *
 * 若 code 不等于 200，则弹出 res.message，并 reject Promise。
 * 当 code 为 401 时，清除存储中的 iwtoken 并跳转到登录页面。
 *
 * 提供两组接口方法：
 *  1. 带授权的 get、post、put、delete 方法（会在 header 中携带 iwtoken）
 *  2. 不带授权的 getNoAuth、postNoAuth 方法（用于登录、获取验证码等场景）
 */

// 固定前缀，根据当前环境调整
const BASE_URL = 'http://localhost:18000'; // 开发环境前缀
// const BASE_URL = 'https://api.itwray.com'; // 生产环境前缀

/**
 * 内部请求方法，自动拼接 BASE_URL 并根据 withToken 参数决定是否添加授权头
 */
function baseRequest(options, withToken) {
  // 拼接固定前缀，注意确保 options.url 以 '/' 开头
  options.url = BASE_URL + options.url;

  // 如果需要授权，则先从 storage 中获取 iwtoken
  if (withToken) {
    const token = wx.getStorageSync('iwtoken');
    if (!token) {
      wx.showToast({
        title: '登录状态已失效',
        icon: 'none'
      });
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/login/login'
        });
      }, 1500);
      return;
    }
    options.header = Object.assign({}, options.header, { iwtoken: token });
  }
  wx.request(options);
}

/**
 * 请求工具统一封装为 Promise
 */
function requestPromise(options, withToken) {
  return new Promise((resolve, reject) => {
    baseRequest(
      Object.assign({}, options, {
        success: res => {
          // 假设后端返回数据格式为 { code, message, data }
          if (!res.data || res.data.code !== 200) {
            // 如果返回 code 为 401，说明登录状态失效
            if (res.data && res.data.code === 401) {
              wx.removeStorageSync('iwtoken');
              wx.showToast({
                title: res.data.message || '登录状态已失效',
                icon: 'none'
              });
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/login/login'
                });
              }, 1500);
            } else {
              wx.showToast({
                title: (res.data && res.data.message) || '请求错误',
                icon: 'none'
              });
            }
            return reject(res.data);
          }
          resolve(res.data);
        },
        fail: err => {
          wx.showToast({
            title: '请求异常',
            icon: 'none'
          });
          reject(err);
        }
      }),
      withToken
    );
  });
}

// 带授权的请求方法
function get(url, data = {}) {
  return requestPromise(
    {
      url: url,
      method: 'GET',
      data: data
    },
    true
  );
}

function post(url, body = {}) {
  return requestPromise(
    {
      url: url,
      method: 'POST',
      data: body
    },
    true
  );
}

function put(url, body = {}) {
  return requestPromise(
    {
      url: url,
      method: 'PUT',
      data: body
    },
    true
  );
}

function del(url, data = {}) {
  return requestPromise(
    {
      url: url,
      method: 'DELETE',
      data: data
    },
    true
  );
}

// 不带授权的请求方法
function getNoAuth(url, data = {}) {
  return requestPromise(
    {
      url: url,
      method: 'GET',
      data: data
    },
    false
  );
}

function postNoAuth(url, body = {}) {
  return requestPromise(
    {
      url: url,
      method: 'POST',
      data: body
    },
    false
  );
}

module.exports = {
  get,
  post,
  put,
  delete: del, // 导出 delete 方法
  getNoAuth,
  postNoAuth
};
