// let fu= {
//     a:1
// }
// function yang(x,y){ //new Function()
//     console.log(this.a)
// }
// yang.call(fu,1,2)// 把函数中的this强行掰弯到对象中
// // 1,3

// let obj={
//     a:2
// }
// function yang(x,y){
//     console.log(this.a,x+y)
// }
// yang.apply(obj,[1,2])
// // 2,3

let obj2={
    a:3
}
function yang(x,y){
    console.log(this.a,x+y)
}
let foo=yang.bind(obj2,2)
foo(2,3)
// 3,5