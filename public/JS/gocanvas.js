const socket = io.connect();
// const weiqi = document.getElementById('weiqi');
// const ctx = weiqi.getContext('2d');

const moveShowButton = document.getElementById('moveShow');

//落子順序輔助
let moveShow = false;
function clickButton() {
	moveShowButton.onclick = function() {
		if (moveShow) {
			moveShowButton.innerHTML='落子順序';
			moveShow = false;
		} else {
			moveShowButton.innerHTML='取消順序';
			moveShow = true;
		}
		showGo();
	}
}


//畫棋盤  
function createBoard(ctx){
	
    for (let i = 0; i < 19; i++) {
        ctx.beginPath();
        // 橫線
        ctx.moveTo(45 + (i * 45), 45);
        ctx.lineTo(45 + (i * 45), 855);
        ctx.stroke();

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
		ctx.fillStyle='black';
		ctx.fill();
	}
}

//下棋處理
let moveCount = 0;
//滑鼠點擊元素
function mousedownHandler(e) {
	//獲取鼠標點擊事件，确定鼠標點擊的具體位置
	let x ,y ;
	if (e.offsetX || e.offsetX == 0) {
	x = e.offsetX; //最左邊
	y = e.offsetY; //最上面
	}
   
	//判斷鼠標點擊的位置是否在一個特定區域內
	if (x < 45-10 || x > 900-45+10)
		return;
	if (y < 45-10 || y > 900-45+10)
		return;
	
  	//將鼠標點擊的坐標轉換為可以在棋盤上使用的座標
	let xIsFree = false;
	let yIsFree = false;
  	let xStatus;
  	let yStatus;
	for (let i = 1; i <= 19; i++) {
		if (x > i*45-22 && x < i*45+22) {
			x = i*45;
			xIsFree = true;
      		xStatus = i-1 ;
		}
		if (y > i*45-22 && y < i*45+22) {
			y = i*30;
			yIsFree = true;
      		yStatus = i-1 ;
		}
	}
	if (!xIsFree || !yIsFree)
		return;


	play(xStatus, yStatus, moveCount);
	showGo();
}

//滑鼠經過元素
function mousemoveHandler(e) {
  	//獲取鼠標點擊事件，确定鼠標點擊的具體位置
  	let x ,y ;
  	if (e.offsetX || e.offsetX == 0) {
  	  x = e.offsetX; //最左邊
  	  y = e.offsetY; //最上面
  	}
   
	//判斷鼠標點擊的位置是否在一個特定區域內
	if (x < 45-10 || x > 900-45+10)
		return;
	if (y < 45-10 || y > 900-45+10)
		return;
	
  //將鼠標點擊的坐標轉換為可以在棋盤上使用的座標
	let xIsFree = false;
	let yIsFree = false;
	for (let i = 1; i <= 19; i++) {
		if (x > i*45-22.5 && x < i*45+22.5) {
			x = i*45;
			xIsFree = true;
		}
		if (y > i*45-22.5 && y < i*45+22.5) {
			y = i*45;
			yIsFree = true;
		}
	}
	if (!xIsFree || !yIsFree)
		return;

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
	ctx.arc(x,y,17.5,0,2*Math.PI,false);
	if (moveCount % 2 == 0)
		ctx.fillStyle='black';
	else
		ctx.fillStyle='white';
	ctx.fill();
}
//滑鼠離開元素
function mouseoutHandler(e) {
	const canvas = document.getElementById('goboard');
	const ctx = canvas.getContext('2d');
	ctx.clearRect(0,0,900,900);
}


