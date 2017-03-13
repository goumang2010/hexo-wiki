---
title: performance
excerpt: 前端页面性能测试
categories: 
- FE
---

# 基础知识

- [HAR ​standard](https://w3c.github.io/web-performance/specs/HAR/Overview.html)
- [Navigation_timing_API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_timing_API)
- [yslow](https://github.com/marcelduran/yslow)
- [coach](https://github.com/sitespeedio/coach)
- [PageSpeed](https://developers.google.com/speed/pagespeed/)
- [psi](https://github.com/addyosmani/psi)
- [wikipedia-Website_monitoring](https://en.wikipedia.org/wiki/Website_monitoring)
- [wikipedia-Web_analytics](https://en.wikipedia.org/wiki/Web_analytics)

![](/images/performance-1.png)

# 监控指标及规则

1. 页面优化情况（Yahoo的23条规则）
2. 接口请求并发数及数据返回时间
3. 静态资源的请求并发数及返回时间
4. 缓存使用情况及优化空间
5. 关于接口的压力测试
6. 与主流站点间的指标比较
7. 站点相关日志分析

## 具体指标参考
<h4 id="overallScore">总体分数</h4>
<p>平均组合性能表现, 是 Coach中综合可用性与最佳实践的分数. 如果该分数为100表示完美，不需要再进行修改。</p>
<h4 id="performanceScore">性能分数</h4>
<p>coach计算页面与性能最佳实践的接近程度 查看全部&nbsp;<a href="#performanceAdvice">建议列表</a>.</p>
<h4 id="accessibilityScore">可用性分数</h4>
<p>确保所有人可以进入并使用你的站点. 参考以下链接了解更多&nbsp;<a href="https://github.com/sitespeedio/coach/issues/new">help out&nbsp;</a>. 通过以下链接了解如何提高可用性&nbsp;<a href="https://www.marcozehe.de/2015/12/14/the-web-accessibility-basics/">here</a>.</p>
<h4 id="bestPracticeScore">Web最佳实践分数</h4>
<p>与Web最佳实践接近程度. 确保页面能被搜索引擎索引, 有良好的url结构。 阅读全部&nbsp;<a href="#bestPracticeAdvice">the advice</a>.</p>
<h4 id="timingMetrics">计时</h4>
<h5 id="backEndTime">后端用时</h5>
<p>服务器生成页面及网络传输页面所用时间.通过导航计时API中的定义计算: responseStart - navigationStart</p>
<h5 id="frontEndTime">前端用时</h5>
<p>浏览器解析及创建页面所用的时间. 通过导航计时API中的定义计算:  loadEventStart - responseEnd</p>
<h5 id="domContentLoadedTime">DOM内容加载计时</h5>
<p>解析文档、 执行延迟和被解析插入的脚本所耗时间，包括从用户位置到服务器的网络时间. 通过导航计时API中的定义计算: domContentLoadedEventStart - navigationStart</p>
<h5 id="domInteractiveTime">DOM交互时间</h5>
<p>浏览器解析文档所用的时间, 包括从用户位置到服务器的网络时间. 通过导航计时API中的定义计算: domInteractive - navigationStart</p>
<h5 id="domainLookupTime">域名解析计时</h5>
<p>DNS查询所用的时间. 通过导航计时API中的定义计算: domainLookupEnd - domainLookupStart</p>
<h5 id="pageDownloadTime">页面下载计时</h5>
<p>下载页面所用时间 ( HTML). 通过导航计时API中的定义计算: responseEnd - responseStart</p>
<h5 id="pageLoadTime">页面加载计时</h5>
<p>页面加载所用时间, 从页面视图初始化 (e.g., 点击页面链接)到在浏览器中加载完成. 注意: 这仅仅和某些页面相关, 取决于页面如何构建. 通过导航计时API中的定义计算: loadEventStart - navigationStart</p>
<h5 id="redirectionTime">重定向计时</h5>
<p>重定向所用时间. 通过导航计时API中的定义计算: fetchStart - navigationStart</p>
<h5 id="serverConnectionTime">服务器连接计时</h5>
<p>连接服务器所用时间. 通过导航计时API中的定义计算: connectEnd - connectStart</p>
<h5 id="firstPaint">首次绘制</h5>
<p>发生在屏幕上首次绘制的时候. 如果浏览器支持这项指标 (现在只有Chrome支持), 则使用它.</p>
<h5 id="fullyLoaded">完整加载</h5>
<p>所有资源都已下载的时候. 通过资源计时API计算 API.</p>
<h5 id="speedIndex">速度指数</h5>
<p>速度指数是页面可见部分被展示的平均时间. 以毫秒表示并且与视口大小相关 。它由 Pat Meenan 创建 可通过以下连接查看完整文档&nbsp;<a href="https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index">here</a>.</p>
<h5 id="rumSpeedIndex">RUM-速度指数</h5>
<p> Pat Meenan 创建的一个浏览器版本， 使用资源计时来进行速度指数测量计算 。它和速度指数一样并不完美，但是是一个好的开始.</p>

## 页面检查及建议
参见[coach](coach)

***

# 技术案例
- ## har文件及浏览器工具
- ## [psi](https://github.com/addyosmani/psi)
  调用google API，需使用vpn翻墙,[github](https://github.com/addyosmani/psi)
- ## [WebPageTest](#WebPageTest)
- ## [SiteSpeed](#SiteSpeed)
- ## [bonree](http://www.bonree.com/)
- ## Web服务器/转发服务器直接优化
  -  nginx/apache 中间件 eg:https://github.com/pagespeed/ngx_pagespeed
  -  url rewrite进行静态化

***

# 解决方案

1. 页面优化情况检查接口
 - 参照[sitespeed](https://www.sitespeed.io/),[grunt-yslow](https://github.com/andyshora/grunt-yslow),
[psi](https://github.com/addyosmani/psi)
2. 制作页面性能综合测试接口。
 - 页面加载响应时间测试监控（首页加载时间、各链接响应时间）
 - 各地域测试（使用已购买的接口或购买新接口）
3. 压力测试
4. 数据的处理和比较
 - 定期扫描主流站点，根据测试结果形成标准并定期更新
 - 定期运行分析，记录站点当前的性能状态
 - 制作相应的数据模型并存入数据库（Mongo/MySQL）
5. 统计数据的可视化，建立展示站点，开发相应展示功能（Vue/Echart）
6. 预警推送功能（邮件/APP）

## 与现有解决方案相比的特色
1. 增加页面优化分析和建议项
2. 定制重要指标，简化操作
3. 预警推送有的放矢

# <a name="WebPageTest">WebPageTest</a>
# 平台搭建
目前WebPageTest私有实例只能搭建在Windows平台上，搭建步骤如下：
1. 下载已编译的WebPageTest实例：webpagetest_2.19.zip 目前最新版本2.19
2. 在windows上部署apache/nginx+php环境，可采用xampp安装，注意2003及XP需使用[旧版1.8.2的版本](https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/1.8.2/)。
并且在此之前，需安装[VC环境](https://www.microsoft.com/en-us/download/confirmation.aspx?id=5582)
3. 将webpagetest_2.19.zip解压，www文件夹中的文件移动至apache站点的根目录（或将apche配置文件中的文档根目录指定至解压后的文件夹）。测试[http://127.0.0.1/](http://127.0.0.1/),应已可显示Web UI。
4. 查看网站中settings文件夹，参考.sample文件,创建相应的.ini文件，测试时仅需创建locations.ini，保证在UI中location可以选择。
5. 打开webpagetest_2.19.zip中的agent文件夹，把<b>所有</b>sample文件转为ini文件，修改wptdriver.ini，将其中的各浏览器对应的地址转为本地正确的地址
6. 安装dummynet，在网络连接中安装服务，从agent\dummynet\64bit或32bit中选择安装
7. 启动wptdriver.exe ，正常状态应该是Waiting for work，若在下载文件中卡住，应把wptdriver.ini所涉及的下载文件都在当前目录下建立相应空文件，并把ini涉及的地址改为本地
8. 在浏览器中打开[http://127.0.0.1/](http://127.0.0.1/),输入测试网址，选择Location为Test及浏览器Chrome，运行后应该能正常生成报告
9. 若未能成功安装dummynet，则无法使用连接速度控制功能，这时应在UI里高级选项中将从Connection下所有数值置为0，否则会报错。
10. WinXP目前不能使用2.19版本，只能使用旧版。
11. 该php站点并未绑定域名，故可通过所有站点IP/域名来访问。其他事项参考[官方文档](https://sites.google.com/a/webpagetest.org/docs/private-instances)

# <a name="SiteSpeed">SiteSpeed</a>
参见： [sitespeed](sitespeed)