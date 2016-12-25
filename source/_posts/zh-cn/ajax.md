---
title: Ajax
excerpt: ajax写法
categories: 
- FE
---



# 原生写法
http://sjpsega.iteye.com/blog/1729350
```
function createXMLHTTPRequest() {   
                 //1.创建XMLHttpRequest对象   
                 //这是XMLHttpReuquest对象无部使用中最复杂的一步   
                 //需要针对IE和其他类型的浏览器建立这个对象的不同方式写不同的代码   
                 var xmlHttpRequest;
                 if (window.XMLHttpRequest) {   
                     //针对FireFox，Mozillar，Opera，Safari，IE7，IE8   
                    xmlHttpRequest = new XMLHttpRequest();   
                     //针对某些特定版本的mozillar浏览器的BUG进行修正   
                     if (xmlHttpRequest.overrideMimeType) {   
                         xmlHttpRequest.overrideMimeType("text/xml");   
                     }   
                 } else if (window.ActiveXObject) {   
                     //针对IE6，IE5.5，IE5   
                     //两个可以用于创建XMLHTTPRequest对象的控件名称，保存在一个js的数组中   
                     //排在前面的版本较新   
                     var activexName = [ "MSXML2.XMLHTTP", "Microsoft.XMLHTTP" ];   
                     for ( var i = 0; i < activexName.length; i++) {   
                         try {   
                             //取出一个控件名进行创建，如果创建成功就终止循环   
                             //如果创建失败，回抛出异常，然后可以继续循环，继续尝试创建   
                            xmlHttpRequest = new ActiveXObject(activexName[i]); 
                            if(xmlHttpRequest){
                                break;
                            }
                         } catch (e) {   
                         }   
                     }   
                 }   
                 return xmlHttpRequest;
             }   
```

## get
```
            function get(){
                var req = createXMLHTTPRequest();
                if(req){
                    req.open("GET", "http://test.com/?keywords=手机", true);
                    req.onreadystatechange = function(){
                        if(req.readyState == 4){
                            if(req.status == 200){
                                alert("success");
                            }else{
                                alert("error");
                            }
                        }
                    }
                    req.send(null);
                }
            }
```

## post
```
               function post(){
                var req = createXMLHTTPRequest();
                if(req){
                    req.open("POST", "http://test.com/", true);
                    req.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=gbk;");   
                    req.send("keywords=手机");
                    req.onreadystatechange = function(){
                        if(req.readyState == 4){
                            if(req.status == 200){
                                alert("success");
                            }else{
                                alert("error");
                            }
                        }
                    }
                }
            }
```

# Jquery
```
    $.ajax({
        url: 'addnote',// 跳转到 action  
        data: {
            noteText: note.text(),
            ifkeychanged: $('#keepkey').attr("checked"),
        },
        type: 'post',
        cache: false,
       // dataType: 'json',
        success: function (data) {
            showQR(data);
        },
        error: function () {   
            alert("通信异常！");
        }
    });
```

# 跨域写法

