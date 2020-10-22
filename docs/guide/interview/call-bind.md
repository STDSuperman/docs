## 从call、apply到bind源码，你真的了解bind吗

### 序言
> 这段时间笔者在忙着项目开展的过程中，多次涉及到了`this`指向的问题。当然，对于这个问题的解决办法我们可能用的最多的还是`call`、`apply`，他们的用法也基本差不多，区别可能也就是传参方式的不同了，不过，大家似乎忘了还有一个哥们`bind`，它也能实现我们的需求。

### 从this谈call、apply、bind
就像我们在判断变量类型时，比较多的就是使用`typeof`关键字，当然，它的确能满足我们大部分情况下的需求，不足的地方就在于它无法对引用类型进行很好的判断。比如对于`Array` `Object`，甚至时对于`null` `(PS:typeof null -> "object")`类型都存在判断不准确的情况。

那么在这个时候，我们基本上搬出`Object.prototype.toString`就能很好的解决我们上述的问题，我们其实通过视觉上就能明确感觉到仅仅是`Object`的原型方法，那么我们怎么来使用它呢，答案就是`this`。

#### call/apply
以`[]`举例，我们可以使用下面几种方法来让别人的方法为自己服务：
```javascript
/* call */
Object.prototype.toString.call([]) // "[object Array]"

/* apply */
Object.prototype.toString.apply([])
```

#### bind
对于上面这两种写法可能大家见的会比较多，因为以笔者自己的实际开发来说，其实很少有用`bind`来实现这种需求吧。`Object.prototype.toString.bind([])()`，看起来似乎会繁琐一些。如果你还不曾用过bind，那么笔者先说说它的用法吧。

> 引用`MDN`的说明，这个应该是比较权威的了

* 语法
    * `function.bind(thisArg[, arg1[, arg2[, ...]]])` 
* 参数
    * `thisArg`
    调用绑定函数时作为this参数传递给目标函数的值。 如果使用new运算符构造绑定函数，则忽略该值。当使用bind在setTimeout中创建一个函数（作为回调提供）时，作为thisArg传递的任何原始值都将转换为object。如果bind函数的参数列表为空，执行作用域的this将被视为新函数的thisArg。
    * `arg1, arg2, ...`
    当目标函数被调用时，预先添加到绑定函数的参数列表中的参数。
* 返回值
    * 返回一个原函数的拷贝，并拥有指定的this值和初始参数。
* 描述
    * `bind()` 函数会创建一个新绑定函数`（bound function，BF）`。绑定函数是一个`exotic function object`（怪异函数对象，ECMAScript 2015中的术语），它包装了原函数对象。调用绑定函数通常会导致执行包装函数。
    * 绑定函数也可以使用`new`运算符构造，它会表现为目标函数已经被构建完毕了似的。提供的`this`值会被忽略，但前置参数仍会提供给模拟函数。
> 官话似乎永远是那么拗口，好吧，以笔者的理解大概是给一个函数进行包装，改变它的指向，并把包装完的函数返回，这样你就能拿到改变完`this`指向的原函数的包装函数了。

### bind源码实现
> 在进行代码分析之前，我们需要先根据它实现的功能来理一理思路。第一，它是怎么处理参数；第二，它是怎么实现`this`指向的改变；第三，对于`new`关键字，它怎么实现继承；第四，它需要返回一个什么样的函数

#### 参数处理
`var args = Array.prototype.slice.apply(arguments, 1)`

它首先会把用户传入的非`this`对象（也就是非`bind`函数的第一个参数）的其他参数保存到一个变量中

#### this改变
其实对于`this`的改变方式，本文开始已经有说明过了，一般来说都是采用的`call/apply`。

#### 怎么实现new关键字处理

```javascript
self.apply(this instanceof fBound ? this : othis,...)
```
先忽略其他的参数，我们只关注于它对`apply`第一个参数的处理方式，这里用到了`instanceof`关键字，其实这样处理的方式就是为了识别是否是使用`new`关键字进行调用`bind`函数，如果是，则忽略传入的`this`，指向`new`出来的实例对象。

继承部分，它采用的就是原型链继承方法

```javascript
var fn = function () {}
fn.prototype = this.prototype
fBound.prototype = new fn();
```
> 具体继承的叙述会放到后面，这里就不进行深入讲解

### 偏函数与bind
#### 什么是偏函数呢
属于函数式编程的一部分，使用偏函数可以通过有效地“冻结”那些预先确定的参数，来缓存函数参数，然后在运行时，当获得需要的剩余参数后，可以将他们解冻，传递到最终的参数中，从而使用最终确定的所有参数去调用函数。

#### 它和bind又有什么关系呢

`bind()`的另一个最简单的用法是使一个函数拥有预设的初始参数。只要将这些参数（如果有的话）作为`bind()`的参数写在`this`后面。当绑定函数被调用时，这些参数会被插入到目标函数的参数列表的开始位置，传递给绑定函数的参数会跟在它们后面。

> 说这么多，举个栗子吧


```javascript
function add(a,b){
    return a+b
}
var func  = add.bind(null,1)
func(2) //返回3
```
通过`bind`绑定给函数包装固定一个值，这样在下一次调用这个包装后的函数就可以少传一个参数了。其实这个东西应用场景在于，你需要多次调用同一个函数，多次传入的参数中有部分重复的参数，那么就可以使用偏函数进行预先固定几个参数来减少不必要的重复传参操作了。

### bind函数源码
最后将处理好的函数进行返回，下面贴上源码及其注释


```javascript
 /**严谨的bind函数实现 */
 if (!Function.prototype.bind) {
     Function.prototype.bind = function (othis) {
         /**判断调用者是否为函数 */
         if (typeof this !== 'function') {
             throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")
         }
        /*保存调用bind传入的参数*/
         var args = Array.prototype.slice.apply(arguments, 1)
         /**这里使用self保存this的目的是改变当前调用bind函数的this
         而不是调用bind返回的函数 
         */
         var self = this;
         var fn = function () {}
         var fBound = function () {
             return function () {
                 /**
                  * this instanceof fBound用与检测是否是 new fBound
                  * 如果是构造函数的形式则会忽略传入的othis 
                  * 后面的参数部分就是实现偏函数必不可少的操作
                  * 接收调用包装后的函数传入的参数
                  */
                 self.apply(this instanceof fBound ? this : othis, args.concat(Array.prototype.slice.call(arguments)))
             }
         }
         /**实现继承 */
         if (this.prototype) {
             fn.prototype = this.prototype
             fBound.prototype = new fn();
         }
         return fBound;
     }
 }
```
> 根据笔者前面的铺垫，相信大家对`bind`函数源码实现应该也有了大概的了解。

贴上笔者的个人网站，欢迎戳我

[陌小路](https://stdsuperman.github.io/)