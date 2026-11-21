var str='hello'//`hello` new String('hello')
str.a=2//正在往字符串对象上添加一个属性a
//str是原始数据类型，不能添加属性，只能添加方法
console.log(str)//不报错，读取的是primitiveValue
console.log(str.a)// undefined
console.log(str.length)//5//length在String.prototype上

//1. 只要涉及读取str，就会发现有primitiveValue