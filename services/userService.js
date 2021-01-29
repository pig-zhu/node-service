/**
 * 描述: 业务逻辑处理 - 用户相关接口
 * 作者: Mr.Rao
 * 日期: 2020-12-20
*/


const { querySql, queryOne } = require('../utils/index');
const md5 = require('../utils/md5');
const jwt = require('jsonwebtoken');
const boom = require('boom');
const { body, validationResult } = require('express-validator');
const { 
  CODE_ERROR,
  CODE_SUCCESS, 
  PRIVATE_KEY, 
  JWT_EXPIRED 
} = require('../utils/constant');
const { decode } = require('../utils/user-jwt');


// 登录
function login(req, res, next) {
  const err = validationResult(req);
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors;
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
    next(boom.badRequest(msg));
  } else {
    let { username, password } = req.body;
    // md5加密
    // password = md5(password); 
    console.log(password,'login')
    const query = `select * from sys_user where username='${username}' or mobile='${username}' and password='${password}'`;
    querySql(query)
    .then(user => {
      if (!user || user.length === 0) {
        res.json({ 
        	code: CODE_ERROR, 
        	msg: '用户名或密码错误', 
        	data: null 
        })
      } else {
        // 登录成功，签发一个token并返回给前端
        const token = jwt.sign(
          // payload：签发的 token 里面要包含的一些数据。
          { username },
          // 私钥
          PRIVATE_KEY,
          // 设置过期时间
          { expiresIn: JWT_EXPIRED }
        )

        let userData = {
          id: user[0].id,
          username: user[0].username,
          nickname: user[0].nickname,
          mobile: user[0].mobile,
          email: user[0].email,
          avator: user[0].avator,
          sex: user[0].sex,
          bio:user[0].bio,
          gmt_create: user[0].gmt_create,
          gmt_modify: user[0].gmt_modify
        };

        res.json({ 
        	code: CODE_SUCCESS, 
        	msg: '登录成功', 
        	data: { 
            token,
            userData
          } 
        })
      }
    })
  }
}


// 注册
function register(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { username, password, email, mobile } = req.body;
    findUser(username)
  	.then(data => {
  		// console.log('用户注册===', data);
  		if (data) {
  			res.json({ 
	      	code: CODE_ERROR, 
	      	msg: '用户已存在', 
	      	data: null 
	      })
  		} else {
        password = md5(password);
  			const query = `insert into sys_user(username, password, email, mobile) values('${username}', '${password}', '${email}', '${mobile}')`;
  			querySql(query)
		    .then(result => {
		      if (!result || result.length === 0) {
		        res.json({ 
		        	code: CODE_ERROR, 
		        	msg: '注册失败', 
		        	data: null 
		        })
		      } else {
            const queryUser = `select * from sys_user where username='${username}' and password='${password}'`;
            querySql(queryUser)
            .then(user => {
              res.json({ 
                code: CODE_SUCCESS, 
                msg: '注册成功'
              })
            })
		      }
		    })
  		}
  	})
   
  }
}

// 重置密码
function updatePassword(req, res, next) {
	const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { id, oldPassword, newPassword } = req.body;
    validateUser(id, oldPassword)
    .then(data => {
      if (data) {
        if (newPassword) {
          newPassword = md5(newPassword);
				  const query = `update sys_user set password='${newPassword}' where id='${id}'`;
				  querySql(query)
          .then(user => {
            if (!user || user.length === 0) {
              res.json({ 
                code: CODE_ERROR, 
                msg: '重置密码失败', 
                data: null 
              })
            } else {
              res.json({ 
                code: CODE_SUCCESS, 
                msg: '重置密码成功', 
                data: null
              })
            }
          })
        } else {
          res.json({ 
            code: CODE_ERROR, 
            msg: '新密码不能为空', 
            data: null 
          })
        }
      } else {
        res.json({ 
          code: CODE_ERROR, 
          msg: '旧密码错误', 
          data: null 
        })
      }
    })
   
  }
}

// 校验用户名和密码
function validateUser(id, oldPassword) {
	const query = `select username from sys_user where id='${id}' and password='${oldPassword}'`;
  	return queryOne(query);
}

// 通过用户名查询用户信息
function findUser(username) {
  const query = `select id, username from sys_user where username='${username}'`;
  return queryOne(query);
}

// 修改用户信息
function updateUserInfo(req, res, next) {
  const err = validationResult(req);
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors;
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
    next(boom.badRequest(msg));
  } else {
    let { id, email, bio,nickname } = req.body;
    const query = `update sys_user set nickname='${nickname}', email='${email}', bio='${bio}' where id = ${id}`;
    querySql(query).then(data=>{
      if (!data || data.length === 0) {
        res.json({ 
          code: CODE_ERROR, 
          msg: '编辑失败！', 
          data: null 
        })
      }else{
        res.json({ 
          code: CODE_SUCCESS, 
          msg: '编辑成功！', 
          data: null
        })
      }
    })
  }
}

// 查询全部用户
function allUserList (req, res, next) { 
  const err = validationResult(req);
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors;
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
    next(boom.badRequest(msg));
  } else {
    let { username } = req.body;
    findUser(username).then(data => {
      if(data){
        const queryAll = "select id,nickname from sys_user";
        querySql(queryAll).then(data => {
          if (!data || data.length === 0) {
            res.json({ 
              code: CODE_ERROR, 
              msg: '查询失败！', 
              data: null 
            })
          }else{
            res.json({ 
              code: CODE_SUCCESS, 
              msg: '查询成功！', 
              data: data
            })
          }
        })
      }else{
        res.json({ 
          code: CODE_ERROR, 
          msg: '查询失败！', 
          data: null
        })
      }
    })
  }
}
module.exports = {
  login,
  register,
  updatePassword,
  updateUserInfo,
  allUserList
}
