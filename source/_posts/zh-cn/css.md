---
title: CSS
excerpt: All about CSS, including selector, layout, position
categories: 
- FE
---

# 教程

## 编写
http://www.w3school.com.cn/example/csse_examples.asp

CSS语句由选择器和声明组成


## 引入

```
<LINK rel="stylesheet" href="bach.css" type="text/css">
```
注意src与href区别，src用于替换当前元素，href是链接,href是并行处理,src串行处理
```
<script src="javascripts/resume.js"></script>
```


## 选择器
http://www.w3school.com.cn/cssref/css_selectors.asp

* em是相对长度单位。相对于当前对象内文本的字体尺寸。如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸。

http://www.w3.org/TR/2011/REC-CSS2-20110607/selector.html

### 样式匹配
* E[foo~="warning"]属性中以空格分隔的，包含warning单词
* E[lang|="en"]属性中以连字符-分隔的，包含en单词
* DIV.warning等同于 DIV[class~="warning"]用法同jade
* E#myid用法同jade
* E + F匹配在E旁边的F

### 伪元素
* :first-line第一行，只能应用于块级元素
* :first-letter 第一个字母
* :before and :after用于插入内容
，在p元素note类前插入"Note: "
http://www.w3.org/TR/2011/REC-CSS2-20110607/generate.html
```
p.note:before { content: "Note: " }
```

# 布局
https://zhuanlan.zhihu.com/p/25565751

## 定位

### 水平居中
- 行内元素：对父元素设置text-align:center; https://codepen.io/goumang2010/pen/EXWbzm
- 定宽块状元素: 设置左右margin值为auto; https://codepen.io/goumang2010/pen/ZyeagO
- 不定宽块状元素: 设置子元素为display:inline,然后在父元素上设置text-align:center; 
- 通用方案: 对子元素设置position: relative; left: 50%;margin-left: 宽度一半 https://codepen.io/goumang2010/pen/PjpEwL
- 通用方案: flex布局，对父元素设置display:flex;justify-content:center; https://codepen.io/goumang2010/pen/bRqabX

### 垂直居中

- 父元素一定，子元素为单行内联文本：设置父元素行高line-height等于父元素的height https://codepen.io/goumang2010/pen/eRvygW
- 父元素一定，子元素为多行内联文本：设置父元素的display:table-cell，再设置vertical-align:middle； https://codepen.io/goumang2010/pen/gRmomJ
- 块状元素:设置子元素position:absolute 并设置top、bottom为0，父元素要设置定位为static以外的值，margin:auto; https://codepen.io/goumang2010/pen/weJpPa
- 通用方案: flex布局，给父元素设置{display:flex; align-items:center;}。

## 单列布局

- 同宽： https://codepen.io/goumang2010/pen/owZeoa

- 不同宽： https://codepen.io/goumang2010/pen/gRmxzY

## 二列&三列布局
二列布局的特征是侧栏固定宽度，主栏自适应宽度。
三列布局的特征是两侧两列固定宽度，中间列自适应宽度。 

### 浮动布局
设置两个侧栏分别向左向右浮动，中间列通过外边距给两个侧栏腾出空间，中间列的宽度根据浏览器窗口自适应。

- 两栏： https://codepen.io/goumang2010/pen/GEWvwR
- 三栏：https://codepen.io/goumang2010/pen/dRvzja

### 绝对定位布局

- 两栏： https://codepen.io/goumang2010/pen/zzZdVL
- 三栏： https://codepen.io/goumang2010/pen/RgpZdb

### 圣杯布局
- 主面板设置宽度为100%，主面板与两个侧栏都设置浮动，常见为左浮动，这时两个侧栏会被主面板挤下去。
- 通过负边距将浮动的侧栏拉上来，左侧栏的负边距为100%，刚好是窗口的宽度，因此会从主面板下面的左边跑到与主面板对齐的左边
- 右侧栏此时浮动在主面板下面的左边，设置负边距为负的自身宽度刚好浮动到主面板对齐的右边
- 为了避免侧栏遮挡主面板内容，在外层设置左右padding值为左右侧栏的宽度，给侧栏腾出空间，此时主面板的宽度减小
- 使用相对布局，调整两个侧栏到相应的位置。使其不遮挡主面板的内容

