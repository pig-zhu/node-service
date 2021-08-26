/**
 * 描述: 入口文件
 * 作者: Mr.Rao
 * 日期: 2020-12-12
*/

const bodyParser = require('body-parser'); // 引入body-parser模块
const express = require('express'); // 引入express模块
const cors = require('cors'); // 引入cors模块
const routes = require('./routes'); //导入自定义路由文件，创建模块化路由
const app = express();
const ws = require("nodejs-websocket");
console.log("开始建立连接...")
global.connections = []
global.current_server = null
var server = ws.createServer(function(conn){
    conn.on("text", function (str) {
        let idIndex = str.indexOf('id:')
        let id = str.slice(idIndex + 3)
        if(str.includes('首次连接')){
            global.connections.push({
                id: id,
                server: conn
            })
        } else if (str.includes('close')) {
            let item = global.connections.find(ele => ele.id === code)
            if (item) {
                let index = global.connections.indexOf(item)
                global.connections.splice(index, 1)
            }
        } else {
            let item = global.connections.filter(ele => ele.id !== id)
            if (item.length) {
                let msg = str.slice(0, idIndex-1)
                item.forEach(ele => {
                    ele.server.send(msg)
                })
            }
        }
	})
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
}).listen(8001)

app.use(bodyParser.json()); // 解析json数据格式
app.use(bodyParser.urlencoded({extended: true})); // 解析form表单提交的数据application/x-www-form-urlencoded

app.use(cors()); // 注入cors模块解决跨域


app.use('/', routes);


app.listen(8081, () => { // 监听8088端口
	console.log('服务已启动 http://localhost:8081');
})