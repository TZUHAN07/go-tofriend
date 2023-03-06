const express = require('express');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const app=express();
const member = require('./routes/member');
const formatMessage = require('./utils/messages');
const board = require('./utils/board');
const { Console } = require('console');
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




let players = []; 
let readyCount = 0;// 存儲已連接的玩家

// 處理新的連線
io.on('connection', (socket) => {
    console.log(socket.id);
    
    // 計算在線人數
    function getOnlinePlayers() {
        return Object.keys(players).length;
    }

    // 處理新玩家連接
    players[socket.id] = {
      id: socket.id,
      player: getOnlinePlayers() + 1 ,// 給新玩家編號
      ready: false // 新增 ready 屬性，初始值為 false
    };
    console.log('Current online players:', getOnlinePlayers());

    // 檢查是否可以開始遊戲
    function checkReady() {
      if (readyCount === 2) {
        console.log('Game started!');
        // TODO: 開始遊戲
      }
    }

     // 當玩家準備好後，檢查是否可以開始遊戲
    socket.on('ready', () => {
      console.log(`${socket.id} is ready`);
      players[socket.id].ready = true;
      readyCount++;
      console.log('Ready count:', readyCount);
      console.log('Current online players:', getOnlinePlayers());
      checkReady();
    });

    socket.emit('message', formatMessage(gogameName,'Welcome to the room'));

    socket.broadcast.emit('message', formatMessage(gogameName,'A user has joined  the chat'));

    socket.on('disconnect', () => {
        delete players[socket.id];
        console.log('Current online players:', getOnlinePlayers());
        io.emit('message',formatMessage(gogameName,'A user has left the chat'));
    });

    //listen for chatMessage
    socket.on('chatMessage',(msg)=>{
        io.emit('message',formatMessage('USER',msg));
        // console.log(msg);
    });

    // 向新玩家發送玩家編號
    socket.emit('playerNumber', players[socket.id].player);

    const boardData = board.createBoard();
    io.emit('board', boardData);

  
//   // 處理玩家下棋
//   socket.on('move', (data) => {
//     socket.broadcast.emit('move', data); // 將下棋信息廣播給對手
//   });
  
    // 處理玩家輪流下棋
    socket.on('takeTurn', (player) => {
        for (const id in players) {
          if (players[id].player !== player) {
            io.to(id).emit('opponentTurn', player); // 將該輪到哪個玩家下棋通知對手
            break;
        }
        }
    });

    //處理玩家下棋
    socket.on('play', (data) => {
         // 接收前端傳送過來的落子資訊
        const { x, y,moveCount, color } = data;
        console.log(data,71)
        // 更新棋盤狀態
        const update = board.updateBoard(x, y, color);
        console.log(update,74)
        // moveCount++;
        console.log(`Player ${color} made a move at (${x}, ${y}), movecount: ${moveCount}`);

        // 告知客戶端換對方下棋
        const nextPlayer = color === 1 ? 2 : 1;
        socket.emit('next', nextPlayer, moveCount);
   
        });
        socket.on('requestBoard', () => {
            // const boardBuffer = board.getBoardBuffer();// 回傳一個 buffer
            const boardString = board.getBoardString();
            // console.log(boardString,97)
            io.emit('updateBoard', boardString); // 將 buffer 通知所有客戶端
        }) 
        
})
  
http.listen(port, () => {
    console.log(`Listening on ${port}`)
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


