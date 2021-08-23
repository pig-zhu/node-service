/**
 * 描述: 任务路由模块
 * 作者: Mr.Rao
 * 日期: 2020-12-20
*/

const express = require('express');
const router = express.Router();
const service = require('../services/taskService');


// 获取任务接口
router.post('/queryTaskList', service.queryTaskList);

// 添加任务接口
router.post('/addTask', service.addTask);

// 编辑任务接口
router.post('/editTask', service.editTask);

// 操作任务状态接口
router.put('/updateTaskStatus', service.updateTaskStatus);

// 订阅报警
router.post('/alarms', service.alarms);

// 删除任务接口
router.post('/delProject', service.deleteTask);

// 获取团队列表
router.get('/teamList', service.teamList)

router.get('/goudan', service.goudan)

router.get('/goudanBABA', service.goudanBABA)

module.exports = router;

