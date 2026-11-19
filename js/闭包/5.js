function foo() {
  var myname = '宏宏'
  let test1 = 1
  const test2 = 2
  var innerBar = {
    getName: function() {
      console.log(test1);
      return myname
    },
    setName: function(name) {
      myname = name
    }
  }
  return innerBar
}
var bar = foo()
bar.setName('刘少')
bar.getName()
console.log(bar.getName());