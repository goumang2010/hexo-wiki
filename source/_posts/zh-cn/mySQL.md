---
title: mySQL
excerpt: mySQL
categories: 
- FE
---



# 安装
```
apt-get install mysql-server
```

# 命令
重启：
```
/etc/init.d/mysql restart
```

## 解锁
- 查看所有进程： 
```
show full processlist;
```
- kill 进程id;

## 引擎
查看系统支持的存储引擎:
```
show engines;
```
查看默认引擎：
```
show variables like '%storage_engine%';
```
查看单个表引擎：
```
show table status from db_name where name='table_name';
```
查看数据库中所有表引擎：
```
select table_name,ENGINE from information_schema.tables WHERE table_schema = 'dbname'
```
修改引擎：ALTER TABLE my_table ENGINE=InnoDB;

# 表批量操作
```
select * from information_schema.tables WHERE table_schema = 'dbname'
```

# 配置优化


## 文件结构
数据文件默认存放于：/var/lib/mysql/

配置文件： /etc/mysql/my.cnf

## 文件优化
若要在其他主机上进行远程登陆mysql，需在my.cnf中添加：
```
[mysqld]
bind-address="0.0.0.0"
```
注意双引号
设置utf8默认字符,在mysqld后：
```
character_set_server=utf8 
init_connect='SET NAMES utf8'
```
Mysql5.5配置文件如下：
```
#
- !includedir /etc/mysql/conf.d/
- !includedir /etc/mysql/mysql.conf.d/
[mysqld]
bind-address="0.0.0.0"
sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES
back_log = 600
max_connections = 1000
max_connect_errors = 6000
open_files_limit = 65535
table_open_cache = 128
max_allowed_packet = 4M
binlog_cache_size = 1M
max_heap_table_size = 8M
tmp_table_size = 16M
read_buffer_size = 2M
read_rnd_buffer_size = 8M
sort_buffer_size = 8M
join_buffer_size = 8M
thread_cache_size = 6
query_cache_size = 8M
query_cache_limit = 2M
key_buffer_size = 4M
ft_min_word_len = 4
- 分词词汇最小长度，默认4
log_bin = mysql-bin
binlog_format = mixed
expire_logs_days = 30 #超过30天的binlog删除
slow_query_log = 1
bulk_insert_buffer_size = 8M
myisam_max_sort_file_size = 10G
myisam_repair_threads = 1
interactive_timeout = 18800
wait_timeout = 18800
character_set_server=utf8 
init_connect='SET NAMES utf8'
default-storage-engine = InnoDB
innodb_lock_wait_timeout = 120
innodb_max_dirty_pages_pct = 90
innodb_flush_log_at_trx_commit = 2
innodb_purge_threads = 1
[mysql]
default_character_set=utf8
[client]
port = 3306
```

# 参考
[https://blog.linuxeye.com/379.html](https://blog.linuxeye.com/379.html)

[http://www.jb51.net/article/33569.htm](http://www.jb51.net/article/33569.htm)
