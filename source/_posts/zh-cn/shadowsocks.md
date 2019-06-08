---
title: shadowsocks
excerpt: shadowsocks安装方法
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

参照： <https://github.com/shadowsocks/shadowsocks-libev>

### 安装git
见[Ubuntu下安装github](Ubuntu下安装github)

### 安装编译工具

#### Ubuntu/Debian

```bash
sudo apt-get install --no-install-recommends gettext build-essential autoconf libtool libpcre3-dev asciidoc xmlto libev-dev libc-ares-dev automake libmbedtls-dev libsodium-dev
```

#### CentOS

```bash
yum install epel-release -y
yum install gcc gettext autoconf libtool automake make pcre-devel asciidoc xmlto c-ares-devel libev-devel libsodium-devel mbedtls-devel -y
```

#### Arch

```bash
sudo pacman -S gettext gcc autoconf libtool automake make asciidoc xmlto c-ares libev
```

### 编译依赖

#### libsodium

```bash
export LIBSODIUM_VER=1.0.16
wget https://download.libsodium.org/libsodium/releases/libsodium-$LIBSODIUM_VER.tar.gz
tar xvf libsodium-$LIBSODIUM_VER.tar.gz
pushd libsodium-$LIBSODIUM_VER
./configure --prefix=/usr && make
sudo make install
popd
sudo ldconfig
```

#### MbedTLS

```bash
export MBEDTLS_VER=2.6.0
wget https://tls.mbed.org/download/mbedtls-$MBEDTLS_VER-gpl.tgz
tar xvf mbedtls-$MBEDTLS_VER-gpl.tgz
pushd mbedtls-$MBEDTLS_VER
make SHARED=1 CFLAGS="-O2 -fPIC"
sudo make DESTDIR=/usr install
popd
sudo ldconfig
```


### 获取源代码

```bash
git clone https://github.com/shadowsocks/shadowsocks-libev.git
cd shadowsocks-libev
git submodule update --init --recursive
```


### 编译

```
./autogen.sh && ./configure && make
sudo make install
```

# 创建配置文件

```bash
sudo vi /etc/shadowsocks-libev/config.json
```
**Note：/etc/shadowsocks-libev/不存在，则需要使用mkdir创建**

```json
{
"server":"0.0.0.0",
"server_port":port,
"local_port":1080,
"password":"password",
"timeout":300,
"method":"aes-256-cfb",
"fast_open": false,
"workers": 1
}
```
* port替换为任意设定的端口，不要和已有端口冲突，10000以下;
* password替换为设定的密码，8位以上;
* aes-256-cfb为加密方式，客户端上需要选择;
* 不要加入local_address字段。<https://github.com/shadowsocks/shadowsocks-libev/issues/2141>

# UDP转发并运行服务

找到ss-server位置

```bash
whereis ss-server
```

得到位置如：`/usr/bin/ss-server` 或是 `/usr/local/bin/ss-server`

```bash
nohup /usr/bin/ss-server -c /etc/shadowsocks-libev/config.json -u &
```

或

```bash
nohup /usr/local/bin/ss-server -c /etc/shadowsocks-libev/config.json -u &
```

运行后可以使用Ctrl+C回到命令行，服务会在后台运行

# 设定开机自动运行

```bash
vi /etc/rc.local
```
加入：

```bash
nohup /usr/bin/ss-server -c /etc/shadowsocks-libev/config.json -u &
```

# 停止服务

```bash
ps aux | grep ss-server
```

找到ss-server的pid，然后使用kill命令杀死进程。


