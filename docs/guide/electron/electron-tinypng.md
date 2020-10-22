## JS跨端体验之Electron桌面开发

![](https://s1.ax1x.com/2020/10/22/BkGMPH.jpg)

## 背景
不得不说，自`Node.js`的出现以来，`JS`的发展也是有目共睹。放眼望去，`JS`开发者的身影已经出现在了各个领域。不论是前端、后端、移动端，抑或是今天要说的桌面端，`JS`以一种一发不可收拾的势态，从最开始只能做一些简单的前端UI层面的动效操作，到现在能够独当一面的扛起前端生态大梁，它的发展，着实让人感受到惊叹和赞许。似乎正在印证那句：**能用JS解决的，终将用JS来解决**。

随着`JS`跨端风潮的兴起，`Electron`也顺势出道，成为桌面跨端开发的利器，作为能够一套代码多端发布的技术，它的出现，无疑能给众多桌面端开发者带来极大的便利。今天，我们就带着好奇的目光，来走进`Electron`的世界。

## 介绍
`Electron` 基于 `Chromium` 和 `Node.js`, 让你可以使用 `HTML`, `CSS` 和 `JavaScript` 构建应用。与此同时，`Electron`可以构建出`Windows`、`Mac`、`Linux`三个平台的应用程序，所以它也属于桌面应用的跨端解决方案。

不仅如此，作为前端开发者，我们对于上手`Electron`是一项十分容易的事情，只要你具备`Node.js`相关知识，以及前端页面搭建相关能力，你将能够直接开始开发简单的`Electron`相关应用。

`Electron`相对于`Web`应用而言，最大的差异莫过于`Electron`具备了操作系统的调动能力，比如蓝牙，`shell`命令，以及桌面应用所具备的强大能力。同时，内部集成了`Node.js`，使我们天生能使用众多强大的`npm`包，可以说等于接入了整个`Node.js`社区，看到这，你还能不心动😜？

## 预热
在正式开始硬刚这玩意之前，我们先要明确几个概念。

众所周知，`Chrome`目前采用了多进程架构，所以，采用了`Chromium`内核的`Electron`可想而知也是多进程架构。

`Electron`中包含了两种进程，主进程以及渲染进程，顾名思义，我们不难推出主进程应该属于整个应用的核心进程，我们需要确保它的健壮性，因为一旦主进程崩溃，那么整个应用也将无法继续工作。其次来说说渲染进程，如果说你对渲染两个字表示不是很清晰的话，我们或许可以这样理解，比如我们打开`VsCode`这个应用，我们看到的整个窗口中的内容就是渲染进程所负责的事。

> 对于这些概念如果存在迷惑的也不用纠结，我们继续往下看，这里主要先给你混个眼熟，笔者将会手摸手带你快速上手`Electron`开发😋。

## 主进程

我们在看代码之前，先问自己一个问题，比如，站在用户角度来说，对于一个桌面应用，我们第一步要实现什么😲？

这个时候大家会说了，当然是先给我看看你这应用长啥样啊。那么好的，往下看，我们先实现创建一个基本的窗口。

光说不练，嘴把戏，我们可以先从官方给的入门项目开始说起。

> Talk is cheap. Show me the code.

项目地址：[electron-quick-start](https://github.com/electron/electron-quick-start)

拿到项目三部曲：
1. `git clone`
2. `npm i` 或 `yarn`
3. 打开`package.json`

对于研究一个基本的前端应用而言，我们第一步要做的就是应该先找到入口文件，所以呢，我们点开项目的`package.json`，找到它的`main`字段。

```json
{
  "name": "electron-quick-start",
  "version": "1.0.0",
  "description": "A minimal Electron application",
  "main": "main.js",
}
```

我们不难发现它的入口文件是`main.js`，找到了入口文件那就好说了，打开`main.js`，我们先不着急看它具体干了啥，先大概看一下结构，了解`Node.js`的朋友嘴角微微上扬，就这？？

![](https://pic.qqtn.com/up/2020-4/2020040314040968906.gif)

```javascript
// main.js
const {app, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
```
没错，就是我们熟悉的`Node.js`，或者说可以说就是`Javascript`，看到这，部分朋友悬着的心放了下来，不就是`js`，何惧之有，看我分分钟写一个`QQ`出来。

接下来，笔者将带你一步一步刨析整个代码，让你学习`Electron`如丝一般顺滑。

### Electron生命周期
正如我们学习`Vue`或者`React`，他们都有各自的生命周期，`Electron`也不例外，我们可以通过这些事件，来做我们需要做的一些操作。由于`Electron`中包含的生命周期事件太多了，这里就不展开解释了，先挑代码里这几个事件讲解一下，详细的事件相关介绍可以去[`Electron`](https://www.electronjs.org/docs/api/app)官网查看。

* ready：
	* 当 Electron 完成初始化时被触发。
* activate(`macOS`有效)：
	* 当应用被激活时发出。 各种操作都可以触发此事件, 例如首次启动应用程序、尝试在应用程序已运行时或单击应用程序的坞站或任务栏图标时重新激活它。
* window-all-closed：
	* 如果你没有监听此事件并且所有窗口都关闭了，默认的行为是控制退出程序；但如果你监听了此事件，你可以控制是否退出程序。

看完这里可能有读者问了，示例代码里也没有`ready`啊，这是咋回事？

不要慌，我们来看看`app.whenReady`这个玩意：
> 返回 `Promise<void>` - 当Electron 初始化完成。 可用作检查 app.isReady() 的方便选择，假如应用程序尚未就绪，则订阅ready事件。

看完上面描述，我们可以稍稍改写一下文中的代码玩玩，把示例代码的`app.whenReady().then(callback)`改成`app.on('ready', callback)`，效果是一样的。

### 代码分析
```javascript
const {app, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')
}
```
对于第三方模块的导入应该不用笔者多赘述了吧，不过这个地方可以提一下，有关于`Electron`的系统操作以及进程间通信都在这个`electron`包中，所以大部分情况下，如果你需要使用到内部的一些方法调用只要导入这个包即可。

首先看到这个`createWindow`方法，由名字我们可以看出，这个方法是用来创建一个窗口的。等等😲，我们是不是该想起点啥？没错，还记得前面笔者有提到的先带着的那个问题嘛，不记得了赶紧往前翻翻，这个方法似乎已经满足了我们创建一个窗口的需求。

我们观察这个函数内部可以发现，其实也就是调用了两个方法：

`new BrowserWindow()`- 这个地方主要做了一件事，实例化一个窗口对象，同时，在这里我们会牵扯到渲染进程的东西，我们可以先大概了解下。实例化的窗口对象会运行在渲染进程中，我们可以在实例化的同时传入一些配置项，比如是否允许使用`node`模块，以及示例代码中的`preload`，是否需要进行预加载，其他的配置项如窗口的宽高等等具体配置可上官网自行查阅。

`loadFile` - 实例方法，这个方法主要用于加载一个`HTML`页面用于显示在创建的窗口中。对于写`HTML`页面来说，这应该是作为前端工程师最擅长的东东了吧🤭。

继续往下看：
```javascript
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
```
这里其实就比较好理解了，`app.whenReady.then(callback)`这个函数里面主要就是用于在应用初始化完成之后调用创建窗口方法，同时监听了一个`activate`应用被唤醒的事件，也就是你重新点击程序坞里小图标或者说是第一次启动应用，这个时候如果发现原来窗口并没有被创建就直接调用创建窗口方法，这个生命周期事件需要注意的是只在`macOS`有效。

好了基本的入口文件或者可以说这个入门项目的主进程相关代码差不多就这么多。是不是觉得这玩意还用学😒？

![](https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3488358829,502068892&fm=26&gp=0.jpg)

## 渲染进程

接下来就要进入我们熟悉的领域了，渲染进程你其实可以类比于`Web`页面，甚至连开发方式都几乎一样，这就是为什么笔者前面会说，只要你会一点`Node.js`知识，作为前端攻城狮的你就能轻松上手`Electron`。

- 我们每创建一个`web`页面都会创建一个渲染进程
- 每个`web`页面运行在它自己的渲染进程中
- 每个渲染进程是独立的, 它只关心它所运行的页面

其实就对于`Web`应用的开发而言，主流的三大前端框架如：`React`、`Vue`、`Angular`，都可以成为我们开发`Electron`的利器。就开发而言，和平常的`Web`开发几乎没有区别，唯一不一样的是，我们可以在前端代码中使用`Node.js`的所有模块，以及`Electron`为我们提供的各项系统级别的操作如：蓝牙、音频、视频等强大的`API`，区别于一般的一般的网页开发，我们需要打破思维枷锁，应该站在桌面应用级别去思考问题，这就是`Electron`的强大之处。

这个时候就会有读者问了，那应该怎么接入呢，其实这个问题的答案也是很简单，还记得上面主进程部分那个`loadFile`方法传入的参数么，没错，我们能清晰的看出来那是一个`HTML`文件，也就是说，你可以理解为，`Electron`每一个窗口里展示的内容都是一个内嵌的`Web`网页，你甚至可以直接使用现有的网页链接进行渲染。

如果你使用`Vue`作为页面开发框架，我们只需要在`Electron`应用启动之前将对应的项目打包一下，然后在主进程中配置`loadFile`方法，将打包后的`HTML`文件路径传入这个方法即可成功加载对应页面。

```javascript
 const mainWindow = new BrowserWindow({...})
 mainWindow.loadFile('../x/index.html')
```

如果说你想用现有的网页链接进行渲染，你可以这么做：

```javascript
 const mainWindow = new BrowserWindow({...})
 mainWindow.loadURL('https://www.baidu.com')
```
然后你会神奇的发现，你的窗口渲染出来的内容赫然就是我们神奇的百度首页。

> 但就这个入门项目来看，当你好不容易找到`index.html`文件中引入的外部`js`文件（`renderer.js`）时，你会神奇的发现，里面啥也没有，哈哈哈哈。

由于官方这个入门项目比较简陋，所以没办法继续用这个项目给大家讲解了，下面将会结合其他项目进行实战讲解。

## 实战项目讲解

### 项目介绍
这里笔者要拿出来给大家讲解实战项目目前还处于孵化状态，涉及内容不多，所以用来作为入门项目进行研究就再适合不过了。该项目主要致力于解决前端对于图片压缩的繁琐问题，能一步解决的坚决不多走一步。

内部采用了目前主流的图片压缩网站`tinypng`进行图片压缩，用过的读者这个时候可能就会知道，我们如果需要进行多张图片压缩，我们就需要先找到并打开它的压缩网站，然后拖动一组图片放置到指定位置，并等待压缩完成，然后手动进行下载操作，然后进行解压，最后复制压缩后的图片替换原图。

这一套流程实在过于繁琐，为了简化用户操作，提高工作效益，`TinyPNGCompress`项目顺势而出，目前实现的功能如下：
- [x] 点击选择图片进行压缩
- [x] 拖拽单张或多张图片进行压缩
- [x] 拖拽文件夹进行压缩（将对文件夹下所有符合条件的图片进行压缩）
- [x] 压缩成功自动替换原图（可关闭，默认开启）
- [x] 原图以及压缩图缓存（可关闭，默认开启）
- [x] 对压缩过的图片不进行二次压缩，确保图片品质（可关闭，默认开启）
- [x] 失败图片一键重压
- [x] 还原原图
- [x] 共享`APIKEY`，达到突破每日500张图片限制

- 项目地址: [https://github.com/STDSuperman/TinyPNGCompress](https://github.com/STDSuperman/TinyPNGCompress)
- 项目主要技术栈：`Electron`、`Vue`
- 主要目录结构
![](https://s1.ax1x.com/2020/10/22/BkG8Mt.png)

就项目技术栈而言，采用的是`TypeScript`，不过个人觉得，它长得跟`Javascript`区别真心不大，如果读者有看不明白的地方，可以忽略，着重看`Electron`相关即可。

### 项目命令介绍

对于一个项目来说，我们首先应该去了解的应该是如何启动它，不然一个无法启动的项目就会影响到后续的调试和探索，所以呢，我们第一步先打开项目根目录下的`package.json`文件，看一下相关的命令。

这里笔者先整理出了几条比较重要的命令，其他的大家可以先不用管。
```javascript
"start": "concurrently \"npm run start:render\" \"wait-on http://localhost:8080 && npm run start:main\"",
"start:render": "cd app/renderer/src/main && npm run serve",
"start:main": "electron ."
```
首先笔者先解释下启动命令`npm run start`，我们在终端输入这条命令并回车，就会执行上述`start`所对应的命令，这里笔者可能需要先讲解以下这里面涉及到的两个库：

- `concurrently`：
	- 用于并发执行多个命令，即上述代码中的`npm run start:render`和`wait-on http://localhost:8080 && npm run start:main`。这里整个命令的含义是，先把本地渲染进程也就是我们熟知的`Web`项目跑起来，这里用到的是`Vue`框架，并把该`Web`项目挂载到`8080`端口，然后我们就能通过上述提到的`loadURL`方法去加载一个`Web`页面作为窗口渲染的内容了。
    
> 但是呢，我们在启动`Electron`应用之前必须确保对应的项目已经启动完毕了，所以就需要用到我们`wait-on`这个库了。

- `wait-on`：
	- 顾名思义就是等待的意思，我们还是拿上面的`start`命令来讲解，也就是说如果我们按上述方式进行使用，它就会等待对应的端口能够访问到我们的`Web`项目的时候，再去执行后续的任务。

也就是你可以理解为`npm run start` = `npm run start:render`然后再`npm run start:main`，主要就是为了简化用户启动项目的操作，一个命令就可以解决启动问题。启动部分讲完了，下面就开始刚一些比较基础的代码相关了，`Are You Ready?`😜。

### 主进程相关
我们可以暂时忽略其他不重要的目录，专注于研究怎么把`Electron`先玩起来。笔者不会直接把所有代码`Copy`过来，着重于讲解怎么理解它的大概开发流程。

根据`package.json`的配置的入口文件，我们可以很轻松的找到以下代码（相关代码存在的路径都以注释的形式标注）。

```javascript
// app/main/index.js
const { app } = require('electron');
app.on('ready', () => {
    createMainWindow();
});

// app/main/windows/main.js
function createMainWindow() {
    win = new BrowserWindow({
        height: 620,
        width: 515,
        webPreferences: {
            nodeIntegration: true
        },
        icon: '../../../resources/icon.ico'
    })
    if (isDev) {
        win.loadURL('http://localhost:8080/')
    } else {
        win.loadFile(path.resolve(__dirname, '../../renderer/pages/main/index.html'))
    }
}
```

通过前面的讲解，相信大家也能够对这段代码有种熟悉的感觉，这里是从项目中截取的一些关键代码。整个的代码主要思路有以下几步:
1. 在项目启动的时候调用创建窗口的方法
2. 在`createMainWindow`中实例化了一个用户渲染的窗口。
3. 在`webPreferences`中开启了`Node`。（这里主要就是告诉这个渲染进程，在这个窗口实例中可以使用`Node.js`模块，默认如果你不配置，那么是不能在这个渲染进程中或者说是窗口中使用`Node.js`模块）
4. 判断是否是开发环境，如果是则直接加载本地项目项目地址，否则就直接加载打包好的静态资源。

### 走进渲染进程
其实说是说渲染进程，我们为了方便理解，其实你就可以把它想象成一个加强版的`Web`页面，所以我们可以驾轻就熟的找到这个项目的`Vue`相关代码（具体路径：`app/renderer/src/main`）。

如果熟悉`Vue`的朋友可能就能一眼看出来，这不就是完完全全的`Vue`项目嘛，对，你没猜错。
![](https://s1.ax1x.com/2020/10/22/BkGwGj.jpg)

话不多说，跟`Vue`相关的代码笔者这里就不进行讲解了，就单纯来讲一讲`Electron`给它带来了什么功能提升。

翻开书本，哦不对，找到`app/renderer/src/main/components/user-config.vue`文件。然后再看到第27、28行代码和52行（也就是下面的代码）：

```javascript
const { shell, remote } = window.require('electron')
const path = window.require('path');

path.resolve('./', this.cacheDir);
```

> 这里`window.require`等效于直接在`Node.js`中使用`require`，为什么在这需要在前面加上`window`呢？其实了解过`webpack`打包机制的读者就会清楚为什么了，这里这么做主要是为了防止`webpack`在打包的时候把`Node.js`相关或者说`Electron`相关代码也进行打包，这样会导致报错，所以用`window.require`能有效避免被`webpack`识别。

细心的读者可能已经发现了，居然可以直接在`Vue`中使用`Node.js`的内置模块，那这`Node + Vue === 全栈`😱。笔者是不是没骗你，集成了`Node`能力之后，就基本把前端界面和后端服务合二为一，这种酸爽，简直无法自拔啊。也就是说，你可以在`Vue`或`React`项目中随意的引入`Node.js`相关所有模块，这都是被支持的。

不仅如此，我们可以看到27行，我们从`Electron`包种导入了`shell`方法，也就是意味着我们直接可以使用`shell`命令，是不是已经要被它的强大所征服了。`Electron`具备的能力远远不止笔者所介绍的这些零星，它还为我们提供了许多其他强大的功能，具体相关方法调用可以去官网进行查阅。由于笔者篇幅有限就不进行详细解释了，有兴趣的可以研究一下项目功能实现，如果有觉得有存在问题或者隐患的地方，欢迎大家给予意见。

如果读者有兴趣加入项目功能开发的，欢迎给项目提`PR`。当然，若觉得项目还挺有意思的话，希望能够得到读者大大的`Star`😝。

## 总结

对于一项新技术而言，总是会存在或多或少的争议的，就`Electron`本身特性而言，它的跨平台能力以及对于成本的投入无疑是比较让人推崇的，毕竟作为能够一套代码三个平台都进行使用，这样的开发成本可以说是十分让人受用的，特别是对于需要兼容多平台，并且又没有多少预算的项目来说简直是不可多得的神器。

不仅如此，对于`Node.js`社区的生态应该大家也是有目共睹的，有了它的加持，我们在开发一个桌面端应用，它的开发效率提升可想而知。

当热，有利也有弊，我们应该用辩证的目光来看待这项技术，由于它是基于`Chromium`内核的，虽然说我们有时候并不需要`Chromium`的一些能力，但在打包的同时还是会将整个内核进行打包，所以说对于一般比较小的项目，打包出来的安装包会比较大，能达到几十兆甚至是上百兆，这无疑是需要后续进行改进优化的。

相对于它的弊端来说，它的优点明显是很突出的，也是笔者为什么比较推崇的一项技术。

当然，笔者也是初入`Electron`，所以如果文中有表述不当的地方，还望各位读者朋友们进行指点，笔者在此感激不尽。

如果读者朋友们觉得此文还算不错，能够帮助到大家，那么笔者也希望大家能够给本文一个赞，你们的**点赞**是给笔者最大的鼓励😜。

> 一键三连：点赞、收藏加关注🤪。