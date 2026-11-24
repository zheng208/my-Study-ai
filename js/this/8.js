// const user = {
//   name: '小明',
//   say() {
//     const inner = () => this.name   // 箭头：用 say 的 this
//     return inner()
//   }
// }

// console.log(user.say())   // 小明
const bad = {
  name: 'bad',
  say: () => this === bad
}

console.log(bad.say())   // false