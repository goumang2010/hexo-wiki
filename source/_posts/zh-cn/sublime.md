---
title: sublime
excerpt: sublime
categories: 
- FE
---



# 安装


## Windows
- 下载Sublime3并安装[http://www.sublimetext.com/3](http://www.sublimetext.com/3)

## Debian/Ubuntu==
```
wget https://download.sublimetext.com/sublime-text_build-3103_amd64.deb
sudo dpkg -i sublime-text_build-3103_amd64.deb
subl
```
==License
参考：
[http://blog.csdn.net/kencaber/article/details/50651207](http://blog.csdn.net/kencaber/article/details/50651207)

# 插件


## 安装插件
- 安装package control，ctrl+`打开命令窗口，输入该网址指示的内容： [https://packagecontrol.io/installation](https://packagecontrol.io/installation)
- Ctrl+Shift+P打开命令框，输入 install Pakage即可安装拓展包

## 删除空行
DeleteBlankLines
Ctrl+A选中所有
Ctrl+Alt+Backspace --> 删除所有空行
Ctrl+Alt+Shift+Backspace--> 删除多余空行

# 快捷键
打开命令框： Ctrl+Shift+P

# 自定义快捷键
Preferences--Key-Bindings user
添加alt+1，alt+2为行注释/块注释
```
{ "keys": ["alt+1"], "command": "toggle_comment", "args": { "block": false } },
{ "keys": ["alt+2"], "command": "toggle_comment", "args": { "block": true } }
```


# 技巧
[https://www.zhihu.com/question/24896283](https://www.zhihu.com/question/24896283)
