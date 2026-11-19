# 一篇文章讲透 JS 预编译：AO、GO 与变量提升

> 本文所有代码均在 Node v24.16.0 下实测，文中的输出就是真实运行结果，可以直接复制到浏览器控制台复现（个别处会标注 Node 与浏览器的差异）。

## 零、先看一道题

```js
function foo(a, b) {
  console.log(b);      // ①
  c = 0;
  var c;
  a = 3;
  b = 2;
  console.log(b);      // ②
  function b() {}
  console.log(b);      // ③
}
foo(1);
```

如果你觉得 ① 应该打印 `undefined`，那这篇就值得看完——它实际打印的是 `[Function: b]`。

```
[Function: b]
2
2
```

`b` 明明是个形参，传参时根本没传值，凭什么在函数第一行就能拿到一个函数？

答案就四个字：**预编译**。

---

## 一、JS 不是"读一行、执行一行"

很多人对 JS 的第一印象是"解释型语言，从上到下一行行跑"。这句话只对了一半：**在执行任何一行代码之前，引擎会先把当前作用域里的声明都扫一遍，登记进一个对象里。**

所以一次脚本运行其实是两个阶段：

| 阶段 | 干什么 | 你能观察到什么 |
| --- | --- | --- |
| ① 创建阶段（预编译 / 实例化） | 创建执行上下文，扫描 `var`、`function` 等声明，登记名字 | 变量"提前"存在了，函数"提前"可调用 |
| ② 执行阶段 | 逐行执行，赋值、计算、打印 | 你写的代码真正生效 |

**"预编译"是国内教程的叫法，规范里没这个词。** 它在规范里对应的动作是：

