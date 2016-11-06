---
title: 
excerpt: 
categories: 
- FE
---



# 虚拟内存
* 输入以下命令进行配置1G的交换区（虚拟内存）：
```
- /dev/zero是一个输入设备，你可你用它来初始化文件。该设备无穷尽地提供0，可以使用任何你需要的数目——设备提供的要多的多。他可以用于向设备或文件写入字符串0。
dd if=/dev/zero of=/var/swap bs=1024 count=1048576
mkswap /var/swap
- 600权限表示仅是属主有读写权
chmod 600 /var/swap
swapon /var/swap
- 当内存使用70%的时候开始使用虚拟内存
sysctl vm.swappiness=30
echo "vm.swappiness=30" >> /etc/sysctl.conf
- 使系统倾向于保留缓存
echo "vm.vfs_cache_pressure=50" >> /etc/sysctl.conf
```

## 参考
[http://blog.csdn.net/nzing/article/details/9166057](http://blog.csdn.net/nzing/article/details/9166057)

[http://blog.itpub.net/29371470/viewspace-1250975](http://blog.itpub.net/29371470/viewspace-1250975)

[http://blog.sina.com.cn/s/blog_8b5bb24f01016y3o.html](http://blog.sina.com.cn/s/blog_8b5bb24f01016y3o.html)

[http://blog.sina.com.cn/s/blog_4b4de658010006m7.html](http://blog.sina.com.cn/s/blog_4b4de658010006m7.html)

# 部署脚本
## php网站
安装：
```
apt-get install apache2 mysql-server php5 php5-mysql phpmyadmin
```
配置：[Apache部署]] [[MySQL安装配置](Apache部署]] [[MySQL安装配置)

## node环境
[node安装](node安装)

## 其他
* [vsftpd](vsftpd)
* [ShadowSocks-libev搭建](ShadowSocks-libev搭建)
* [Ubuntu下mongoDB安装](Ubuntu下mongoDB安装)
* [Ubuntu下安装github](Ubuntu下安装github)

## apt-get总安装命令
```
apt-get install apache2 mysql-server mongodb  vsftpd  build-essential autoconf libtool libssl-dev  openssh-server openssh-client git-core php5
```

## 备份脚本
若在win下创建文件并编辑，需要在vim中做如下检查和修改：
```
:set ff 
```
回车，显示fileformat=dos，重新设置下文件格式：
```
:set ff=unix 
```
保存退出:
```
:wq 
```

### 程序备份
```
##!/bin/bash
----- create restore sh file######
- save folder
sf="/home/ftp/data/backup"
rn=${sf}"/restore.sh"
echo "######restore sh######" > $rn
echo "sudo apt-get update" > $rn
echo "sudo apt-get install apache2 mysql-server mongodb  vsftpd  build-essential autoconf libtool libssl-dev  openssh-server openssh-client git-core php5" >> $rn
----- backup configuration files ######
conf_files=(
- backup apache2
"/etc/apache2/sites-available/000-default.conf" 
- backup mysql
"/etc/mysql/my.cnf" 
- backup mongodb
"/etc/mongodb.conf"
- backup Vsftpd
"/etc/vsftpd.conf"
- backup shadowsock
"/etc/shadowsocks.json"
)
for lf in ${conf_files[@]}
do
   cp $lf $sf
   ##split the str
    arr=(${lf//// }) 
    length=${##arr[@]} 
    filename=${arr[length-1]}
    ##backup original files
    echo "cp "${lf}" "${filename}".bak" >> $rn
    echo "cp "${filename}" "${lf} >> $rn
done
echo "echo finish!" >> $rn
echo "finish!"
```

### 数据库备份
```
##!/bin/bash
----- backup mysql######
filename=wikibackup`data +%Y-%m-%d_%H%M%S`.sql.gz
mysqldump -hlocalhost -uXXX -pXXX --default-character-set=utf8 s9759044_wiki | gzip >$filename
mutt goumang2010@qq.com -a $filename -s “ParkBackup”
```
