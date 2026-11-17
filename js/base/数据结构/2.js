let obj={
    name:"张三",
    age:18,
    sex:"男",
    //对象可以嵌套对象
    address:{
        city:"北京",
        street:"东城区"
    }
}
console.log(obj);

let arr=['张三',18,'男'] //new Array()

//数组 array 有序的集合
arr.push('北京')
//数组可以嵌套数组
arr.push(['东城区','西城区'])
arr.unshift('hello') //在数组的开头添加一个元素多个元素
// arr.pop() //删除数组的最后一个元素
// arr.shift() //删除数组的第一个元素
// arr.splice(2,1) //删除数组的第3个元素
// arr.splice(2,2) //删除数组的第3个元素到第4个元素
console.log(arr);

