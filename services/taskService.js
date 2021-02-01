/**
 * 描述: 业务逻辑处理 - 任务相关接口
 * 作者: Mr.Rao
 * 日期: 2020-12-20
*/

const { querySql, queryOne } = require('../utils/index');
const jwt = require('jsonwebtoken');
const boom = require('boom');
const { validationResult } = require('express-validator');
const { 
  CODE_ERROR,
  CODE_SUCCESS, 
  PRIVATE_KEY, 
  JWT_EXPIRED 
} = require('../utils/constant');
const { decode } = require('../utils/user-jwt');


// 查询任务列表
function queryTaskList(req, res, next) {
  const err = validationResult(req);
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors;
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
    next(boom.badRequest(msg));
  } else {
    let { id,name } = req.body;
    // 默认值
    // pageSize = pageSize ? pageSize : 1;
    // pageNo = pageNo ? pageNo : 1;
    // status = (status || status == 0) ? status : null;
    let query = null
    if(id){
      if(name){
        query = `select * from projects where leader = ${id} and name like '%${name}%'`;
      }else{
        query = `select * from projects where leader = ${id}`;
      }
    }else{
      query = 'select * from projects';
    }
    querySql(query)
    .then(data => {
      if (!data || data.length === 0) {
        res.json({ 
        	code: CODE_ERROR, 
        	msg: '暂无数据', 
        	data: {
            data: [],
            total: 0
          } 
        })
      } else {

        // 计算数据总条数
        let total = data.length; 
        // 分页条件 (跳过多少条)
        // let n = (pageNo - 1) * pageSize;
        res.json({ 
          code: CODE_SUCCESS, 
          msg: '查询数据成功', 
          data: {
            data: data,
            total: total,
            // pageNo: parseInt(pageNo),
            // pageSize: parseInt(pageSize),
          } 
        })
        // 拼接分页的sql语句命令
        // if (status) {
        //   let query_1 = `select d.id, d.title, d.content, d.status, d.is_major, d.gmt_create, d.gmt_expire from sys_task d where status='${status}' order by d.gmt_create desc`;
        //   querySql(query_1)
        //   .then(result_1 => {
        //     console.log('分页1===', result_1);
        //     if (!result_1 || result_1.length === 0) {
        //       res.json({ 
        //         code: CODE_SUCCESS, 
        //         msg: '暂无数据', 
        //         data: null 
        //       })
        //     } else {
        //       let query_2 = query_1 + ` limit ${n} , ${pageSize}`;
        //       querySql(query_2)
        //       .then(result_2 => {
        //         console.log('分页2===', result_2);
        //         if (!result_2 || result_2.length === 0) {
        //           res.json({ 
        //             code: CODE_SUCCESS, 
        //             msg: '暂无数据', 
        //             data: null 
        //           })
        //         } else {
        //           res.json({ 
        //             code: CODE_SUCCESS, 
        //             msg: '查询数据成功', 
        //             data: {
        //               rows: result_2,
        //               total: result_1.length,
        //               pageNo: parseInt(pageNo),
        //               pageSize: parseInt(pageSize),
        //             } 
        //           })
        //         }
        //       })
        //     }
        //   })
        // } else {
        //   let query_3 = query + ` order by d.gmt_create desc limit ${n} , ${pageSize}`;
        //   querySql(query_3)
        //   .then(result_3 => {
        //     console.log('分页2===', result_3);
        //     if (!result_3 || result_3.length === 0) {
        //       res.json({ 
        //         code: CODE_SUCCESS, 
        //         msg: '暂无数据', 
        //         data: null 
        //       })
        //     } else {
        //       res.json({ 
        //         code: CODE_SUCCESS, 
        //         msg: '查询数据成功', 
        //         data: {
        //           rows: result_3,
        //           total: total,
        //           pageNo: parseInt(pageNo),
        //           pageSize: parseInt(pageSize),
        //         } 
        //       })
        //     }
        //   })
        // }
      }
    })
  }
}

// 添加新项目
function addTask(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { name, startTime, endTime,target,description,partner_id, partner_name, isPublic, leader_id } = req.body;
    findTask(name, 1)
    .then(task => {
      if (task) {
        res.json({ 
          code: CODE_ERROR, 
          msg: '项目名称不能重复', 
          data: null 
        })
      } else {
        const query = `insert into projects(name, start_time, end_time,target,description,partner_id,partner_name ,isPublic, leader) values('${name}', 
        '${startTime}', '${endTime}', '${target}', '${description}', '${partner_id}', '${partner_name}', '${isPublic}', '${leader_id}')`;
        querySql(query)
        .then(data => {
          if (!data || data.length === 0) {
            res.json({ 
              code: CODE_ERROR, 
              msg: '添加项目失败', 
              data: null 
            })
          } else {
            res.json({ 
              code: CODE_SUCCESS, 
              msg: '添加项目成功', 
              data: null 
            })
          }
        })
      }
    })

  }
}

