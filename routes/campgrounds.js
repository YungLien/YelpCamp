const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground'); // model: campground.js // ./ 表示「從當前檔案所在的資料夾開始」，也就是 app.js 所在的 yelpcamp 資料夾。
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer'); //handling multipart/form-data
const { storage } = require('../cloudinary');
const upload = multer({ storage });
// const upload = multer({ dest: 'uploads/' }) //storage to local 


router.route('/')
    // GET 用於讀取資料，不會對伺服器的資料進行任何改變。
    .get(catchAsync(campgrounds.index))
    // make a new campground
    // POST 用於新增資料，會對伺服器的資料進行更改。
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
//new.ejs 上傳照片的input name //array上傳多個檔案, single上傳一個


// 顯示新增營地的表單 (New Route)
// 注意: 這個路由必須在 `/:id` 之前，否則 Express 會將 `new` 視為 `:id` 處理
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    // 獲取單個營地的詳細資訊 (Show Route)
    .get(catchAsync(campgrounds.showCampground))
    // 使用 PUT 方法來更新現有的營地資料
    // 更新指定的營地 (Update Route)
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    // 刪除指定的營地 (Delete Route)
    // 使用 DELETE 方法來刪除特定的營地
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


// 顯示編輯營地的表單 (Edit Route)
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
module.exports = router;