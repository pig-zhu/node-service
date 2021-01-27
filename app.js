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
var connection1 = null, connection1Ready = false;
var server = ws.createServer(function(conn){
    conn.on("text", function (str) {
        console.log("收到的信息为:"+str)
        if(str==="connection1"){
            connection1 = conn;
			connection1Ready = true;
            conn.sendText("success");
        }

        conn.sendText(str)
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


app.listen(8090, () => { // 监听8088端口
	console.log('服务已启动 http://localhost:8090');
})