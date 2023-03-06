const logout = document.getElementById("logout");
const players = document.getElementById("players");
const welcome = document.getElementById("welcome");
const no = document.getElementById("no");
const yes = document.getElementById("yes");
const inviteno = document.getElementById("invite-no");
const inviteyes = document.getElementById("invite-yes");

// 創建一個 WebSocket 連接
const socket = io.connect('/room');
// 生成一個唯一的 room ID，可用 uuid 等庫來生成
const roomID = 'room_' + Math.random().toString(36);
console.log(roomID)


// 記錄在線使用者
let onlineUsers = [];
// 更新上線用戶
function updateOnlineUsers(users) {
    users.forEach(function(user) {
    // 檢查使用者是否已存在
    if (!onlineUsers.includes(user)) {
            let userNameDiv = document.createElement("div");
            userNameDiv.classList.add("name");
            userNameDiv.textContent = user;
            players.appendChild(userNameDiv);
            onlineUsers.push(user);

            // 當使用者點擊某個玩家的名稱時
            userNameDiv.addEventListener("click", function () {
                document.querySelector(".invite").classList.add("show_block");

                //邀請
                inviteno.addEventListener("click", function () {
                    document.querySelector(".invite").classList.remove("show_block");
                    let playerName = this.textContent;
                    let roomNumber = roomID; // 假設這裡是你想要進入的房間號
                    socket.emit("requestEnterRoom", { playerName: playerName, roomNumber: roomNumber });

                });  
                inviteyes.addEventListener("click", function () {
                    document.querySelector(".invite").classList.remove("show_block");
                    location.href='/gogame'
                });  
                
                // 監聽後端回傳的結果
                socket.on("responseToInvitation", function(data) {

                    if (data.accept) {
                        // 玩家要邀請進入房間
                        document.querySelector(".askcontainer").classList.remove("show_block");

                    } else {
                        // 玩家不要邀請進入房間
                        document.querySelector(".askcontainer").classList.remove("show_block");
                    }
                });
                // let playerName = this.textContent;
                // let roomNumber = roomID; // 假設這裡是你想要進入的房間號
                // socket.emit("requestEnterRoom", { playerName: playerName, roomNumber: roomNumber });
            });
        }
    })
    
}

// 點擊離開大廳網頁會導回首頁
logout.addEventListener("click", function () {
    fetch(`/user/auth`, {method: 'DELETE'})
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        if(data["ok"]){
            location.href='/'
        }
    })
    .catch(function (err){
    console.log("錯誤訊息",err)
    })
})
 
function joinHome() {
    fetch(`/user/auth`)
    .then(function (response) {
        return response.json();
    }).then(function (data) {
        if (data["data"]!=null){
            const userName = data.data.payload.name;
            console.log(userName);

            // 儲存使用者名字到 Cookie 中
            document.cookie = `username=${userName}`

            let userNameDiv = document.createElement("div");
            userNameDiv.classList.add("name");
            userNameDiv.textContent = userName;

             // 檢查使用者是否已存在
            if (!onlineUsers.includes(userName)) {
              players.appendChild(userNameDiv);
              onlineUsers.push(userName);
            }

            welcome.textContent=("歡迎，"+userName);

            // 向後端发送 join 事件
            socket.emit("new_user", {
                userName: userName,
            });
            console.log({
                userName: userName,
            })
        }
    }).catch(function (err) {
        console.log("錯誤訊息", err.message)
    });
}

joinHome()

socket.on("online_users", function (users) {
    console.log("更新上限用戶", users);
    updateOnlineUsers(users);
    
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    // 將離開的使用者從 onlineUsers 中刪除
    onlineUsers = onlineUsers.filter(user => user !== socket.username);
    
    // 廣播當前的 onlineUsers
    roomNamespace.emit('online_users', onlineUsers);
  });
  
  
  socket.on("new_user", (data) => {
    console.log(`${data.userName} 加入了房間 `);
  
    // 將新使用者加入到 onlineUsers 中
    onlineUsers.push(data.userName);
  
    // 廣播當前的 onlineUsers
    roomNamespace.emit('online_users', onlineUsers);
  });
  



socket.on("invitationToEnterRoom", function(data) {
    console.log(data)
    document.querySelector(".askcontainer").classList.add("show_block");
    // 在此處處理收到的 "invitationToEnterRoom" 事件和數據
    // data 是一個 JavaScript 物件，包含了後端傳送過來的數據
    // 例如，可以通過 data.roomNumber 獲取房間號
});
// //邀請
// inviteno.addEventListener("click", function () {
//     document.querySelector(".invite").classList.remove("show_block");
// });  
// inviteyes.addEventListener("click", function () {
//     document.querySelector(".invite").classList.remove("show_block");
// });   
  

//監聽意願
no.addEventListener("click", function () {
    document.querySelector(".askcontainer").classList.remove("show_block");
});
yes.addEventListener("click", function () {
    document.querySelector(".askcontainer").classList.remove("show_block");
    location.href='/gogame'
});




// // 監聽是否有其他使用者發出邀請
// socket.on('request_game', function(data) {
//   // 確認收到的 roomID 與本地的 roomID 是否相符
//   if (data.roomID === roomID) {
//     // 顯示一個提示框，詢問是否願意接受邀請
//     if (confirm(`${data.userName} 邀請你一起下棋，是否接受？`)) {
//       // 若接受邀請，則進入/gogame頁面，並將 roomID 傳遞到該頁面
//       location.href = `/gogame?roomID=${roomID}`;
//     }
//   }
// });
