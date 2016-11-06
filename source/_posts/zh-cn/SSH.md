---
title: SSH
excerpt: SSH
categories: 
- FE
---



# 下载上传
下载文件：
```
scp root@45.32.16.114:/etc/nginx/sites-available/default /Users/lizhongning/OneDrive/backup
```
上传文件
```
scp /Users/lizhongning/OneDrive/backup/default ubuntu@54.213.133.73:/etc/nginx/sites-available/
```
Windows下使用pscp
[http://www.chiark.greenend.org.uk/](http://www.chiark.greenend.org.uk/)~sgtatham/putty/download.html

下载文件
```
pscp -i privatekey.ppk -r user@111.111.11.11:Dictory D:/ 
```
