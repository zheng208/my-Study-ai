function bar(){
    console.log(myname)

}
function foo(){
    var name = 'foo'
    bar()
}
var myname = 'global'
foo()