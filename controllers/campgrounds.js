const Campground = require('../models/campground'); // model: campground.js // ./ 表示「從當前檔案所在的資料夾開始」，也就是 app.js 所在的 yelpcamp 資料夾。
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const { cloudinary } = require('../cloudinary')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({}); //查詢所有的營地資料
    res.render('campgrounds/index', { campgrounds }) //回傳資料給 index.ejs，並將資料作為 campgrounds 傳遞給模板
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    // by default, req.body is empty!!!
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    await campground.save(); // 將新資料保存到資料庫
    console.log(campground);
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`) // 重定向到新營地的頁面

}

module.exports.showCampground = async (req, res) => {
    // const { id } = req.params;
    // 根據 id 查詢對應的營地，並使用 populate 來載入關聯的 reviews 和 author
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    // 渲染 show.ejs，並傳遞查詢到的 campground 資料
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    // 渲染 edit.ejs，並傳遞查詢到的 campground 資料
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    // 使用 findByIdAndUpdate 來更新資料庫中的營地
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    campground.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs)
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await campground.save();
    req.flash('success', 'successfully update campground');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    // 在資料庫中刪除該營地
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully delete campground');
    res.redirect('/campgrounds');
}