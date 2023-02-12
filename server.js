// import express from 'express';
const express = require('express');
// const cors = require('cors');
const app=express();
const http = require('http').Server(app)
const io = require('socket.io')(http, {
    cors: {
        origin:['http://localhost:3000', 'http://127.0.0.1:3000'], 
        credentials:true,            //access-control-allow-credentials:true
        optionSuccessStatus:200,
        allowedHeaders: ['Content-Type', 'Authorization'],
     }
})

//指定開啟的 port
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

//首頁
app.get('/',(req, res)=>{
    res.render('index')
});

//
app.get('/gogame',(req, res)=>{
    res.render('gogame')
});

//當 WebSocket 從外部連結時執行
io.on('connection', (socket) => {
    console.log(socket.id)
    //連結時執行此 console 提示
    console.log('Client connected')

    //當 WebSocket 的連線關閉時執行
    socket.on('close', () => {
        console.log('Close connected')
    })
})


http.listen(port, () => {
    console.log(`Listening on ${port}`)
})