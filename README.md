# 目录结构
```
│  app.js                              // 入口文件
│  ecosystem.config.js                // pm2默认配置文件
│  package.json                       // npm包管理所需模块及配置信息
├─db
│      dbConfig.js                    // mysql数据库基础配置
├─routes
│      index.js                       // 初始化路由信息，自定义全局异常处理
│      tasks.js                       // 任务路由模块
│      users.js                       // 用户路由模块
├─services
│      taskService.js                 // 业务逻辑处理 - 任务相关接口
│      userService.js                 // 业务逻辑处理 - 用户相关接口
└─utils
        constant.js                   // 自定义常量
        index.js                      // 封装连接mysql模块
        md5.js                        // 后端封装md5方法
        user-jwt.js                   // jwt-token验证和解析函数
```


# 技术栈
 * NodeJS v12
 * express
 * mysql v8
 * jwt
 * nodemon
 * cors
 * boom
 * pm2
 
# 功能模块
* 登录（登出）
* 注册
* 记住密码
* 修改密码
* todo增删改查
* 点亮红星标记
* 查询条件筛选

感谢这位大佬“懒人码农”，他的文章地址（https://juejin.im/post/6844904198551666701）