//落子邏輯
//棋盤的落子，開始為0
let go = new Array(
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
//影子棋盤，標示最新一手要用
let shadow = new Array(
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

let jie = new Array();
let moveRecord = new Array();

function showGo() {
	const weiqi = document.getElementById('weiqi');
	const ctx = weiqi.getContext('2d');
	ctx.strokeStyle='black';
	// ctx.fillRect(0,0,900,900);
	
	/* 清空，重新画线等 */
	ctx.clearRect(0,0,900,900);
	ctx.fillStyle = "#c9a682";
	ctx.fillRect(0,0,900,900);
	createBoard(ctx);
	ninePoints(ctx);

	for (let i = 0; i < 19; i++) {
		for (let j = 0; j < 19; j++) {
			if (go[i][j] === 1) { //黑棋
				let rg = ctx.createRadialGradient((i+1)*45-3, (j+1)*45-3, 1, (i+1)*45-4, (j+1)*45-4, 11);
				rg.addColorStop(1, '#202020');
				rg.addColorStop(0, 'gray');
				ctx.beginPath();
				ctx.arc((i+1)*45, (j+1)*45,22.5,0,2*Math.PI,false);
				//ctx.fillStyle="black";
				ctx.fillStyle=rg;
				ctx.fill();
				
			}
			else if (go[i][j] === 2) { //白棋
				let rg = ctx.createRadialGradient((i+1)*45-3, (j+1)*45-3, 1, (i+1)*45-4, (j+1)*45-4, 11);
				rg.addColorStop(1, '#e0e0e0');
				rg.addColorStop(0, 'white');
				ctx.beginPath();
				ctx.arc((i+1)*45, (j+1)*45,22.5,0,2*Math.PI,false);
				//ctx.fillStyle="white";
				ctx.fillStyle=rg;
				ctx.fill();
			}
			else if (go[i][j] === 7) { // fill color
				ctx.beginPath();
				ctx.arc((i+1)*45, (j+1)*45,22.5,0,2*Math.PI,false);
				ctx.fillStyle='red';
				ctx.fill();
			}
		}
	}
	//顯示順序
	if (moveShow) {
		for (let m = 0; m < moveRecord.length-1; m++) { 
			// 先判断一下棋子是否在棋盤上
			if (go[moveRecord[m][0]][moveRecord[m][1]] === 0)
				continue;

			// 只出現最新的数字（打劫后，一個座標重複步數
			let repeatMove = false;
			for (let j = m+1; j < moveRecord.length; j++) {
				if (moveRecord[m][0] === moveRecord[j][0] &&
					moveRecord[m][1] === moveRecord[j][1]) {
						repeatMove = true;
					break;
				}
			}
			if (repeatMove)
				continue;

			
			if (moveRecord[m][2] % 2 === 1) { //black
				ctx.fillStyle='white';
			} else {
				ctx.fillStyle='black';
			}
			ctx.font='bold 18px sans-serif';
			if (moveRecord[m][2] > 99) {
				ctx.font='bold 16px sans-serif';
			}
			ctx.font='bold 16px sans-serif';
			ctx.textAlign='center';
			let moveNum = moveRecord[m][2].toString();
			ctx.fillText(moveNum, (moveRecord[m][0]+1)*45, (moveRecord[m][1]+1)*45+6);
		}
	}
	// 顯示最新的一手
	if (moveRecord.length > 0) {
		ctx.fillStyle = 'red';
		let newestMove = moveRecord.length-1;
	ctx.fillRect(
			(moveRecord[newestMove][0]+1)*45-5, 
			(moveRecord[newestMove][1]+1)*45-5, 
			10, 10
		);
	}
}

function play(row, col){
	if (row< 0 ||row > 19 || col < 0 || col > 19){
		alert('超過棋盤大小');
		return;
	}
	//已有棋子
	if (go[row][col]!=0 ){
		alert('已有棋子');
		return;
	}

	let canDown = false; // 是否可落子
	// 得到将落子的棋子的颜色
	let color = 2; // 白
	if (moveCount % 2 === 0) { // 未落子前是白
		color = 1; 
	}

	if (!haveAir(row, col)) {
		if (ourGo(row, col)) {
			make_shadow();


			goFill(row, col, color);	
			if (canGo(row, col, color)) {
				canDown = true;
				let deadgo = new Array();
				canEat(row, col, color, deadgo);
				cleanDeadGo(deadgo);
			} else {
				let deadgo = new Array();
				let cret = canEat(row, col, color, deadgo);
				cleanDeadGo(deadgo);

				if (cret) {
					canDown = true;
				} else {
					alert("無氣，不能落子！！");
				}
			}
		} else {
			let deadgo = new Array();
			let cret = canEat(row, col, color, deadgo);

			// 劫争也应该在此处理，只在此处理？
			if (cret) {
				if (!is_jie(row, col, deadgo)) {
					cleanDeadGo(deadgo);
					canDown = true;
				} else {
					alert("劫, 不能落子, 請至少隔一手棋！");
				}	
			}
		}
	} else {
		canDown = true;
		let deadgo = new Array();
		canEat(row, col, color, deadgo);
		cleanDeadGo(deadgo);
	}
	if (canDown) {
		goDown(row, col);
	}
}
/* 劫争 */
function is_jie(row, col, deadgo) { //是否劫
	if (deadgo.length === 1) {
		for (var i = 0; i < jie.length; i++) {
			//若符合（有坐標，且moveCount就是上一手）
			if (	jie[i][0] === deadgo[0][0] && 
					jie[i][1] === deadgo[0][1] && 
					jie[i][2] === moveCount) {
				return true;
			}
		}
		//加入順序紀錄
		jie.push([row, col, moveCount+1]);
		return false;
	}
	return false;
}
/* 棋盤落點是否為空 */
function canGo(row, col, color) {
	for (var i = 0; i < go.length; i++) {
		for (var j = 0; j < go[i].length; j++) {
			if (i !== row || j !== col) {
				if (shadow[i][j] === 7 && go[i][j] !== color) {
					return true; // 有空，可下
				}
			}
		}
	}
	alert("沒有空！！！");
	return false;
}
/* 能提吃吗？ */
function canEat(row, col, color, deadgo) { // color 是當前落子的颜色
	let ret = false;
	let anti_color = 2;
	if (color === 2)
		anti_color = 1;

	if (row+1 <= 19-1 && go[row+1][col] === anti_color) {
		make_shadow();
		shadow[row][col] = color;
		goFill(row+1, col, anti_color);
		if (!getGo(anti_color)) {
			// 记录下这些7的坐标，以及(row+1,col)，表示可以提吃的对方棋子
			// alert("提吃: "+(row+1).toString()+","+col.toString());
			var rret = recordDeadGo(deadgo);
			ret = ret || rret;
		}

	}
	if (row-1 >= 0 && go[row-1][col] === anti_color) {
		make_shadow();
		shadow[row][col] = color;
		goFill(row-1, col, anti_color);
		if (!getGo(anti_color)) {
			var rret = recordDeadGo(deadgo);
			ret = ret || rret;
		}

	}
	if (col+1 <= 19-1 && go[row][col+1] === anti_color) {
		make_shadow();
		shadow[row][col] = color;
		goFill(row, col+1, anti_color);
		if (!getGo(anti_color)) {
			var rret = recordDeadGo(deadgo);
			ret = ret || rret;
		}

	}
	if (col-1 >= 0 && go[row][col-1] === anti_color) {
		make_shadow();
		shadow[row][col] = color;
		goFill(row, col-1, anti_color);
		if (!getGo(anti_color)) {
			var rret = recordDeadGo(deadgo);
			ret = ret || rret;
		}

	}
	return ret;
}

/* 紀錄死棋*/
function recordDeadGo(dg) {
	let record = false;
	for (let row = 0; row < shadow.length; row++) {
		for (var col = 0; col < shadow[row].length; col++) {
			if (shadow[row][col] === 7) {
				dg.push([row, col]);
				record = true; // it's true have dead body
				// alert("DEAD: "+(row).toString()+","+col.toString());
			}
		}
	}
	return record;
}
/* 清理死棋*/
function cleanDeadGo(dg) {
	for (let i = 0; i < dg.length; i++) {
		go[dg[i][0]][dg[i][1]] = 0;
		// alert("OUT: "+(dg[i][0]).toString()+","+(dg[i][1]).toString());
	}	
}
/* 提吃判断 */
function getGo(color) {
	for (let i = 0; i < go.length; i++) {
		for (let j = 0; j < go[i].length; j++) {
			if (shadow[i][j] === 7 && go[i][j] !== color) {
				return true; // 活
			}
		}
	}
	// alert("沒有气！！！");
	return false; //死
}
/* 将盘面做个影分身 */
function make_shadow() {
	for (let i = 0; i < go.length; i++) {
		for (let j = 0; j < go[i].length; j++) {
			shadow[i][j] = go[i][j];
		}
	}
}

/* 紅色填充，只操作影分身 */
function goFill(row, col, color) { // color 为当前要填充的颜色
	if (row < 0 || row > 19-1 || col < 0 || col > 19-1)
		return;

	let anti_color = 2;
	if (color === 2)
		anti_color = 1;

	if (shadow[row][col] !== anti_color && shadow[row][col] !== 7) { // 非color颜色，且未被填充
		shadow[row][col] = 7; // 表示已被填充
		goFill(row+1, col, color);
		goFill(row-1, col, color);
		goFill(row, col+1, color);
		goFill(row, col-1, color);
	}
}
/* 周圍有氣 */
function haveAir(row, col) {
	if (row > 0 && row < 19-1 && col > 0 && row < 19-1) { //中央 1->17(0->18)
		if (	go[row+1][col] !== 0 &&
				go[row-1][col] !== 0 &&
				go[row][col+1] !== 0 &&
				go[row][col-1] !== 0 ) {
			// alert("have no air");
			return false;
		} else {
			// alert("have air");
			return true;
		}
	} else if (row === 0 && col > 0 && col < 19-1) { // 上邊
		if (	go[row+1][col] !== 0 &&
				go[row][col+1] !== 0 &&
				go[row][col-1] !== 0 ) {
			// alert("have no air");
			return false;
		} else {
			// alert("have air");
			return true;
		}
	} else if (row === 19-1 && col > 0 && col < 19-1) {//下邊
		if (	go[row-1][col] !== 0 &&
				go[row][col+1] !== 0 &&
				go[row][col-1] !== 0 ) {
			return false;
		} else {
			return true;
		}
	} else if (col === 0 && row > 0 && row < 19-1) {//左邊
		if (	go[row][col+1] !== 0 &&
				go[row+1][col] !== 0 &&
				go[row-1][col] !== 0 ) {
			return false;
		} else {
			return true;
		}
	} else if (col === 19-1 && row > 0 && row < 19-1) {//右邊
		if (	go[row][col-1] !== 0 &&
				go[row+1][col] !== 0 &&
				go[row-1][col] !== 0 ) {
			return false;
		} else {
			return true;
		}
	} else if (row === 0 && col === 0) { // 左上角
		if (	go[row][col+1] !== 0 &&
				go[row+1][col] !== 0) {
			return false;
		} else {
			return true;
		}
	} else if (row === 0 && col === 19-1) {//右上角
		if (	go[row][col-1] !== 0 &&
				go[row+1][col] !== 0) {
			return false;
		} else {
			return true;
		}
	} else if (row === 19-1 && col === 0) {//左下角
		if (	go[row][col+1] !== 0 &&
				go[row-1][col] !== 0) {
			return false;
		} else {
			return true;
		}
	} else if (row === 19-1 && col === 19-1) {//右下角
		if (	go[row][col-1] !== 0 &&
				go[row-1][col] !== 0) {
			return false;
		} else {
			return true;
		}
	}

}
/* 周圍是否有我方的棋子 */
function ourGo(row, col) { 
	if (row > 0 && row < 19-1 && col > 0 && row < 19-1) { //非邊角 1->18
		if (moveCount % 2 === 0) { //未落子前是白
			if (go[row+1][col] === 1 ||
				go[row-1][col] === 1 ||
				go[row][col+1] === 1 ||
				go[row][col-1] === 1 ) {
					// alert("ourGo");
					return true;
			}
		} else {
			if (go[row+1][col] === 2 ||
				go[row-1][col] === 2 ||
				go[row][col+1] === 2 ||
				go[row][col-1] === 2 ) {
					// alert("ourGo");
					return true;
			}
		}
	} else if (row === 0 && col > 0 && col < 19-1) { // 邊
		if (moveCount % 2 === 0) { //未落子前是白
			if (go[row+1][col] === 1 ||
				go[row][col+1] === 1 ||
				go[row][col-1] === 1 ) {
					// alert("ourGo");
					return true;
			}
		} else {
			if (go[row+1][col] === 2 ||
				go[row][col+1] === 2 ||
				go[row][col-1] === 2 ) {
					// alert("ourGo");
					return true;
			}
		}
	} else if (row === 19-1 && col > 0 && col < 19-1) { // 邊
		if (moveCount % 2 === 0) { //未落子前是白
			if (go[row-1][col] === 1 ||
				go[row][col+1] === 1 ||
				go[row][col-1] === 1 ) {
					// alert("ourGo");
					return true;
			}
		} else {
			if (go[row-1][col] === 2 ||
				go[row][col+1] === 2 ||
				go[row][col-1] === 2 ) {
					// alert("ourGo");
					return true;
			}
		}
	} else if (col === 19-1 && row > 0 && row < 19-1) {
		if (moveCount % 2 === 0) { //未落子前是白
			if (go[row+1][col] === 1 ||
				go[row-1][col] === 1 ||
				go[row][col-1] === 1 ) {
					// alert("ourGo");
					return true;
			}
		} else {
			if (go[row+1][col] === 2 ||
				go[row-1][col] === 2 ||
				go[row][col-1] === 2 ) {
					// alert("ourGo");
					return true;
			}
		}
	} else if (col === 0 && row > 0 && row < 19-1) {
		if (moveCount % 2 === 0) { //未落子前是白
			if (go[row+1][col] === 1 ||
				go[row-1][col] === 1 ||
				go[row][col+1] === 1 ) {
					// alert("ourGo");
					return true;
			}
		} else {
			if (go[row+1][col] === 2 ||
				go[row-1][col] === 2 ||
				go[row][col+1] === 2 ) {
					// alert("ourGo");
					return true;
			}
		}
	} else if (row === 0 && col === 0) { // 角
		if (moveCount % 2 === 0) { //未落子前是白
			if (go[row+1][col] === 1 ||
				go[row][col+1] === 1 ) {
					// alert("ourGo");
					return true;
			}
		} else {
			if (go[row+1][col] === 2 ||
				go[row][col+1] === 2 ) {
					// alert("ourGo");
					return true;
			}
		}
	} else if (row === 0 && col === 19-1) { // 角
		if (moveCount % 2 === 0) { //未落子前是白
			if (go[row+1][col] === 1 ||
				go[row][col-1] === 1 ) {
					// alert("ourGo");
					return true;
			}
		} else {
			if (go[row+1][col] === 2 ||
				go[row][col-1] === 2 ) {
					// alert("ourGo");
					return true;
			}
		}
	} else if (row === 19-1 && col === 0) { // 角
		if (moveCount % 2 === 0) { //未落子前是白
			if (go[row-1][col] === 1 ||
				go[row][col+1] === 1 ) {
					// alert("ourGo");
					return true;
			}
		} else {
			if (go[row-1][col] === 2 ||
				go[row][col+1] === 2 ) {
					// alert("ourGo");
					return true;
			}
		}
	} else if (row === 19-1 && col === 19-1) { // 角
		if (moveCount % 2 === 0) { //未落子前是白
			if (go[row-1][col] === 1 ||
				go[row][col-1] === 1 ) {
					// alert("ourGo");
					return true;
			}
		} else {
			if (go[row-1][col] === 2 ||
				go[row][col-1] === 2 ) {
				    // alert("ourGo");
				return true;
			}
		}
	}

	return false;
}


// 真正落子
function goDown(row, col) {
	if (moveCount % 2 === 0) { //未落子前是白
		go[row][col] = 1; //就放黑
	} else {
		go[row][col] = 2;
	}
	moveCount ++;
	moveRecord.push([row, col, moveCount]);	// 記錄順序
}

//初始棋盤
function initBroad() {
	const canvas = document.getElementById('goboard');
	canvas.addEventListener('mousedown', mousedownHandler, false);
	canvas.addEventListener('mousemove', mousemoveHandler, false);
	canvas.addEventListener('mouseout', mouseoutHandler, false);

	const weiqi = document.getElementById('weiqi');
	const ctx = weiqi.getContext('2d');
	ctx.fillStyle = 'black';
	// ctx.fillRect(0,0,900,900);

	createBoard(ctx);
	ninePoints(ctx);

	showGo();
	console.log("show")
}

//監聽
function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			oldonload();
			func();
		}
	}
}
addLoadEvent(initBroad);
addLoadEvent(clickButton);

socket.on('connect',() => {
  console.log(socket.id)
})


