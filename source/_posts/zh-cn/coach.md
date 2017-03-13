---
title: coach
excerpt: coach
categories: 
- FE
---

# 可用性 [参考](https://www.marcozehe.de/2015/12/14/the-web-accessibility-basics/)
## img标签一定要添加alt属性
所有的img标签都需要alt属性，这条规则没有例外. 如果没有，则请马上加上它。 
### 检查页面img标签的alt属性：
- 如果没有或者为空字符串，则提示：该页面有？个img标签缺少alt属性，其中？个img标签是唯一（非重复）的。
- 若alt属性过长（长度大于125），则提示：该页面有？ 个img标签alt属性文本过长 (长于125个字符).

## 使用h标签来结构化你的页面
标题使页面结构清晰，更加有逻辑. 维基百科使用标题来汇集文章，从H1到H6能清晰的向阅读者，搜索引擎等展示该页面的结构。 
<br />检查页面中h1-h6标签的数量：
- 页面没有h标签，则提示：页面没有标题。请使用标题使你的内容更加结构化。
- 没有更下级的h标签，则提示：这个页面没有h?标签，标签的优先级过低。

## 表单中的Input应有设置label
大多数input、select和textarea元素需要一个关联的label元素来声明他们的目的. 唯一例外的是产生按钮的那些, 如重置和提交按钮. 其他的, 如 text, checkbox, password, radio (button), search 等都需要一个label元素。
### 检查页面中input标签
如果input标签的类型为text，password，radio，checkbox，search中的一种，则通过以下两种方式检查
它是否有对应的label标签，并提示：表单中有？个input标签没有对应的label标签：
- 父元素的节点名称为LABEL，说明具有对应的label标签
- input元素具有id属性，并且有label标签的for属性为该id，说明具有对应的label标签

## 使用地标来结构化你的内容
地标是 article, aside, footer, header, nav 或main标签. 适当的添加这些地标能够使页面更易于理解，帮助用户更家容易的操作内容。
### 统计页面中的article, aside, footer, header, nav及main标签数量
如果一个都没有，则提示：页面没有用到任何地标。

## 不要禁止触摸缩放 [参考](http://www.iheni.com/mobile-accessibility-tip-dont-suppress-pinch-zoom/)
移动浏览的一个关键特性就是可以放大阅读内容，缩小定位内容。
### 检查页面中同时具有name和content属性的meta元素
若其content中含有user-scalable=no或initial-scale=1.0; maximum-scale=1.0
则提示：
注意！页面已禁用缩放，你不应该这样做。

## 在section标签中使用h标签来增强页面结构化
大多数input、select和textarea元素需要一个关联的label元素来声明他们的目的. 唯一例外的是产生按钮的那些, 如重置和提交按钮. 其他的, 如 text, checkbox, password, radio (button), search 等都需要一个label元素。
<br />Section标签应该至少有一个直接子级h元素。
### 检查页面中的section标签：
- 如果页面中没有section标签，则提示：页面中没有使用sections. 你应该使用它使你的内容更结构化.
- section标签没有h元素下级，则提示：该页面section标签下没有h标签，发生了？次.

## 在table中使用caption和th标签
使用caption元素给table添加一个合适的标头或摘要. 使用th 元素来表示列或行的标头. 利用它的作用范围和其他属性来理清关联。
### 检查页面中的每个table标签
检查其下是否有caption标签，以及tr标签下是否有th标签，若没有，则提示：
该页面的表格没有caption元素, 请添加一个合适的标头或摘要。

# 最佳实践

## 声明字符集(charset)
Unicode标准 (UTF-8) 覆盖世界上大多数字符, 标点和符号，请使用它。
### 通过document.characterSet取得字符集
- 如果取到的是null，则提示：该页面没有字符集。 如果你使用 Chrome/Firefox则一定是没有定义它, 如果你使用其他浏览器，则有可能是浏览器实现问题。
- 如果取到的不是UTF-8，则提示：你没有使用 UTF-8字符集?

## 声明doctype
\<!DOCTYPE> 声明不是HTML标签; 它是一条给浏览器指令，指示页面采用的是哪个版本的HTML。
### 通过document.doctype取得doctype
- 如果取到的是null，则提示：页面没有doctype. 请使用\<\!DOCTYPE html\>.
- 如果doctyped的name属性html(大写或小写)，并且systemId属性为空或为about:legacy-compat，则提示：
珍爱生命使用HTML5 doctype 声明: \<\!DOCTYPE html\>

