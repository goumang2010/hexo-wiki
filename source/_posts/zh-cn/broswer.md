---
title: broswer
excerpt: broswer
categories: 
- FE
---

https://github.com/slashhuang/translation/blob/master/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B8%B2%E6%9F%93%E6%9C%BA%E5%88%B6

http://domenicodefelice.blogspot.sg/2015/08/how-browsers-work.html




# 原理

## 两个模块
浏览器的两个主模块
1. rendering engine 渲染引擎或者称为布局引擎(layout engine)
2. javascript解析器


火狐使用Gecko(由mozilla发明)，Safari和谷歌的chrome都使用webkit引擎。
谷歌的chrome在版本27之后使用Blink引擎。


## 四个阶段
渲染引擎的工作:
从基本的html css js 开始渲染整个屏幕的网页，粗浅的经过四个阶段

1. 解析html为dom树，解析css为cssom。
2. 把dom和cssom结合起来生成渲染树render tree
3. 布局render tree，计算几何形状
4. 把render tree展示到屏幕上

以上四步同时并多次执行

由于浏览器会尝试尽快展示内容，所以内容有时会在样式还没有加载的时候展示出来。
这就是经常发生的FOCU(flash of unstyled content)问题。
### 解析dom和cssom
* 在这个阶段，引擎html parser开始解析html，解析出来的结果会成为一棵dom树。html和dom并不是1:1的关系，dom树的根节点是<html>元素
* dom树的目的至少有2个：1. 作为下个阶段render tree的输入。 2. 成为网页和脚本的接口。(如 getElementById)
* 当所有的html解析完成，整个document被标记可交互的，它的状态显示为完成。
    - defer脚本会被执行
    - load event会被执行

### 渲染render tree

dom节点和cssom会合并渲染新的树状图。它的结构和dom树类似，但不是完全一样:只有可见元素才会在这棵树中(以下称为tree);例如head，script标签都不会在树中，所有拥有display:none样式的节点也不会在树中。
整个结构是按照它们的渲染顺序可视化的树状图，每个节点都存储着应用在它上面的css属性。
这些节点在不同的浏览器中被称为不同的:
- webkit称它为renderers
- firefox称它为frames
- 有些时候节点也直接称为boxes。

### layout(flow/reflow)阶段
	
一个节点的图形位置和尺寸，有时在css样式表中规定，有时不在。不管如何，它们都必须被计算，以便所有的节点能正确的渲染。浏览器会从根节点遍历render tree, 进行图形计算，这时相关的在css中使用的单元都转化成pixels。

### paint阶段
这个阶段也被称为"绘制"(painting)或repainting，所有的节点被遍历，从root开始，调用paint的方法。

## reflow和repaint优化
有重要的两点：
- 整个过程很耗费性能(阻塞式)
- 它们可以重新被触发

reflows和repaints不可避免，但是降低它们的频率可以提升我们网站的加载速度
### 是什么触发了reflow和repaint？
- javascript操作页面
	- dom操作(增加或者移除dom)
	- 样式表操作(增加或者移除样式规则)
- 用户操作(例如):
	- a标签的鼠标悬浮效果
	- 滚动页面
	- input标签中输入文字
	- resize窗口

浏览器会尽可能少的对改变做出响应，因此reflow及repaint可以是全局的，也可以是增量的。
reflow和repaint不必同时发生，例如:
- 如果只是改变元素的颜色，那么只会触发repaint
- 如果改变一个元素的位置，将会触发reflow和repaint

### reflow和repaint哪个性能开销更大？
我们必须考虑到浏览器将会使用大量缓存来避免重新计算。
- 一个repaint需要浏览器遍历元素来决定哪些是可见的，哪些事必须展示的
- 一个reflow重新计算元素的几何状态(geometry)，会递归的(recursively)reflow它的子元素，有时还包括它的相邻元素(siblings)
- 一个reflow将会触发repaint来更新网页

### 如何优化css和html以减少reflow？
- css越是简洁，reflow越快
- dom的层级越多，reflow的性能开销越大
- 有些元素的display模式比其他的性能开销更大
	- 行内样式会产生一个更深层次的reflow(further reflow)
	- 有自动的单元宽度的\<table\>性能开销大，因为浏览器需要更多的步骤计算单元格的尺寸
    - 使用flexbox布局性能开销大，因为flex元素的图形能在解析的时候发生改变

### 优化javascript
优化优化css和html的重要程度不如javascript， 如下例所示：

```js
    var foo = document.getElementById('foobar');
    foo.style.color = 'blue';
    var margin = parseInt(foo.style.marginTop);
    foo.style.marginTop = (margin + 10) + 'px';
```

由于reflow和repaint在性能开销上很大，浏览器会累积你在同一个时间片段(timeframe)里的所有的dom操作，进入队列(queue)，批量处理它们，我们来分析上面那段代码:
- 在改变颜色属性后，这个操作被放在累积队列里面(accumulating queue),然后我们寻找元素的style。这个操作会强制一个提前的repaint。
当我们改变dom的元素的时候，元素被标记为脏的(dirty)，有时它的children也会被标记为脏的(dirty)，意味着至少它的一个子元素要reflow。
interval之后，所有的被标记为脏的元素会重新reflow和repaint。
请求一个标记为脏的元素的属性，会触发浏览器的提前reflow。


