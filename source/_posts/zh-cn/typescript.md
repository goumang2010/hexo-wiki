---
title: typescript
excerpt: 
categories: 
- FE
---

# 参数默认值
```
function ShowQR(data,toa:boolean=true) {
    if (toa) {
      toaWin("成功", "请查看二维码及链接")
    }
}
```
翻译为JavaScript为：
```
function ShowQR(data, toa) {
    if (toa === void 0) { toa = true; }
    if (toa) {
        toaWin("成功", "请查看二维码及链接");
    }
}
```

# 类型库
## 链接
* Github： https://github.com/DefinitelyTyped/DefinitelyTyped
* 官网： http://definitelytyped.org/

## tsd
tsd已停用，现在应迁移至typings
* 说明：https://github.com/Definitelytyped/tsd#readme

#### 安装管理器
```
npm install tsd -g
```

#### 查询包
* 通过类型库搜索： http://definitelytyped.org/tsd/
* 命令：
```
tsd query pkgname
```
pkgname替换为包的名称，可以使用*等通配符

#### 安装包
以下命令为安装toastr.js的类型库，-s是表示记录于tsd.json 
```
tsd install toastr -s
```
该命令会在当前目录下创建typings\toastr,并将toastr.d.ts存放其中

## typings
将tsd迁移至typings：https://github.com/typings/typings/blob/master/docs/tsd.md