## 使用更安全的https [参考](https://https.cio.gov/everything/)
页面应该总是使用HTTPS， HTTP/2也需要使用它! 你可以从https://letsencrypt.org/得到免费的 SSL/TLC 证书。
### 通过document.URL取得url
如果页面不是以https://开头，则提示：注意！该页面没有使用HTTPS. 每一个未加密的HTTP请求都将暴露用户的操作信息。

## 使用 HTTP/2
结合使用 HTTP/2 及 HTTPS 是一项新的最佳实践. 使用HTTPS的同时应该也使用HTTP/2
### 通过document.URL取得url，通过以下方法取得ConnectionType
 如果url包含https://但connectionType不包含h2，则提示：
该页面使用HTTPS的同时没有使用HTTP/转到HTTP/2以满足最佳实践并且使站点更快。
<pre>
function getHostname(url) {
    var a = window.document.createElement('a');
    a.href = url;
    return a.hostname;
  }
function getConnectionType() {
    // it's easy in Chrome
    if (window.chrome && window.chrome.loadTimes) {
      return window.chrome.loadTimes().connectionInfo;
    }
    // if you support resource timing v2
    // it's easy kind of easy too
    else if (window.performance && window.performance.getEntriesByType &&
      window.performance.getEntriesByType('resource')) {
      var resources = window.performance.getEntriesByType('resource');
      // now we "only" need to know if it is v2
      if (resources.length > 1 && resources[0].nextHopProtocol) {
        // if it's the same domain, say it's ok
        var host = document.domain;

        for (var i = 0, len = resources.length; i < len; i += 1) {
          if (host === getHostname(resources[i].name)) {
            return resources[i].nextHopProtocol;
          }
        }
      }
    }
    return 'unknown';
}
</pre>

## 声明语言 [参考](https://www.w3.org/International/questions/qa-html-language-declarations#basics)
根据W3C的推荐标准你应该使用lang标签为每个网页声明主要语言
### 检查html标签下的lang属性
- 如果取到的是null，则提示：```HTML标签缺少lang定义，定义它 <html lang="zh"> ```
- 如果根本没有html标签，则提示：```注意！你的页面没有HTML标签!```

## Meta 描述 [参考](http://static.googleusercontent.com/media/www.google.com/en//webmasters/docs/search-engine-optimization-starter-guide.pdf)
使用页面描述使其对搜索引擎友好
### 检查页面中同时具有name和content属性的meta元素
筛选name为description（不区分大小写）的meta，取其content属性:
- 如果没有content或内容为空，则提示：```页面没有 meta 描述（元描述）```
- 如果content长度大于155个字符，则提示：```meta 描述过长. 有？个字符, 推荐最大长度为155;```

## 页面标题
使用标题来使页面对搜索引擎友好
### 通过document.title取得标题
如果长度为0，提示页面没有标题,如果超过60个字符，提示:
标题过长，超出?个字符. 推荐最大字符数为60;

## 良好的url格式
一个干净的url对用户和SEO会更友好. 让url可读, 避免url过长, url中有空格, 过多的请求参数,并且不要在url中加入session id
### 通过document.URL取得url
- url包含?并且jsessionid在?的后面，则提示：```该页面将用户的session id作为参数了,请修改它，使其通过cookies来处理session```
- url包含不止一个&，则提示： ```该页面有两个以上的请求参数.你应该重新考虑，减少请求参数。```
- url的长度大于100，则提示： ```该URL有？个字符长. 请使它小于100个字符。```
- url中含有空格或%20，则提示： ```避免URL中含有空格，使用连字符或下划线代替。```

# 性能
## 不要在浏览器中缩放图片
缩放图片非常容易，并且可以在不同的设备中显示的很好，然而这种做法不利于性能! 浏览器中缩放图片会占用额外的CPU时间，也将严重的降低移动端的性能。并且用户需要下载额外的数KB甚至数MB的数据。所以不要这样做，确保在服务端创建同一图片的多个版本，以满足不同客户端的需求。
### 遍历页面中所有img标签
统计所有clientWidth属性比naturalWidth属性小的值超过100的数量.
如果数量不为0，则提示： ```页面有?个缩放的图片缩小超过100像素. 最好不要缩放它们```

