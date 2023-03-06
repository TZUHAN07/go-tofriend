

const socket = io.connect();// 創建 Socket.io 連線


socket.on('connect',() => {
	console.log(socket.id)
})

// let player = 1; // 初始化第一個下棋的玩家
// socket.on('play', (playerId) => {
//   player = playerId; // 接收到該輪下棋的玩家
//   console.log(player)
// });
// 接收後端傳送的玩家編號事件
socket.on('playerNumber', (playerNumber) => {
	console.log(`Player number: ${playerNumber}`);
  });
  
socket.emit('ready');
// 接收後端傳送的玩家輪流下棋事件
socket.on('opponentTurn', (player) => {
	console.log(`Opponent's turn: ${player}`);
  });
// function handleClick(x, y) {
//   if (player === 1) {
//     // 玩家1下棋
//     socket.emit('move', {x: x, y: y, player: player}); // 傳遞棋子位置和下棋玩家到服務器端
//     player = 2; // 轉換到玩家2下棋
//     socket.emit('play', player); // 通知對手該輪到對手下棋了
//   } else {
//     // 玩家2下棋
//     socket.emit('move', {x: x, y: y, player: player});
//     player = 1; // 轉換到玩家1下棋
//     socket.emit('play', player);
//   }
// }

// 當收到 'board' 訊息時，更新棋盤圖像
socket.on('board', (boardData) => {
  // 創建一個圖像元素
  const boardImg = document.createElement('img');
  boardImg.src = boardData;
  boardImg.classList.add('weiqi');
  console.log("success")

  // 在HTML中添加圖像元素
  const boardContainer = document.querySelector('.board');
  boardContainer.appendChild(boardImg);
});


// 向後端請求棋盤字符串
socket.emit('requestBoard');



// socket.on('next', (nextPlayer, moveCount) => {
// 	currentPlayer = nextPlayer;
// 	console.log(`It's now ${currentPlayer}'s turn. Move count: ${moveCount}`);
// });


// 監聽 'updateBoard' 事件

socket.on('updateBoard', (boardString) => {

	console.log(boardString);
	// 解析棋盤狀態字串，轉成陣列或物件
	const boardArray = parseBoardString(boardString);
	console.log(boardArray)
	// 繪製棋盤和棋子
	drawBoard(boardArray);
});


//下棋處理
let moveCount = 0;
const canvas = document.getElementById('goboard');
const gridSize = 45;
const boardMargin = 10;

let isMyTurn = true;
//滑鼠點擊元素
canvas.addEventListener('mousedown', (e) => {
	if(!isMyTurn){
		return
	}
	//獲取鼠標點擊事件，确定鼠標點擊的具體位置
	let x ,y ;
	if (e.offsetX || e.offsetX == 0) {
	x = e.offsetX; //最左邊
	y = e.offsetY; //最上面
	}
   
	// 判斷鼠標點擊的位置是否在棋盤範圍內
	if (x < boardMargin - gridSize / 2 || x > canvas.width - boardMargin)
		return;
	if (y < boardMargin - gridSize / 2 || y > canvas.height - boardMargin)
		return;

	// 計算格子的座標
	let xGrid = Math.round((x - boardMargin) / gridSize);
	let yGrid = Math.round((y - boardMargin) / gridSize);

	shoeGO(xGrid, yGrid, moveCount);

	
})

let currentPlayer = 1

function shoeGO(x, y, moveCount,player) {
	moveCount++;
	if (player === 1) {
		// 玩家1下棋
		socket.emit('shoeGO', { x, y, moveCount ,color: currentPlayer}); // 傳遞棋子位置和下棋玩家到服務器端
		player = 2; // 轉換到玩家2下棋
		socket.emit('play', player); // 通知對手該輪到對手下棋了
	  } else {
		// 玩家2下棋
		socket.emit('shoeGO', { x, y, moveCount ,color: currentPlayer});
		player = 1; // 轉換到玩家1下棋
		socket.emit('play', player);
	  }
	// moveCount++;
  	// // 將落子資訊傳送給後端
  	// socket.emit('shoeGO', { x, y, moveCount ,color: currentPlayer});
  	// console.log({ x, y, moveCount,color: currentPlayer })
    
	//  // 更新当前玩家
	 
	// currentPlayer = player === 1 ? 2: 1;
	// // 現在不能下棋，等待後端傳回下一個玩家資訊
    // isMyTurn = false;
	// console.log("not your turn")
}
// 解析棋盤狀態字串，轉成陣列或物件的函式
function parseBoardString(boardString) {
	// 將字串分行，然後每行分割成單個字元，形成二維陣列
	const rows = boardString.trim().split('\n');
	// const boardArray = rows.map((row) => row.split(''));
	const boardArray = rows.map((row) => row.split('').map((val) => parseInt(val)));
	console.log(boardArray)
	return boardArray;
  }

