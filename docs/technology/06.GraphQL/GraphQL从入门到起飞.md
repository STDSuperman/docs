---
title: GraphQL从入门到起飞
date: 2020-11-20 09:58:02
permalink: /pages/dd5c8b/
categories:
  - technology
  - GraphQL
tags:
  - 
---
# GraphQL从入门到起飞

## 简介

**一种用于` API `的查询语言**

> 官网的介绍总是这么精辟，简单而粗暴。（这里还是要吐槽一句，官方文档真的太太太太不友好了）

正如这句话所说，`GraphQL`是一种语言，一种用于`API`查询的语言。由`Facebook`开发，用以代替古老的`RESTful`架构，它允许你用陈述性语句描述你想要的数据，对于每一次请求而言，它总能返回可预测的结果。同时，它支持与多种语言进行一起使用，无论你是`JS`、`Java`还是`Go`...(`And so on!`)，它都能给予稳定的支持，覆盖的语言很多。

`Facebook `开源了 `GraphQL` 标准和其 `JavaScript` 版本的实现。后来主要编程语言也实现了标准。此外，GraphQL 周边的生态不仅仅水平上扩展了不同语言的实现，并且还出现了在` GraphQL `基础上实现了类库（比如 `Apollo` 和 `Relay`）。`GraphQL`目前被认为是革命性的`API`工具，因为它可以让客户端在请求中指定希望得到的数据，而不像传统的REST那样只能呆板地在服务端进行预定义。