// 编辑任务
function editTask(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { id, partner_name, status, partner_id } = req.body;
    findTask(id, 2)
    .then(task => {
      if (task) {
        let query = null
        if(partner_id){
          partner_id = partner_id + ',' + task.partner_id
          partner_name = partner_name + ',' + task.partner_name
          query = `update projects set partner_id='${partner_id}', status='${status}', partner_name='${partner_name}' where id='${id}'`;
        }else{
          query = `update projects set status='${status}' where id='${id}'`;
        }
          querySql(query)
          .then(data => {
            if (!data || data.length === 0) {
              res.json({ 
                code: CODE_ERROR, 
                msg: '更新数据失败', 
                data: null 
              })
            } else {
              res.json({ 
                code: CODE_SUCCESS, 
                msg: '更新数据成功', 
                data: null 
              })
            }
          })
      } else {
        res.json({ 
          code: CODE_ERROR, 
          msg: '参数错误或数据不存在', 
          data: null 
        })
      }
    })

  }
}

// 操作任务状态
function updateTaskStatus(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { id, status } = req.body;
    findTask(id, 2)
    .then(task => {
      if (task) {
        const query = `update sys_task set status='${status}' where id='${id}'`;
        querySql(query)
        .then(data => {
          // console.log('操作任务状态===', data);
          if (!data || data.length === 0) {
            res.json({ 
              code: CODE_ERROR, 
              msg: '操作数据失败', 
              data: null 
            })
          } else {
            res.json({ 
              code: CODE_SUCCESS, 
              msg: '操作数据成功', 
              data: null 
            })
          }
        })
      } else {
        res.json({ 
          code: CODE_ERROR, 
          msg: '参数错误或数据不存在', 
          data: null 
        })
      }
    })

  }
}

// 订阅报警
function alarms(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { id, content, type,userId,createTime } = req.body;
    findTask(id, 2)
    .then(task => {
      if (task) {
        const query = `insert into sys_message(type, content, create_user, create_time) values('${type}', '${content}', '${userId}', '${createTime}')`;
        querySql(query)
        .then(data => {
          if (!data || data.length === 0) {
            res.json({ 
              code: CODE_ERROR, 
              msg: '操作失败', 
              data: null 
            })
          } else {
            res.json({ 
              code: CODE_SUCCESS, 
              msg: '操作成功', 
              data: null 
            })
          }
        })
      } else {
        res.json({ 
          code: CODE_ERROR, 
          msg: '参数错误或数据不存在', 
          data: null 
        })
      }
    })

  }
}

// 删除任务
function deleteTask(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { id } = req.body;
    let ids = id.split(',')
        const query = `delete from projects where id in (${ids})`;
        querySql(query)
        .then(data => {
          // console.log('删除任务===', data);
          if (!data || data.length === 0) {
            res.json({ 
              code: CODE_ERROR, 
              msg: '删除数据失败', 
              data: null 
            })
          } else {
            res.json({ 
              code: CODE_SUCCESS, 
              msg: '删除数据成功', 
              data: null 
            })
          }
        })
  }
}

// 通过任务名称或ID查询数据是否存在
function findTask(param, type) {
  let query = null;
  if (type == 1) { // 1:添加类型 2:编辑或删除类型
    query = `select id, name from projects where name='${param}'`;
  } else {
    query = `select id, name, partner_name, partner_id from projects where id='${param}'`;
  }
  return queryOne(query);
}
// 获取团队列表
function teamList (req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  }else{
    const query = 'select * from teams'
    querySql(query).then(data => {
      if(data && data.length>0){
        res.json({ 
          code: CODE_SUCCESS, 
          msg: '获取列表成功！', 
          data: data 
        })
      }else{
        res.json({ 
          code: CODE_ERROR, 
          msg: '获取列表失败！', 
          data: null 
        })
      }
    })
  }
}

module.exports = {
  queryTaskList,
  addTask,
  editTask,
  updateTaskStatus,
  alarms,
  deleteTask,
  teamList
}
