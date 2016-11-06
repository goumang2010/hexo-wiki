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
