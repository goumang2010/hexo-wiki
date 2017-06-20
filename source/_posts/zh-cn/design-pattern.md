
---
title: design-pattern
excerpt: design-pattern
categories: 
- FE
---

摘自：曾探. JavaScript设计模式与开发实践 (图灵原创) . 人民邮电出版社. Kindle 版本. 

## 单例模式

```js
var Singleton = function(name) {
	this.name = name;
	this.instance = null;
};
Singleton.prototype.getName = function() {
	alert(this.name);
};
// 惰性单例
Singleton.getInstance = (function() {
	var instance = null;
	return function(name) {
		if (!instance) {
			instance = new Singleton(name);
		}
		return instance;
	}
})();

var a = Singleton.getInstance('sven1');
var b = Singleton.getInstance('sven2');
alert(a === b); // true
```

## 策略模式

将行为封装成函数
https://codepen.io/goumang2010/pen/weJQvm

## 代理模式

### 图片加载
```js
var myImage = (function() {
	var imgNode = document.createElement('img');
	document.body.appendChild(imgNode);

	return {
		setSrc: function(src) {
			imgNode.src = src;
		}
	}
})();
var proxyImage = (function() {
	var img = new Image;
	img.onload = function() {
		myImage.setSrc(this.src);
	}
	return {
		setSrc: function(src) {
			myImage.setSrc('loading.gif');
			img.src = src;
		}
	}
})();
proxyImage.setSrc('realImage.jpg');
```

### 缓存

```
var createProxyFactory = function(fn) {
	var cache = {};
	return function() {
		var args = Array.prototype.join.call(arguments, ',');
		if (args in cache) {
			return cache[args];
		}
		return cache[args] = fn.apply(this, arguments);
	}
};
```

## 观察者模式（发布-订阅）

https://codepen.io/goumang2010/pen/NgpEXe

## 命令模式

将行为抽象封装成指令，要求行为都有相似的结构

https://codepen.io/goumang2010/pen/gRmQzK

## 组合模式

把指令组合成树形结构 既可以执行单独命令，也可以执行组合后的命令，因为无论是单独命令还是组合命令，都部署了同样的执行接口

https://codepen.io/goumang2010/pen/zzZMyK

## 职责链模式

将分支流程的各个步骤拆分出函数

```js

var order500 = function(orderType, pay, stock) {
	if (orderType === 1 && pay === true) {
		console.log('500 元定金预购， 得到100优惠券');
	} else {
		return 'nextSuccessor'; 
	}
};

var order200 = function(orderType, pay, stock) {
	if (orderType === 2 && pay === true) {
		console.log('200 元定金预购， 得到50优惠券');
	} else {
		return 'nextSuccessor';

	}
};
var orderNormal = function(orderType, pay, stock) {
	if (stock > 0) {
		console.log('普通 购买， 无优惠券');
	} else {
		console.log('手机库存不足');
	}
};


// Chain. prototype. setNextSuccessor 指定 在 链 中的 下一个 节点 
// Chain. prototype. passRequest 传递 请求 给 某个 节点 
var Chain = function(fn) {
	this.fn = fn;
	this.successor = null;
};
Chain.prototype.setNextSuccessor = function(successor) {
	return this.successor = successor;
};
Chain.prototype.passRequest = function() {
	var ret = this.fn.apply(this, arguments);
	if (ret === 'nextSuccessor') {
		return this.successor && this.successor.passRequest.apply(this.successor, arguments);
	}
	return ret;
};

var chainOrder500 = new Chain(order500);
var chainOrder200 = new Chain(order200);
var chainOrderNormal = new Chain(orderNormal);

chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);

chainOrder500.passRequest(1, true, 500); // 输出： 500 元定金预购， 得到100优惠券 
chainOrder500.passRequest(2, true, 500); // 输出： 200 元定金预购， 得到50优惠 券 
chainOrder500.passRequest(3, true, 500); // 输出： 普通购买， 无优惠券 
chainOrder500.passRequest(1, false, 0); // 输出： 手机库存不足
```

## 中介者模式

充当指挥者和调度者，解耦客户对象间的关系