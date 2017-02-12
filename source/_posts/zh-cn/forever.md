---
title: foreverjs
excerpt: foreverjs
categories: 
- FE
---


参照：[https://cnodejs.org/topic/5021c2cff767cc9a51e684e3](https://cnodejs.org/topic/5021c2cff767cc9a51e684e3)

github：[https://github.com/foreverjs/forever](https://github.com/foreverjs/forever)

- 全局安装forever
```
npm install forever -g
```
- 启动（文件变化自动重启,同时监视文件及文件夹)
```
forever start  app.js --watchDirectory --watch
```
-w慎用，见：[https://github.com/foreverjs/forever/issues/235](https://github.com/foreverjs/forever/issues/235#issuecomment-69095346)
- 列出所有运行的脚本
```
forever list
```
- 注意：当增加npm模块后，需要在布置的机器上运行npm install
