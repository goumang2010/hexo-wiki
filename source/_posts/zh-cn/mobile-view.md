---
title: mobile-view
excerpt: 
categories: 
- FE
---




* 使用location.hash设置锚点在一些浏览器中容易失效，故正确的做法是：
```
    var t = $("#anchor").offset().top; 
    $(window).scrollTop(t);
```
* textarea或input在使用.text()或innerText等进行取值容易失效，故取得输入的值应使用.val()
