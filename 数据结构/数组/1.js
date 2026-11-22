let arr=[1,2,3,4,5]
arr.unshift(0)
arr.shift()
arr.push(6)
arr.pop()
let deleted=arr.splice(2,1)
arr.splice(2,0,7,8)//在索引2位置插入7,8两个元素


console.log(arr)