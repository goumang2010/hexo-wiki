---
title: quiz
excerpt: 
categories: 
- FE
---


# 试题
## HTML


### 名词
* DOCTYPE
* SGML SGML(Standard Generalized Markup Language,即标准通用标记语言)SGML是国际上定义电子文档和内容描述的标准。HTML5 不基于 SGML，因此不需要对DTD进行引用，但是需要doctype来规范浏览器的行为（让浏览器按照它们应该的方式来运行）； 而HTML4.01基于SGML,所以需要对DTD进行引用，才能告知浏览器文档所使用的文档类型。

### 试题
* 行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？
* 浏览器的内核分别是什么?
* 常见兼容性问题？
* html5有哪些新特性、移除了那些元素？如何处理HTML5新标签的浏览器兼容问题？如何区分 HTML 和
HTML5？
* 语义化的理解？
* HTML5的离线储存？
* iframe有那些缺点？
* HTML5的form如何关闭自动完成功能？
* 请描述一下 cookies，sessionStorage 和 localStorage 的区别？
* 如何实现浏览器内多个标签页之间的通信?
* webSocket如何兼容低浏览器?

### 链接
https://segmentfault.com/a/1190000000465431

## CSS


### 名词
* justify单词两端对齐
```
text-align:justify
```
* text-transform
```
h1 {text-transform:uppercase}
h2 {text-transform:capitalize}
p {text-transform:lowercase}
```
capitalize每个单词以大写开头

### 试题
* 介绍一下CSS的盒子模型？
* CSS 选择符有哪些？哪些属性可以继承？优先级算法如何计算？ CSS3新增伪类有那些？
* 如何居中div？如何居中一个浮动元素？
* 列出display的值，说明他们的作用。position的值， relative和absolute定位原点是？
* CSS3有哪些新特性？
* 一个满屏品字布局 如何设计?
* 经常遇到的CSS的兼容性有哪些？原因，解决方法是什么？
* 为什么要初始化CSS样式。
* absolute的containing block计算方式跟正常流有什么不同？
https://www.zhihu.com/question/20086234
* position跟display、margin collapse、overflow、float这些特性相互叠加后会怎么样？
* 对BFC规范的理解？
http://www.cnblogs.com/lhb25/p/inside-block-formatting-ontext.html
* css定义的权重
* 解释下浮动和它的工作原理？清除浮动的技巧
* 用过媒体查询，针对移动端的布局吗？
* 使用 CSS 预处理器吗？喜欢那个？
* 如果需要手动写动画，你认为最小时间间隔是多久，为什么？
* display:inline-block 什么时候会显示间隙？

## JS


### 概念
* AMD CMD

### 试题
* 对象和引用的概念
```
var a = {n:1};  
var b = a; // 持有a，以回查  
a.x = a = {n:2};  
alert(a.x);// --> undefined  
alert(b.x);// --> {n:2}
```
* JavaScript原型，原型链 ? 有什么特点？
* 说几条写JavaScript的基本规范？
* eval是做什么的？
* null，undefined 的区别？
* 写一个通用的事件侦听器函数
* Node.js的适用场景？
* 介绍js的基本数据类型。
* Javascript如何实现继承？
* ["1", "2", "3"].map(parseInt) 答案是多少？
* 如何创建一个对象? （画出此对象的内存图）
* 谈谈This对象的理解。
* 事件是？IE与火狐的事件机制有什么区别？ 如何阻止冒泡？
* 什么是闭包（closure），为什么要用它？
* "use strict";是什么意思 ? 使用它的好处和坏处分别是什么？
* 如何判断一个对象是否属于某个类？
* new操作符具体干了什么呢?
* Javascript中，有一个函数，执行时对象查找时，永远不会去查找原型，这个函数是？
* JSON 的了解？
* js延迟加载的方式有哪些？
* ajax 是什么?
* 同步和异步的区别?
* 如何解决跨域问题?
* 模块化怎么做？
* AMD（Modules/Asynchronous-Definition）、CMD（Common Module Definition）规范区别？
* 异步加载的方式有哪些？
* .call() 和 .apply() 的区别？
* Jquery与jQuery UI 有啥区别？
* JQuery的源码看过吗？能不能简单说一下它的实现原理？
* jquery 中如何将数组转化为json字符串，然后再转化回来？
* 针对 jQuery 的优化方法？
* JavaScript中的作用域与变量声明提升？
* 如何编写高性能的Javascript？
* 那些操作会造成内存泄漏？
* JQuery一个对象可以同时绑定多个事件，这是如何实现的？
* 如何判断当前脚本运行在浏览器还是node环境中？


---
title: 
excerpt: 
categories: 
- FE
---


# 答案
## HTML


### 名词
* DOCTYPE
* SGML SGML(Standard Generalized Markup Language,即标准通用标记语言)SGML是国际上定义电子文档和内容描述的标准。HTML5 不基于 SGML，因此不需要对DTD进行引用，但是需要doctype来规范浏览器的行为（让浏览器按照它们应该的方式来运行）； 而HTML4.01基于SGML,所以需要对DTD进行引用，才能告知浏览器文档所使用的文档类型。

