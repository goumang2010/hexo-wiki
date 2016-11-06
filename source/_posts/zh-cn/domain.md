---
title: domain
excerpt: domain
categories: 
- FE
---

# 域名解析
## 使用DNSpod进行域名解析
- 进入域名商的管理页面，万网入口：[http://dc.aliyun.com/basic/](http://dc.aliyun.com/basic/)
- 输入DNSpod的解析服务器的地址，参照：[https://support.dnspod.cn/Kb/showarticle/tsid/40/](https://support.dnspod.cn/Kb/showarticle/tsid/40/)
- 在DNSPod的管理页面中添加域名解析：[https://www.dnspod.cn/console/dns](https://www.dnspod.cn/console/dns)

# 域名配置
修改配置文件参见：[Apache部署##Apache配置](Apache部署##Apache配置)

## 子域名映射
将wiki.liqiune.xyz映射至/var/www/html/wiki的网站
```
<VirtualHost *:80>
DocumentRoot /var/www/html/wiki
ServerName wiki.liqiune.xyz
ServerAlias wiki.liqiune.xyz
ErrorLog "/var/www/html/wiki/logs/error.log"
CustomLog "/var/www/html/wiki/logs/access.log"  combined
</VirtualHost>
```
注意"/var/www/html/wiki/logs/error.log"
及"/var/www/html/wiki/logs/access.log"需要事先建立


之后重启Apache：[Apache部署##Apache重启](Apache部署##Apache重启)

## 端口及域名映射
放弃使用不安全的Proxy，转用rewrite作为跳转
```
<VirtualHost *:80>
ServerName note.liqiune.xyz
ServerAlias note.liqiune.xyz
RewriteEngine on
RewriteRule   "^/(.*)"  "[http://note.liqiune.xyz](http://note.liqiune.xyz):3000"  [R,L]
</VirtualHost>
```
参考：[http://segmentfault.com/q/1010000000095724](http://segmentfault.com/q/1010000000095724)
注意：当未安装Proxy模块时，服务器将不能正常启动。通过journalctl -xe 查看，会提示：Invalid command 'ProxyPass', perhaps misspelled or defined by a module ...
这时需要进入/etc/apache2/mods-available 目录，启用代理模块：
```
a2enmod proxy
```
之后重启Apache：[Apache部署##Apache重启](Apache部署##Apache重启)

参考：[http://wiki.ubuntu.org.cn/Apache%E8%99%9A%E6%8B%9F%E4%B8%BB%E6%9C%BA%E6%8C%87%E5%8D%97](http://wiki.ubuntu.org.cn/Apache%E8%99%9A%E6%8B%9F%E4%B8%BB%E6%9C%BA%E6%8C%87%E5%8D%97)
