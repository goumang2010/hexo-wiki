---
title: win-cmd
excerpt: win-cmd
categories: 
- FE
---

# BCD命令
* Win7及以上禁用驱动强制签名,其中win8及8.1需要配合快速启动达到保持禁用强制签名的效果
```
bcdedit -set loadoptions DDISABLE_INTEGRITY_CHECKS
bcdedit -set TESTSIGNING ON
```
# netstate
## 查找端口被占用程序
如查看4000端口被占用情况：`netstat -aon|findstr "4000"`

# start
## 打开并运行命令
- 打开新terminal：`start cmd.exe /K "SET NODE_ENV=dev&& npm run rollupwatch`
- 打开网址： `start http://localhost:4000` 注意需要加上http(s)才能被认为是网址
