const n=123 //new Number(123)
n.a=2 //正在往Number对象上添加一个属性a ，但是Number对象是原始数据类型，不能添加属性，只能添加方法 被删了

console.log(n)// 123//读取的是primitiveValue 123
