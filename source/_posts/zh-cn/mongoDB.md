---
title: mongoDB
excerpt: mongoDB
categories: 
- FE
---


# Windows下mongoDB安装
## 下载安装包
* 进入官网：[https://www.mongodb.org/ ](https://www.mongodb.org/ )下载相应的安装包
* 点击进行安装
* 记录安装后mongo程序所在位置，如:
```
D:\Program Files\MongoDB\Server\3.2\bin
```

## 建立配置文件及数据库目录
建立配置文件D:\Programming\MongoDB\mongo.config,内容如下：
```
dbpath=D:\Programming\MongoDB\data\db ##数据库路径
logpath=D:\Programming\MongoDB\log\mongo.log ##日志输出文件路径
logappend=true ##错误日志采用追加模式，配置这个选项后mongodb的日志会追加到现有的日志文件，而不是从新创建一个新文件
journal=true ##启用日志文件，默认启用
quiet=true ##这个选项可以过滤掉一些无用的日志信息，若需要调试使用请设置为false
port=27017 ##端口号 默认为27017
```
以上配置文件所涉及的路径及文件均需手动一一建立

## 将mongoDB安装为服务
管理员模式下进入cmd命令行,并进入程序所在目录，如:
```
cd D:\Program Files\MongoDB\Server\3.2\bin
```
输入命令：
```
mongod --config D:\Programming\MongoDB\mongo.config --install
```
启动服务：
```
net start MongoDB
```

## 测试
进入程序所在目录，直接输入mongo进行连接

## 参考
[http://www.cnblogs.com/lzrabbit/p/3682510.html](http://www.cnblogs.com/lzrabbit/p/3682510.html)

# Linux下mongoDB安装
* 安装:apt-get install mongodb
* 客户端登陆：mongo

# 基本命令
## 登陆退出
Linux直接输入命令，Windows需在cmd下进入mongoDB的安装目录，如输入cd C:\Program Files\MongoDB\Server\3.2\bin
无密码登陆：mongo
退出：quit()

## 数据库
* 查看所有数据库(与MySQL相同): 
```
show databases
```
* 创建并使用数据库: 
```
use netnote
```
（netnote为数据库名字）
* 查看所有集合：
```
show collections
```
* 删除数据库:
```
use xxx
db.dropDatabase()
```

## collection
* 删除coll：
```
db.coll.drop()
```

## 查询操作
查看所有记录：
```
db.notes.find()
```
记录数量：
```
db.notes.find().count()
```
清除所有记录：
```
db.notes.remove({})
```

## 备份恢复
这些命令在shell下使用

#### mongostore
[https://docs.mongodb.org/manual/reference/program/mongorestore/](https://docs.mongodb.org/manual/reference/program/mongorestore/)
```
mongorestore -d dss_dev /Users/lizh/OneDrive/backup/dev0323
```
dss_dev为数据库名称，/Users/lizh/OneDrive/backup/dev0323为已备份的文件夹
