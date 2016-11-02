---
title: javascript
excerpt: javascript
categories: 
- FE
---



# 事件监听
* DOM直接调用
```
    
doms[i].click= function()
     {
        ....
     }
```
* addEventListener方式和IE私有的attachEvent方式
```
    try
     {
         doms[i].addEventListener('mouseover',show_color,false);
         doms[i].addEventListener('mouseout',hide_color,false);
     }
     catch(e)
     {
         doms[i].attachEvent('onmouseover',for_ie(doms[i],show_color));
         doms[i].attachEvent('onmouseout',for_ie(doms[i],hide_color));
     }
```

# 类型检测
```
var  isType =  function  (type) {
   return  function  (obj) {
     return  toString.call(obj)  ==  '[object ' +  type +  ']';
   };
 };

 var  isString =  isType('String');
 var  isFunction =  isType('Function');
```
