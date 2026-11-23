//const arr = []

//const arr=new Array(10).fill(0)//创建一个10个元素的数组，每个元素都为0
// const arr=new Array(10).fill(new Array(10).fill(0))//创建一个10*10的数组，每个元素都为0
// arr[3][3]=1
var isValid = function(s) {
  const obj = {
    '(': ')',
    '[': ']',
    '{': '}',
  }
  const stack = []
  for (let i = 0; i < s.length; i++) {
    let item = s[i]  // '}'
    if (item in obj) {  // 是对象中的一个key 
      stack.push(item)
    } else {  // 右括号
      if (obj[stack.pop()]  !== item) {
        return false
      }  
    }
  }

  return stack.length === 0
};