function drawBoard(boardArray) {
	clearBoard(); // 先清除畫布
	// const goboard = document.getElementById('goboard');
	// const ctx = goboard.getContext('2d');

	for (let i = 0; i < 19; i++) {
		for (let j = 0; j < 19; j++) {
			if (boardArray[i][j] === 1) { //黑棋
				let rg = ctx.createRadialGradient((i+1)*45-3, (j+1)*45-3, 1, (i+1)*45-4, (j+1)*45-4, 11);
				rg.addColorStop(1, '#202020');
				rg.addColorStop(0, 'gray');
				ctx.beginPath();
				ctx.arc((i+1)*45, (j+1)*45,22.5,0,2*Math.PI,false);
				//ctx.fillStyle="black";
				ctx.fillStyle=rg;
				ctx.fill();
				
			}
			else if (boardArray[i][j] === 2) { //白棋
				let rg = ctx.createRadialGradient((i+1)*45-3, (j+1)*45-3, 1, (i+1)*45-4, (j+1)*45-4, 11);
				rg.addColorStop(1, '#e0e0e0');
				rg.addColorStop(0, 'white');
				ctx.beginPath();
				ctx.arc((i+1)*45, (j+1)*45,22.5,0,2*Math.PI,false);
				//ctx.fillStyle="white";
				ctx.fillStyle=rg;
				ctx.fill();
			}
			else if (boardArray[i][j] === 7) { // fill color
				ctx.beginPath();
				ctx.arc((i+1)*45, (j+1)*45,22.5,0,2*Math.PI,false);
				ctx.fillStyle='red';
				ctx.fill();
			}
		}
	}
	
}
function clearBoard() {
	const goboard = document.getElementById('goboard');
	const ctx = goboard.getContext('2d');
	ctx.strokeStyle='black';
	ctx.clearRect(0, 0, goboard.width, goboard.height);
	ctx.fillStyle = "#c9a682";
	ctx.fillRect(0, 0, goboard.width, goboard.height);
  }

//滑鼠經過元素
canvas.addEventListener('mousemove', (e) =>{
	//獲取鼠標點擊事件，确定鼠標點擊的具體位置
	let x ,y ;
	if (e.offsetX || e.offsetX == 0) {
	x = e.offsetX; //最左邊
	y = e.offsetY; //最上面
	}
	// 計算格子的座標
	let xGrid = Math.round((x - boardMargin) / gridSize);
	let yGrid = Math.round((y - boardMargin) / gridSize);

	//判斷轉換後的座標是否在棋盤範圍內
	if (xGrid < 0 || xGrid > 18 || yGrid < 0 || yGrid > 18)
	    return;
	
	//將座標轉換為像素座標，以便繪製棋子
	x = xGrid * gridSize + gridSize;
	y = yGrid * gridSize + gridSize;
	
	
	const canvas = document.getElementById('goboard');
	const ctx = canvas.getContext('2d');
	// 畫布清空
	ctx.clearRect(0,0,900,900);

	// put a new Gray stone
	ctx.beginPath();
	ctx.arc(x,y,22.5,0,2*Math.PI,false);
	ctx.fillStyle='gray';
	ctx.fill();

	ctx.beginPath();
	ctx.arc(x,y,20,0,2*Math.PI,false);
	if (moveCount % 2 == 0)
		ctx.fillStyle='black';
	else
		ctx.fillStyle='white';
	ctx.fill();
})
//滑鼠離開元素
canvas.addEventListener('mouseout', (e) => {
	const canvas = document.getElementById('goboard');
	const ctx = canvas.getContext('2d');
	ctx.clearRect(0,0,900,900);
})	
