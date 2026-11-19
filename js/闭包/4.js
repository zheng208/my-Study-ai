function bar() {
  var myname = '曹老板'
  let test1 = 100
  if (1) {
    let myname = '邢同学'
    console.log(test1);
  }
}

function foo() {
  var myname = '煌煌'
  let test = 2
  {
    let test = 3
    bar()
  }
}
var myname = '付总'
let myage = 18
let test = 1
foo()