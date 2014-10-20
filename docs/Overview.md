# 框架概述（Overview）

## 基础知识

### 阅读基础知识要求
需要读者拥有以下基础知识
* HTML、CSS、JS
* Ajax
* Bookmark
* History
* URL hash

### 单页应用
单页应用即single-page application (SPA)，或single-page interface (SPI)。指：

>使用容纳在单一个网页的web应用或web网站，旨在提供更流畅的接近原生应用的用户体验。

单页应用通常使用ajax为基础技术，在单一网页内，动态增加或替换DOM片段，以获得无刷新的操作体验。
在此基础上，加上CSS animation，以达到接近原生应用的效果。

### 书签和历史管理
传统的Web网站是多个包含信息的网页，及其相互之间的链接组成的。每一个网页能够由唯一的URL标识。因此浏览器可以通过书签（Bookmark）对正在阅读的页面进行保存。另外可以通过历史（History）进行前进和返回。

但对于单页应用，由于所有内容变换都是在同一个网页上进行的，因此Web的两个天然特性书签和历史便会失效。

幸运的是，我们可以通过URL锚点（hash）标识当前正在显示的页面。单页应用通过识别hash的值和改变，来显示相应的页面内容，以达到模拟传统Web网站的特性。

另外，HTML5引入pushState特性，也能达到效果，此处不再赘述。

### 路由
在单页应用中，路由最本质的职责是根据URL hash的改变，来执行相应的操作。

在butterfly.js中，路由的职责被简单收窄为：
>根据URL hash的改变，显示相应的视图

当然，这个行为可以被替换和修改的。

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

Butterfly.js是这么一个框架：
* 通过整合bootstrap或ratchet提供基础样式
* 使用require.js对代码进行规范化管理
* 扩展[backbone.js](http://backbonejs.org)实现MVC架构
* 提供基础组件及容器快速上手
* 提供直观的视图编写方式，及视图绑定机制

Butterfly.js与其说是一个前端框架，更贴切的说法是：
>基于require.js, backbone.js等基础框架的前端应用开发最佳实践技术堆栈。

### Butterfly.js技术堆栈：
* zepto.js/jquery.js（jquery就不说了，zepto可以简单理解为与jquery的轻量版，提供与jquery几乎一样的API，两者根据需求二选一）
* require.js（javascript模块化框架，用以提供统一的代码管理机制）
* require-css（插件，动态加载css文件）
* requirejs-domready（插件，如其名）
* requirejs-i18n（插件，用于实现国际化）
* requirejs-text（插件，以文本形式加载资源）
* underscore.js（函数式类库）
* backbone.js（SPA架构的MVC框架，backbone.js是一个提供MVC基础构件的框架，而非一个高大全的框架。它依赖于underscore.js）

另外，捆绑了一些使用频率很高的框架：
* iScroll（提供类似iOS的滚动加速和回弹效果）
* fastclick（消除click事件的300ms的延迟）
* moment（时间处理类库）
* spinjs（展示loading）

及其构建框架：
* Grunt.js（任务执行）
* bower.js（依赖管理）

### 视图（View）

Butterfly.View继承自[Backbone.View](http://backbonejs.org/#View)，Backbone.View的实例会关联到一个HTML元素上：
* 通过设置el属性，直接关联到一个HTML元素上
* 通过设置tagName，className属性，View对象初始化时，会生成一个detach（没有父节点，不在页面上）的HTML元素
* 通过调用setElement方法，关联到别的HTML元素上

Butterfly.View在Backbone.View的基础上，增加了如下特性：
* 默认返回键事件绑定
* window的orientationchange, resize, scroll事件响应
* onShow, onHide回调
* 子视图管理
* 路由功能（route方法）
* CSS3动画支持

我们可以使用backbone.js的继承机制，自定义一个Butterfly.View：
```js
define(['butterfly/View'], function(View){

  return View.extend({

  });
});
```

### 视图（View）层级结构
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
应用的用户界面，就是由View及容器（其实是View的子类）组合而成。呈树形结构，根节点称为rootView。可以通过butterfly.rootView访问。

### 视图管理及容器
Butterfly.js作为一个单页架构的前端框架，对视图的管理显得尤为重要，Butterfly.js中，由容器担负这个职责。

Butterfly.js提供以下几个基础容器：
* StackView
* TabBar

### 路由

路由是Butterfly.js最重要的一环。

Butterfly.js的设计基于一个基础思想：任何一个UI状态（页面状态），均可以由唯一的URL代表（类似RESTful的思想）。
另外为了减少配置，Butterfly.js采用容器路由的方案。

注：目前来说，这种做法的合理性有待考究，但目前来看，确实能做到**满足大多数应用场景**及**简化配置**两个诉求。
