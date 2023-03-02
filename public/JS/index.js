const login = document.getElementById("login")
const register = document.getElementById("register")

const login_email = document.getElementById("login_email")
const login_password = document.getElementById("login_password")
const login_button = document.getElementById("login_button")
const login_change = document.getElementsByClassName("login_change")[0]
const login_msg = document.getElementById("login_msg")

const register_name = document.getElementById("register_name")
const register_email= document.getElementById("register_email")
const register_password= document.getElementById("register_password")
const register_button= document.getElementById("register_button")
const register_change = document.getElementsByClassName("register_change")[0]
const register_msg = document.getElementById("register_msg")

// 登入按鈕
login_button.addEventListener("click", function () {  
    logSystem()
})
// 切換至註冊表單
login_change.onclick=function(){
    // login_change.classList.add("text_color")
    register.classList.remove("hide")
    login.classList.add("hide")
    login_email.value=""
    login_password.value=""
    login_msg.textContent=""

}
// 切換至登入表單
register_change.onclick=function(){
    register_change.classList.add("text_color")
    login.classList.remove("hide")
    register.classList.add("hide")
    register_name.value=""
    register_email.value=""
    register_password.value=""
    register_msg.textContent=""

}

//登入系統驗證
function logSystem() {
    if (login_email.value===""|| login_password.value===""){
        login_msg.textContent= "尚有欄位未輸入"
        login_msg.style.color = "#e08272"
    }else{
        fetch(`/user/auth`, {
            method: "PUT",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
                email: login_email.value,
                password: login_password.value,
            })
        }).then(function (response) {
            return response.json()
        }).then(function (data) {
            if(data["ok"]){
                location.href='/home'
            }else{
                login_msg.textContent = data["message"]
                login_msg.style.color = "#e08272"
            }

        }).catch(function (err) {
            console.log("錯誤訊息", err)
        })
    }
}



// 監聽註冊按鈕
register_button.addEventListener("click", function () {  
    registerSystem()
})

// 註冊系統驗證
function registerSystem() {

    register_msg.style.color = "#e08272"
    //  姓名:輸入2-10位中文或英文
    const register_name_verify=/^[\u4e00-\u9fa5a-zA-Z]{2,12}$/.test(register_name.value)
    //  信箱:符合信箱的格式
    const register_email_verify = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/.test(register_email.value)
    //  密碼:5-8位英數字(至少包含一個字母)
    const register_password_verify = /^(?=.*[A-Za-z])\w{8,12}$/.test(register_password.value)
    if (register_name.value === ""|| register_email.value === ""|| register_password.value === ""){
        register_msg.textContent= "尚有欄位未輸入"
    }else if(register_name_verify === false){
        register_msg.textContent= "姓名需為2-12字元的中文或英文"
    }else if(register_email_verify === false){
        register_msg.textContent= "信箱格式錯誤"
    }else if(register_password_verify === false){
        register_msg.textContent= "密碼需為8-12字元的英文或數字,至少有一個英文字母"
    }else{
        fetch(`/user`, {
            method: "POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
                name: register_name.value,
                email: register_email.value,
                password: register_password.value,
            })
        }).then(function (response) {
            return response.json()
        }).then(function (data) {
            if(data["ok"]){
                registerSuccess()
            }else{
                register_msg.textContent = data["message"]
            }

        }).catch(function (err) {
            console.log("錯誤訊息", err)
        })
    }
}
// 註冊成功：導向登入視窗
function registerSuccess(){
    register_msg.textContent = "註冊成功！請登入帳號"
    register_msg.style.color = "#a49f95"
    setTimeout(() => {
        login_msg.textContent= "歡迎登入go-tofriend"
        login_msg.style.color = "#a49f95"
        register.classList.add("hide")
        login.classList.remove("hide")
    }, 2000);
}
