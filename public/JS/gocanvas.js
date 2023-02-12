// import {showGo} from './gogame';

const socket = io.connect();
const canvas = document.getElementById('goboard');
const ctx = canvas.getContext('2d');

//畫棋盤
window.onload = function() {

//   canvas.addEventListener('mousedown', mousedownHandler, false);
//   canvas.addEventListener('mousemove', mousemoveHandler, false);
//   canvas.addEventListener('mouseout', mouseoutHandler, false);

  	createBroad(ctx);
	ninePoints(ctx);
	// showGo()

}
  
function createBroad(ctx){
  ctx.strokeStyle = ' black';
    
    for (let i = 0; i < 19; i++) {
        ctx.beginPath();
        // 橫線
        ctx.moveTo(45 + (i * 45), 45);
        ctx.lineTo(45 + (i * 45), 855);
        ctx.stroke();
        // 直線
        ctx.moveTo(45, 45 + (i * 45));
        ctx.lineTo(855, 45 + (i * 45));
        ctx.stroke();
      }   
}

//畫棋盤上九個點
function ninePoints(ctx) {
	let points = new Array(
		[180,180],[450,180],[720,180],
		[180,450],[450,450],[720,450],
		[180,720],[450,720],[720,720]
	);
	
	for (let i = 0; i < points.length; i++) {
		//circle
		ctx.beginPath();
		ctx.arc(points[i][0],points[i][1],3,0,2*Math.PI,false);
		ctx.fillStyle="black";
		ctx.fill();
	}
}
let pan = new Array(
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
);
// 真正落子
function stone_down(row, col) {
	if (move_count % 2 === 0) { //未落子前是白
		pan[row][col] = 1; //就放黑
	} else {
		pan[row][col] = 2;
	}
	move_count ++;
	move_record.push([row, col, move_count]);	// 记录手数
}
// //下棋處理
// let moveCount = 0;
// //滑鼠點擊元素
// function mousedownHandler(e) {
//   //獲取鼠標點擊事件，确定鼠標點擊的具體位置
//   let x ,y ;
//   if (e.offsetX || e.offsetX == 0) {
//     x = e.offsetX; //最左邊
//     y = e.offsetY; //最上面
//   }
   
// 	//判斷鼠標點擊的位置是否在一個特定區域內
// 	if (x < 45-10 || x > 900-45+10)
// 		return;
// 	if (y < 45-10 || y > 900-45+10)
// 		return;
	
//   //將鼠標點擊的坐標轉換為可以在棋盤上使用的座標
// 	let xIsFree = false;
// 	let yIsFree = false;
//   	let xStatus;
//   	let yStatus;
// 	for (let i = 1; i <= 19; i++) {
// 		if (x > i*45-22 && x < i*45+22) {
// 			x = i*45;
// 			xIsFree = true;
//       		xStatus = i-1 ;
// 		}
// 		if (y > i*45-22 && y < i*45+22) {
// 			y = i*30;
// 			yIsFree = true;
//       		yStatus = i-1 ;
// 		}
// 	}
// 	if (!xIsFree || !yIsFree)
// 		return;
// }

// // 	play(xStatus, yStatus, moveCount);
// // 	showGo();
// // }

// //滑鼠經過元素
// function mousemoveHandler(e) {
//   //獲取鼠標點擊事件，确定鼠標點擊的具體位置
//   let x ,y ;
//   if (e.offsetX || e.offsetX == 0) {
//     x = e.offsetX; //最左邊
//     y = e.offsetY; //最上面
//   }
   
// 	//判斷鼠標點擊的位置是否在一個特定區域內
// 	if (x < 45-10 || x > 900-45+10)
// 		return;
// 	if (y < 45-10 || y > 900-45+10)
// 		return;
	
//   //將鼠標點擊的坐標轉換為可以在棋盤上使用的座標
// 	let xIsFree = false;
// 	let yIsFree = false;
// 	for (let i = 1; i <= 19; i++) {
// 		if (x > i*45-22 && x < i*45+22) {
// 			x = i*45;
// 			xIsFree = true;
// 		}
// 		if (y > i*45-22 && y < i*45+22) {
// 			y = i*30;
// 			yIsFree = true;
// 		}
// 	}
// 	if (!xIsFree || !yIsFree)
// 		return;

// 	// 畫布清空
// 	ctx.clearRect(0,0,900,900);

// 	// put a new Gray stone
// 	ctx.beginPath();
// 	ctx.arc(x,y,15,0,2*Math.PI,false);
// 	ctx.fillStyle="gray";
// 	ctx.fill();

// 	ctx.beginPath();
// 	ctx.arc(x,y,10,0,2*Math.PI,false);
// 	if (moveCount % 2 == 0)
// 		ctx.fillStyle="black";
// 	else
// 		ctx.fillStyle="white";
// 	ctx.fill();
// }
// //滑鼠離開元素
// function mouseoutHandler(e) {
// 	ctx.clearRect(0,0,600,600);
// }


socket.on('connect',() => {
  console.log(socket.id)
})
