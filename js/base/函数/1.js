//函数
function fn(){
    console.log("hello world");
}
function add(a,b){
    return a+b;
}
console.log(add(1,2));
 
let obj={
    name:"张三",
    age:18,
    sex:"男"
}
function showInfo(obj){
    console.log('姓名：'+obj.name);
    console.log('年龄：'+obj.age);
    console.log('性别：'+obj.sex);
}
showInfo(obj);
