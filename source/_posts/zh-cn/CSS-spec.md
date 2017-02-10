---
title: CSS-spec
excerpt: CSS规范阅读
categories: 
- FE
---

http://www.w3.org/TR/2011/REC-CSS2-20110607/#minitoc

# 介绍
CSS语句由选择器和声明组成
```
<LINK rel="stylesheet" href="bach.css" type="text/css">
```
注意src与href区别，src用于替换当前元素，href是链接,href是并行处理,src串行处理
```
<script src="javascripts/resume.js"></script>
```

# 选择器
http://www.w3.org/TR/2011/REC-CSS2-20110607/selector.html

## 样式匹配
* E[foo~="warning"]属性中以空格分隔的，包含warning单词
* E[lang|="en"]属性中以连字符-分隔的，包含en单词
* DIV.warning等同于 DIV[class~="warning"]用法同jade
* E#myid用法同jade
* E + F匹配在E旁边的F

## 伪元素
* :first-line第一行，只能应用于块级元素
* :first-letter 第一个字母
* :before and :after用于插入内容
，在p元素note类前插入"Note: "
http://www.w3.org/TR/2011/REC-CSS2-20110607/generate.html
```
p.note:before { content: "Note: " }
```

# Media types
<table border="1" summary="Relationship between media groups and media types">
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

# 盒子模型


# 属性值的级联和继承
http://www.w3.org/TR/2011/REC-CSS2-20110607/cascade.html

## 几个值
* Specified values指定值：如果有明确的指定值，则运用，否则寻找继承，没有继承则使用默认值
* Computed values计算值：转化指定值中相对数值；
* Used values使用值：考虑计算值依赖关系后形成结果；
* Actual values实际值：考虑实际硬件情况，所渲染出的值；

## 继承
* 继承遵循文档树并且不会被匿名盒子打破；
* 根节点的值将被视为初始值；

## @import
在css中引用其他的css
```
@import url("fineprint.css") print;
@import url("bluish.css") projection, tv;
```

## 级联
- 找 target media type
- 找声明
- 权重排序

### 选择器权重
a b c d 逐级比较覆盖
- a非选择器为1，否则为0
- b ID的数量
- c属性和伪类的数量
- d元素和伪元素的数量
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

## 其他
html的非css的属性往往会被UA置于样式表的头部，而可能被样式表之后的内容所覆盖
