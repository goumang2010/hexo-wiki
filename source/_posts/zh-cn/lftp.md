---
title: lftp
excerpt: lftp
categories: 
- FE
---



# 安装使用
```
apt-get install lftp
```

```
lftp IP
```
IP替换为FTP服务器地址
```
login username
```
登录，系统会提示输入密码
```
ls
```
列出目录
```
mirror [-c] [--parallel=n] [-R] 远程目录 本地目录
```
其中-c是断点续传参数，--parallel是多线程参数，-R是反镜像参数。

# 参考
[http://blog.chinaunix.net/uid-215617-id-2213078.html](http://blog.chinaunix.net/uid-215617-id-2213078.html)
