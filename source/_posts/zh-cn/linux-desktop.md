---
title: linux-desktop
excerpt: linux-desktop
categories: 
- Linux
---
# 安装
```
apt-get install ubuntu-desktop
```

# 远程桌面
[http://www.xuebuyuan.com/1791546.html](http://www.xuebuyuan.com/1791546.html)


# 安装Chrome
```
wget [https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb](https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb)
sudo dpkg -i google-chrome-stable_current_amd64.deb
```
以root运行：[http://blog.sina.com.cn/s/blog_633763a2010137i3.html](http://blog.sina.com.cn/s/blog_633763a2010137i3.html)
```
1 进入 /opt/google/chrome 文件夹
2 找到 ‘google-chrome’ 文件
3 用 TextViewer打开或者VI编辑
4 将最后一行。
	exec -a "$0" "$HERE/chrome" "$@"
替换为
	exec -a "$0" "$HERE/chrome" "$@" --user-data-dir $HOME
5 保存，即可。
```

# 远程桌面
## 安装vnc server
这步必须在安装xrdp之前，否则连接时会出现错误
```
apt-get install tightvncserver
```

## 安装xrdp
```
apt-get install xrdp
```

## 安装xfce4桌面
```
apt-get install xfce4
```

## 配置文件
将使用xfce4桌面写入配置文件
```
echo "xfce4-session" >~/.xsession
```

## 重启服务
```
sudo service xrdp restart
```
