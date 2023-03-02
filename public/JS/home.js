const logout = document.getElementById("logout")

// 點擊離開大廳網頁會導回首頁
logout.addEventListener("click", function () {
    fetch(`/user/auth`, {method: 'DELETE'})
    .then(function (response){
        return response.json()
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