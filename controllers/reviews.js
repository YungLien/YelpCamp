const Campground = require('../models/campground')
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    //catchAsync() 是一個自訂的錯誤處理函數，確保 async 函數中的錯誤能夠被捕獲，而不會讓 Express 服務崩潰。
    //內部的 async 函數允許我們使用 await 來處理資料庫操作。

    const campground = await Campground.findById(req.params.id); // 取得對應 ID 的營地
    const review = new Review(req.body.review); //make a new review // 用請求中的 `review` 資料來建立新的 Review

    //campground.reviews 存的不是 Review 的完整數據，而是 Review 的 ObjectId
    review.author = req.user._id;  // 設定評論的作者為目前登入的使用者
    campground.reviews.push(review); // 將這則評論的 ID 加入到 Campground 的 `reviews` 陣列中
    await review.save();
    await campground.save(); // 儲存更新後的營地 (確保評論 ID 存入 `reviews` 陣列)
    req.flash('success', 'successfully create a new review');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params; // 從 URL 取得 `campground id` 和 `review id`
    // 使用 `$pull` 運算子，從 Campground 的 `reviews` 陣列中移除這則評論的 ID
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'successfully delete a review');
    res.redirect(`/campgrounds/${id}`)
}