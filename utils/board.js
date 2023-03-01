const boardsize = 19; // 圍棋棋盤大小
const empty = 0; // 空格
const black = 1; // 黑子
const white = 2; // 白子
const stoneType = {
  [empty]: 'empty',
  [black]: 'black',
  [white]: 'white'
};

let board = null; // 圍棋棋盤
let turn = black; // 黑子先下

// 初始化棋盤
function initBoard() {
    board = [];
    for (let i = 0; i < boardsize; i++) {
      board.push([]);
      for (let j = 0; j < boardsize; j++) {
        board[i].push(empty);
      }
    }
}
// 判斷棋子是否在棋盤內
function isOnBoard(x, y) {
    return x >= 0 && x < boardsize && y >= 0 && y < boardsize;
}
// 判斷棋子是否為空格
function isEmpty(x, y) {
    return board[x][y] === empty;
}
// 檢查棋子是否能落在指定位置
function isValidMove(x, y, color) {
    if (!isOnBoard(x, y) || !isEmpty(x, y)) {
      return false;
    }
    // 先假設棋子可以落在指定位置
    let hasLiberty = false; // 有氣的旗子
    board[x][y] = color;

    // 檢查棋子四周的位置
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue;
        }

        const nx = x + i;
        const ny = y + j;

        if (isOnBoard(nx, ny) && board[nx][ny] !== empty) {
          const stoneColor = board[nx][ny];
          const liberties = getLiberties(nx, ny);

          if (stoneColor !== color && liberties === 0) {
            // 擊殺對方旗子
            removeStones(nx, ny);
          } else if (stoneColor === color || liberties > 0) {
            hasLiberty = true;
          }
        } else {
          hasLiberty = true;
        }
      }
    }
    if (!hasLiberty) {
        board[x][y] = empty; // 棋子沒有氣，不能落在指定位置
        return false;
    }
    return true;
}
// 取得旗子的氣數
function getLiberties(x, y) {
    const stoneColor = board[x][y];
    let liberties = 0;
  
    // 檢查棋子四周的位置
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
  
        const nx = x + i;
        const ny = y + j;
  
        if (!isOnBoard(nx, ny)) {
          continue;
        }
  
        if (board[nx][ny] === empty) {
          liberties++;
        } else if (board[nx][ny] === stoneColor) {
          liberties += getLiberties(nx, ny);
        }
      }
    }
    return liberties;
}
// 擊殺指定位置的旗子
function removeStones(x, y) {
  const stoneColor = board[x][y];

  board[x][y] = empty;

  // 檢查棋子四周的位置
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {
        continue;
      }

      const nx = x + i;
      const ny = y + j;

      if (!isOnBoard(nx, ny)) {
        continue;
      }
      
      if (board[nx][ny] === stoneColor) {
        removeStones(nx, ny);
      }
    }
  }
}
// 判斷勝負
function getWinner() {
    let blackStones = 0;
    let whiteStones = 0;
  
    for (let i = 0; i < boardsize; i++) {
      for (let j = 0; j < boardsize; j++) {
        if (board[i][j] === black) {
          blackStones++;
        } else if (board[i][j] === white) {
          whiteStones++;
        }
      }
    }
  
    if (blackStones > whiteStones) {
      return black;
    } else if (whiteStones > blackStones) {
      return white;
    } else {
      return empty;
    }
  }

// 初始化棋盤
initBoard();
