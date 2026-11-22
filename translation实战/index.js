// js中还专门提供了一块能力，用于和html中的元素进行交互

//1. 监听翻译按钮的点击事件 
let translateBtn = document.getElementById('translateBtn')

translateBtn.addEventListener('click', function () {
  console.log('用户点击了翻译按钮')
})