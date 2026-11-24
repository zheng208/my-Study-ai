Person.prototype.sports='running'
function Person(){
// new 原理
// let obj={}//1
// Person.call(obj)//2

    this.name='杨总'//3 执行构造函数体，将this指向新创建的对象
    this.age=18
// 4 obj.__proto__=Person.prototype
// return obj//5
}

let p=new Person()
console.log(p)
// Person {name: '杨总', age: 18}