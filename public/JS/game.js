var game = document.querySelector('#game')

var socket = io('ws://localhost:3000')

function login(username) {
  socket.emit('login', username)
}

// 玩家登陆成功
socket.on('home', function (data) {
  if (data.flag) {
	game.contentWindow.flag.hidden = false
  } else {
	game.contentWindow.flag.hidden = true
	localStorage.setItem('name', data.name)
	localStorage.setItem('playerCount', data.playerCount)
	// location.href = './home.html'
	game.src = 'home.html'
  }
})


// 玩家太少了，人不够
socket.on('player less', function () {
  game.contentWindow.flag.style.display = 'block'
  game.contentWindow.loader.hidden = true
})

function play() {
  socket.emit('play')
}

socket.on('play', function (data) {
  localStorage.setItem('color', data.color)
  localStorage.setItem('player2', data.name)
  game.src = 'gobang-ui.html'
})

function clearPlay() {
  socket.emit('clearPlay')
}

function add_pieces(data) {
  socket.emit('data', data)
}

socket.on('addPieces', function (data) {
  game.contentWindow.add_pieces(data.position, data.color)
  if (data.color === localStorage.getItem('color')) {
	game.contentWindow.showSleep(true)
  } else {
	game.contentWindow.showSleep(false)
  }
})

socket.on('result', function (data) {
  // game.contentWindow.result(data)
  alert(data)
  game.src = 'gobang-ui.html'
})