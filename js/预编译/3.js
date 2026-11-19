// var a 
// var b = 2
// function a() {
//   console.log(a);
//   var c = 3
//   var a = b
//   function c() {}
//   console.log(c);
// }
// a()
global = 100
function fn() {
  console.log(global);//100
  global = 200
  console.log(global);//200
  var global = 300
}
// fn()
// var global

// GO:{
//     global:undefined,100,
//     fn:function fn() {},
// }
// AO:{
//     global:undefined,200,300
//     fn:function fn() {},

// }
