function foo(str){
    eval(str);//var b=2;让原本不属于foo函数作用域的变量b，变成了foo函数作用域的变量
    console.log(b);
}

let a=1;
foo('var b=2');