```
// 参照：
/*! qwest 4.4.5 (https://github.com/pyrsmk/qwest) */

const jsonToQuery = function (a) {
    const add = function (s, k, v) {
        v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;
        s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
    };
    const buildParams = function (prefix, obj, s) {
        let i;
        let len;
        let key;

        if (Object.prototype.toString.call(obj) === '[object Array]') {
            for (i = 0, len = obj.length; i < len; i++) {
                buildParams(prefix + '[' + (typeof obj[i] === 'object' ? i : '') + ']', obj[i], s);
            }
        } else if (obj && obj.toString() === '[object Object]') {
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (prefix) {
                        buildParams(prefix + '[' + key + ']', obj[key], s, add);
                    } else {
                        buildParams(key, obj[key], s, add);
                    }
                }
            }
        } else if (prefix) {
            add(s, prefix, obj);
        } else {
            for (key in obj) {
                add(s, key, obj[key]);
            }
        }
        return s;
    };
    return buildParams('', a, []).join('&').replace(/%20/g, '+');
};

const JSONParse = function () {
    if (window.JSON) {
        return JSON.parse;
    } else {
        return function (jsonstr) {
            return (new Function("return" + jsonstr))();
        };
    }
}();

const win = typeof window !== 'undefined' ? window : self;
// Get XMLHttpRequest object
let xdr;
let getXHR = win.XMLHttpRequest ? function () {
    return new win.XMLHttpRequest();
} : function () {
    return new win.ActiveXObject('Microsoft.XMLHTTP');
};
let xhr2 = (getXHR().responseType === '');

function Xget(url, data, options) {
    this.headers = {
        Accept: '*/*',
        'Cache-Control': ''
    };
    this.callback = options.callback;
    this.errHandler = options.errHandler || function (msg) {
        console.log(`error: ${msg}`);
    };
    // Prepare URL
    this.url = url + '?' + jsonToQuery(data);
    this.options = {
        _async: true,
        timeout: 30000,
        attempts: 2
    };
    this.attempts = 0;
    this.aborted = false;
    // timeout id
    this.timeoutid = null;
    // Guess if we're dealing with a cross-origin request
    let i = url.match(/\/\/(.+?)\//);
    this.crossOrigin = i && (i[1] ? i[1] !== location.host : false);
}

Xget.prototype.abort = function () {
    if (!this.aborted) {
        if (this.xhr && this.xhr.readyState !== 4) { // https://stackoverflow.com/questions/7287706/ie-9-javascript-error-c00c023f
            this.xhr.abort();
        }
        this.aborted = true;
    }
};

Xget.prototype.handleResponse = function (xhr = this.xhr) {
    clearTimeout(this.timeoutid);
    // Verify if the request has not been previously aborted
    if (this.aborted) {
        return;
    }
    // Handle response
    try {
        // Process response
        if (xhr.responseType === 'json') {
            if ('response' in xhr && xhr.response === null) {
                throw 'The request response is empty';
            }
            this.response = xhr.response;
        } else {
            this.response = JSONParse(xhr.responseText);
        }
        // Late status code verification to allow passing data when, per example, a 409 is returned
        // --- https://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
        if ('status' in xhr && !/^2|1223/.test(xhr.status)) {
            throw xhr.status + ' (' + xhr.statusText + ')';
        }
        // Fulfilled
        this.callback(this.response);
    } catch (e) {
        // Rejected
        this.handleError(e);
    }
};

Xget.prototype.handleTimeout = function () {
    if (!this.aborted) {
        if (!this.options.attempts || ++this.attempts !== this.options.attempts) {
            this.xhr.abort();
            this.send();
        } else {
            this.handleError({
                message: 'Timeout (' + this.url + ')'
            });
        }
    }
};

Xget.prototype.handleError = function (e) {
    console.log(e);
    let message = e && e.message;
    if (!this.aborted) {
        message = typeof message === 'string' ? message : 'Connection aborted';
        this.abort();
        this.errHandler(message);
    }
};

Xget.prototype.send = function ({
    method = 'get',
    url = this.url,
    options = this.options,
    headers = this.headers
} = {}) {
    // Get XHR object
    let xhr = getXHR();
    if (this.crossOrigin && win.XDomainRequest) {
        xhr = new XDomainRequest(); // CORS with IE8/9
        xdr = true;
    }
    // Open connection
    if (xdr) {
        xhr.open(method, url);
    } else {
        xhr.open(method, url, options._async);
    }
    this.xhr = xhr;

    // Set headers
    if (!xdr) {
        for (var i in headers) {
            if (headers[i]) {
                xhr.setRequestHeader(i, headers[i]);
            }
        }
    }
    // Plug response handler
    if (xhr2 || xdr) {
        xhr.onload = () => {
            this.handleResponse.apply(this);
        };
        xhr.onerror = () => {
            this.handleError.apply(this);
        };
        // http://cypressnorth.com/programming/internet-explorer-aborting-ajax-requests-fixed/
        if (xdr) {
            xhr.onprogress = function () {};
        }
    } else {
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this.handleResponse.apply(this);
            }
        };
    }
    // Plug timeout
    if (options._async) {
        if ('timeout' in xhr) {
            xhr.timeout = options.timeout;
            xhr.ontimeout = () => {
                this.handleTimeout.apply(this);
            };
        } else {
            this.timeoutid = setTimeout(() => {
                this.handleTimeout.apply(this);
            }, options.timeout);
        }
        // http://cypressnorth.com/programming/internet-explorer-aborting-ajax-requests-fixed/
    } else if (xdr) {
        xhr.ontimeout = function () {};
    }

    // Send request
    if (xdr) {
        // https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest
        setTimeout(function () {
            xhr.send(null);
        }, 0);
    } else {
        xhr.send(null);
    }
};

export default Xget;
```
