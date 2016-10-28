---
title: wiki
excerpt: 如何构建该Wiki。
---

该博客采用[Hexo](https://hexo.io/)构建! 使用[wiki-i18n](https://github.com/xcatliu/hexo-theme-wiki-i18n)主题。


# 如何建立一个相同的Wiki

## 安装hexo

``` bash
$ npm install hexo-cli -g
```

该命令安装hexo命令行，可以通过
``` bash
$ hexo --help
```

查看命令行帮助
## 克隆该git项目或主题作者的git博客项目
- 运行命令：

``` bash
$ git clone git@github.com:goumang2010/ChuuneWiki.git
```

或

``` bash
$ git clone git@github.com:xcatliu/js-index.git
```

- 补全nodejs依赖包：

``` bash
$ npm install
```

## 建立自己的GitHub项目
- 在github上建立项目，并获得git地址，如：git@github.com:yourname/project.git(默认已添加SSH key)
- 修改.git/config或使用 ：

``` bash
$ git remote set-url origin git@github.com:yourname/project.git
```

将远程url更改为自己github项目的地址.

- 将master分支推送至远程仓库:

``` bash
$ git checkout master
$ git push origin master
```


## 去除修改原有信息

1. 删除source/_posts/中所有的md文件；
2. 更改_config.yml文件，将站点信息更改为你想要的：
<br /><pre>subtitle:
description:
author: 
author_link:</pre> 
然后更改部署信息：<pre>deploy:
  type: git
  repo: git@github.com:yourname/project.git
  branch: gh-pages
  message:
</pre>这样，运行hexo deploy后，可以自动把编译后的静态网站推送至项目的gh-pages分支，从而完成部署
3. 更改source/CNAME文件
使cname指向你自有的域名，注意域名本身需添加DNS解析，解析cname至yourname.github.io。
4. 更改/themes/wiki-i18n/layout/_partial/jumbotron.ejs
将其中的链接替换为本身项目的。


## 修改样式
结合浏览器调试工具，修改 themes/wiki-i18n/source/css/normalize.css，达到你想要的效果

## 生成并调试
``` bash
$ npm run start
```

在浏览器中打开http://localhost:4000 ,进行查看和迭代修改

## 提交部署
- 将master分支上的更改进行提交
- 运行：

``` bash
$ npm run deploy
```

项目即部署到github page中，通过cname上配置的域名即可查看（该主题不可通过yourname.github.io/project查看，有样式问题）