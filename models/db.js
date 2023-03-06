const dotenv = require('dotenv');
const path = require('path');
const mysql = require('mysql2');


dotenv.config({
  path: path.join(__dirname, '../.env')
})

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // 無可用連線時是否等待pool連線釋放(預設為true)
    waitForConnections : true,
    // 連線池可建立的總連線數上限(預設最多為10個連線數)
    connectionLimit : 10,
})
const connectionPool = pool.promise();

const secret = process.env.JWT_SECRET;

//確認email有沒有重複
async function emailExist(email){
  const [rows] =  await connectionPool.query('SELECT email FROM member WHERE email = ?', email);
  // console.log(rows)
  const result = true
 
  // 如果有重複的email
  if (rows.length >= 1) {
    return result;
  } 
}

//註冊資料填入資料庫
async function register(memberData) {
  let result = {};
  try{
    await emailExist(memberData.email);
    const resultData = await connectionPool.query('INSERT INTO member SET ?', memberData)
    console.log(resultData) ;
    result = memberData;
  }catch(err){
    console.error(err);
    throw new Error(err.message);
  }
  return result
}

async function login(memberData) {
  let rows = [];
  try{
    // 登入時確認是否有資料
    const resultData = await connectionPool.query('SELECT * FROM member WHERE email = ? ', memberData.email)
    // console.log(resultData,55)
    rows = resultData[0]
    console.log(rows)
  return rows
  }catch(err){
    console.error(err);
    throw new Error(err.message);
  }      
 
  
}




module.exports = {register , emailExist, login  ,secret}



