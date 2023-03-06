const express = require('express');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const app=express();
const member = require('./routes/member');
const formatMessage = require('./utils/messages');
const { userJoin , getCurrentUser ,userLeave} = require('./utils/users');
const board = require('./utils/board');
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
//棋室
app.get('/oneplayer',(req, res)=>{
    res.render('oneplayer')
});

const messagesNamespace = io.of('/messages');
messagesNamespace.on('connection', (socket) => {
    socket.on('joinRoom',(username) => {

        const user = userJoin (socket.id, username);

        socket.emit('message', formatMessage(gogameName,'Welcome to the room'));

        socket.broadcast.emit('message', formatMessage(gogameName,`${user.username} has joined  the chat`));
    })

  // 處理聊天相關的事件和邏輯
    console.log(socket.id);
    console.log('New client connected');
    
    //listen for chatMessage
    socket.on('chatMessage',(msg)=>{
        const user = userLeave(socket.id)

        messagesNamespace.emit('message',formatMessage(user.username,msg));
        // console.log(msg);
    });

    socket.on('disconnect', () => {
        const user = getCurrentUser(socket.id)
        if(user){
            messagesNamespace.emit('message',formatMessage(gogameName,'A  user has left the chat'));
        }
    });
});


const goNamespace = io.of('/go');
// 將所有房間存儲在一個對象中，每個房間有一個棋盤和兩個玩家
const gorooms = {};
goNamespace.on('connection', (socket) => {
    
        console.log(socket.id);
        console.log('New client connected');
        
        socket.on('joinRoom', (roomId) => {
            console.log(`user ${socket.id} joined room ${roomId}`);
            if (!gorooms[roomId]) {
                gorooms[roomId] = {
                players: {},
                currentTurn: 'black',
                board: Array(19).fill().map(() => Array(19).fill(''))
              };
            }
            const room = gorooms[roomId];
            if (Object.keys(room.players).length < 2) {
              const color = Object.keys(room.players).length === 0 ? 'black' : 'white';
              room.players[socket.id] = color;
              goNamespace.emit('joinedRoom', color);
              socket.join(roomId);
              io.to(roomId).emit('updateBoard', room.board, room.currentTurn);
            } else {
                goNamespace.emit('roomFull');
            }
          });
        
          socket.on('makeMove', (roomId, x, y) => {
            console.log(`user ${socket.id} made move ${x},${y} in room ${roomId}`);
            const room = gorooms[roomId];
            if (room && room.players[socket.id] === room.currentTurn) {
              room.board[x][y] = room.currentTurn;
              room.currentTurn = room.currentTurn === 'black' ? 'white' : 'black';
              io.to(roomId).emit('updateBoard', room.board, room.currentTurn);
            }
          });

        const boardData = board.createBoard();
        goNamespace.emit('board', boardData);

        //處理玩家下棋
        socket.on('play', (data) => {
           // 接收前端傳送過來的落子資訊
          const { x, y, color } = data;
          console.log(data,71)
          // 更新棋盤狀態
          const update = board.updateBoard(x, y, color);
        //   console.log(update,"updateBoard")
          // 增加移動次數
        //   game.moveCount++;
          // 更新棋盤狀態
          // const update = board.updateBoard(x, y, color);
          // console.log(update,74)
          // moveCount++;
        //   console.log(`Player ${color} made a move at (${x}, ${y}), movecount: ${game.moveCount++}`);

          
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
            for (const roomId in rooms) {
              const room = rooms[roomId];
              if (room.players[socket.id]) {
                delete room.players[socket.id];
                io.to(roomId).emit('playerLeft');
                if (Object.keys(room.players).length === 0) {
                  delete rooms[roomId];
                }
                break;
              }
            }
          });
       
    })
    

const roomNamespace = io.of('/room');
// 儲存當前線上的使用者
let onlineUsers = [];
//  紀錄目前的房間
const rooms = {};
roomNamespace.on('connection', (socket) => {
  // 處理進入相關的事件和邏輯
    console.log("a user connected");  
    
    socket.on("new_user", (data) => {
        console.log(`${data.userName} 加入了房間 `);

        if (!onlineUsers.includes(data.userName)) {
            // 將新使用者加入到 onlineUsers 中
            onlineUsers.push(data.userName);
        }
        // 廣播當前的 onlineUsers
        roomNamespace.emit('online_users', onlineUsers);
      });


      socket.on("requestEnterRoom", function(data) {
        let playerName = data.playerName;
        let roomNumber = data.roomNumber;
        console.log(playerName,roomNumber)
        
        // 檢查玩家是否存在
        if (onlineUsers.includes(playerName)) {
            // 向該名玩家發送一個通知，詢問是否願意進入房間進行遊戲
            io.to(`${socket.id}`).emit("invitationToEnterRoom", { roomNumber: roomNumber });

            // 等待玩家回應
            socket.on("responseToInvitation", function(data) {
                if (data.accept) {
                    // 玩家同意進入房間，則將兩名玩家的信息傳送至/gogame房間
                    let room = io.of("/").adapter.rooms[roomNumber];
                    if (!room) {
                        // 如果房間不存在，則創建一個新房間
                        room = io.of("/").adapter.rooms[roomNumber] = new Set();
                    }
                    room.add(socket.id);
                    room.add(data.playerId);
                    // 向兩名玩家發送進入房間的通知
                    io.to(socket.id).emit("enterRoomSuccess", { roomNumber: roomNumber });
                    io.to(data.playerId).emit("enterRoomSuccess", { roomNumber: roomNumber });
                } else {
                    // 玩家不同意進
                    io.to(socket.id).emit("invitationDeclined", { roomNumber: roomNumber });
                    delete io.of("/").adapter.rooms[roomNumber];
                }
            })
        }
    })


    socket.on("disconnect", () => {
      console.log("user disconnected");
      // 將離開的使用者從 onlineUsers 中刪除
      onlineUsers = onlineUsers.filter(user => user !== socket.userName);

      // 廣播當前的 onlineUsers
      roomNamespace.emit('online_users', onlineUsers);
    
    });
})
  
  
http.listen(port, () => {
    console.log(`Listening on ${port}`)
})