## 不要加载单独的打印样式表
打印样式表并不常用，加载单独的打印样式表会拖慢页面性能。你可以使用@media print把打印样式包含在其他CSS文件中。
### 遍历页面中所有link标签,统计media属性为print的数量
如果数量不为0，则提示： ```页面有？个打印样式表. 你应该使用@media print把打印样式包含在其他 CSS文件中```

## 避免拖慢关键渲染路径
关键渲染路径是指浏览器渲染页面的主要路径。每个在head元素中请求的文件将会延迟页面的渲染，因为浏览器要先处理这些文件请求。避免在head中使用js (你不应该需要用js来渲染页面)，请求的文件应该与主文档同域名 (避免DNS查询)，使用内联 CSS 或服务器推送达到快速渲染和缩短渲染路径的目的。
### 取得head中所有css文件路径
遍历head中的所有link标签，筛选rel属性为stylesheet并且href不以data:开头的元素，提取其绝对路径
- 如果使用的是HTTP/2，而数量不为0，则提示： ```确保使用服务器推送CSS来达到快速渲染```
- 检查文件大小，如果大于14.5 kB，则提示：```样式文件(url)大于TCP窗口大小 14.5 kB. 确保文件小于它以保证快速渲染.```
- 如非使用HTTP/2，则检查文件路径是否与页面同域名，如果不是则扣分
### 取得head中所有同步js文件路径
遍历head中的所有script标签，筛选不存在async属性且存在src属性的元素，提取其绝对路径
- 如果使用的是HTTP/2，且数量不为0，则提示： ```避免在文档头部加载同步j文件,你不应该需要js文件来渲染页面```
- css+js数量不为0，则提示：```页面头部有？ 个阻塞CSS请求和？个阻塞JS请求```

## 在HTTP/1上使用内联样式以加快首次渲染
在互联网早期内联样式是一个丑陋的做法。但这样做能加快用户首次渲染速度.在使用HTTP/1时应该内联关键CSS，避免CSS请求阻塞渲染，之后懒加载并缓存剩余的CSS. 使用HTTP/2情况会复杂些。如果你的服务器可以做http推送，大量用户连接缓慢且需下载大块HTML. 那么使用内联是更好的选择，因为服务器上HTML内容优先级高于CSS，所以用户需要先下载HTML，再下载CSS。
### 取得head中所有css文件数量及style标签数量
- 如使用HTTP/2，css文件数量和style标签数量都大于0，则提示：```该页面使用HTTP/2，同时存在css文件和style标签。 如果你的服务器支持推送，确保通过服务器推送来取得CSS文件.大量用户连接较慢, 使用内联是更好的选择. 请自行测试并查看瀑布图```
- 如使用HTTP/2，css文件数量为0，style标签数量大于0，则提示：```该页面有内联样式并使用HTTP/2.如果大量用户连接较慢, 使用内联是更好的选择，否则如果你的服务器支持推送，请使用服务器推送单独的CSS文件.```
- 如使用HTTP/2，css文件数量大于0，则提示：```如果你的服务器支持推送，则确保把CSS请求放在文档头部，否则请使用内联样式```
- 如使用HTTP/1，style标签数量为0，css文件数量大于0，则提示：```该页面头部有?个CSS请求, 请内联关键样式并懒加载其余的CSS```
- 如使用HTTP/1，css文件数量和style标签数量都大于0，则提示：```该页面头部同时具有内联样式和?个CSS请求. 请仅使用内联样式以加快首次渲染速度```

## 避免使用多个JQuery版本
在同一页面使用多个版本的JQuery会导致额外下载大量的数据，清理代码并仅是有一个版本。
### 通过以下方法获取存储所有JQuery原型的数组
数组长度大于1，则提示：```该页面有？个版本的jQuery!你只需要一个版本，请移除没必要的版本.```
<pre>
  var versions = [];
  // check that we got a jQuery
  if (typeof window.jQuery == 'function') {
    versions.push(window.jQuery.fn.jquery);
    var old = window.jQuery;
    while (old.fn && old.fn.jquery) {
      old = window.jQuery.noConflict(true);
      if ((!window.jQuery) || (!window.jQuery.fn)) break;
      if (old.fn.jquery === window.jQuery.fn.jquery) {
        break;
      }
      versions.push(window.jQuery.fn.jquery);
    }
  }
