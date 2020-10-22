
## PWA-让你的web应用变得高大上

## 前言
对于`PWA`，在经过多次被面试官进行灵魂拷问后😭，我对他产生了浓厚的兴趣，苦于前段时间笔者忙着面试没得时间，于是就耽搁到了现在😂。不过对于学习新技术而言，我们总是需要去怀着一颗敬畏之心去研究的，一项技术的兴起总是有着它的意义所在，也必然代表了某种趋势。说了这么多，那`PWA`到底是什么呢？

## 什么是PWA
> PWA（Progressive web apps，渐进式 Web 应用）运用现代的 Web API 以及传统的渐进式增强策略来创建跨平台 Web 应用程序。这些应用无处不在、功能丰富，使其具有与原生应用相同的用户体验优势

MDN上的解释总是很官方的，从字面上来说，我们可以知道他是一种渐进式的`Web`应用，那么何谓渐进式呢？其实就是代表着如果浏览器不支持，那么对原有应用不会产生影响，对于支持该项技术的浏览器，他会在原有基础上新增它的特性，让用户得到更好的体验。目前在`Vue`、`React`脚手架中已经集成了该项技术，一旦你拥有一个`web app`项目，那么你的`PWA`之旅就已经开始了。

为什么它会这么火？这就不得不提到它的三大特性了：

* 可添加到桌面
* 离线访问
* 后台通知

对于一个网站来说，怎么留住用户就成了我们必须考虑的一个问题，而对于`Web`应用而言，被用户记住的一个比较粗糙的方式莫过于书签了，可就用户体验层次来说，这就无法与原生应用进行媲美了。对于一个比较大型的项目来说，开发一个原生应用的成本无疑是巨大的。

于是我们怎么让一个`Web`应用具备像原生`App`一样的桌面添加直接可访问并具有打开网站的过度效果就成了一种迫切的开发需要，`PWA`应势而生。

## 三大特性实现详解

> 在`PWA`中有一个必须注意的点，它只支持在`https`协议和`localhost`即本地环境下进行使用，也就是你的应用需要被访问必须具备这个条件。

### 桌面添加

其实对于这个功能而言，它的核心在于一个名叫`manifest.json`的文件，一旦我们的应用引入了该项配置，它就能被安装到桌面进行使用。

#### manifest配置

```javascript
 {
    "name": "HackerWeb",//应用名称
    "short_name": "HackerWeb",//短名称，用于在桌面显示
    "start_url": ".",//入口url
    "display": "standalone",//应用的展现模式，一般来说这个模式体验最优
    "background_color": "#fff",//应用的主题颜色，一般会改变你的上方菜单栏背景颜色
    "description": "A simply readable Hacker News app.",//应用描述
    "icons": [{//在不同环境下展现的应用图标
    "src": "images/touch/homescreen48.png",
    "sizes": "144x144",
    "type": "image/png"
    }]
 }
```

