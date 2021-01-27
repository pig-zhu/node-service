/**
 * 描述: 用户路由模块
 * 作者: Mr.Rao
 * 日期: 2020-12-20
*/

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const service = require('../services/userService');


// 登录/注册校验
const vaildator = [
  body('username').isString().withMessage('用户名类型错误'),
  body('password').isString().withMessage('密码类型错误')
]

// 重置密码校验
const resetPwdVaildator = [
  body('username').isString().withMessage('用户名类型错误'),
  body('oldPassword').isString().withMessage('密码类型错误'),
  body('newPassword').isString().withMessage('密码类型错误')
]

// 用户登录路由
router.post('/login', service.login);

// 用户注册路由
router.post('/register', service.register);

// 密码重置路由
router.post('/updatePassword', service.updatePassword);

// 修改用户信息
router.post('/updateUserInfo', service.updateUserInfo);


module.exports = router;

