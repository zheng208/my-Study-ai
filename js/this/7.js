//Child.prototype.__proto__===Object.prototype  //  //new Object()
//Object.prototype.__proto__===null
function Child(){
    this.lastName='张'

}
let c=new Child()
// c.__proto__===Child.prototype
// c.__proto__.__proto__===Object.prototype
// c.__proto__.__proto__.__proto__===null
console.log(c.toString()) //'[object Object]'
Child()