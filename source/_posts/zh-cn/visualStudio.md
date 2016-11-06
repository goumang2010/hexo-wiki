---
title: visualStudio
excerpt: visualStudio
categories: 
- FE
---



# 文本编辑
* 清除空行：
```
^(?([^\r\n])\s)*\r?$\r?\n
```
改正这表达式可匹配所有空行，将其替换为空字符即可。
* Ctrl+M+M 可以对结构进行折叠和展开。
* 输入/**后可自动补全为：
```
/**
* */
```
* 自动排版
```
 Ctrl+K+F
```

# 插件
Web Essential已将编译less sass功能模块分拆

[https://visualstudiogallery.msdn.microsoft.com/ee6e6d8c-c837-41fb-886a-6b50ae2d06a2](https://visualstudiogallery.msdn.microsoft.com/ee6e6d8c-c837-41fb-886a-6b50ae2d06a2)
```
Important!

Web Essentials 2015 no longer contains features for bundling and minifying of JS, CSS and HTML files as well as compiling LESS, Scss and CoffeeScript files. Those features have been moved to their own separate extensions that improves the features greatly. Download them here:

Bundler & Minifier - for bundling and minifying JS, CSS and HTML files
Web Compiler - for compiling LESS, Sass, Scss, (Iced)CoffeeScript and JSX files
Image Optimizer - for lossless optimization of PNG, JPG and GIFs
Web Analyzer - for static code analysis (linting) of JS, TS, CSS and JSX files 
Gulp Snippet Pack - for being more productive writing Gulp files
```

# Raw
* 在安装某些插件后，复制粘贴不能保持完全一致，最好的办法是直接进行文件复制粘贴
