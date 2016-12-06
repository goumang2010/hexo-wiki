---
title: BP
excerpt: BP
categories: 
- FE
---

# 操作流程
目前尚处于测试阶段。
##  增加埋点
1.  管理平台地址（测试）： http://bi.test.gomeplus.com/
2.  使用域的账户和密码登录，并通知管理员开头相关权限。
3.  进入数据埋点 -> 可视化埋点，在埋点URL中输入需要埋点的网址，当前可用网址为预生产环境：https://www-pre.gomeplus.com/  选择平台后，点击检索页面。
4. 待页面加载完成后，可通过鼠标查看当前选中的元素，点击邮件，可进入该元素的埋点菜单。
5. 在右键菜单中，对埋点信息进行增加或修改，点击保存/更新埋点后，完成埋点操作。
6. 左键点击页面其他元素，若该元素含有链接，则可跳转到该页面，进行正常埋点。
7. 若选择的平台与URL不符，埋点URL会自动变更为重定向后的网址。

## 查询,修改及删除
1. 进入 数据埋点 -> 埋点管理，可以查看所有埋点
2. 通过上方输入框，可以通过埋点URL、埋点名称、状态、匹配模式、平台、修改时间进行筛选。
3. 列表中的操作列可以进行相应的操作。点击修改可以进入可视化埋点界面编辑相关的埋点信息。
4. 点击删除、恢复将进行相应的操作。

## 热点分布图
1. 当用户点击埋点页面设置过的埋点元素时， sdk会将该行为及埋点信息进行上报。
2. 这些信息可以在热力分布图中体现。
3. 目前仅有pv页面点击量，uv用户访问数，可以在数据选择框中切换
4. 取消勾选显示热力图，可以像可视化埋点一样，点击相应的链接进行页面跳转，并刷新热力图。

