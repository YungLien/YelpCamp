// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'

    // 找到所有擁有 'validated-form' class 的表單
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) { // 如果表單驗證不通過
                event.preventDefault() // 阻止提交
                event.stopPropagation() // 阻止事件冒泡
            }

            form.classList.add('was-validated') // 加上 Bootstrap的驗證樣式,加上 was-validated class
        }, false)
    })
})()
