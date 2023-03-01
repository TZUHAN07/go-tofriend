const express = require('express');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const app=express();
const member = require('./routes/member');
const formatMessage = require('./utils/messages');
// const gogame = require('./public/JS/gogame');
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
// app.use('/gogame', gogame);
app.set('view engine', 'ejs');

const gogameName = 'gogame Bot'

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


// 處理新的連線
io.on('connection', (socket) => {
    console.log(socket.id);

    socket.emit('message', formatMessage(gogameName,'Welcome to the room'));

    socket.broadcast.emit('message', formatMessage(gogameName,'A user has joined  the chat'));

    socket.on('disconnect', () => {
        io.emit('message',formatMessage(gogameName,'A user has left the chat'));
    });

    //listen for chatMessage
    socket.on('chatMessage',(msg)=>{
        io.emit('message',formatMessage('USER',msg));
        // console.log(msg);
    });
})
  
//     // 玩家加入遊戲
//     socket.on('joinGame', () => {
//       socket.join('game');
  
//       // 廣播棋盤狀態
//       io.to('game').emit('updateBoard', { board });
//     });
  
//     // 玩家落子
//     socket.on('placeStone', ({ x, y }) => {
//       if (isValidMove(x, y, turn)) {
//         const winner = getWinner();
  
//         // 廣播棋盤狀態和勝負結果
//         io.to('game').emit('updateBoard', { board, turn, winner });
  
//         // 換手
//         turn = turn === BLACK ? WHITE : BLACK;
//       }
//     });
//   // 處理斷線
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
    
//         // 如果有玩家斷線，遊戲就無法繼續進行，因此要重新初始化棋盤
//         initBoard();
    
//         // 廣播棋盤狀態
//         io.to('game').emit('updateBoard', { board, turn });
//     });


// //Socket 從外部連結時執行
// io.on('connection', (socket) => {
//     console.log(socket.id)
//     //連結時執行此 console 提示
//     console.log('Client connected')

    
//     // 當用戶端斷開連接時執行以下程式碼
//     socket.on('disconnect', () => {
//           console.log('用戶端斷開連接');
//     });
    
// });


http.listen(port, () => {
    console.log(`Listening on ${port}`)
})