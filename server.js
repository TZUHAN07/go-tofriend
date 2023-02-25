const express = require('express');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const app=express();
const member = require('./routes/member');
// const users = require('./routes/users');
const http = require('http').Server(app)
const io = require('socket.io')(http)

//指定開啟的 port
const port = process.env.PORT || 3000;

app.use(express.static('public'));
// app.use('/users', users);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/', member);
app.set('view engine', 'ejs');

// 首頁
app.get('/',(req, res)=>{
    res.render('index')
});
//大廳
app.get('/home',(req, res)=>{
    res.render('home')
});

//棋室
app.get('/gogame',(req, res)=>{
    res.render('gogame')
});

//當 WebSocket 從外部連結時執行
io.on('connection', (socket) => {
    console.log(socket.id)
    //連結時執行此 console 提示
    console.log('Client connected')
})

http.listen(port, () => {
    console.log(`Listening on ${port}`)
})