![对比REST](https://res.cloudinary.com/dyyck73ly/image/upload/v1487945540/pm42jugohtjb3t124syz.png)

## 背景

诚然，任何一种技术或者语言的诞生，必然有着它难以割舍的历史背景。

在`RESTful`架构横行的当下，我们在构建一个前后端项目的同时，几乎总能不假思索的确定服务端`API`的供给方式。当然，不得不肯定`RESTful`架构在经过这么多年的考验后依然能屹立不倒，必然拥有着不可或缺的价值所在。有利亦有弊，`RESTful`也存在或多或少的缺陷。在一个 `RESTful` 架构下，因为后端开发人员定义在各个 `URL `的资源上返回的数据，而不是前端开发人员来提出数据需求，使得按需获取数据会非常困难。

从前后端交互角度来说，我们就请求一个接口来说，总会遇到某种场景，前端为了获取或修改到特定的数据需要传递很多个参数，伴随着项目的持续迭代，整个接口请求部分将会变得十分的臃肿且难以维护；不仅如此，如果存在服务端需要兼容多端的情况下，一个接口返回的数据可能会存在许许多多的赘余字段，甚至还可能存在这个页面仅仅只需要寥寥可数的几个字段，请求接口却返回了巨量的数据，从而导致网络带宽的浪费和服务端处理的速度。

对于前端依赖多个接口进行页面渲染的情况来说，几个相关的数据需要发起多个请求来满足需求，这显然是一种不太高效的行为。

从服务端维护的角度来说，对于多个接口，不管是否有存在接口字段重合的情况，我们总是需要编写接口独立的文档用以前端人员的使用，这在很多场景下是十分不友好的。

![概览](https://blog-images-1257398419.cos.ap-nanjing.myqcloud.com/GraphQL/gailan.png)

## 优势

### 渐进式

采用 `GraphQL` 并不需要将现有技术栈全部一步推翻，正如你计划从一个单体后端应用迁移到一个微服务架构上，这将是很好的一个机会去引入`GraphQL API`。当你的团队拥有多个微服务时，你的团队可以采用`GraphQL`聚合`Schema`的方式来集成一个 `GraphQL` 网关（`gateway`）。你可以通过将所有现有的` API `通过一个` API `网关不断一步一步汇集到一起，逐步完成到 `GraphQL` 的迁移。通过这种方式，你可以以较小的代价进行`GraphQL`架构的接入。

### 版本管理

在传统的`RESTful`架构中，我们的接口迭代往往伴随着多个`API`的版本切换（api.domain.com/v1/、api.domain.com/v2/），甚至存在新旧接口共存的情况，在许多情况下前端人员在调用不同接口的时候并没有意识到接口已经处于废弃的阶段，以及新接口的结构的转变，这对于一个项目的长期维护来说必然是存在隐患的。

而对于`GraphQL`来说，它可以精确到字段级别的废弃，且在前端人员进行使用的时候可以得到良好的提示，你可以灵活的进行各项接口字段的废弃和新增，而调用方能够实时得到同步，这无疑是一种比较友好的交互方式。

### 强类型

`GraphQL` 是一门强类型的查询语言，因为它是通过 `GraphQL Schema Definition Language`（`SDL`）书写的。在这一点上，我们可以对比`ts`与`js`的爱恨情仇，强校验对于代码的可维护性来说无疑是意义重大的。`GraphQL`配合一定编辑器插件不仅能够提供良好的书写提示，还能对代码进行一定的错误检测，能避免一些常见的语法错误。

### 接口健壮性

不再因为后端修改了接口的字段而没有同步前端的情况下导致前端调用出错，然后花费一定时间与后端`Battle`，这将是十分不友好的行为。为什么说`GraphQL`就能保证这一点呢，因为该标准下的面向前端的接口都有强类型的校验，完整的类型定义对前端透明，一旦出现前端进行`query`操作与后端接口定义不符，就能快速感知错误。

### 声明式查询

正如简介所述，`GraphQL`是一种`API`查询语言，同时它也是一种声明式的查询语言。客户端可以按照业务需要，通过声明式的方式获取数据。在一次接口调用中，我们可以定义我们想要的字段，服务端将按照用户需要返回特定的字段数据，不多不少，正正好好。在这个过程中，客户端与服务端的关系清晰，客户端只需要关注它需要什么数据，而服务端对自己的数据结构有明确的认知，同时对于每一个字段的数据获取方式有确定的渠道（微服务、数据库、第三方`API`），各司其职。

### 无数据溢出

它的声明式查询带给了客户端按需获取的能力，每一次的交互只会传输需要用到的字段，不会造成`RESTful`架构中出现的无关数据大量溢出的情况。

> 就社区生态而言，由`Facebook`维护，我们熟知的`github`、`Twitter`也加入了`GraphQL`的行列。

## 不足

### 复杂查询问题

#### 现象

提到这一点，就不得不说起`N+1`的问题了，那么什么是`N+1`问题呢？举个栗子：

![数据库映射关系](https://blog-images-1257398419.cos.ap-nanjing.myqcloud.com/GraphQL/N%2B1.png)

```javascript
const allUser = [{id: 1}, {id: 2}, {id: 3}}]
allUser.forEach(item => {
    queryScore(item.id);
})
```

正如上述代码表述，假设数据库设计中用户与用户的成绩分别属于两个表，首先我会需要先拿到包含所有用户`id`和`name`的数据，然后通过用户的`id`去查询用户的成绩，而上述的代码的执行将会导致明明一次查表就能解决的问题，在这里却需要进行"N +1"次操作才能完成，这显然是十分不友好的。

虽然说这不仅仅只有`GraphQL`才会造成的问题，但是在一定程度上它相较于`RESTful`更容易出现。这里其实主要会与`GraphQL`的逐层解析方式所造成的，正如官网所描述的：

> `GraphQL` 查询中的每个字段视为返回子类型的父类型函数或方法。事实上，这正是 `GraphQL` 的工作原理。每个类型的每个字段都由一个`*resolver* `函数支持，该函数由 `GraphQL` 服务器开发人员提供。当一个字段被执行时，相应的 `*resolver* `被调用以产生下一个值。
>
> 如果字段产生标量值，例如字符串或数字，则执行完成。如果一个字段产生一个对象，则该查询将继续执行该对象对应字段的解析器，直到生成标量值。`GraphQL `查询始终以标量值结束。

#### 解决方案

对于关系型数据库而言：

1. 针对**一对一**的关系（比如上面举例中提到的这个 `User` 与 `UserScore` 的关系），在从数据库里抓取数据时，就将所需数据 `join` 到一张表里。
2. 针对**多对一或者多对多**的关系，你就要用到一个叫做 `**DataLoader**` 的工具库了。其中，`Facebook` 为 `Node.js` 社区提供了 [DataLoader 的实现](https://github.com/facebook/dataloader)。`DataLoader `的主要功能是 `batching & caching`，可以将多次数据库查询的请求合并为一个，同时已经加载过的数据可以直接从 `DataLoader `的缓存空间中获取到，这样就能处理这种复杂请求的问题了。

### 缓存

一个简单缓存，相比 `RESTful`，在` GraphQL` 中实现会变得比较复杂。在 `RESTful` 中你通过 `URL` 访问资源，因此你可以在资源级别实现缓存，因为资源使用 `URL` 作为其标识符。在 `GraphQL` 中就复杂了，因为即便它操作的是同一个实体，每个查询都各不相同。比如，一个查询中，你可能只会请求一个作者的名字，但是在另外一次查询中你可能也想知道他的电子邮箱地址。这就需要你有一个更加健全的机制中来确保字段级别的缓存，实现起来并不简单。不过，多数基于 `GraphQL `构建的类库都提供了开箱即用的缓存机制，比如`Apollo`的缓存能力，它对于前端来说在一定程度上相比于`RESTful`体验更好。

那么为什么`GraphQL`不能像传统的`RESTful`架构一样在服务端加个`Header`就行了（协商缓存、强缓存）,答案是因为`RESTful`的`URL`是唯一的，因此可以作为`KEY`轻松实现缓存，而`GraphQL`本身只有一个`URL`，他的查询本质上是通过传`Schema`参数来实现数据获取或修改的，所以无法按旧有方式来实现缓存能力。

#### 解决方案

这里以`Apollo Client`为例，它为我们提供了缓存策略的可控机制：

##### cache-first

缓存优先，顾名思义，在发起请求时先查看是否命中缓存，如果命中则直接返回数据，如果没有则发起一次网络请求获取数据，并更新缓存。

##### cache-and-network

该策略所匹配的规则如下：

获取数据时，先检查缓存是否命中，如果命中，同理直接返回，但与缓存优先不同的是，不管缓存是否命中，它都会发起一次网络请求来更新缓存，如果前者没有命中缓存也就是还没有返回数据，那么请求完成之后再返回数据。这种方式的好处在于能够保证缓存数据的实时性。

##### network-only

仅仅走网络方式，不走缓存。这种就比较简单了，也就是对于任何请求，它不会检查缓存是否命中，直接发起请求，获取最新数据。

##### cache-only

与`network-only`恰恰相反，这种方式只会检查是否在缓存中，如果获取的数据没在缓存则会抛出错误。如果需要给用户一直显示同个数据而忽略服务端的变化时，或者在离线访问时，这个策略就非常有用了。

##### no-cache

同样的，从命名上就能知道该缓存的能力在于所有请求都走网络，不检查缓存，且请求到数据后也不进行数据缓存，如果你的数据只需要最新的，可以采用该方案。

对于策略的设置方式来说，你既可以为整个应用设置`fetch policy`，也可以单独为某个`query`设置，至于使用哪种策略，这就需要你根据项目的实际需要来决定了，如果你不设置特定策略，那么`Apollo`默认会采用`cache-first`。

## 核心概念

![核心概念](https://blog-images-1257398419.cos.ap-nanjing.myqcloud.com/GraphQL/core.png)

### Schema

用于定义数据模型的结构、字段的类型、模型间的关系，可以说是属于`GraphQL`的核心。它其实就跟`Typescript`很像，你在用的过程中就会发现，几乎只要你熟悉`ts`，使用`Schema`进行类型定义的时候会如鱼得水。

类型系统最终的目的主要是用来定义对象属性的形状，比如某个类型明确表示了对象中这个字段必须是`Int`类型那么在返回数据时该字段你就就必须返回整型。

#### 标量类型

这个可以类比于我们`typescript`的原始类型。

- `Int`：有符号 32 位整数。
- `Float`：有符号双精度浮点值。
- `String`：UTF‐8 字符序列。
- `Boolean`：`true` 或者 `false`。
- `ID`：ID 标量类型表示一个唯一标识符，通常用以重新获取对象或者作为缓存中的键。ID 类型使用和 String 一样的方式序列化；然而将其定义为 ID 意味着并不需要人类可读型。

大部分的`GraphQL `服务实现中，都有自定义标量类型的方式。例如，我们可以定义一个 `Date` 类型：

```graphql
scalar Date
```

然后就取决于我们的实现中如何定义将其序列化、反序列化和验证。例如，你可以指定 `Date` 类型应该总是被序列化成整型时间戳，而客户端应该知道去要求任何 `date` 字段都是这个格式。

#### 对象类型和字段

在使用`GraphQL`来构建系统的过程中，最基本的组件就是对象类型，因为`GraphQL`架构本质上就是在获取某个对象上的字段。

```graphql
type ObjectOne {
	name: String
	age: Int
}
```

这就是一个最基本的对象类型，它描述了这个对象中各个字段的具体类型是什么，对象中当然也可以嵌套对象，正如我们使用`Javascript`对象一样。

#### 枚举类型

这个其实跟`ts`中的使用方式差不多，也称作**枚举（enum）**，枚举类型是一种特殊的标量，它限制在一个特殊的可选值集合内，它同样被序列化为String。这让你能够：

1. 验证这个类型的任何参数是可选值的的某一个
2. 与类型系统沟通，一个字段总是一个有限值集合的其中一个值。

定义方式如下：

```graphql
enum Episode {
	ONE
	TWO
	Three
}
```

也就是说，我们给某个属性定义成了`Episode`，那么他的返回值一定是枚举类型中定义的三个值之一。

#### 联合类型

联合类型相当于一组类型的集合。

```graphql
type Cat{
　　wang: String!
}
type Fish{
　　miao: String!
}
union Animal = Cat | Fish
```

#### 接口

如果有接触过`ts`，那么这些概念可能对于你来说小菜一碟。方便查询时返回统一类型，接口是抽象的数据类型，因此只有接口的实现才有意义。

```graphql
interface Animal {
	name: String
}

type Dog implements Animal {
	name: String
	age: Int
}
```

上面代码表示如果你的类型被定义成`Dog`，那么你返回的数据中就可能包含这`name`、`age`这两个属性（为什么用的是可能呢，因为这里没有添加必填标识符，后面会进行讲述）。

#### 列表和非空

顾名思义，列表对应的就是用来描述一组数据而不是单个对象或单个字段，而非空类型相当于指定当前字段或者列表不得为空。

先看看他们分别长什么样（细心的同学会发现非空类型在上述代码中已经出现过了）：

```graphql
type Character {
  name: String!
  appearsIn: [String]!
  test: [String!]
}
```

从代码中我们可以看到，部分字段的类型后面加上了**!**，这个符号就是表示非空类型，如果加上了这个符号，那么这个字段就被标记为非空，如果被加在列表后面那么久表示这个列表不得为空也就是至少要有一个值。

一般我们都会用`[]`来表示这个字段是一个列表，然后在`[]`中标识集合中每个数据的类型。在这里我们非空标识符加在不同地方又会有不同的含义，下面会进行一一讲述：

```graphql
test: [String!]
```

这种方式表示就是列表内容可以为空，但是列表的每个项不得为空，这个代码中表示就是不得为空串。

```graphql
test: [String]!
```

如果是符号在`[]`的后面，那么就表示这个列表不得为空，也就是至少要有一个项或以上，但是可以包含空值成员。

#### 输入类型

一般来说我们都会有一个需求，我们需要传递一整个对象并且对象中包含了多个属性作为查询参数来获取数据，那么输入类型就是用来定义这个对象的形状的，它的定义方式和对象类型几乎一样，只不过定义的关键字是`input`。

```graphql
input myInput {
	name: String!
	age: Int!
}
```

这里主要用在客户端调用`Mutation`进行数据修改的时候会用到，具体的实例后面会进行详细分析，这里先理解一下。

### Query

![工作流](https://blog-images-1257398419.cos.ap-nanjing.myqcloud.com/GraphQL/query.png)

从这里开始就准备开始接触实际的操作了，`Query`就对比于`RESTful`来说就类似于`Router`，它是作为入口提供给客户端调用查询数据的。

我们再来看看详细的定义方式：

```graphql
type Account {
    name: String
    age: Int,
    sex: String,
    salary(city: String): Int
}

type Query {
    name: String
    age: Int,
    account(username: String!): Account
    accounts: [Account]
}
```

> 我们这里可以先忽略字段后面括号内容，这个属于`Argument`的内容，详细可以参考`Argument`部分。

从代码中来看，这里定义了`Query`类型，它是作为查询入口而存在的，同时这个对象中定义了多个字段，这些字段将暴露给客户端进行查询返回，并且这些字段不限于标量类型联合类型等等，不仅如此，定义在`Query`中的这些字段都要有他们各自的`resolver`，因为这里只是定义了他们的结构，具体返回值和逻辑部分需要有特定的`resolver`来处理，具体参考下面`resolver`部分。

那么客户端又是怎么做到针对这些字段进行查询的呢？其实也很简单，直接按照他的结构进行一一对应查询即可，具体实现如下：

```graphql
query {
    account(username: "小李子") {
        name
        sex
        age
    }
    age,
    name
}
```

如上所示，我们可以按照我们想要的字段进行查询，我们需要什么字段就在对应的结构中写上字段名，那么服务器接收到请求之后就会按照你想要的仅仅返回你定义的查询字段，其他的都不会返回。

这里有一个注意点，如果你的目标对象不是原始类型，而是一个对象，那么你必须标识你需要这个对象上的特定字段，也就是说必须精确到标量类型，否则就会出错，比如上面的`account`字段（这里忽略传参逻辑，后面会说），这个`account`对象定义的类型是`Account`，而`Account`类型具有`name`、`age`、`sex`、`salary`字段，那你在查询的时候，必须指定这个字段对象中的值，如果这个值还是对象，那你就还必须循环上述步骤直至拿到标量类型为止。

#### Argument

关于参数，我们应该也很熟悉了，不就是类似于函数一样的传参。话虽如此，但是这里还是有点区别的。

我们从代码层次来看`GraphQL`中怎么实现传参的：

```graphql
{
	salary(city: String!): Int
}
```

首先上面这个是在服务端定义结构的时候的写法，也比较好理解，也就是想要获取这个字段的值，那么你就必须传递这个参数（因为加了！，所以必须传），具体的这个参数怎么接收怎么处理，`Resolver`部分会提到，然后我们再来看客户端怎么进行查询传参的：

```graphql
query {
	salary(city: "上海") 
}
```

是不是也很好理解，只要参数名与你在服务端定义的参数名一致就可以了，然后后面给定具体的值。

### Resolver

对于`GraphQL`来说，它只有一个入口点，也就是根节点，查询一般都是从这个`Root`开始。

假设有这样一个`Schema`：

```graphql
type UserInfo {
	name: String
	age: Int
}
type Query {
	userinfo(userId: Int): UserInfo
}
```

而对应的客户端查询语句如下：

```graphql
query {
	userinfo(userId: 666): {
		name
		age
	}
}
```

为了正常的响应给客户端这些字段的数据，那么我们就需要给特定的字段编写它的`resolver`。比如，上述的`userinfo`对应的实际数据其实就是由一个`resolver`进行处理返回的，一个`resolver`一般是一个对应的是一个函数，参数分别为：

- `obj` 代表上一个对象；
- `args`　查询参数；
- `context`　上下文，类似于`Koa`的`ctx`；

那么如何编写上述`userinfo`字段的`resolver`呢：

```graphql
const root = {
	userinfo: function(obj, args, context) {
		const userId = args.userId;
		return {
			name: '李明' + userId,
			age: 18
		}
	}
}
```

这里忽略了这些数据的获取方式，直接写死的，而在实际项目中，这些字段的数据来源可以是数据库或者是其他`RPC`调用等等方式。同时我们应该也能注意到，我们在对需要传参的字段做处理的时候，直接可以从`args`中拿到对应的参数值，然后做逻辑处理返回。

在编写完`resolver`后，这个字段才能在查询的时候拿到对应的值。

### Mutation

在讲解完`Query`和`Resolver`之后，相信大家对基本的查询交互代码编写已经有所了解，那么现在就继续讲解怎么修改数据吧。

在开始讲解修改数据之前我们需要想想，如果我们需要修改某个用户的信息，我们是不是需要把新信息作为参数传递过去，那么这个参数类型势必就不是一个标量类型能够表示的了，所以就需要用到我们上面提到过的输入类型来进行传参。

#### 定义输入类型传参

首先先定义`schema`

```graphql
type Account {
    name: String
    age: Int,
    sex: String,
    salary(city: String): Int
}

input AccountInput {
    name: String
    age: Int,
    sex: String
}

type Mutation {
    createAccount(input: AccountInput): Account
}
```

> 这里与`Query`不同的是，它的名字需要改成`Mutation`，`Query`与`Mutation`这两个名字是指定的，不能更改。

我们从代码上看，其实和`Query`传参区别不大，唯一的区别在于参数的类型由之前的`String`变成现在了`AccountInput`，也就是从一个标量类型变成了一个对象类型，而定义输入类型的方式也从`type`变成了`input`。

然后再来看看客户端传参方式：

```graphql
mutation {
  createAccount(input: {
    name: "李四"
    age: 10
    sex: "女"
  }) {
    name
  }
}
```

其实这里和上述的传参方式没啥区别，唯一的不同就是类型的转变，这里变成了对象方式的传参。

### 实战

![工作流](https://blog-images-1257398419.cos.ap-nanjing.myqcloud.com/GraphQL/practice.png)

#### Server端

这里采用`express`进行演示，首先需要安装几个`npm`包：

```shell
npm i express express-graphql graphql -S
```

- `express`： 搭建服务
- `express-graphql`： `graphql`相关中间件
- `graphql`：核心包

```javascript
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
    type Account {
        name: String
        age: Int,
        sex: String,
        salary(city: String): Int
    }

    type Query {
        name: String
        age: Int,
        account(username: String!): Account
        accounts: [Account]
    }

    input AccountInput {
        name: String
        age: Int,
        sex: String
    }

    type Mutation {
        createAccount(input: AccountInput): Account
    }
`)

const root = {
    name() {
        return '陌路'
    },
    age() {
        return 18
    },
    account({ username }) {
        return {
            name: username,
            age: 17,
            sex: '男',
            salary({ city }) {
                if (city === '上海') {
                    return 10000
                }
                return 3000
            }
        }
    },
    createAccount({ input }) {
        db[input.name] = input;
        return input;
    },
    accounts() {
        let arr = []
        for(const key in db) {
            arr.push(db[key])
        }
        return arr
    }
}

let db = {}

const app = express();

app.use(express.static(__dirname + '/public'));

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue:root,
    graphiql: true
}))

app.listen(4000, () => console.log('listening port: 4000'));
```

从上面的实例代码来看，这里主要分析一下流程逻辑：

1. 编写`schema`，定义接口类型等。
2. 编写`resolver`，代码中`root`对象中的一个个函数就是需要暴露给客户端调用查询的字段各自的`resolver`，用于处理如何返回数据
3. 实例化一个`express`对象
4. 添加相关中间件
5. 启动服务

有关于`express`相关的教程网上很多这里就不进行细说了，主要讲一下这个`graphqlHTTP`用到的几个配置项：

- `schema`：就是我们上文提到的`schema`，不过这里需要先利用`buildSchema`处理一下用字符串编写的`schema`语句（可以说是语法糖）
- `rootValue`：包含所有能被客户端访问到的字段的`resolver`对象
- `graphiql`：本地调试工具，开发环境使用（巨好用）

然后我们看看如何借助`graphiql`工具调试我们的服务吧：

![调试界面](https://blog-images-1257398419.cos.ap-nanjing.myqcloud.com/GraphQL/graphiql.png)

这里可见有中间两部分分别对应请求和响应，右侧还有一个侧边栏，相当于文档，如果这个字段是对象，还可以继续点进去看它包含的字段有哪些。

具体查询语句上文也有提到这里就不多赘述了，其实也很清晰了，你需要什么字段，就写上对应的字段名即可得到想要的响应。

#### 客户端

上面我们介绍了如果使用本地调试工具进行接口调试，那么现在就来讲讲怎么在实际的浏览器端进行接口调用吧：

```html
<script>
        function queryData() {
            const query = `
                query ($username: String!) {
                    account(username: $username) {
                        name
                        sex
                        age
                    }
                    age,
                    name
                }
            `

            fetch('/graphql', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                },
                body: JSON.stringify({
                    query,
                    variables: {
                        username: "陌小路"
                    }
                })
            }).then(res => console.log(res.json()));
        }
    </script>
```

同样先分析一下流程：

1. 构建查询参数，也就是上述调试工具中我们写的查询语句，这里用字符串包裹起来，一般是使用模板字符串比较实用。
2. 设置请求参数与请求头
3. 发起请求

对于请求参数这里再进行一下详细解析，首先需要给`body`传递一个被序列化的参数，内容包含：

- `query`：查询语句
- `variables`：语句中用到的请求参数

这里可能就会有小伙伴懵逼了，这个查询语句中的`$username`是用来干嘛的，服务端也没有定义这个参数啊，其实这个`$username`就是用来对应我们在请求的时候传给`body`的`variables`对象中的`username`，只不过需要在前面加上一个`$`符号进行标识的。

这样整个前后端在`GraphQL`体系下的交互方式也差不多讲解完了。

## 总结

总的来说，对于`GraphQL`这项技术未来是否能替代`RESTful`体系也不好说，只不过这相对于传统的`RESTful`架构是一种截然不同的概念，我们可以选择在新项目中进行尝鲜，也可以在老项目中进行架构调整，迁移到`GraphQL`，甚至可以两者皆存。这两种架构都有各自的优劣，我们可以根据我们自身的需求进行选择。总之，我相信`GraphQL`的发展潜力还是很大的，希望未来能将现存的不足进行更好的改进吧。

>  整理不易，跪求一赞😭。
