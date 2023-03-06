const users = [];

//加入聊天
function userJoin (id, username) {
    const user ={id , username};

    users.push(user);

    return user
}

//目前使用者
function getCurrentUser (id) {
    return users.find(user => user.id === id);
}

//離開聊天
function userLeave (id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index , 1)
    }
}


module.exports = { userJoin , getCurrentUser , userLeave}