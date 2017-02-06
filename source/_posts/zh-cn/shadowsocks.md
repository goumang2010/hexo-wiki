---
title: shadowsocks
excerpt: shadowsocks
categories: 
- FE
---



# 安装git
见[Ubuntu下安装github](Ubuntu下安装github)

# 安装编译工具
```
apt-get install build-essential autoconf libtool libssl-dev
```

# 克隆shadowsocks-libev仓库
```
git clone https://github.com/madeye/shadowsocks-libev.git
```

# 编译安装
```
./configure
make
make install
```

# 创建配置文件
```
vim /etc/shadowsocks.json
```

```
{
"server":"0.0.0.0",
"server_port":port,
"local_address": "127.0.0.1",
"local_port":1080,
"password":"password",
"timeout":300,
"method":"aes-256-cfb",
"fast_open": false,
"workers": 1
}
```
port替换为任意设定的端口，不要和已有端口冲突，10000以下
password替换为设定的密码，8位以上
aes-256-cfb为加密方式，客户端上需要选择

# UDP转发并运行服务
```
nohup /usr/local/bin/ss-server -c /etc/shadowsocks.json -u &
```
运行后可以使用Ctrl+C回到命令行，服务会在后台运行

# 设定开机自动运行
```
vim /etc/rc.local
```
加入：
```
nohup /usr/local/bin/ss-server -c /etc/shadowsocks.json -u &
```