https://codepen.io/goumang2010/pen/yXMzOK

当面板的main内容部分比两边的子面板宽度小的时候，布局就会乱掉。可以通过设置main的min-width属性或使用双飞翼布局避免问题。

### 双飞翼布局

双飞翼布局在圣杯布局上做了改进，在main元素上加了一层div（main-wrap）, 并设置margin,由于两侧栏的负边距都是相对于main-wrap而言，main的margin值变化便不会影响两个侧栏，因此省掉了对两侧栏设置相对布局的步骤。

https://codepen.io/goumang2010/pen/gRmGGg

### flex布局

https://codepen.io/goumang2010/pen/ZyeXjV

# 概念
http://www.w3.org/TR/2011/REC-CSS2-20110607/#minitoc


## 盒子模型

### box-sizing
http://www.cnblogs.com/zhaoran/archive/2013/05/24/3097482.html

- content-box，border和padding不计算入width之内
- padding-box，padding计算入width内
- border-box，border和padding计算入width之内，其实就是怪异模式

https://codepen.io/goumang2010/pen/OgpOvB


## 属性值的级联和继承
http://www.w3.org/TR/2011/REC-CSS2-20110607/cascade.html

### 几个值
* Specified values指定值：如果有明确的指定值，则运用，否则寻找继承，没有继承则使用默认值
* Computed values计算值：转化指定值中相对数值；
* Used values使用值：考虑计算值依赖关系后形成结果；
* Actual values实际值：考虑实际硬件情况，所渲染出的值；

### 继承
* 继承遵循文档树并且不会被匿名盒子打破；
* 根节点的值将被视为初始值；

### @import
在css中引用其他的css
```
@import url("fineprint.css") print;
@import url("bluish.css") projection, tv;
```

### 级联
- 找 target media type
- 找声明
- 权重排序

#### 选择器权重
a b c d 逐级比较覆盖
- a非选择器为1(内联style)，否则为0
- b ID的数量
- c 属性和伪类的数量
- d 元素和伪元素的数量
```
 *             {}  /* a=0 b=0 c=0 d=0 -> specificity = 0,0,0,0 */
 li            {}  /* a=0 b=0 c=0 d=1 -> specificity = 0,0,0,1 */
 li:first-line {}  /* a=0 b=0 c=0 d=2 -> specificity = 0,0,0,2 */
 ul li         {}  /* a=0 b=0 c=0 d=2 -> specificity = 0,0,0,2 */
 ul ol+li      {}  /* a=0 b=0 c=0 d=3 -> specificity = 0,0,0,3 */
 h1 + *[rel=up]{}  /* a=0 b=0 c=1 d=1 -> specificity = 0,0,1,1 */
 ul ol li.red  {}  /* a=0 b=0 c=1 d=3 -> specificity = 0,0,1,3 */
 li.red.level  {}  /* a=0 b=0 c=2 d=1 -> specificity = 0,0,2,1 */
 #x34y         {}  /* a=0 b=1 c=0 d=0 -> specificity = 0,1,0,0 */
 style=""          /* a=1 b=0 c=0 d=0 -> specificity = 1,0,0,0 */
```

### 其他
html的非css的属性往往会被UA置于样式表的头部，而可能被样式表之后的内容所覆盖

## BFC
http://web.jobbole.com/84808/
http://www.imooc.com/article/9723

1. 在BFC下，内部的Box会在垂直方向，一个接一个地放置。
2. Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
3. 在BFC中，每一个盒子的左外边缘（margin-left）会触碰到容器的左边缘(border-left)（对于从右到左的格式来说，则触碰到右边缘），即使存在浮动也是如此。
4. BFC的区域不会与其外的float box重叠。
5. 计算BFC的高度时，浮动元素也参与计算。
6. 内部元素的布局不会影响外部元素。

### 触发条件

- 浮动元素，float 除 none 以外的值
- 绝对定位元素，position的值不为relative和static（absolute，fixed）
- display为以下其中之一的值inline-block, table-cell, table-caption, flex，inline-flex
- overflow 除了 visible 以外的值（hidden，auto，scroll）

