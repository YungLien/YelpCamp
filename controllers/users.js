const User = require('../models/user')

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username }); //// 建立新使用者 (但不包含密碼)
        // `User.register()` 是來自 `passport-local-mongoose` 的方法，會自動雜湊密碼並存入資料庫
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp-Camp');
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register')

    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    // Now we can use res.locals.returnTo to redirect the user after login
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';  // 若有 returnTo，就導向原本的頁面，否則回到 `/campgrounds`
    res.redirect(redirectUrl);

}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) { // Passport.js 提供的登出方法
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully log out');
        res.redirect('/campgrounds');
    });

}