---
title: apache
excerpt: apache
categories: 
- FE
---



# Apache安装
```
apt-get install apache2
```
Apache2与Apache区别见：[http://baike.baidu.com/link?url=0F0sTBs-qUk9KpPhuE50fge5TzDRFJqVUnVRHV3u84-iukNURiAeZf1Jpn7DPEQ1eraxinPkuquTs3qkfRVQJ_](http://baike.baidu.com/link?url=0F0sTBs-qUk9KpPhuE50fge5TzDRFJqVUnVRHV3u84-iukNURiAeZf1Jpn7DPEQ1eraxinPkuquTs3qkfRVQJ_)

# Apache配置
编辑apache配置文件：
```
vim /etc/apache2/sites-available/000-default.conf
```
,实际上该文件被软连接到/etc/apache2/sites-enabled目录中，而该目录的配置文件被包含在/etc/apache2/apache2.conf，从而使得Apache启动时生效。

# 模块启用
但配置文件中涉及其他模块如rewrite时，需要启用该模块，即是在/etc/apache2/mods-available文件夹中将rewrite.load软连接至mods-enabled文件夹至：
```
ln -s /etc/apache2/mods-available/rewrite.load /etc/apache2/mods-enabled/rewrite.load
```

# Apache重启
```
service apache2 restart
```
或：
```
/etc/init.d/apache2 restart
```
