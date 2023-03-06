// const socket = io.connect();// 創建 Socket.io 連線
const socket = io.connect('/go');

socket.on('connect',() => {
	console.log(socket.id)
})
socket.on('updatePlayers', (onlinePlayers) => {
	console.log(onlinePlayers);
    // 处理在线玩家更新
});
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

socket.on('next', (nextPlayer, moveCount) => {
	currentPlayer = nextPlayer;
	console.log(`It's now ${currentPlayer}'s turn. Move count: ${moveCount}`);
});

// 向後端請求棋盤字符串
socket.emit('requestBoard');


// 監聽 'updateBoard' 事件
socket.on('updateBoard', (boardString) => {
	console.log(boardString);
	  
	// 解析棋盤狀態字串，轉成陣列或物件
	const boardArray = parseBoardString(boardString);
	console.log(boardArray)
	// 繪製棋盤和棋子
	drawBoard(boardArray);
});
// 解析棋盤狀態字串，轉成陣列或物件的函式
function parseBoardString(boardString) {
	// 將字串分行，然後每行分割成單個字元，形成二維陣列
	const rows = boardString.trim().split('\n');
	// const boardArray = rows.map((row) => row.split(''));
	const boardArray = rows.map((row) => row.split('').map((val) => parseInt(val)));
	console.log(rows,boardArray,"canvas.js")
	return boardArray;
  }

// function drawBoard(boardArray) {
// 	clearBoard(); // 先清除畫布
// 	const goboard = document.getElementById('goboard');
// 	const ctx = goboard.getContext('2d');

// 	goboard.width = 900;
// 	goboard.height = 900;

// 	for (let i = 0; i < 19; i++) {
// 		for (let j = 0; j < 19; j++) {
// 			if (boardArray[i][j] == 1) { //黑棋
// 				let rg = ctx.createRadialGradient((i+1)*45-3, (j+1)*45-3, 1, (i+1)*45-4, (j+1)*45-4, 11);
// 				rg.addColorStop(1, '#202020');
// 				rg.addColorStop(0, 'gray');
// 				ctx.beginPath();
// 				ctx.arc((i+1)*45, (j+1)*45,22.5,0,2*Math.PI,false);
// 				//ctx.fillStyle="black";
// 				ctx.fillStyle=rg;
// 				ctx.fill();
				
// 			}
// 			else if (boardArray[i][j] == 2) { //白棋
// 				let rg = ctx.createRadialGradient((i+1)*45-3, (j+1)*45-3, 1, (i+1)*45-4, (j+1)*45-4, 11);
// 				rg.addColorStop(1, '#e0e0e0');
// 				rg.addColorStop(0, 'white');
// 				ctx.beginPath();
// 				ctx.arc((i+1)*45, (j+1)*45,22.5,0,2*Math.PI,false);
// 				//ctx.fillStyle="white";
// 				ctx.fillStyle=rg;
// 				ctx.fill();
// 			}
// 			else if (boardArray[i][j] == 7) { // fill color
// 				ctx.beginPath();
// 				ctx.arc((i+1)*45, (j+1)*45,22.5,0,2*Math.PI,false);
// 				ctx.fillStyle='red';
// 				ctx.fill();
// 			}
// 		}
// 	}
	
// }
function clearBoard() {
	const goboard = document.getElementById('goboard');
	const ctx = goboard.getContext('2d');
	ctx.strokeStyle='black';
	ctx.clearRect(0, 0, goboard.width, goboard.height);
	ctx.fillStyle = "#c9a682";
	ctx.fillRect(0, 0, goboard.width, goboard.height);
  }

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

	play(xGrid, yGrid, moveCount);
})

let currentPlayer = 1

function play(x, y,player) {
	// moveCount++;
  	// 將落子資訊傳送給後端
  	socket.emit('play', { x, y, color: currentPlayer});
  	console.log({ x, y, color: currentPlayer })
    
	 // 更新当前玩家
	 
	currentPlayer = player === 1 ? 2: 1;
	// 現在不能下棋，等待後端傳回下一個玩家資訊
    isMyTurn = false;
	console.log("not your turn")
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


