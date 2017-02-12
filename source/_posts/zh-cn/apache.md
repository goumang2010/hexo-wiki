---
title: apache
excerpt: apache
categories: 
- Server
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

## 多域名配置

1. 在httpd.conf中，确认`Include conf/extra/httpd-vhosts.conf`未被注释
2. 在httpd.conf中，增加要监听的端口号，如`Listen 8880`
3. 在httpd.conf中，将相关设置变更为如下：
    ```
        <Directory />
            # Options Indexes FollowSymLinks  # 允许索引目录
            # 不允许索引目录
            Options FollowSymLinks
            # 允许.htaccess覆写配置
            AllowOverride All
            Order allow,deny
            Allow from all
            # Require all denied # 拒绝所有
        </Directory>
    ```

4. 编辑apache/conf/extra中的httpd-vhosts.conf，增加相关设置
    ```
        <VirtualHost *:8880>
            ServerAdmin webmaster@dummy-host.example.com
            DocumentRoot "H:\yourpath"
            ServerName localhost
            ServerAlias localhost
            ErrorLog "logs/yoursite.log"
            CustomLog "logs/dummy-host.example.com-access.log" common
            <Directory "H:\yourpath"> 
                Options FollowSymLinks
                AllowOverride None 
                Order allow,deny 
                Allow from all 
            </Directory>
        </VirtualHost>
    ```
5. 重启apache

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
