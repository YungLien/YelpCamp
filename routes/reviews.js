const express = require('express');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas');
const Campground = require('../models/campground');
const Review = require('../models/review');
const router = express.Router({ mergeParams: true }); //讓 router 可以存取來自 app.js 的 :id 參數。(Campground ID)
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews')


// 新增評論 (Create Review Route)
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

// 刪除評論 (Delete Review Route)
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))


module.exports = router;