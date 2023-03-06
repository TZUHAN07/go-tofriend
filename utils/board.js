const { createCanvas } = require('canvas');

function createBoard() {
  const canvas = createCanvas(900, 900);
  const ctx = canvas.getContext('2d');

  // 畫棋盤的網格線
  for (let i = 0; i < 19; i++) {
    ctx.beginPath();
    ctx.moveTo(45 + (i * 45), 45);
    ctx.lineTo(45 + (i * 45), 855);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(45, 45 + (i * 45));
    ctx.lineTo(855, 45 + (i * 45));
    ctx.stroke();
  }

  // 畫棋盤上的九個點
  const points = [    [180, 180], [450, 180], [720, 180],
    [180, 450], [450, 450], [720, 450],
    [180, 720], [450, 720], [720, 720]
  ];
  ctx.fillStyle = '#000';
  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point[0], point[1], 4.5, 0, 2 * Math.PI);
    ctx.fill();
  });

  return canvas.toDataURL();
}


// const boardSize = 19; // 棋盤大小
// const board = []; // 棋盤陣列

// // 初始化棋盤
// for (let i = 0; i < boardSize; i++) {
//   board[i] = [];
//   for (let j = 0; j < boardSize; j++) {
//     board[i][j] = 0; // 0 表示空位
//   }
// }
// 在全局作用域中声明 board 变量
const board = [];
const boardSize = 19;
// 初始化 board 变量
for (let i = 0; i < boardSize; i++) {
  board.push(new Array(boardSize).fill(0));
}
console.log(board)

// 當收到前端的落子位置時，更新棋盤
function updateBoard(x, y, player) {
  board[x][y] = player; // 將玩家的旗子放置在棋盤上
  console.log(board[x][y]),50
  return board;
}

// 將棋盤轉成字串形式，以便傳給前端顯示
function getBoardString() {
  let boardString = '';
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      boardString += board[i][j];
    }
    boardString += '\n';
  }
  return boardString;
}



module.exports = {createBoard,updateBoard,getBoardString}