# 埋点管理平台
## iframe加载埋点页面
### 前端
1. 用户输入埋点URL和平台
2. 前端验证URL是否合法，合法则将iframe的src属性置为`/databp/html?m=${platform}&url=${pageUrl}`,platform为用户选择的平台，pageUrl为用户输入的埋点URL。
3. iframe会向接口[/databp/html](#bphtml)发起get请求，传入以上参数。
4. iframe收到文档信息，进行正常渲染加载。
5. iframe加载完成后，jquery注入悬浮时的样式并绑定hover事件。
6. 绑定右击事件，右击时取得选择器信息，传给弹出右键菜单。
7. 绑定左击事件，当点击的元素或其父级有链接时，重新设置URL进行重新检索。
8. 触发的xhr请求，会导向[/databp/ajax](#bpajax)进行动态加载。

### 选择器
使用chrome获取选择器的js操作，并进行修改。
传入DOM节点node
1. 检查node.nodeType，若非Node.ELEMENT_NODE，直接返回空字符串。
2. 调用内部方法[_cssPathStep](#_cssPathStep)不断检查得到node及其父级的标识，直到到达DOM最顶级（html标签）
3. 若有任何一级检查标识出错，则终止该过程。
4. 将取得的标识从父到子，使用>连接。

#### <a name="_cssPathStep">\_cssPathStep
传入要检查的DOM节点node，是否启用优化optimized
1. 检查node.nodeType，若非Node.ELEMENT_NODE，直接返回null。
2. 通过getAttribute检查node的id，若存在，调用[DOMNodePathStep](#DOMNodePathStep)方法，并传入nodeName#id
3. 若id不存在，检查node.parentNode，若parent不存在或为document，表示该节点为根节点，标识唯一，直接传入nodeName，生成DOMNodePathStep对象。
4. id不存在，且不满足以上条件，调用[prefixedElementClassNames](#prefixedElementClassNames)生成prefixedOwnClassNamesArray
5. `var needsClassNames = false;var needsNthChild = false;var ownIndex = -1;`
6. 遍历node同级的所有DOM节点，确定needsClassNames及needsNthChild的最终值：若是没有同级元素，needsClassName和needsNthChild皆为false，若有同级同tagName的元素，needsClassName置为true，并比较所有同级同tagName元素的class，确定class是否唯一，若否，则标记needsNthChild为true。
7. 如果node就是最终节点且为input元素，没有id没有class，则将标识置为input[type="..."]
8. needsNthChild为true，则表示node没有可以唯一标识自身的class，则根据同级标签tagName的数量确定其为tagName:first-child +...的形式。
9. needsNthChild为false，needsClassNames为true，表示，其有可以唯一标识自身的class，则将prefixedOwnClassNamesArray中的元素去除$，并使用.拼接起来。
10. 把最终结果传入[DOMNodePathStep](#DOMNodePathStep)构造函数，返回新的[DOMNodePathStep](#DOMNodePathStep)对象。

#### <a name="prefixedElementClassNames">prefixedElementClassNames
存入DOM节点node
1. 通过getAttribute得到class属性。
2. 若class属性不存在，返回空数组。
3. `/\s+/g`分割，通过filter(Boolean)去除可能存在的空字符串。
4. 筛选出active类（自行添加），因为当埋点时，脚本可能自动添加active类，所以active类不能作为元素的唯一标识。
5. 将所有类名前加上$,返回数组。

#### <a name="DOMNodePathStep">DOMNodePathStep类
通过实例属性value存入传入的值，重写原型上toString方法，返回实例属性value


### <a name="bphtml">/databp/html接口
1. 根据平台设置请求头，并确定是否为重定向页面，并发起相应页面的http(s)请求，得到页面内容。
2. 将页面内容中，各标签href及src属性指向根域的地址替换为完整地址，从而使其iframe中可以正常加载。
3. 注入拦截XMLHttpRequest的脚本，将所有ajax请求定向至[/databp/ajax](#bpajax)接口。
4. 保存真实页面的cookie到后台session中，从而使页面后续的ajax请求能通过埋点页面网站后台的验证。
5. 将重定向后真实的地址和平台注入iframe的window对象中，从而反映在前端。
6. 将页面html文档返回给前端。

### <a name="bpajax">/databp/ajax接口
接受页面中重定向的ajax请求，从而修复iframe页面中的动态加载
1. 根据session中存储的页面cookie信息，设置相应的请求头。
2. 向真实地址发出请求，并返回结果。

## 右键菜单
1. 加载时根据传入的页面URl和选择器，请求埋点信息接口。
2. 显示已设置的埋点信息。
3. 绑定drag drop事件实现拖拽。

## 管理页面
实现埋点列表的分页查询，修改，删除，恢复。
其中修改使用Vue router跳转至可视化埋点页面。

## 热力图
1. 用户输入埋点URL和平台，在iframe中加载该页面。
2. 请求接口，返回热力图信息。
3. 调用[heatmap.js](#heatmap.js)，根据热力图信息生成热力图canvas。
4. 绑定数据来源选择，切换canvas。
5. 取消勾选显示热力图，即去除canvas遮罩，同可视化埋点，绑定单击事件，实现iframe页面的跳转。
6. 绑定MutationObserver，当DOM有新节点插入时，刷新热力图，从而实现动态加载元素的热力图绘制。

### <a name="heatmap.js">heatmap.js
echart2的heatmap组件，作者：me@zhangwenli.com， 灵感来源于[simpleheat](#https://github.com/mourner/simpleheat)
构造函数根据默认option补全传入的option，包括：
- blurSize 模糊尺寸
- gradientColors 渐变颜色数组
- minAlpha 最小不透明度
- valueScale 点位值的比例
- opacity 总体不透明度

#### getCanvas
传入数据data，长宽height,width
1. 调用[\_getBrush](#getBrush)取得笔刷。
2. 调用[\_getGradient](#getGradient)取得颜色渐变表。
3. 建立canvas画布，根据data中的点位上用第1步得到的笔刷画圆，圆心即点位，半径为`BRUSH_SIZE + this.option.blurSize`, 总体透明度为data中点位对应的值。这是这些圆是黑色的且从中心到边缘渐变为透明。
4. 通过getImageData取得canvas的data,注意每个点都有rgba四个值，所以四个值一组，遍历这些点，根据透明度在颜色渐变表上取值，即是重定义他们的颜色。
5. 通过putImageData将修改后的数据重新写入canvas。

#### <a name="getBrush">\_getBrush
1. `var r = BRUSH_SIZE + this.option.blurSize`
2. 以2r为长宽建立canvas画布
3. 以(-r,r)为圆心，r为半径画个黑色实心圆，此时该圆完全在画布左侧，画布上看不到该圆。
4. 设置shadowOffsetX为2r，以及shadowBlur，这样圆的模糊阴影就会出现在画布中心。
5. 返回画布。

#### <a name="getGradient">\_getGradient
1. 建立canvas花布，宽度为1，高度为256
2. 调用canvas的createLinearGradient，配合addColorStop，将颜色列表中的颜色均分渐变
3. 画一个填满画布的矩形，并以上步定义的渐变进行填充。
4. 通过getImageData得到数据并返回。


# js sdk
1. 通过domReady在DOM加载完毕后调用[pvLog](#pvLog)记录并发送pv信息，调用getSelector动态埋点信息。
2. 通过UA判断页面不是WebView，并且host在限定的范围内，在文档上绑定click或是touchstart事件：
 - 遍历e.target及其上级元素，检测其标签上是否有bp-data属性，取出其值转为对象data。
 - 若是a标签，则将href属性加入data中。
 - 检测e.target是否匹配动态埋点的元素，若匹配，若匹配取出其动态埋点信息和埋点id，混入data。
 - 通过[send](#send)上报data.
3. 监听window的error事件，报告错误和三层堆栈信息。

## BP入口
### <a name="pvLog">pvLog
收集[平台信息](#wm),拼接[getPvData](#getPvData)所收集的信息组,连同上报的地址构建get请求的url，调用工具方法[sendRequest](#sendRequest)进行发送。

### <a name="getPvData">getPvData
收集[客户端信息](#CI),[页面信息PI](#PI),[用户信息UI](#UI),[性能信息](#P),[特别信息SI](#SI)返回组合后的字符串，如：`CI=screen_size:1366x768|color_depth:24...&PI=pagename:%E5%9B|referrer:|is_homepage:unkown|dom_count:660...&UI=phpsid:61g1pa6cilc9ps7fod1gu5cbn3|ssid:892199852910.1479808626068|is_new:0...&P=sdate:-|load_time:2816...&SI=last_time:1480671035|active_no:-|page_id:A001...&source=`

### <a name="send">send
调用[getExt](#getExt)获取扩展信息，调用工具方法[jsonToQuery](#jsonToQuery)格式化传入的data，连同上报的地址构建get请求的url，调用工具方法[sendRequest](#sendRequest)进行发送。

### <a name="getExt">getExt
收集[页面信息PI](#PI),[性能信息P](#P),[平台信息](#wm),[用户信息UI](#UI)并组合为字符串


## 工具方法
### <a name="wm">获取平台信息getWm
通过创建TouchEvent事件来判断是否为移动端，记录形式为：`wm=m`或`wm=www`

### <a name="sendRequest">sendRequest
通过UA判断客户端不是PhantomJS，并且window.location.host在限定的列表中，则`var img = new Image();img.src = url;`

### <a name="jsonToQuery">jsonToQuery
将js对象转换为query字符串，注意该方法并未调用encodeURIComponent对字符串进行转义，所以需要时手动进行转义。

## 返回数据
### <a name="CI">客户端信息CI
- 屏幕尺寸:screen_size
通过window.screen.width/height获取，如`screen_size:1366x768`
- 屏幕色深:color_depth
通过window.screen.colorDepth获取，如`color_depth:24`
- appCode
通过navigator.appCodeName获取，如`app_code:Mozilla`
- appName
通过navigator.appName获取，如`app_name:MSIE`或`app_name:Netscape`
- CPU信息:cpu
通过navigator.cpuClass或oscpu获取，如`cpu:x86`
- 平台信息:platform
通过navigator.platform获取，如`platform:Win32`
- 网络连接类型:network
navigator.connection.type获取，对于IE10以前的IE，通过`document.body.addBehavior("#default#clientCaps");`然后取得document.body.connectionType获取，如：`network:-`
- 系统语言:language
通过navigator.systemLanguage或language获取，如`language:zh-CN`
- 时区:timezone
通过`new Date().getTimezoneOffset() / 60 `取得，如：`timezone:-8`
- Flash版本:flash_ver
遍历navigator.plugins数组，找到name为Shockwave Flash的项，截取description中的版本信息。对于IE10以下，则是从10开始往下遍历flash版本号，试验是否能成功new ActiveXObject('ShockwaveFlash.ShockwaveFlash.rev')来确定flash版本。如:`flash_ver:23.0 r0`
- 浏览器UA:ua
通过encodeURIComponent编码navigator.userAgent，如：`ua:Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F54.0.2840.99%20Safari%2F537.36`

### <a name="PI">页面信息PI
- 页面title:pagename
`encodeURIComponent(document.title || '-')`

- 页面引用:referrer
通过document.referrer得到跳转或打开到当前页面的那个页面的URI，若为空字符串，或通过`/^[^\?&#]*.swf([\?#])?/`判断该页面为flash页面，则截取win.location.href中ref到&之间的字符串作为结果。否则直接返回encodeURIComponent编码后的referrer，如：`referrer:https%3A%2F%2Fgroup.gomeplus.com%2Ftopic%2F58085f7d4b70a437327ab705.html%3Fcsid%3D150000001002`

- 当前页是否为浏览器默认首页:is_homepage
若是IE10以下的IE浏览器，通过`document.body.addBehavior("#default#homePage");`,而后通过document.body.isHomePage(win.location.href)判断。除此之外，置为`is_homepage:unkown`

- 页面DOM数:dom_count
通过`document.getElementsByTagName("*").length`取得,如： `dom_count:542`

- 页面iframe数:iframe_count
通过`document.getElementsByTagName("iframe").length`取得,如： `iframe_count:0`

- 当前页面的url:url
`encodeURIComponent(window.location.href)`, 如：`url:https%3A%2F%2Fwww.gomeplus.com%2F`

- 当前网站环境:env
测试当前url的host中是否包含dev，test，pre，有则置为相应环境，没有则置为pro，如`env:pro`

### <a name="UI">用户信息UI
- phpsid
通过在cookie中取得mx_wap_gomeplusid或mx_pc_gomeplusid并返回，如`phpsid:h1cmcj37euhqru7d3v33fjvff6`

- 唯一用户标记:ssid
若cookie中不存在ssid的cookie，则设置一个随机字符串作为ssid，设置5年的cookie，并返回，如`ssid:87418208056.1480669727100`,该值前面是11位数，后面为当前时间值

- 7天是否访问过此页面:is_new
检查cookie中是否有isnew的值，若存在，则返回`is_new:0`,否则设置其期限为7天的随机值。

- 用户id:uid
获取window.userId并返回，如：`uid:0`

- 店铺id:shop_id
`window.BPConfig.shop_id`,如`shop_id:0`

- 商品id:produce_id
`window.BPConfig.produce_id`,如`produce_id:0`

- 圈子id:group_id
`window.groupId`, 如`group_id:0`

- 话题id:topic_id
`window.topicId`, 如`topic_id:0`

- 频道id:channel
`window.BPConfig.channel`，如`channel:0`

### <a name="SI">特别信息SI
- 获取plasttime:last_time
`window.BPConfig.serverTime`存在，则设置cookie中plasttime为为该时间，否则设置为当前时间，期限都是1年，并返回如`last_time:1480675047`
- 获取active_no属性:active_no
`window.active_no`, 如`active_no:-`
- 获取页面id:page_id
`window.page_id`, 如`page_id:-`
- 获取页面name:page_name
`window.page_name`, 如`page_name:-`

### <a name="P">性能信息P
- 页面服务器时间:sdate
`window.BPConfig.serverTime`

- 页面加载结束时间:load_time
`loadTime - startTime`,loadTime为页面load事件触发时记录的时间，`startTime = win.BPConfig.startTime`

- 页面节点加载完成时间:ready_time
`readyTime - startTime`,readyTime为jquery的ready触发时记录时间，大多数情况比load要早，一般在DOMContentLoaded时被触发。

- 页面header加载时间：first_screen_time
`headEndTime - startTime`, `headEndTime = win.BPConfig.headEndTime`

- js sdk版本:version
直接写在源文件中

# 后续完善
1. 协调加入模拟登录
2. 更多可视化效果
