---
title: vsftpd
excerpt: vsftpd
categories: 
- FE
---



# 安装
```
apt-get install vsftpd
```

# 配置
创建用于共享的FTP目录：
```
mkdir /home/ftp/
```
设置读写权限：
```
chmod 777 /home/ftp/
```
打开配置文件:
```
vim /etc/vsftpd.conf
```
配置文件设置注意如下
```
禁止IPV6jianting
listen_ipv6=NO
- 设置根目录，需要预先建立
local_root=/home/ftp
- 允许FTP的被动模式，命令连接和数据连接都由客户端发起，这样就可以解决从服务器到客户端的数据端口的入方向连接被防火墙过滤掉的问题
pasv_promiscuous=YES
- 允许写入
write_enable=YES
```

# 添加用户
```
sudo useradd -d /home/ftp -M username
sudo passwd username
```
按照提示输入密码

# 重启
```
service vsftpd restart
```
