// js中还专门提供了一块能力，用于和html中的元素进行交互

//1. 监听翻译按钮的点击事件 
let translateBtn = document.getElementById('translateBtn')

translateBtn.addEventListener('click', function () {
  // 1. 获取用户输入的文本
  let inputText = document.getElementById('input').value
  //翻译的目标语言
  let targetLang = document.getElementById('tgtLang').value
  document.getElementById('output').textContent = '翻译中...'
  // 2. 将用户输入的文本传输给ollama中的deepseek—r1
  //在js中发送http请求给http://localhost:11434/api/chat
  fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-r1:7b',
      messages: [
        {
          role: 'system',
          content: `你是一个专业的翻译,擅长将一种语言翻译成'${targetLang}'语言，只返回最简单的翻译结果，不带任何解释，也不要带换行符`
        },
        {
          role: 'user',
          content: inputText
        }
      ],
      stream: false// 是否开启流式返回
    })
  }).then(res => res.json()).then(data => {
    console.log(data.messages.content)
    // 4. 处理翻译结果，去掉换行符
    data.messages.content = data.messages.content.replace(/\n/g, '')
    // 3. 将翻译结果展示在页面上
    document.getElementById('output').value = data.messages.content
  })






//   function foo() {}
//   var foo=function() {}
//   let foo=()=>{} // 箭头函数

})