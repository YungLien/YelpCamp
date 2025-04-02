// (Seed File)
// check our database
// 建立一個種子檔案，將隨機生成的範例資料插入 MongoDB 的資料庫中
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const mongoose = require('mongoose');
const Campground = require('../models/campground'); // ../ 表示「從當前檔案所在的資料夾往上一層」，也就是從 seeds 資料夾返回到根目錄 yelpcamp。



mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected');
});

//pick a random element from an array
// sample 是一個函數，用於從陣列中隨機選擇元素，讓程式碼更簡潔、可重用
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({}); // 清空資料庫
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            // your user ID
            author: '67ce75b5882d70b0c8c527ba',
            //city, states
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Here is the description for the campground ....',
            price,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude,
                ]
            },
            images: [

                {
                    url: 'https://res.cloudinary.com/dxmlz8bvo/image/upload/v1742550044/YelpCamp/lhwes9ol21iujbsg5537.avif',
                    filename: 'YelpCamp/lhwes9ol21iujbsg5537'
                },
                {
                    url: 'https://res.cloudinary.com/dxmlz8bvo/image/upload/v1742550045/YelpCamp/pza2slvmrwncbdz9qkwx.avif',
                    filename: 'YelpCamp/pza2slvmrwncbdz9qkwx'
                }
            ],

        })
        await camp.save();
    }
}
// 每次執行 seedDB，會先清空資料庫，然後新增 50 筆隨機資料
seedDB().then(() => {
    console.log('Seed data inserted');
    db.close(); // 關閉資料庫連接
});