/**
 * 描述: 自定义常量
 * 作者: Mr.Rao
 * 日期: 2020-12-20
*/


module.exports = {
  CODE_ERROR: -1, // 请求响应失败code码
  CODE_SUCCESS: 200, // 请求响应成功code码
  CODE_TOKEN_EXPIRED: 401, // 授权失败
  PRIVATE_KEY: 'rao', // 自定义jwt加密的私钥
  JWT_EXPIRED: 60 * 60 * 24, // 过期时间24小时
} 