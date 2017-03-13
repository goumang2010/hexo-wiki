---
title: sitespeed
excerpt: sitespeed
categories: 
- FE
---

基于coach/Yslow，github: [github](https://github.com/sitespeedio/sitespeed.io)
。运行后生成一个纯静态站点展示所有报告
# v3.x
为目前的生产环境版本，使用YSlow和BrowserMobProxy 分析页面，[官方文档](https://www.sitespeed.io/documentation/)即3.11.7版本文档.Windows下安装测试步骤：
1. node环境及VS（C++编译器）环境，npm源添加淘宝镜像。
2. 安装JAVA并确保加入环境变量path
3. 下载解压slimerjs-0.9.6-win32.zip，并确保slimerjs.bat所在目录包含在环境变量path中。
4. 下载解压phantomjs-2.1.1-windows.zip,并确保phantomjs.exe所在目录包含在环境变量path中。
5. 下载解压chromedriver_win32.zip,并确保chromedriver.exe所在目录包含在环境变量path中。
6. 运行```npm install -g sitespeed.io```
7. 测试：```sitespeed.io.cmd -u  https://m.gomeplus.com --wptHost  www.webpagetest.org --wptKey A.d8127398a99713f3083f549dec9641ef```

# v4.0
为目前开发版本，采用coach，不需要java依赖和浏览器前置代理，速度更快。
## 源码分析
### 入口文件./bin/sitespeed.js
通过../lib/support/cli.js接受命令行传递的参数，cli.js使用yargs对参数处理，并导出options，options传入../lib/support/pluginLoader.js的parsePluginNames方法，处理后得到所有使用的插件名称，最后使用../lib/sitespeed.js的方法，传入插件名称和cli的options进行最后处理。
### ./lib/sitespeed.js
导出run(pluginNames, options){},该方法首先建立相关存储目录，然后调用./support/pluginLoader.js中的loadPlugins方法，该方法传入插件名，导出require各个插件后的模块对象，调用runOptionalFunction方法，执行各个模块定义的open，postOpen(如果存在)，再传入./support/queueHandler.js处理，对模块进行队列管理，调用模块的processMessage方法，出现错误会调用close方法。
### ./support/queueHandler.js
构造QueueHandler类，该类构造器传入plugins模块数组和用户输入的参数options，并调用createQueues构造执行队列。run方法传入url-source.js构建的对象，并执行findUrls方法，该方法会执行queueHandler.js中的postMessage方法，并传入参数{type='url',...},这回导致队列每个插件的参数都为'url'，当之后的startProcessingQueues时传入了处理函数plugin.processMessage(message, this)后，会执行自身的processMessage({type:'url,...}',this)。再所有插件都执行完毕后，又一次调用processMessage，这会传入{type:'summarize',...}进行结果输出。
### 插件
./lib/support/pluginLoader.js定义的默认插件为'browsertime', 'coach', 'domains', 'assets', 'html', 'analysisStorer','screenshot'，这些插件被queueHandler.js中的队列控制，按顺序加载调用。
#### browsertime
在调用processMessage({type:'url,...}',this)时，会先通过analyzer.js的analyzeUrl方法对url进行分析，该方法是执行主体，其中同时调用browsertime和coach模块，得到结果后通过队列的postMessage进而调用插件processMessage的type参数情况判断含有'browsertime.run'，'browsertime.pageSummary'，'browsertime.har'，'browsertime.screenshot'的插件的相应方法。这些情况都在html插件当中，即把结果输出给html。注意browsertime.har还会触发domains和coach相应的processMessage方法。
#### coach
browsertime默认会通过其中的processCoachOutput触发type为coach.run的processMessage方法，该方法触发html插件的coach.pageSummary。
## Windows安装测试方法:
1. node环境及VS（C++编译器）环境，npm源添加淘宝镜像。
2. 下载解压phantomjs-2.1.1-windows.zip,并确保phantomjs.exe所在目录包含在环境变量path中。
3. 下载解压chromedriver_win32.zip,并确保chromedriver.exe所在目录包含在环境变量path中。
4. 运行```npm i -g sitespeed.io@canary```
5. 测试：```sitespeed.io.cmd  https://m.gomeplus.com --webpagetest.host www.webpagetest.org --webpagetest.key A.d8127398a99713f3083f549dec9641ef --mobile --html.showWaterfallSummary```

