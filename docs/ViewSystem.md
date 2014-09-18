# Overview

## 基础知识

### 单页应用
单页应用即single-page application (SPA)，或single-page interface (SPI)。

指使用容纳在单一个网页的web应用或web网站，旨在提供更流畅的接近原生应用的用户体验。

单页应用通常使用ajax为基础技术，在单一网页内，动态增加或替换DOM片段，以获得无刷新的操作体验。

在此基础上，加上CSS animation，以达到接近原生应用的效果。

### 单页应用的书签和历史管理
传统的Web网站是多个包含信息的网页，及其相互之间的链接组成的。每一个网页能够由唯一的URL标识。因此浏览器可以通过书签（Bookmark）对正在阅读的页面进行保存。另外可以通过历史（History）进行前进和返回。

但对于单页应用，由于所有内容变换都是在同一个网页上进行的，因此Web的两个天然特性书签和历史便会失效。

幸运的是，我们可以通过URL锚点（hash）标识当前正在显示的页面。单页应用通过识别hash的值和改变，来显示相应的页面内容，以达到模拟传统Web网站的特性。

另外，HTML5引入pushState特性，也能达到效果，此处不再赘述。

### Web应用的MVC模式
MVC一种设计模式，能够将业务逻辑，数据和用户界面代码进行有效组织，适用于传统桌面、移动应用。

例如cocoa开发环境，视图的主要作用是通过drawRect方法绘制（渲染）用户界面，并将UI事件交给Controller处理。

但到了Web应用，事情就变得简单多了，因为浏览器会帮你处理绘制（渲染）的事情，你只需要用HTML标记和CSS告诉浏览器你的界面是怎样的，浏览器就能够帮你完成绘制工作。

在这个架构下，对应到传统MVC架构中View角色的，其实是一堆HTML标记和CSS。没有包含太多的逻辑。那么View与Controller之间的区别和职责就变得模糊，因此我们可以通过一个View对象来代表传统MVC中的视图和控制器。

因此在Web应用中，视图（View）的职责如下：
* 管理HTML标记，及CSS样式，
* 绑定和响应界面事件
* 沟通数据模型


## Butterfly.js的基础架构

### 视图（View）

Butterfly.js的架构基于[Backbone.js](http://backbonejs.org)，Butterfly.View继承自Backbone.View。

#### Backbone.View基础

View的实例会关联到一个HTML元素上：
* 通过设置el属性，直接关联到一个HTML元素上
* 通过设置tagName，className属性，View对象初始化时，会生成一个detach（没有父节点，不在页面上）的HTML元素
* 通过调用setElement方法，关联到别的HTML元素上

具体请参考[Backbone.js官方文档](http://backbonejs.org/#View)

#### Butterfly.View
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

### 视图层级结构
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
应用的用户界面，就是由View及容器（其实也是View）组合而成。呈树形结构，根节点称为rootView。可以通过butterfly.rootView访问。

### 视图管理
butterfly.js作为一个单页架构的前端框架，

### 路由

路由是Butterfly.js最重要的一环。

Butterfly.js的设计基于一个基础思想：任何一个UI状态（页面状态），均可以由唯一的URL代表（类似RESTful的思想）。
另外为了减少配置，Butterfly.js采用容器路由的方案。

注：目前来说，这种做法的合理性有待考究，但目前来看，确实能做到**满足大多数应用场景**及**简化配置**两个诉求。
