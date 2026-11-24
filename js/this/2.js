// var a=1

// function foo(){
//     var a=2
//     console.log(this.a)//1
// }
// foo()

var a=1
function foo(){
    var a=2
    Bar()
}
function Bar(){
    var a=3
    console.log(this.a)//2
}
foo()