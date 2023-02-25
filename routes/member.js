const express = require('express');
const router=express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // 解析 application/json
router.use(bodyParser.urlencoded({ extended: true })); // 解析 application/x-www-form-urlencoded

const MemberModifyMethod = require('../controllers/controller');
memberModifyMethod = new MemberModifyMethod();
router.post('/user',memberModifyMethod.postRegister);
router.put('/user/auth', memberModifyMethod.postLogin);
router.get('/user/auth', memberModifyMethod.getLogin);
router.delete('/user/auth', memberModifyMethod.deleteLogout);

module.exports = router;

