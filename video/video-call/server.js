const express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    WebSocketServer = require('ws').Server,
    ws = new WebSocketServer({server: server});

server.listen(8080);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// 存储socket的数组 这里只能有2个socket 每次测试需要重启 否则会出错
let wss = [],
    index = 1;

// 有socket连入
ws.on('connection', function (currentWs) {

    // 将socket存入数组
    wss.push(currentWs);

    // 保存socket数组中下标 当前程序只允许2个socket 第一个为0 第二个为1
    // otherIndex就反着来 第一个socket的otherIndex下标为1 第二个socket的otherIndex下标为0
    let currentWsIndex = index--,
        desc = null;
    console.log(currentWsIndex);

    if (currentWsIndex === 1) {
        desc = '第' + currentWsIndex + '个socket';
    } else {
        desc = '第' + currentWsIndex + '个socket';
    }

    // 转发收到的消息
    currentWs.on('message', function (message) {
        let json = JSON.parse(message);
        console.log('received (' + desc + ') : ', json);

        wss[currentWsIndex].send(message, function (error) {
            if (error) {
                console.log('send message error (' + desc + ') : ', error);
            }
        });
    });
});
