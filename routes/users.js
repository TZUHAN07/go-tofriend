const express = require('express');
const router=express.Router();


//註冊會員
router.post('/', function(req, res, next) {
    console.log(req.body.test)
      
});

module.exports = router;