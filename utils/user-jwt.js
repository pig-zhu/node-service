/**
 * 描述: jwt-token验证和解析函数
 * 作者: Mr.Rao
 * 日期: 2020-12-20
*/

const jwt = require('jsonwebtoken'); // 引入验证jsonwebtoken模块
const expressJwt = require('express-jwt'); // 引入express-jwt模块
const { PRIVATE_KEY } = require('./constant'); // 引入自定义的jwt密钥

// 验证token是否过期
const jwtAuth = expressJwt({
  // 设置密钥
  secret: PRIVATE_KEY,
  // 设置为true表示校验，false表示不校验
  credentialsRequired: true,
  // 自定义获取token的函数
  getToken: (req) => {
    if (req.headers['access-token']) {
      return req.headers['access-token']
    } else if (req.query && req.query.token) {
      return req.query.token
    }
  }
  // 设置jwt认证白名单，比如/api/login登录接口不需要拦截
}).unless({
  path: [
    '/',
    '/api/login',
    '/api/register',
    '/api/updatePassword',
    '/api/goudan',
    '/api/goudanBABA',
  ]
})

// jwt-token解析
function decode(req) {
  const token = req.get('access-token')
  return jwt.verify(token, PRIVATE_KEY);
}

module.exports = {
  jwtAuth,
  decode
}