### 同步布局与布局垃圾

针对dom的交替读写操作会引发布局垃圾=---性能杀手
我们如何避免垃圾？
- 重新组合对dom读写的命令
- 缓存已计算的样式
- 不要使用style来改变样式，选择用css
- 在dom之外操作元素， document fragments
- 尽可能将有动画的元素position设置为fixed或者absolute，这样更新这些元素的geometry的时候不会影响其他元素
- 只在有必要的时候将元素展示出来
- 使用window.requestAnimationFrame()
- 使用虚拟dom库

### requestAnimationFrame

window.requestAnimationFrame()允许我们在下一次reflow的时候执行代码（每个元素读取属性不会单独触发reflow），这个很有用，因为它允许我们交叉读写，同时以最优顺序执行它们，eg:
```js
function doubleHeight(element) {
    var currentHeight = element.clientHeight;
    element.style.height = (currentHeight * 2) + 'px';
}
all_my_elements.forEach(doubleHeight);
```

```js
function doubleHeight(element) {
    var currentHeight = element.clientHeight;
    window.requestAnimationFrame(function () {
        element.style.height = (currentHeight * 2) + 'px';
    });
}
all_my_elements.forEach(doubleHeight);
```

使用settimeout(fn,0)粗略的获得相同的结果，因为settimeout通常会在下次reflow的时候执行
### 虚拟dom库
优势：
    - 聚集操作
    - 应用启发式方法
    - 缓存值
    - 在合适的时候操作DOM， 避免布局垃圾




# html parser

- html解析器是个可重入的解析器(这意味着它可接受动态输入)，这让第一阶段的解析更加的复杂。
- 为何html解析器是可重入的？
    - 当浏览器解析到script标签的时候，js代码是立刻执行的
    - js可以修改html，例如通过(document.write)
- html解析是同步的(synchronous)，当解析器到达script标签的时候：
    - html解析器停止解析（非async defer）
    - 如果是外部脚本，就从外部网络获取脚本代码
    - 将控制权交给js引擎，执行js代码
    - 恢复html解析器的解析
    - 这也是script标签移到页面底部的原因

    在Gecko和webkit,当引擎被获取和执行脚本所阻塞的时候，会开启第二个进程(thread)开始解析文档(document)寻找外部的资源进行加载，它不会修改dom,但是会开始获取外部的资源。
- css是阻塞的, 因为：
    - js有可能会寻求未被解析的css信息
    - 浏览器会保持渲染进程直到cssom建立起来

    所以：
    - script脚本放在页面底部
    - 将样式表按照media type和media query区分，这样有助于我们将css资源标记成非阻塞渲染的资源，非阻塞的资源还是会被浏览器下载，只是优先级较低。

## http
很多浏览器能够同时下载超过2个的资源，在2014 RFC2616发布的http/1.1 中移除了2个连接的限制。根据browserscope.org的测试，现在主流的浏览器基本能达到同时发送6个http请求，ie11能够达到13个。
若是http2， 则没有必要优化连接数

## css
所有的样式表都会被解析成cssom对象模型(就和dom树一样展现结构)。
每一个页面element都会被许多css规则匹配， 匹配顺序：origin => weight => specificity=> order of definition
- origin: 
    - 作者自定义
    - 浏览器使用者定义
    - userAgent 定义
- weight
    - normal weight
    - !important weight
- specificity，即是css选择器的权重(a,b,c,d)的规则决定。
    - a : 值为1(当样式放在style属性中的时候)，0为其它情况
    - b : id在样式规则中出现的次数 eg:#slide #hello p的值就是2
    - c : class，伪类，和属性在样式中出现的次数 eg:input[type=email]值就是2
    - d : 标签个数(tag names)和伪类元素出现的次数

css规则会根据特定的选择器，分别加入对应的hash表中，当浏览器试图寻找哪个样式表加载到元素上的时候，它没必要查看所有的规则，而只需要查看哈希表。实际上，写css只需匹配最右边的(rightmost)的选择器，这个选择器称为主选择器(key selector)。由于浏览器是由右向左解析，所以以下例子中选择#container2 a时，将会先选择所有a元素，再筛选父级中含有#container2的元素。

```html
<div id=”container1”>
    … thousands of <a> elements here …
    <a> … </a>
    … thousands of <a> elements here …
</div>
<div id=”container2”>
    <a class=”a-class”>...</a>
</div>
```

所以改为#container2 .a-class或.a-class更有效率。将$('#container .class-name')改为$('.class-name', '#container')可以很好的性能。前者会先去寻找.class-name然后再沿着dom树寻找#container元素,后者会先找到#container，然后再沿着子树寻找.class-name的元素。