</pre>

## 避免前端单点失败(SPOF)
如果某个JS文件、CSS、字体没有取回或是加载缓慢（白屏），加载的页面就会在浏览器中卡住.所以不要在head标签中同步加载第三方的组件.
### 统计页面头部所有 <u>同步</u>CSS和JS请求
筛选其中链接域名和文档域名不同的元素
如果数量不为0，则提示： ```该页面头部有？个请求可能引起 SPOF. 异步加载它们或是把其移出文档头部```

## 异步加载第三方JS插件
使用异步加载的JS切片能够加快速度，提高用户体验，避免阻塞渲染.
### 统计页面头部所有<u>同步</u>CSS和JS请求
通过匹配链接域名，筛选出第三方插件
如果数量不为0，则提示： ```该页面有？个同步第三方JS请求，把它们替换为异步请求.```

## 使用用户 Timing API 来检查性能
用户Timing API是一个完美的方法来测量网站指定的或常规的指标.
### 检查window.performance
window.performance.getEntriesByType('mark').length或
window.performance.getEntriesByType('measure').length任一一个大于0，表示浏览器支持。
提示： ```开始使用Timing API来测量网站指定的或常规的指标。```

否则提示：```NOTE: 浏览器不支持User timing```

# HAR性能检查
利用从har文件中得到的数据进行检查

## 避免资源重定向
重定向对于用户下载资源来说是一个额外的步骤. 避免重定向使得页面加载更快并且防止移动端卡住
### 检查资源请求的status
如果存在301, 302, 303, 305, 306, 307中的一种或几种，并统计与页面域名不同的项
如果存在，则提示：```页面有 ?个重定向. 其中?个是来自主域名的，请修复它们 ```

## 通过设置缓存头来避免额外的请求
提高页面速度的最好办法就是不要请求服务器. 在服务器响应上面设置一个缓存头可以让浏览器在设定的缓存时间内不再重复下载资源。
### 检查资源请求的expires
统计小于等于0的项目
如果存在，则提示：```该页面有？个请求没有设置缓存时间. 设置一个缓存时间，这样浏览器就不需要每次都下载. 这在下次进入该页面时将节省？kB ```

## 设置长的缓存时间
设置长的缓存时间 (至少30天) ，这样资源能长期存在浏览器中. 如果静态资源改变了，那么就给它重命名，这样浏览器就会重新下载.
### 检查资源请求的expires
统计小于2592000的项目
如果存在，则提示：```该页面有？个请求的已设置的缓存时间小于 30 天 ```

## 压缩文本内容
互联网早期，浏览器不支持压缩文本内容 (gzipping) . 现在则需要压缩 HTML, JSON, Javacript, CSS and SVG这样可以减少流量、使页面更快、节省网络带宽
### 检查资源请求的编码
筛选type为'html', 'plain', 'json', 'javascript', 'css', 'svg'的资源，通过```asset.headers.response['content-encoding']```取得编码（asset是静态资源对象），统计编码不是gzip的项目
如果存在，则提示：```该页面有 ？个请求服务器没有压缩.压缩它们可以节省很多资源```

## 不要关闭一个会使用多次的连接
使用keep alive标头这样就可以复用同一域名下的连接. 从前的立即关闭连接需要时再打开的说法已经不适用了
### 检查资源请求的连接
检查asset.headers.response.connection（asset是静态资源对象）是否包含close，如果有两个及以上相同域名者
，则提示：```该页面有？个请求未能复用相同域名的连接. 请使用keep alive复用连接```

## CSS大小不该过大
传递大的CSS给浏览器会增加解析时间，拖慢渲染速度. 请仅发送页面所需的CSS，并移除不再使用的CSS规则
### 检查css资源的大小
筛选type为css的资源，累加它们的contentSize
- 大于1000000，则提示：```CSS文件总大小已超过1MB，不适合再移动端显示```
- 大于2000000，则提示：```CSS文件总大小已超过2MB，请修改.```
- transferSize超过120k或contentSize超过400k，并且contentSize大于transferSize，则提示：```总CSS传输尺寸为?kB,非压缩尺寸为contentSize kB ```

