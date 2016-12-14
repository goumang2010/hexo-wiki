---
title: SSH
excerpt: SSH
categories: 
- FE
---

# 登录

如
```
ssh -l username -p 24334 10.34.3.44
```

# 下载上传
下载文件：
```
scp root@45.32.16.114:/etc/nginx/sites-available/default /Users/lizhongning/OneDrive/backup
```
上传文件
```
scp /Users/lizhongning/OneDrive/backup/default ubuntu@54.213.133.73:/etc/nginx/sites-available/
```
## Windows

### 使用pscp

[http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html)

下载文件
```
pscp -i privatekey.ppk -r user@111.111.11.11:Dictory D:/ 
```
### rz,sz
1. 在linux上安装ZModem `yum install lrzsz`
2. windows上安装支持ZModem的客户端，如SecureCRT，xshell等，putty和git bash不行
3. 在ssh客户端中使用sz rz命令 `sz tar.sh` `rz` 文件都指当前linux目录下
