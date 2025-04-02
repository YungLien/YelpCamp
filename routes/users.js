const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user')
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users')

router.route('/register')
    //顯示註冊表單 (Register Page)
    .get(users.renderRegister)
    //處理註冊請求 (Register Logic)
    .post(catchAsync(users.register))

router.route('/login')
    // 顯示登入表單 (Login Page)
    .get(users.renderLogin)
    // 處理登入請求 (Login Logic)
    .post(storeReturnTo,
        // use the storeReturnTo middleware to save the returnTo value from session to res.locals
        // passport.authenticate logs the user in and clears req.session
        // `passport.authenticate('local')` 使用本地登入策略，若登入失敗則顯示錯誤訊息並重新導向登入頁面
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

// 登出 (Logout)
router.get('/logout', users.logout)

module.exports = router;