## 避免主文档重定向
除非是http重定向至https，否则不要使用页面重定向
### 检查documentRedirects
同时检查url和finalUrl，若documentRedirects大于0
- 若url包括```http:```且finalUrl包含```https```则提示：``````
- 否则提示： 主文档重定向documentRedirects 次，去除这些重定向使得页面速度更快

## 图标应该小且能够缓存
把图标做小，并加上长时间（大于30天）的缓存头.
### 检查type为favicon的资源
检查status，size，expires，size大于2000则提示： ```图标大小大于?bytes. 这已经很大了，请尝试把它做小```

## 避免多字体
过多的字体会拖慢渲染速度, 若字体未加载完成文字可能会闪光甚至不显示
### 检查type为font的资源
若数量大于1，则提示： ```页面有 ？个字体请求.请确认是否真的需要它们```

## 避免同域名过多请求[HTTP/1]
使用 HTTP/1时，浏览器对每个域名下的并发请求存在限制. 当达到限制后请求需要排队发出。
### 检查连接类型和domains对象
- 连接类型为HTTP2，则提示：```HTTP/2连接对于请求数几乎没有限制, 但这也不完全正确，取决于下载的是是么. 请检查HAR文件查看详情```
- 检查domains中每个域名的请求数，统计超过30个请求的域名数，并提示：```'该页面有?个域名发起的超过 30 个请求.通过分片或迁移至HTTP/2提高性能.```

## 请求头不应过大[HTTP/1]
使用HTTP/1时避免大量cookie和其他东西使得请求头过大，因为请求头是不压缩的. 你会发送多余的东西给用户
### 检查连接类型和每个资源的headerSize
- 连接类型为HTTP2，则提示：```该页面使用HTTP/2 连接，请求头已压缩, 很好```
- headerSize大于20000，则提示：```该页面有个请求头部大于20kb. 你应该试图减少发送的cookie```

## 总图片大小过大
避免页面中有过多的大图片. 这些图片不会影响页面的绘制，但会占用用户大量带宽.
### 检查type为image或svg的资源
累加它们的contentSize，大于700000，则提示：```该页面的总图像大小超过700kB. 这是已经很大了，确保你选择了正确的图片格式并已被压缩，可以使用ImageOptim让它们变得更小.```

## 总JS大小不应过大
大量JS意味着可能下载了很多用户并不需要的，确定页面的复杂性，和是否使用了多套JS框架?
### 检查type为javascript的资源
累加它们的contentSize和transferSize
- transferSize超过contentSize，则提示：```总共JS传输大小为transferSize，未压缩的大小为contentSize```
- contentSize超过500000或transferSize超过120000，则提示：```总共JS已很大了，你需要精简JS ```
- contentSize超过1000000，则提示：```crazy，你需要精简JS```

## 使每个CSS请求尽量小
减小css请求尺寸，使其满足 TCP 窗口大小 14.5 kB. 这样可以下载CSS更快，从而更早的渲染页面.
### 检查type为css的资源
累加它们的transferSize，大于14500，则提示：```请尝试精简CSS至14.5 kb内.```

## 总页面大小不应该过大
避免页面传输大于2 MB (桌面端) / 1 MB (移动端)，因为这将降低页面性能并占用用户网络带宽.
### 检查页面的transferSize
- 移动端大于1000000，桌面端大于2000000，则提示：```页面传输大小为transferSize，你需要精简它.```

## 不要在静态内容上使用私有头
如果在内容上设置私有头，表示该内容只针对该用户. 但静态内容可以被每个用户缓存和使用, 所以要避免设置头部私有.
### 遍历每个资源
检查asset.headers.response['cache-control']，若包含private，且资源url和页面url相同 ，则提示：```主页面有私有头.某些情况这是正确的，如用户登录才可访问特定内容，但若是静态共用的，请不要设置private.```

## 避免丢失和失败的请求
页面请求资源不应返回400或500错误.这些失败的请求不应被缓存, 否则浏览器每次都会这样做. 如果这种情况发生了，表示有东西损坏了，应及时修复
### 遍历每个资源
检查资源的status，如果大于等于400,则计入统计，之后进行分组，提示：```这个页面有 ?个失败的请求，请求代码为status```