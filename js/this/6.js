function foo(){
    let bar=()=>{
        this.a=2
    }
    bar()
}
let obj={
    a:1,
    baz:foo
}
obj.baz()
console.log(obj)
// 2

