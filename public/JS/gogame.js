const socket = io('http://localhost:3000');
const canvas = document.getElementById('goboard');

//棋盤
window.onload = function() {
    // canvas.width = 1140;
    // canvas.height = 1140;
    const ctx = canvas.getContext('2d');
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


//開始下棋

socket.on('connect',() => {
  console.log(socket.id)
})