- 全局代码：`GlobalDeclarationInstantiation`
- 函数代码：`FunctionDeclarationInstantiation`（[ECMA-262 §10.2.11](https://tc39.es/ecma262/#sec-functiondeclarationinstantiation)）

而 V8 的实现里，函数体是**惰性解析**的：只有第一次被调用时，才完整解析并编译成字节码（[V8 官方博客：Blazingly fast parsing, part 2](https://v8.dev/blog/preparser)）。这解释了一个新手常有的困惑：

```js
function foo() {
  console.log("我不会执行");
}
// 只要不调用 foo，函数体里的任何代码都不会跑，也不会报错
```

函数级"预编译"发生在**调用前一刻**，而不是定义时。这一点想通了，后面所有现象都能串起来。

---

## 二、两个"账本"：GO 和 AO

预编译的产物是个普通对象，教程里给它起了两个名字：

| 名字 | 全称 | 出现位置 |
| --- | --- | --- |
| **GO** | Global Object，全局对象 | 全局代码执行前 |
| **AO** | Activation Object，活动对象 | 每次函数调用前 |

> 严格说，现代引擎用的是 Environment Record（环境记录）而不是"对象"，GO 也不是那个你熟悉的 `window`。但作为心智模型，用"对象 + 属性"来理解完全够用，面试也这么考。

记住一句话：**GO / AO 就是"这个名字现在指向什么"的登记簿**。后面所有的 `console.log` 疑惑，本质都是在问"登记簿上此刻写着什么"。

---

## 三、函数预编译：把你的笔记收成 4 步

我见过不少笔记写着 6 步，其实真正有信息量的是 4 步（第 5 步是执行、第 6 步是"返回 AO"，不算预编译动作）：

| 步骤 | 动作 |
| --- | --- |
| 1 | 创建 AO：`AO = {}` |
| 2 | 找**形参**和函数体内的 **`var` 声明**，同名属性置为 `undefined` |
| 3 | 把**实参**赋值给对应的形参 |
| 4 | 找函数体内的**函数声明**，同名属性 = 函数体 |
| — | （然后才开始执行函数体，赋值随时写回 AO） |

三个关键顺序，记牢：

1. **第 2 步在前，第 3 步在后**：先有属性（`undefined`），再被实参覆盖。没传参的形参就停在第 2 步，是 `undefined`。
2. **第 4 步在第 3 步之后**：函数声明会覆盖形参的值。这就是开头那道题里 `b` 变成函数的原因。
3. **`var` 和形参同名不会重复登记**，后到的 `var` 是空操作，不会把已有值清成 `undefined`。

验证一下第 2、3、4 步的先后：

```js
function test(a, b) {
  console.log(typeof a); // function —— 形参 a 被函数声明 a 覆盖了
  console.log(b);        // undefined —— 没传参，停在第 2 步
  var a = 10;
  console.log(a);        // 10 —— 执行阶段赋值，覆盖函数
  function a() {}
}
test(1);
```

输出：

```
function
undefined
10
```

注意最后一行：**函数声明只在预编译阶段赢，执行阶段的赋值还是能把它覆盖掉。**"函数优先级高"说的是预编译阶段内部的顺序，不是"函数不可被覆盖"。

---

## 四、全局预编译：GO 只有 3 步

全局没有形参，所以比函数少一步：

| 步骤 | 动作 |
| --- | --- |
| 1 | 创建 GO：`GO = {}` |
| 2 | 找全局的 **`var` 声明**，同名属性置为 `undefined` |
| 3 | 找全局的**函数声明**，同名属性 = 函数体 |

同样，函数声明在 `var` 之后处理，所以同名时函数赢：

```js
console.log(typeof a); // function
var a = 1;
function a() {}
console.log(typeof a); // number
```

输出：

```
function
number
```

顺带一个常被追问的点：全局 `var` 会被挂到 `window`（`globalThis`）上，而 `let` 不会。

```js
var gv = 1;
let gl = 2;
console.log(Object.hasOwn(globalThis, "gv")); // true
console.log(Object.hasOwn(globalThis, "gl")); // false
```

> 上面这段要在真正的全局作用域（浏览器 `<script>`）里跑，结论才成立；Node 的 CommonJS 模块外面裹了一层函数，`var` 不等于全局。我是在 Node 里用 `vm.runInThisContext` 验证的，结果一致。

---

## 五、把开头那道题逐行拆开

```js
function foo(a, b) {
  console.log(b);      // ①
  c = 0;
  var c;
  a = 3;
  b = 2;
  console.log(b);      // ②
  function b() {}
  console.log(b);      // ③
}
foo(1);
```

**预编译阶段**（调用 `foo(1)` 之前）：

| 步骤 | AO 快照 |
| --- | --- |
| 1. 创建 | `{}` |
| 2. 形参 + var | `{ a: undefined, b: undefined, c: undefined }` |
| 3. 实参赋值（`a = 1`，`b` 没传） | `{ a: 1, b: undefined, c: undefined }` |
| 4. 函数声明 `b` | `{ a: 1, b: function b(){}, c: undefined }` |

**执行阶段**：

| 代码 | AO 变化 | 输出 |
| --- | --- | --- |
| `console.log(b)` ① | — | `[Function: b]` |
| `c = 0` | `c: 0`（`var c` 已提升，不报错） | |
| `var c` | 已存在，空操作 | |
| `a = 3` | `a: 3` | |
| `b = 2` | `b: 2` | |
| `console.log(b)` ② | — | `2` |
| `function b() {}` | 预编译阶段已处理，执行到这里**直接跳过** | |
| `console.log(b)` ③ | — | `2` |

三个输出分别是 `function`、`2`、`2`，和实测一致。

一个很容易被忽略的细节：`c = 0` 写在 `var c` **之前**却不报错，是因为 `var c` 已经被提升登记了。如果没有那句 `var c`，`c = 0` 就变成了**隐式全局**。

---

## 六、五个高频坑（每个都带实测输出）

### 坑 1：函数声明 ≠ 函数表达式

```js
console.log(typeof bar); // undefined
var bar = function () {};
console.log(typeof bar); // function
```

`var bar = function () {}` 只提升了 `bar` 这个**变量名**（`undefined`），函数体要等执行到那一行才赋值。所以 `bar` 在赋值前是 `undefined`，不是函数。

**这是"函数提升"最常见的误用**：只有 `function foo() {}` 这种**声明式**写法才会整体提升。

### 坑 2：形参和函数声明同名，函数赢

```js
function test(a, b) {
  console.log(typeof a); // function
  console.log(b);        // undefined
  var a = 10;
  console.log(a);        // 10
  function a() {}
}
test(1);
```

顺序是：形参 `a = 1` → 函数声明 `a = function` → 执行 `a = 10`。

### 坑 3：隐式全局

```js
function implicit() {
  h = 42; // 前面没有 var / let / const
}
implicit();
console.log(h);                          // 42
console.log(Object.hasOwn(globalThis, "h")); // true
```

没声明就赋值，会挂到全局对象上——**严格模式下直接 `ReferenceError: h is not defined`**。

```js
(function () {
  "use strict";
  z = 1; // ReferenceError: z is not defined
})();
```

### 坑 4：函数内部的 `var` 会遮蔽全局同名变量

```js
var g = "global";
function f() {
  console.log(g);   // undefined，不是 "global"
  var g = "local";
  console.log(g);   // local
}
f();
console.log(g);     // global
```

因为函数内的 `var g` 在预编译阶段就把 `g` 登记进了 AO，访问时优先查 AO，于是拿到 `undefined`。

### 坑 5：块里的函数声明

```js
function sloppy() {
  if (true) { function bg() { return "bg"; } }
  return typeof bg;    // "function"（非严格模式下 Annex B 的兼容行为）
}

function strictBlock() {
  "use strict";
  if (true) { function sg() {} }
  return typeof sg;    // "undefined"（严格模式：函数是块级作用域）
}
```

实测：`sloppy()` 返回 `"function"`，`strictBlock()` 返回 `"undefined"`。这类写法生产环境一律别用——ES6 起块内函数声明是**块级作用域**，行为取决于是否严格模式，是历史包袱。

---

## 七、`let` / `const`：为什么是报错，而不是 `undefined`

`var` 提升后是 `undefined`，`let` 为什么直接报错？

```js
console.log(x);
let x = 1;
```

```
ReferenceError: Cannot access 'x' before initialization
```

因为 `let` / `const` **也被"登记"了，但状态是"未初始化"**。从作用域开始到声明语句执行之间，这个变量处于**暂时性死区（TDZ, Temporal Dead Zone）**，任何读写都会抛错。

`typeof` 也一样会抛——这是它和"未声明的变量"最大的区别：

```js
console.log(typeof notDeclared); // undefined（没声明，不报错）
console.log(typeof y);           // ReferenceError（声明了但还在 TDZ）
let y = 1;
```

同理，块级作用域里的 `let` 还会"遮蔽"外层同名变量，连外层都读不到：

```js
let x = 1;
{
  console.log(x); // ReferenceError：块内的 let x 进入 TDZ
  let x = 2;
}
```

> 一句话记忆：**`var` 是"先给你一个 undefined 占位"，`let` 是"先占位但不许动"。**

---

## 八、一张表看完所有提升行为

| 声明写法 | 是否提升 | 提升成什么 | 何时能安全访问 | 挂到 `window` |
| --- | --- | --- | --- | --- |
| `var a` | ✅ | `undefined` | 任何位置（值是 `undefined`） | ✅ |
| `function f() {}` | ✅ | 函数对象 | 任何位置 | ✅ |
| `var f = function () {}` | ✅（只提升名字） | `undefined` | 赋值语句之后 | ✅ |
| `let` / `const` | ✅（登记） | 未初始化（TDZ） | 声明语句之后 | ❌ |
| `class C {}` | ✅（登记） | 未初始化（TDZ） | 声明语句之后 | ❌ |
| 隐式全局 `a = 1` | ❌ | — | 赋值那一刻才有 | ✅ |

---

## 九、6 道自测题（先做再看答案）

**第 1 题**

```js
console.log(a);
var a = 1;
function a() {}
console.log(a);
```

<details>
<summary>点我看答案</summary>

```
[Function: a]
1
```
预编译：`var a` → `undefined`，函数声明 `a` 覆盖成函数；执行 `a = 1` 后再覆盖成数字。
</details>

**第 2 题**

```js
var a = 1;
function f() {
  console.log(a);
  var a = 2;
  console.log(a);
}
f();
```

<details>
<summary>点我看答案</summary>

```
undefined
2
```
函数内的 `var a` 抢占了这个名字，AO 里 `a` 初始是 `undefined`，不会去读外层的 `1`。
</details>

**第 3 题**

```js
function f(a) {
  console.log(typeof a);
  var a = 2;
  console.log(a);
  function a() {}
}
f(1);
```

<details>
<summary>点我看答案</summary>

```
function
2
```
形参 `a = 1` → 函数声明覆盖成函数 → 执行 `a = 2`。
</details>

**第 4 题**

```js
console.log(typeof f);
var f = function () {};
```

<details>
<summary>点我看答案</summary>

```
undefined
```
函数表达式只提升变量名，不提升函数体。
</details>

**第 5 题**

```js
let x = 1;
{
  console.log(x);
  let x = 2;
}
```

<details>
<summary>点我看答案</summary>

```
ReferenceError: Cannot access 'x' before initialization
```
块内的 `let x` 从块开始就进入 TDZ，并把外层的 `x` 遮蔽掉了。
</details>

**第 6 题（有难度）**

```js
function f() {
  console.log("before:", typeof g);
  if (true) { function g() {} }
  console.log("after:", typeof g);
}
f();
```

<details>
<summary>点我看答案</summary>

```
before: undefined
after: function
```
非严格模式下块内函数声明走了 Annex B 的兼容逻辑：先在函数作用域登记一个 `var g = undefined`，**等 `if` 块执行时**才把函数赋给它。所以块前是 `undefined`，块后才是 `function`。严格模式下 `g` 根本不在函数作用域里，`before` 和 `after` 都会是 `undefined`（`typeof` 不会因为越界报错）。
</details>

---

## 十、三句话总结

1. **预编译就是"执行前先把声明登记进 AO / GO"**：全局扫 `var` + `function`，函数额外加一步"形参"。
2. **顺序决定结果**：创建 AO → 形参和 `var` 置 `undefined` → 实参赋值 → 函数声明覆盖 → 再执行。函数声明在预编译阶段优先级最高，但执行期的赋值依然能覆盖它。
3. **提升只提升"声明"，不提升"赋值"**：`var a = 1` 拆成"提升 `a`"+"执行到才赋 1"；`let` / `const` 提升了名字却处于 TDZ，所以报错而不是 `undefined`。

面试现场如果只给你 30 秒，按这个顺序手算就行：

> **写 AO → 扫形参与 var（undefined）→ 填实参 → 扫函数声明（覆盖）→ 从头执行。**

---

### 参考

- [ECMA-262 §10.2.11 FunctionDeclarationInstantiation](https://tc39.es/ecma262/#sec-functiondeclarationinstantiation)
- [V8 Blog: Blazingly fast parsing, part 2: lazy parsing](https://v8.dev/blog/preparser)
- [ECMA-262 §14.3 Function Definitions（Annex B 块级函数）](https://tc39.es/ecma262/#sec-block-level-function-declarations-web-legacy-compatibility-semantics)
