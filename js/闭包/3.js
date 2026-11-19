function foo(){
    var myage=18
    let height=1.8

    function bar(){
        console.log(myage);
    }
    return bar
}
var baz=foo()