---
title: shadowsocks
excerpt: shadowsocks
categories: 
- FE
---
# 安装
## 包管理器安装
https://github.com/shadowsocks/shadowsocks-libev#debian--ubuntu

```
sudo apt update
sudo apt install shadowsocks-libev
```

## 编译安装
### 安装git
见[Ubuntu下安装github](Ubuntu下安装github)

### 安装编译工具
```
apt-get install build-essential autoconf libtool libssl-dev
```

### 克隆shadowsocks-libev仓库
```
git clone https://github.com/madeye/shadowsocks-libev.git
```

### 编译
```
./configure
make
make install
```

# 创建配置文件
```
sudo vim /etc/shadowsocks-libev/config.json
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

找到ss-server位置
```
whereis ss-server
```

得到位置如：`/usr/bin/ss-server`

```
nohup /usr/bin/ss-server -c /etc/shadowsocks-libev/config.json -u &
```
运行后可以使用Ctrl+C回到命令行，服务会在后台运行

# 设定开机自动运行
```
vim /etc/rc.local
```
加入：
```
nohup /usr/bin/ss-server -c /etc/shadowsocks-libev/config.json -u &
```
