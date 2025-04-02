//(Server)
// 創建一個 Express 應用，處理客戶端的請求與伺服器的回應
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

console.log(process.env.SECRET)
console.log(process.env.API_KEY)


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate'); //可以建造模板, 讓其他ejs套用重複的地方 //boilerplate.ejs
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError'); //ExpressError 是一個 自訂的錯誤類別，用來處理 Express 中的錯誤。
const methodOverride = require('method-override'); //form可以用除了get, post以外的方法,如：delete,put
const { resolveAny } = require('dns');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users')

const Campground = require('./models/campground'); // model: campground.js // ./ 表示「從當前檔案所在的資料夾開始」，也就是 app.js 所在的 yelpcamp 資料夾。
const Review = require('./models/review'); //review model: review.js
const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
// 這行告訴 Express EJS 模板檔案 (.ejs) 存放在哪個資料夾。
//__dirname 代表目前執行的 JavaScript 檔案 (app.js) 所在的目錄（也就是 YelpCamp）。


// to parse in the req.body
app.use(express.urlencoded({ extended: true }));
// to use override to set the put,delete, patch request
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,

    }
}
// session() always before passport.session()
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



// use the router
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home')
})



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})


//error handler
//Express 的錯誤處理中間件，用於處理應用中的任何錯誤。
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err; // 如果 err 沒有 statusCode，則預設為 500（內部伺服器錯誤）
    if (!err.message) err.message = 'Oh no! Something went wrong!'; // 如果 err 沒有 message，設置一個預設訊息
    res.status(statusCode).render('error', { err }); // 將 err 傳遞給模板
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

