---
title: nginx
excerpt: nginx
categories: 
- FE
---



# 安装配置


## nginx配置
* http编辑文件：
```
vim /etc/nginx/nginx.conf
```
* 监听配置文件：
```
vim /etc/nginx/sites-available/default
```
* 重写：
```
rewrite ^/(.*)  [http://node.chuune.top](http://node.chuune.top):3000$uri last;
```
将任意字符不区分大小写重写为：[http://node.chuune.top](http://node.chuune.top):3000加上相对路径($uri),参数会自动添加
* 反向代理：
```
- 将所有包转发给http://localhost:3000
proxy_pass http://localhost:3000;
- 将原始地址(及经过的其他代理)写入header的X-Forwarded-For中，以此在后端可以读取该参数获得前端的实际IP
proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
```

## php.ini
修改一下文件：

/etc/php5/cgi/php.ini 

/etc/php5/cli/php.ini 

/etc/php5/fpm/php.ini 

去掉cgi.fix-pathinfo=1 的注释

## php-fpm
* php-fpm配置文件
```
vim /etc/php5/fpm/php-fpm.conf
```
对于小内存：
```
pm=dynamic
 pm.max_children=20
 pm.start_servers=5
 pm.min_spare_servers=5
 pm.max_spare_servers=20
'进程执行xxx后重启释放内存避免内存泄漏
 pm.max_requests = 4096
'进程超时时间
request_terminate_timeout = 100
```

# 重启
重启php5-fpm：
```
/etc/init.d/php5-fpm restart
```
重启nginx：
```
 /etc/init.d/nginx restart
```
查看状态： 
```
nginx -t
```

# Mediawiki
```
server {
        listen 80;
        server_name wiki.chuune.top;
        root /var/www/html/wiki;
        index  index.php;
    client_max_body_size 5m;
    client_body_timeout 60;

    location / {
        try_files $uri $uri/ @rewrite;
    }

    location @rewrite {
        rewrite ^/(.*)$ /index.php?title=$1&$args;
    }

    location ^~ /maintenance/ {
        return 403;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        #
        #       # With php5-cgi alone:
        #       fastcgi_pass 127.0.0.1:9000;
        #       # With php5-fpm:
        fastcgi_pass unix:/var/run/php5-fpm.sock;

    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        try_files $uri /index.php;
        expires max;
        log_not_found off;
    }

    location = /_.gif {
        expires max;
        empty_gif;
    }

    location ^~ /cache/ {
        deny all;
    }

    location /dumps {
        root /var/www/mediawiki/local;
        autoindex on;
    }

}
```
设置参考：
[https://www.nginx.com/resources/wiki/start/topics/recipes/mediawiki/?highlight=mediawiki](https://www.nginx.com/resources/wiki/start/topics/recipes/mediawiki/?highlight=mediawiki)#

[https://www.mediawiki.org/wiki/Manual](https://www.mediawiki.org/wiki/Manual):Short_URL/wiki/Page_title_--_nginx_rewrite--root_access

# 参考
[http://blog.csdn.net/rainysia/article/details/12972975](http://blog.csdn.net/rainysia/article/details/12972975)
