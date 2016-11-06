---
title: linux-command
excerpt: linux-command
categories: 
- Linux
---



# 常用命令


## 系统运行情况
* 进程Pid及名称：
```
ps -e
```
* 查看总体运行及详细情况：
```
top
```
-M为按照内存占用大小排序
* 查看内存总体使用情况：
```
free -m
```
* 查看详细内存使用情况：
```
cat /proc/meminfo
```

## apt-get
安装：
```
apt-get install pkgname
```
卸载：
```
apt-get remove pkgname
```
完全卸载（删除配置文件）：
```
apt-get purge pkgname
```

## kill
```
kill pid
```
pid替换为pid号

## History
用于查看命令行输入历史，直接键入即可；
打开记录历史命令的文件：
```
vim ~/.bash_history
```
复制文件到Share文件夹：
```
cp ~/.bash_history ~/Share
```
注意：若为FTP服务器，则FTP不支持.bash_history这种名称的文件 则需指定文件名：
```
cp ~/.bash_history /home/ftp/data/note.txt
```
参考：[http://www.2cto.com/os/201411/348554.html](http://www.2cto.com/os/201411/348554.html)

## cd
* 进入根目录：
```
cd /
```
* 进入当前用户的目录（/home/username,root用户为/root）：
```
cd ~/
```
* 退回上一层（注意空格）：
```
cd ..
```

## netstat
* 查看Mysql监听端口：
```
netstat -an|grep 3306
```

## cat
用于查看或创建文件
* 查看详细内存使用情况：
```
cat /proc/meminfo
```
参考：[http://www.2cto.com/os/201207/143561.html](http://www.2cto.com/os/201207/143561.html)

## chmod
-R 表示递归
```
chmod -R 755 /home/ftp/data/Resume
```
将/home/ftp/data/Resume下所有文件及目录递归的设置为755权限（读取执行全权，所有者可写入）
