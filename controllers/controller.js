const db = require('../models/db');
const membercheck = require('./check');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

check = new membercheck();

module.exports = class Member {
    async postRegister(req, res, next) {
            
        try{
            const email = await check.checkEmail(req.body.email);
            // 不符合email格式
            if (email === false) {
                res.status(400).json({
                    error: true,
                    message:'請輸入正確的Eamil格式'
                })
                return;
            } 
            
            // 檢查是否已有相同的 email
            const existingMember = await db.emailExist(req.body.email);
            if (existingMember) {
                res.status(400).json({
                    error: true,
                    message:'Email 已被使用過'
                })
                return;
            }
            
            // 將密碼進行 hash
            const hashPassword = await bcrypt.hash(req.body.password, 10)
            console.log(hashPassword)
            // 獲取client端資料
            const memberData = {
                name: req.body.name,
                email: req.body.email,
                password: hashPassword,
                create_date: onTime()
            }

            // 寫入資料庫
            const result = await db.register(memberData);
            
            // 若寫入成功則回傳
            res.status(200).json({
                ok: true,
                result: result 
            });
            
        } catch (err) {
                console.error(err,53)
                // 若寫入失敗則回傳
                res.status(500).json({
                    error: true,
                    message: '伺服器內部錯誤'
                });
        }
    }
    async postLogin(req, res) {
        try{
            const memberData = {
            email: req.body.email,
            password: req.body.password
            };
            const rows  = await db.login(memberData);

            if (rows.length === 0) {
            res.status(400).json({
                error: true,
                message:'請輸入正確的帳號或密碼'
            });
           
            } else {
            const encrypted_password = rows[0].password;
            const beHashPassword = await bcrypt.compare(memberData.password, encrypted_password)
            console.log(beHashPassword)
            if (beHashPassword) {
                // 產生token
                const token = jwt.sign({
                    // algorithm: 'HS256',
                    payload: {
                        id:rows[0].id ,
                        name:rows[0].name ,
                        email:rows[0].email
                    }
                }, process.env.SECRET);
                // 存儲 token 到 cookie
                res.cookie('access_token', token, {
                    maxAge: 60 * 60 * 24 * 7, // token有效期為七天
                    httpOnly: true
                });
                // res.setHeader('token', token);

                res.status(200).json({
                    ok: true,
                    result:  '歡迎 ' + rows[0].name + ' 的登入！',
                })
            }else {
                res.status(400).json({
                    error: true,
                    message:'請輸入正確的帳號或密碼'
                });
            }
       
            }
        }catch (err) {
            console.error(err,53)
            // 若寫入失敗則回傳
            res.status(500).json({
                error: true,
                message: '伺服器內部錯誤'
            });
        }
    }
    async getLogin(req, res) {
        try{
            const cookies = req.cookies.access_token;
            if (!cookies) {
                return res.status(400).json({ data: null });
            }else{
                const memberData =jwt.verify(cookies,process.env.SECRET);
                console.log(memberData)
                return res.status(200).json({ data: memberData });
            }
        }catch (err) {
            console.error(err);
            return res.status(500).json({ 
                error: true, 
                message: '伺服器內部錯誤' 
            });
        }
    }
    async deleteLogout(req, res){
        try{
            return res
              .clearCookie('access_token')
              .status(200)
              .json({ ok: true});
        }catch (err) {
            console.error(err);
            return res.status(500).json({ 
                error: true, 
                message: '伺服器內部錯誤' 
            });
        }
    };
}
// if (check.checkNull(rows) === false)  
//取得現在時間，並將格式轉成YYYY-MM-DD HH:MM:SS    
const onTime = () => {
    const date = new Date();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const hh = date.getHours();
    const mi = date.getMinutes();
    const ss = date.getSeconds();

    return [date.getFullYear(), "-" +
        (mm > 9 ? '' : '0') + mm, "-" +
        (dd > 9 ? '' : '0') + dd, " " +
        (hh > 9 ? '' : '0') + hh, ":" +
        (mi > 9 ? '' : '0') + mi, ":" +
        (ss > 9 ? '' : '0') + ss
    ].join('');
};


