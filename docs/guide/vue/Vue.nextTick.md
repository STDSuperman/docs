## Vue.nextTick源码分析

![](https://my-blog-1257398419.cos.ap-chengdu.myqcloud.com/blog/6.jpg)

## 前言
> 众所周知，随着 `Vue` 技术的越来越热，大量的前端开发者开始探究这门神奇的框架，笔者也是从 `JQuery` 时代一脚迈进了 `Vue` 的世界。谈到`Vue`，在这呢，就不得不提一下笔者在研究一个`Vue`项目的时候碰到的问题，父组件修改标志位变量，而子组件的相应组件并没有显示，后来通过多方研究，发现了 `Vue.nextTick`这个原型方法可以达到我想要的这个效果，所以笔者今天也来谈谈这个神奇的方法。

#### Vue.nextTick
* 参数
    * `{Function} [callback]`
    * `{Object} [context]`
* 用法

    在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
    
    
```
// 修改数据
vm.msg = 'Hello'
// DOM 还没有更新
Vue.nextTick(function () {
  // DOM 更新了
})

// 作为一个 Promise 使用 (2.1.0 起新增，详见接下来的提示)
Vue.nextTick()
  .then(function () {
    // DOM 更新了
  })
```

> 这里其实涉及到 `js` 的事件循环机制，有兴趣的话可以右转 [js事件循环](https://juejin.im/post/5b24b116e51d4558a65fdb70)

具体使用场景各位小伙伴应该也不用笔者多啰嗦了，今天笔者的重点还是研究一下这个东西源码是怎么实现的，毕竟作为当代前端一员至少不能只会用 `API` 了，咱们还是去底层假装研究一下是吧。

## Vue.nextTick源码解析

#### js事件循环机制

> 其实话说起来，我们就得来了解一下这个 `js` 是单线程的这个特性上来了，它其实所有事件的处理都依赖于这一个事件循环机制，，主线程的执行过程就是一个 tick，而所有的异步结果都是通过 “任务队列” 来调度被调度，消息队列中存放的是一个个的任务`task`。 规范中规定 `task` 分为两大类，分别是` macro task`(宏任务) 和` micro task`(微任务)，并且每个 `macro task` 结束后，都要清空所有的` micro task`。

回到正题，`Vue.nextTick` 怎么实现当前页面更新完之后最早执行它所绑定的回调呢，这就用到了我们上面所说的这个任务队列，每次当前宏任务执行完毕之前，都会清空所有微任务，那么为了在界面更新完之后最短时间内执行回调，最佳选择不就是这个微任务了么，利用这个机制，我们总能在下次事件循环之前把我们要处理的事件处理掉。

#### 微任务 宏任务

> 常见的宏任务有 `setTimeout`、`MessageChannel`、`postMessage`、`setImmediate`

> 微任务有 `MutationObserver` 和 `Promise.then` 以及 `node` 的 `process.nextTick`

当然，为了程序的优化和性能提升，我们的最佳选择当然是 `Promise` 啦，可是呢，`Promise` 属于`es6`中提出的，部分浏览器可能出现不兼容的情况 `(PS: IE:你看我干嘛?)`，所以官方就给了一个优雅降级策略，如果当前浏览器支持 `Promise` 则使用`Promise`，其次就是`MutationObserver`，如果以上两个都不支持，就只能搬出我们的`setTimeout`了。话不多说，下面开始搬代码。



```
 //存储需要触发的回调函数
  var callbacks=[];
  /**是否正在等待的标志（false:允许触发在下次事件循环触发callbacks中的回调,
  *  true: 已经触发过,需要等到下次事件循环）
  */
  var pending=false;
  //设置在下次事件循环触发callbacks的触发函数
  var timerFunc;
```
上面的这个`timerFunc` 将用于达到触发条件后触发所有回调函数


```
  //处理callbacks的函数
  function nextTickHandler() {
      // 可以触发timeFunc
      pending=false;
      //复制callback
      var copies=callbacks.slice(0);
      //清除callback
      callbacks.length=0;
      for(var i=0;i<copies.length;i++){
          //触发callback的回调函数
          copies[i]();
      }
  }
```
这部分代码就是实现触发所有绑定的回调函数的主要逻辑部分，下面我们来看看官方的的优雅降级策略怎么实现的


```
  //如果支持promise，使用promise实现
  if(typeof Promise !=='undefined' && isNative(promise)){
      var p=Promise.resolve();
      var logError=function (err) {
          console.error(err);
      };
      timerFunc=function () {
          p.then(nextTickHandler).catch(logError);
          //iOS的webview下，需要强制刷新队列，执行上面的回调函数
          if(isIOS) {setTimeout(noop);}
      };
  //    如果Promise不支持，但支持MutationObserver
  //    H5新特性，异步,当dom变动是触发,注意是所有的dom都改变结束后触发
  } else if (typeof MutationObserver !=='undefined' && (
      isNative(MutationObserver) ||
      MutationObserver.toString()==='[object MutationObserverConstructor]')){
          var counter = 1;
          var observer=new MutationObserver(nextTickHandler);
          var textNode=document.createTextNode(String(counter));
          observer.observe(textNode,{
              characterData:true
          });
          timerFunc=function () {
              counter=(counter+1)%2;
              textNode.data=String(counter);
          };
  } else {
      //上面两种都不支持，用setTimeout
      timerFunc=function () {
          setTimeout(nextTickHandler,0);
      };
  }
```
看完这段代码，大家可能对官方的这个降级策略有了一种恍然大悟的感觉，不过可能大家也会有疑问，这个MutationObserver的实现方式怎么这么诡异，那让我们来看看它的用法吧。

#### MutationObserver 概述
* 监视 DOM 变动的接口当监视的 DOM 发生变动时 MutationObserver 将收到通知并触发事先设定好的回调函数。
* 类似于事件，但是异步触发。添加监视时，MutationObserver 上的 observer 函数与 addEventListener 有相似之处，但不同于后者的同步触发，MutationObserver是异步触发，此举是为了避免 DOM 频繁变动导致回调函数被频繁调用，造成浏览器卡顿。

#### MutationObserver 构造函数
该构造函数用于实例化一个新的 MutaionObserver ，同时指定触发 DOM 变动时的回调函数：

```
var observer = new MutationObserver(callback);
```
callback，即回调函数接收两个参数，第一个参数是一个包含了所有 MutationRecord 对象的数组，第二个参数则是这个MutationObserver 实例本身。具体详细介绍可以参考
[深入了解MutationObserver](https://user-gold-cdn.xitu.io/2019/6/30/16ba662cafa7e124)。

咳咳咳，回到正题

```
 //nextTick接收的函数，参数1：回调函数 参数2：回调函数的执行上下文
  return function queueNextTick(cb,ctx) {
      //用于接收触发Promise.then中回调的函数
      //向回调函数中pushcallback
      var _resolve;
      callbacks.push(function () {
          //如果有回调函数，执行回调函数
          if(cb) {cb.call(ctx);}
          //触发Promise的then回调
          if(_resolve) {_resolve(ctx);}
      });
      //是否执行刷新callback队列
      if(!pending){
          pending=true;
          timerFunc();
      }
      //如果没有传递回调函数，并且当前浏览器支持promise，使用promise实现
      if(!cb && typeof  Promise !=='undefined'){
          return new Promise(function (resolve) {
              _resolve=resolve;
          })
      }
  }
```

以上其实就是你调用这个方法实际调用的函数啦，利用闭包原理保存了前面提到的各个函数的引用，首先他会把你传入的回调函数包装一下保存到`callback`数组中。

如果当前队列还未执行过回调，那么开始执行回调，并把`pending`标志位置为`true`，表示当前任务队列已经执行过回调。

然后最后加一层判断，如果当前浏览器具有`Promise`环境且未传递回调函数则采用`Promise`执行。
> 最后附上完整代码

```
export const nextTick=(function () {
  //存储需要触发的回调函数
  var callbacks=[];
  //是否正在等待的标志（false:允许触发在下次事件循环触发callbacks中的回调,
  // true: 已经触发过,需要等到下次事件循环）
  var pending=false;
  //设置在下次事件循环触发callbacks的触发函数
  var timerFunc;

  //处理callbacks的函数
  function nextTickHandler() {
      // 可以触发timeFunc
      pending=false;
      //复制callback
      var copies=callbacks.slice(0);
      //清除callback
      callbacks.length=0;
      for(var i=0;i<copies.length;i++){
          //触发callback的回调函数
          copies[i]();
      }
  }
  //如果支持promise，使用promise实现
  if(typeof Promise !=='undefined' && isNative(promise)){
      var p=Promise.resolve();
      var logError=function (err) {
          console.error(err);
      };
      timerFunc=function () {
          p.then(nextTickHandler).catch(logError);
          //iOS的webview下，需要强制刷新队列，执行上面的回调函数
          if(isIOS) {setTimeout(noop);}
      };
  //    如果Promise不支持，但支持MutationObserver
  //    H5新特性，异步,当dom变动是触发,注意是所有的dom都改变结束后触发
  } else if (typeof MutationObserver !=='undefined' && (
      isNative(MutationObserver) ||
      MutationObserver.toString()==='[object MutationObserverConstructor]')){
          var counter = 1;
          var observer=new MutationObserver(nextTickHandler);
          var textNode=document.createTextNode(String(counter));
          observer.observe(textNode,{
              characterData:true
          });
          timerFunc=function () {
              counter=(counter+1)%2;
              textNode.data=String(counter);
          };
  } else {
      //上面两种都不支持，用setTimeout
      timerFunc=function () {
          setTimeout(nextTickHandler,0);
      };
  }
  //nextTick接收的函数，参数1：回调函数 参数2：回调函数的执行上下文
  return function queueNextTick(cb,ctx) {
      //用于接收触发Promise.then中回调的函数
      //向回调函数中pushcallback
      var _resolve;
      callbacks.push(function () {
          //如果有回调函数，执行回调函数
          if(cb) {cb.call(ctx);}
          //触发Promise的then回调
          if(_resolve) {_resolve(ctx);}
      });
      //是否执行刷新callback队列
      if(!pending){
          pending=true;
          timerFunc();
      }
      //如果没有传递回调函数，并且当前浏览器支持promise，使用promise实现
      if(!cb && typeof  Promise !=='undefined'){
          return new Promise(function (resolve) {
              _resolve=resolve;
          })
      }
  }
})()
```
![](https://my-blog-1257398419.cos.ap-chengdu.myqcloud.com/blog/7.jpg)
> 好啦本文暂时介绍到这里，如果发现笔者写的不对的地方，欢迎给笔者留言。