### 应用
- 清除浮动（防止塌陷）：https://codepen.io/goumang2010/pen/wegYPp
- 自适应两栏布局： https://codepen.io/goumang2010/pen/mwRQmL
- 解决与子元素边距折叠。


## 边距折叠

https://www.w3.org/TR/CSS2/box.html#collapsing-margins

### 折叠条件
- 常规文档流，（非float和绝对定位）的块级盒子,并且处于同一个BFC当中。
- 没有线盒，没有空隙，没有padding和border将他们分隔开
- 都属于垂直方向上相邻的外边距，可以是下面任意一种情况：
    - 元素的margin-top与其第一个常规文档流的子元素的margin-top
    - 元素的margin-bottom与其下一个常规文档流的兄弟元素的margin-top
    - height为auto的元素的margin-bottom与其最后一个常规文档流的子元素的margin-bottom
    - 高度为0并且最小高度也为0，不包含常规文档流的子元素，并且自身没有建立新的BFC的元

### 折叠结果
1. 两个相邻的外边距都是正数时，折叠结果是它们两者之间较大的值。 
2. 两个相邻的外边距都是负数时，折叠结果是两者绝对值的较大值。 
3. 两个外边距一正一负时，折叠结果是两者的相加的和。

### 结论
https://codepen.io/goumang2010/pen/jwyQjb

- 创建了新的BFC的元素与它的子元素的外边距不会折叠
- 浮动元素不与任何元素的外边距产生折叠（包括其父元素和子元素）
- 绝对定位元素不与任何元素的外边距产生折叠（要求常规文档流）
- inline-block元素不与任何元素的外边距产生折叠（要求块级盒子）
- 一个常规文档流元素的margin-bottom与它下一个常规文档流的兄弟元素的margin-top会产生折叠，除非它们之间存在间隙（clearance）。
- 一个常规文档流元素的margin-top 与其第一个常规文档流的子元素的margin-top产生折叠，条件为父元素不包含 padding 和 border ，子元素不包含 clearance。
- 一个 'height' 为 'auto' 并且 'min-height' 为 '0'的常规文档流元素的 margin-bottom 会与其最后一个常规文档流子元素的 margin-bottom 折叠，条件为父元素不包含 padding 和 border ，子元素的 margin-bottom 不与包含 clearance 的 margin-top 折叠。
- 一个不包含border-top、border-bottom、padding-top、padding-bottom的常规文档流元素，并且其 'height' 为 0 或 'auto'， 'min-height' 为 '0'，其里面也不包含行盒(line box)，其自身的 margin-top 和 margin-bottom 会折叠。

## Media types

<table summary="Relationship between media groups and media types">
<caption>Relationship between media groups and media types</caption>
<tr><th>Media Types <th colspan="4">Media Groups
<tr><th>&nbsp;
    <th>continuous/paged
    <th>visual/audio/speech/tactile
    <th>grid/bitmap
    <th>interactive/static
<tr><th>braille<td align="center">continuous<td align="center">tactile<td align="center">grid<td align="center">both</tr>
<tr><th>embossed<td align="center">paged<td align="center">tactile<td align="center">grid<td align="center">static</tr>
<tr><th>handheld<td align="center">both<td align="center">visual, audio, speech<td align="center">both<td align="center">both</tr>
<tr><th>print<td align="center">paged<td align="center">visual<td align="center">bitmap<td align="center">static</tr>
<tr><th>projection<td align="center">paged<td align="center">visual<td align="center">bitmap<td align="center">interactive</tr>
<tr><th>screen<td align="center">continuous<td align="center">visual, audio<td align="center">bitmap<td align="center">both</tr>
<tr><th>speech<td align="center">continuous<td align="center">speech<td align="center">N/A<td align="center">both</tr>
<tr><th>tty<td align="center">continuous<td align="center">visual<td align="center">grid<td align="center">both</tr>
<tr><th>tv<td align="center">both<td align="center">visual, audio<td align="center">bitmap<td align="center">both</tr>
</table>

## clearance

https://codepen.io/goumang2010/pen/owBJza

闭合浮动元素的clearance = 浮动元素上下边距高度 + 浮动元素height +浮动元素的上下边框高度+浮动元素的上下内边距高度。

# 技巧

## 文字省略

https://codepen.io/goumang2010/pen/eRvGoa