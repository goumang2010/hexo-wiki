---
title: VM
excerpt: 虚拟机相关
categories: 
- FE
---

# 磁盘格式转换
## GHO -> VMDK
使用ghost将分区直接转化为VMDK

# 转化为虚拟机
## Win7及以下
- 使用ghost将分区直接转化为VMDK
- 复制备份C:\Windows\System32\drivers
- 虚拟机安装相同系统版本的Ghost系统
- 拷贝虚拟机Ghost系统的C:\Windows\System32\drivers
- 打开VMDK，获取C:\Windows\System32\drivers所有权及更改权限，使用虚拟机的文件替换之.
- 若系统版本不同，则仅补充新的文件，不可覆盖。
- 修复VMDK的引导，并启动。
- 启动后，若有功能不正常，用备份的C:\Windows\System32\drivers替换之，跳过正在使用的文件，这样就把加载失败的驱动替换回了原驱动。
