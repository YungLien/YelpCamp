module.exports = func => {
    return (req, res, next) => { //new function
        func(req, res, next).catch(next);
    }
}

//func 是什麼？

// func 是我們要包裝的異步函數（例如你在 app.post('/campgrounds') 中傳入的 async (req, res, next) => { ... }）。
// 換句話說，func 是一個路由處理函數（handler）。

//func(req, res, next) 會返回一個 Promise，因為 func 是 async 函數。

//.catch(next)
// 如果 Promise 被拒絕（發生錯誤），catch(next) 會捕捉到錯誤，並調用 next(err)。
// Express 的錯誤處理中間件會自動接收這個 next(err)，處理錯誤。