# 视图体系

## Web应用与MVC模式
MVC一种设计模式，能够将业务逻辑，数据和用户界面代码进行有效组织，适用于传统桌面、移动应用。

例如cocoa开发环境，视图的主要作用是通过drawRect方法绘制（渲染）用户界面，并将UI事件交给Controller处理。

但到了Web应用，事情就变得简单多了，因为浏览器会帮你处理绘制（渲染）的事情，你只需要用HTML标记和CSS告诉浏览器你的界面是怎样的，浏览器就能够帮你完成绘制工作。

在这个架构下，对应到传统MVC架构中View角色的，其实是一堆HTML标记和CSS。没有包含太多的逻辑。那么View与Controller之间的区别和职责就变得模糊，因此我们可以通过一个View对象来代表传统MVC中的视图和控制器。

因此在Web应用中，视图（View）的职责如下：
* 管理HTML标记，及CSS样式，
* 绑定和响应界面事件
* 沟通数据模型

## Butterfly.js的视图（View）

Butterfly.js的架构基于[Backbone.js](http://backbonejs.org)，Butterfly.View继承自Backbone.View。

### Backbone.View基础

View的实例会关联到一个HTML元素上：
* 通过设置el属性，直接关联到一个HTML元素上
* 通过设置tagName，className属性，View对象初始化时，会生成一个detach（没有父节点，不在页面上）的HTML元素
* 通过调用setElement方法，关联到别的HTML元素上

具体请参考[Backbone.js官方文档](http://backbonejs.org/#View)

### Butterfly.View
Butterfly.View在Backbone.View的基础上，增加了如下特性：
* 默认返回键事件绑定
* window的orientationchange, resize, scroll事件响应
* onShow, onHide回调
* 子视图管理
* 路由功能（route方法）
* CSS3动画支持

```js
define(['butterfly/View'], function(View){

  return View.extend({

  });
});
```

## 视图层级结构
界面上显示的元素，以View为单位进行组织，而一些特殊的View管理着其他的若干View，这些View被成为容器(Container)。

如下图所示，root为一个容器，管理着view1,view2,view3三个视图，而view2也是一个容器，管理着view21,view22两个视图。
```
root
┗view1
┗view2
┃┗view21
┃┗view22
┗view3
```
应用的用户界面，就是由View及容器（其实也是View）组合而成。呈树形结构，根节点称为window。

## 路由

路由是Butterfly.js最重要的一环。

Butterfly.js的设计基于一个基础思想：任何一个UI状态（页面状态），均可以由唯一的URL代表（类似RESTful的思想）。
另外为了减少配置，Butterfly.js采用容器路由的方案。

注：目前来说，这种做法的合理性有待考究，但目前来看，确实能做到**满足大多数应用场景**及**简化配置**两个诉求。