具体配置的详情描述可以参照：[Web App Manifest](https://developer.mozilla.org/zh-CN/docs/Web/Manifest)

配置好之后我们只需使用`link`标签进行引入就足够了

```html
<link rel="manifest" href="manifest.json">
```
这样你的应用就已经具备了被安装到桌面的能力，是不是很简单😏。

### 离线访问

这个描述功能的实现，笔者就开始要准备放大招了🐤，它的一个核心概念可以用一张图来描述：


![原理图](https://user-gold-cdn.xitu.io/2019/10/18/16ddf57929bf690a?w=399&h=185&f=png&s=19018)

其实这项技术的实现就需要借助我们的`ServiceWorker`以及这一个`Cache Storage`来进行配合实现了。

功能的实现思路就在于`ServiceWorker`可以拦截所有请求，并可以操作`Cache Storage`进行存取操作，如果用户断网，我们就可以选择从缓存中读取需要的数据，这样我们就能实现离线缓存功能了🤒。

### ServiceWorker详解
* service worker允许web应用在网络环境比较差或者是离线的环境下依旧可以使用
* service worker可以极大的提升web app的用户体验
* service worker是一个独立的 worker 线程，独立于当前网页进程，是一种特殊的web worker
* Web Worker 是临时的，每次做的事情的结果还不能被持久存下来，如果下次有同样的复杂操作,还得费时间的重新来一遍
* 一旦被 install，就永远存在，除非被手动 unregister
* 用到的时候可以直接唤醒，不用的时候自动睡眠
* 可编程拦截代理请求和返回，缓存文件，缓存的文件可以被网页进程取到（包括网络离线状态）
* 离线内容开发者可控
* 必须在 HTTPS 环境下才能工作
* 异步实现，内部大都是通过 Promise 实现


具体什么是`webWoker`，本文就不再赘述了，详细概念可以参见阮一峰老师这篇博客，[Web Worker 使用教程](http://www.ruanyifeng.com/blog/2018/07/web-worker.html)

#### 注册ServiceWorker

想要使用它，我们一般会在用户首次访问网站的时候进行注册。为了不影响页面正常的解析和页面资源的下载，我们会选择在`onload`事件触发时进行`ServiceWorker`的注册，它的注册很简单，只需要调用一个`Api`即可：

```javascript
window.onload = function() {
  if (navigator.serviceWorker) {
    navigator.serviceWorker
      .register("./sw.js")
      .then(registration => {
        console.log(registration);
      })
      .catch(err => {
        console.log(err);
      });
  }
};
```
我们首先会判断该浏览器是否支持`ServiceWorker`,如果支持就进行注册，不支持就直接跳过，不会影响页面。这个注册方法返回的是一个`Promise`对象，我们可以在`then`方法中获取到`registration`，这个对象包含了一些注册成功后的信息，如果失败，我们可以在`catch`方法中进行捕获。

#### serviceWorker的生命周期
注册完我们的`sw.js`(文件名自定义)后，我们就可以在`sw.js`文件中来研究它的三个核心生命周期函数了。

* install - 会在`service worker`注册成功的时候触发，主要用于缓存资源
* activate - 会在`service worker`激活的时候触发，主要用于删除旧的资源
* fetch - 拦截页面所有请求，当有拦截到请求就会触发（核心），主要用于操作缓存或者读取网络资源

#### install阶段
一般在这个阶段我们主要会将需要离线缓存的一些页面、资源等存入缓存中，以便在无网络的情况下可以继续访问网站。


```javascript
self.addEventListener("install", async e => {
  cacheData(); //调用缓存方法
  await self.skipWaiting(); //跳过等待
  // e.waitUtil(self.skipWaiting()); //另一种跳过等待方式
});
```

首先我会调用相应的缓存资源方法，然后后面的`self.skipWating`方法主要就是用于如果你的`sw.js`也就是被注册的文件发生改变就会重新触发`install`生命周期函数，但是却不会立即触发`activite`周期，它会等待上一个`sw.js`销毁后才会激活下一个，这个时候我们新注册的`sw.js`并没有被激活，所以为了能够让新注册的`sw.js`能立刻生效，我们可以加上这么一句进行跳过等待。

> 这个地方为什么会有这么两种写法呢？其实是因为`self.skipWating`返回的是一个`Promise`，是异步的，为了保证当前周期函数执行完再进入下一个所以我们需要等待它执行完成，这里可以使用`async await`来实现，也可以使用内置的一个工具方法`waitUtil`来实现相应功能。

下面我们来解析一下代码中`cacheData`方法：

```javascript
//缓存方法
const CHACH_NAME = "cache_v2";
async function cacheData() {
  const cache = await caches.open(CHACH_NAME); //打开一个数据库
  const cacheList = [
    "/",
    "/index.html",
    "/images/logo.png",
    "/manifest.json",
    "/index.css",
    "/setting.js"
  ]; //需要缓存的清单
  await cache.addAll(cacheList); //缓存起来
}
```
其实在这里就用上了我们另一个需要研究的知识点`cache storage`了。他其实有点类似于一个数据库，一般想要使用数据库，我们就需要先打开一个数据库，每个数据库都有一个自己的名字，满足了这些条件，我们就能往`cache storage`中存入数据了。

#### cache storage
* caches api 类似于数据库的操作：
    * `caches.open(cacheName).then(function(cache) {})`： 用于打开缓存，返回一个匹配cacheName的cache对象的promise，类似于连接数据库
    * `caches.keys()` 返回一个promise对象，包括所有的缓存的key（数据库名）
    * `caches.delete(key)` 根据key删除对应的缓存（数据库）
* cache对象常用方法（单条数据的操作）
    * `cache.put(req, res)` 把请求当成key，并且把对应的响应存储起来
    * `cache.add(url)` 根据url发起请求，并且把响应结果存储起来
    * `cache.addAll(urls)` 抓取一个url数组，并且把结果都存储起来
    * `cache.match(req)` ： 获取req对应的response

我们需要先列出我们需要进行缓存的清单，也就是代码中的`cacheList`，调用`cache storage`中的`addAll`方法就能将需要缓存的资源存入`cache storage`中了😀。

#### activate阶段

在这个阶段中，我们一般会做的事情无非就一件事，把旧的资源或`cache storage`删除掉。

但由于`serviceWoker`在用户浏览器中安装激活后我们并不能立马就生效，一般会需要用户在刷新页面后的第二次访问才能生效，所以我们会在`activate`阶段中调用一个API，让我们能够在第一访问就能生效，具体代码如下：

```javascript
const CHACH_NAME = "cache_v2";//在全局定义了当前数据库名
self.addEventListener("activate", async e => {
  /**查出数据库所有库名，清除旧版本库 */
  const keys = await caches.keys();
  keys.forEach(key => {
    //如果该数据库名不是当前定义的名字就进行删除
    if (key !== CHACH_NAME) {
      caches.delete(key);
    }
  });
  
  /**用于立刻获取页面控制权，确保用户第一次打开浏览器就是立马生效*/
  await self.clients.claim();
});
```

因为`self.clients.claim()`返回的也是一个`Promise`对象，所以我们也需要等待其执行完成。

#### fetch阶段
这个阶段可以说就是比较核心的生命周期函数了，因为前面两个主要用于一些初始化的操作，而`fetch`阶段就真正实现离线缓存的中心枢纽，它会拦截所有页面请求，因为这一特性，我们就能在无网络的情况下将用户需要请求的资源从缓存中读取出来返回给用户。

一般对于处理用户请求，我们会有多种策略，下面笔者就讲两种常用的：

##### 网络优先
顾名思义，就是先去网络上请求，如果请求不到，再去缓存中读取，具体代码如下：

```javascript
self.addEventListener("fetch", async e => {
  const req = e.request;//拿到请求头
  await e.respondWith(networkFirst(req));//将用户请求的资源响应给浏览器
});

//网络优先
async function networkFirst(req) {
  /**使用try.catch进行异常捕获*/
  try {
    const res = await fetch(req);
    return res;
  } catch (error) {
    const cache = await caches.open(CHACH_NAME); //打开一个数据库
    return await cache.match(req);//读取缓存
  }
}
```
首先会使用[Fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)向对应网络地址发起请求,如果请求不到资源就会抛出异常，就能被`try catch`捕获，然后进入`catch`中进行缓存读取。

##### 缓存优先
先读取缓存中数据，如果没有再发起网络请求。


```javascript
//缓存优先
async function cachekFirst(req) {
  const cache = await caches.open(CHACH_NAME); //打开一个数据库
  let res = await cache.match(req);//读取缓存
  if (res) {
    return res;
  } else {
    res = await fetch(req);
    return res;
  }
}
```
> 具体代码含义就不多加赘述了，能看到这一步应该对你没什么问题了吧😜。

拿到对应资源之后，我们就只需要调用`e.respondWith`方法就能把返回值响应给浏览器进行渲染了，至此我们已经完成了一大步，最后就是怎么进行系统通知了。

### Notification

这个处理部分就不能放在`sw.js`文件中了，因为我们需要用到`window`中的`Notification`函数。

```javascript
//先获取通知权限
if (Notification.permission == "default") {
  Notification.requestPermission();
}
if (!navigator.onLine) {
  new Notification("提示", { body: "您已断线,现在访问的是缓存内容" });
}
```
对于这种系统级别的`api`，第一步自然就是获取用户权限，然后才能进行下一步操作。在这里笔者就只写了一个通知用户已经离线的功能。

### 最后
笔者的文件目录:
* images
    * logo.png
* index.css
* index.html
* manifest.json
* sw.js
* setting.js
* server.js

在`index.html`文件中只需要用`link`标签引入`manifest.json`和`setting.js`，`setting.js`中内容如下：

```javascript
window.onload = function() {
  if (this.navigator.serviceWorker) {
    this.navigator.serviceWorker
      .register("./sw.js")
      .then(registration => {
        console.log(registration);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

/**
 * 判断用户是否联网,并给与通知提示
 */
//先获取通知权限
if (Notification.permission == "default") {
  Notification.requestPermission();
}
if (!navigator.onLine) {
  new Notification("提示", { body: "您已断线,现在访问的是缓存内容" });
}

```
> 洋洋洒洒也写了3k多字，希望能够对大家有所帮助，同时也欢迎大家对表述不正确的地方加以指正🧐。