### 试题
* 行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？
```
行内元素：a b  img span strong
块级元素：div ol ul dl li h1 h2 h3 p
空元素：br hr img input link meta
```
* 浏览器的内核分别是什么?
```
IE-Trident FF-Gecko Chrome-Blink Opera-Blink Edge-改进Trident
```
* 常见兼容性问题？
- 内外边距初始值不同：  *{margin:0;padding:0;}
- IE6中后面的一块被顶到下一行，加入 display:inline;将其转化为行内属性
- 设置display:block后采用float布局，又有横行的margin的情况，IE6间距bug；在display:block;后面加入display:inline;display:table;
- 图片默认有间距；使用float属性为img布局
- 最低高度设置min-height不兼容；如果我们要设置一个标签的最小高度200px，需要进行的设置为：{min-height:200px; height:auto !important; height:200px; overflow:visible;}
* html5有哪些新特性、移除了那些元素？如何处理HTML5新标签的浏览器兼容问题？如何区分 HTML 和HTML5？
新特性：更丰富的标签，如video audio；
语义标签:<br />[[文件:Html5_1.png]]<br />对标题进行组合：hgroup
绘图标签：canvas <br />
可选数据的列表：datalist,与input配合使用 <br />
移除了仅表现元素（交给CSS），如big center font

* 语义化的理解？
* HTML5的离线储存？
* iframe有那些缺点？
* HTML5的form如何关闭自动完成功能？
* 请描述一下 cookies，sessionStorage 和 localStorage 的区别？
* 如何实现浏览器内多个标签页之间的通信?
* webSocket如何兼容低浏览器?

### 链接
https://segmentfault.com/a/1190000000465431

## CSS


### 名词
* justify单词两端对齐
```
text-align:justify
```
* text-transform
```
h1 {text-transform:uppercase}
h2 {text-transform:capitalize}
p {text-transform:lowercase}
```
capitalize每个单词以大写开头

### 试题
* 介绍一下CSS的盒子模型？
* CSS 选择符有哪些？哪些属性可以继承？优先级算法如何计算？ CSS3新增伪类有那些？
* 如何居中div？如何居中一个浮动元素？
* 列出display的值，说明他们的作用。position的值， relative和absolute定位原点是？
* CSS3有哪些新特性？
* 一个满屏品字布局 如何设计?
* 经常遇到的CSS的兼容性有哪些？原因，解决方法是什么？
* 为什么要初始化CSS样式。
* absolute的containing block计算方式跟正常流有什么不同？
https://www.zhihu.com/question/20086234
* position跟display、margin collapse、overflow、float这些特性相互叠加后会怎么样？
* 对BFC规范的理解？
http://www.cnblogs.com/lhb25/p/inside-block-formatting-ontext.html
* css定义的权重
* 解释下浮动和它的工作原理？清除浮动的技巧
* 用过媒体查询，针对移动端的布局吗？
* 使用 CSS 预处理器吗？喜欢那个？
* 如果需要手动写动画，你认为最小时间间隔是多久，为什么？
* display:inline-block 什么时候会显示间隙？
* 实现轮播效果：
```
 
<div class="wrap">
    <div class="carousel">
        <div><img src="a.jpg" /></div>
        <div><img src="b.jpg" /></div>
        <div><img src="c.jpg" /></div>
    </div>
</div>
<style>
        .wrap {
            width: 600px;
            min-height:400px;
            margin: 0 auto;
            position: relative;
            overflow: hidden;//隐藏超出的内容
        }
        .carousel {
            position: absolute;//定位图片
            transition: all 0.5s ease-in 0s;//轮播动画
        }
        img {
            width: 100%;
        }
        .carousel div {
            float: left;
            width: 33.333%;
            text-align: center;
        }
        .button {
            text-align: center;
        }
    </style>
```

## JS


### 概念
* AMD CMD

### 试题
* 对象和引用的概念
```
var a = {n:1};  
var b = a; // 持有a，以回查  
a.x = a = {n:2};  
alert(a.x);// --> undefined  
alert(b.x);// --> {n:2}
```
* JavaScript原型，原型链 ? 有什么特点？
* 说几条写JavaScript的基本规范？
* eval是做什么的？
* null，undefined 的区别？
* 写一个通用的事件侦听器函数
* Node.js的适用场景？
* 介绍js的基本数据类型。
* Javascript如何实现继承？
* ["1", "2", "3"].map(parseInt) 答案是多少？
* 如何创建一个对象? （画出此对象的内存图）
* 谈谈This对象的理解。
* 事件是？IE与火狐的事件机制有什么区别？ 如何阻止冒泡？
* 什么是闭包（closure），为什么要用它？
* "use strict";是什么意思 ? 使用它的好处和坏处分别是什么？
* 如何判断一个对象是否属于某个类？
* new操作符具体干了什么呢?
* Javascript中，有一个函数，执行时对象查找时，永远不会去查找原型，这个函数是？
* JSON 的了解？
* js延迟加载的方式有哪些？
* ajax 是什么?
* 同步和异步的区别?
* 如何解决跨域问题?
* 模块化怎么做？
* AMD（Modules/Asynchronous-Definition）、CMD（Common Module Definition）规范区别？
* 异步加载的方式有哪些？
* .call() 和 .apply() 的区别？
* Jquery与jQuery UI 有啥区别？
* JQuery的源码看过吗？能不能简单说一下它的实现原理？
* jquery 中如何将数组转化为json字符串，然后再转化回来？
* 针对 jQuery 的优化方法？
* JavaScript中的作用域与变量声明提升？
* 如何编写高性能的Javascript？
* 那些操作会造成内存泄漏？
* JQuery一个对象可以同时绑定多个事件，这是如何实现的？
* 如何判断当前脚本运行在浏览器还是node环境中？

## node
* async的使用
* 异步解决方案
* 多线程方案
* node源码及文档
* Websocket
* express原理
