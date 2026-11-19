function add(){
  let i=0;
  return function(){
    i++;
    return i
  }
}
var add1=add()
console.log(add1());
console.log(add1());
console.log(add1());



