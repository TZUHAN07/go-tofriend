const users = [];

//加入聊天
function userJoin (id, username) {
    const user ={id , username};

    users.push(user);

    return user
}

//目前使用者
function getCurrentUser (id) {
    const user = users.find(user => user.id == id);
    if (!user) {
        // 如果找不到符合給定 id 的使用者，回傳一個預設的使用者物件
        return { username: 'unknown' };
        // 或者拋出一個錯誤
        // throw new Error('User not found');
      }
      return user;
}

//離開聊天
function userLeave (id) {
    const index = users.findIndex(user => user.id == id);

    if(index !== -1){
        return users.splice(index , 1)
    }
}


module.exports = { userJoin , getCurrentUser , userLeave}