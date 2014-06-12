# Butterfly.js

Butterfly.js是一个简单易用的移动Web框架。

Butterfly.js的特性
* 页面绑定
* 支持AMD & Require.js
* 自身不维护视觉UI组件，只提供逻辑组件，同时能方便地与第三方WebUI框架进行融合。

## 快速开始

```html
<!DOCTYPE html>
<html>
<head>
	<title>Butterfly.js</title>
	<script type="text/javascript" src="../butterfly/js/require.js" data-main="../butterfly/js/butterfly-amd"></script>
</head>
<body>

</body>
</html>
```

## 使用组件

### 通过data-view属性绑定组件
Butterfly.js允许通过在html元素上添加data-view属性，进行组件绑定

例如以下工程：
<pre>
myproject
	┣member
	┃  ┗login.js
	┗main
	    ┗index.html
</pre>

其中main/index.html内容如下：
```html
<!DOCTYPE html>
<html>
<head>
	<title>Butterfly.js</title>
	<script type="text/javascript" src="../butterfly/js/require.js" data-main="../butterfly/js/butterfly-amd"></script>
</head>
<body>
	<div data-view="member/login">
		<input id="username" type="text"/>
		<input id="password" type="password"/>
		<button id="login">Login</button>
	</div>
</body>
</html>
```

member/login.js
```js
define(['butterfly/view'], function(View){
	return View.extend({
		events: {
			"click #login": "doLogin"
		},
		doLogin: function(){
			var username= this.$('#username').val();
			console.log('login as: %s', username);
		}
	});
});
```

目前内置提供的组件如下：
* View
* TabBar
* Container
* ListView

内置的组件，统一使用butterfly前缀，例如"butterfly/view"，另外，为了简便起见，可以使用$前缀代表butterfly，例如"$view"

## 深入理解Butterfly.js

butterfly.js的核心组件
* Butterfly
* Butterfly.Application
* Butterfly.View
* Butterfly.ViewLoader
* Butterfly.History
* Butterfly.Router

### Butterfly.Application

### Butterfly.View
对Backbone.View进行增强，将view对象绑定到el上（remove时解除），添加subviews属性

### Butterfly.ViewLoader
ViewLoader用于构建页面绑定，能够通过在DOM元素的data-view属性，构建绑定结构，支持两种加载模式：
1. 按DOM节点加载
2. 按html页面加载

页面绑定示例：
```html
<div data-view="butterfly/container">
	<div data-view="member/login">
	...
	</div>
	<div data-view="member/register">
	...
	</div>
</div>
```

#### 按DOM节点加载
给定一个el对象，加载逻辑如下：
1. 检查el的绑定类型，若没有，绑定类型设为butterfly/view
2. 构建el及其所有子节点的绑定
3. 所有el的子节点的绑定View对象，挂到el的View对象的subviews下（扁平化结构，无层级关系）
4. 返回el的绑定View对象

```js
Butterfly.ViewLoader.loadView(document.querySelector('#sample'), function(view){
	//using view object
}, err);
```

#### 按页面加载
加载逻辑如下：
1. 通过require.js的text插件进行页面加载（ajax）
2. 新建一个div元素作为容器
3. 将改页面body内的所有元素，放到该div内
4. 构建改页面的所有页面绑定

示例用法：
```js
Butterfly.ViewLoader.loadView('mail/index.html', function(view){
	//using view object
}, err);
```

### Butterfly.History
对Backbone.History进行增强，增加unroute函数，能够解除路由

### Butterfly.Router
对Backbone.Router进行增强，借助Butterfly.History，能够通过调用remove方法，解除自身定义的路由规则绑定



## 扩展组件

### ListView

## Optimization
TODO: 加载速度优化

## 模块化开发

### CSS模块化
* 使用require-css插件按需加载样式，例如显示某个页面需要依赖login/index.css，可以用以下形式，则requirejs会保证样式已经加载：

```js
require(['css!login/index'], function(){

});
```

* 每个逻辑页面，使用唯一前缀，例如登陆页面的id为login，则页面css使用以下形式编写：

```css
#login input {
	...
}

#login #login-button{
	...
}
```


## Tips & Traps

### 继承与函数重写
Butterfly沿用Backbone的继承方式，有一点需要注意的是，请注意重写一个类方法时，是否需要对父类方法的调用。

例如：
```js
View.extend({
	initialize: function(){
		View.prototype.initialize.call(this, arguments);
		console.log('init~~~~~');
	}
});
```
上面的代码，我们重写View类的initialize方法，但我们只做功能增强，所以需要确保父类的方法也得到调用。
js没有super，所以我们要基于prototype进行父类调用。

### 缓存
1. 浏览器默认会缓存http请求，以减少流量消耗及提高加载速度，但现代Web系统通常会使用大量Javascript。
2. 而AMD的应用的开发时，会使JS文件数量变得更多。
3. 现代应用的高频率迭代，使JS的修改周期远远小于缓存周期，这就会导致最新修改的逻辑无法及时体现。误导开发，浪费时间反复调试。甚至会影响生产系统的正常运行。

#### 开发模式
每一次刷新页面，都会使用时间戳作为加载AMD模块的后缀，防止缓存
```js
var require = {
	urlArgs: "bust=" + (new Date()).getTime()
};
```

#### 生产模式
与开发模式类似，每次发布新版本，都更新版本号，以防止上个版本的缓存，但同时能保证此版本的AMD模块得到缓存。
```js
var require = {
	urlArgs: "bust=v1";
};
```

## Build The Framework

## TODO
* Router与container绑定
* 构建、Optimization
* requirejs butterfly.view插件
