# Butterfly.js

Butterfly.js是一个简单易用的移动Web框架。

Butterfly.js的特性
* 页面绑定
* 支持AMD & Require.js
* 自身不维护视觉UI组件，只提供逻辑组件，同时能方便地与第三方WebUI框架进行融合。

## 快速开始

首先要有一个普通的html页面，然后分别引入两个js：
* zepto.js
* butterfly.js

好，有代码有真相。
PS: 如果不知道zepto是什么？好吧，你可以把它当做jQuery的移动版，有着与jQuery几乎一致的语法，gzip后大小只有5~10k，另外在移动设备上的运行速度比jQuery快。要深入了解，请移步[Zepto官网](http://zeptojs.com)。

```html
<!DOCTYPE html>
<html>
<head>
	<title>Butterfly.js</title>
	<script type="text/javascript" src="../vendor/zepto/zepto.js"></script>
	<script type="text/javascript" src="../js/butterfly.js"></script>
</head>
<body>

</body>
</html>
```

### 视图绑定

```html
<!DOCTYPE html>
<html>
<head>
	<title>Butterfly.js</title>
	<script type="text/javascript" src="../vendor/zepto/zepto.js"></script>
	<script type="text/javascript" src="../js/butterfly.js"></script>
</head>
<body>

</body>
</html>
```

## AMD模式支持/与Require.js集成

```html
<!DOCTYPE html>
<html>
<head>
	<title>Butterfly.js</title>
	<script type="text/javascript" src="../vendor/requirejs/require.js"></script>
	<script type="text/javascript" src="../js/butterfly-amd.js"></script>
</head>
<body>

</body>
</html>
```

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
对Backbone.View进行增强，将view对象绑定到el上（remove时解除），添加subviews熟悉

### Butterfly.ViewLoader
ViewLoader用于
Load Page
```js
Butterfly.ViewLoader.loadView('mail/index.html', function(view){
	//using view object
}, err);
```

Load By DOM
```js
Butterfly.ViewLoader.loadView(document.querySelector('#container-sample'), function(view){
	//using view object
}, err);
```

### Butterfly.History
对Backbone.History进行增强，增加unroute函数，能够解除路由

### Butterfly.Router
对Backbone.Router进行增强，借助Butterfly.History，能够通过调用remove方法，解除自身定义的路由规则绑定



## 扩展组件

### ListView


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
