(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-07-23
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/* global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {
    // Full polyfill for browsers with no classList support
    if (!("classList" in document.createElement("_"))) {
        (function (view) {
            "use strict";

            if (!('Element' in view)) return;
            var classListProp = "classList",
                protoProp = "prototype",
                elemCtrProto = view.Element[protoProp],
                objCtr = Object,
                strTrim = String[protoProp].trim || function () {
                return this.replace(/^\s+|\s+$/g, "");
            },
                arrIndexOf = Array[protoProp].indexOf || function (item) {
                var i = 0,
                    len = this.length;
                for (; i < len; i++) {
                    if (i in this && this[i] === item) {
                        return i;
                    }
                }
                return -1;
            },

            // Vendors: please allow content code to instantiate DOMExceptions
            DOMEx = function DOMEx(type, message) {
                this.name = type;
                this.code = DOMException[type];
                this.message = message;
            },
                checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
                if (token === "") {
                    throw new DOMEx("SYNTAX_ERR", "An invalid or illegal string was specified");
                }
                if (/\s/.test(token)) {
                    throw new DOMEx("INVALID_CHARACTER_ERR", "String contains an invalid character");
                }
                return arrIndexOf.call(classList, token);
            },
                ClassList = function ClassList(elem) {
                var trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
                    classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
                    i = 0,
                    len = classes.length;
                for (; i < len; i++) {
                    this.push(classes[i]);
                }
                this._updateClassName = function () {
                    elem.setAttribute("class", this.toString());
                };
            },
                classListProto = ClassList[protoProp] = [],
                classListGetter = function classListGetter() {
                return new ClassList(this);
            };
            // Most DOMException implementations don't allow calling DOMException's toString()
            // on non-DOMExceptions. Error's toString() is sufficient here.
            DOMEx[protoProp] = Error[protoProp];
            classListProto.item = function (i) {
                return this[i] || null;
            };
            classListProto.contains = function (token) {
                token += "";
                return checkTokenAndGetIndex(this, token) !== -1;
            };
            classListProto.add = function () {
                var tokens = arguments,
                    i = 0,
                    l = tokens.length,
                    token,
                    updated = false;
                do {
                    token = tokens[i] + "";
                    if (checkTokenAndGetIndex(this, token) === -1) {
                        this.push(token);
                        updated = true;
                    }
                } while (++i < l);

                if (updated) {
                    this._updateClassName();
                }
            };
            classListProto.remove = function () {
                var tokens = arguments,
                    i = 0,
                    l = tokens.length,
                    token,
                    updated = false,
                    index;
                do {
                    token = tokens[i] + "";
                    index = checkTokenAndGetIndex(this, token);
                    while (index !== -1) {
                        this.splice(index, 1);
                        updated = true;
                        index = checkTokenAndGetIndex(this, token);
                    }
                } while (++i < l);

                if (updated) {
                    this._updateClassName();
                }
            };
            classListProto.toggle = function (token, force) {
                token += "";

                var result = this.contains(token),
                    method = result ? force !== true && "remove" : force !== false && "add";

                if (method) {
                    this[method](token);
                }

                if (force === true || force === false) {
                    return force;
                } else {
                    return !result;
                }
            };
            classListProto.toString = function () {
                return this.join(" ");
            };

            if (objCtr.defineProperty) {
                var classListPropDesc = {
                    get: classListGetter,
                    enumerable: true,
                    configurable: true
                };
                try {
                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                } catch (ex) {
                    // IE 8 doesn't support enumerable:true
                    if (ex.number === -0x7FF5EC54) {
                        classListPropDesc.enumerable = false;
                        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                    }
                }
            } else if (objCtr[protoProp].__defineGetter__) {
                elemCtrProto.__defineGetter__(classListProp, classListGetter);
            }
        })(self);
    } else {
        // There is full or partial native classList support, so just check if we need
        // to normalize the add/remove and toggle APIs.
        (function () {
            "use strict";

            var testElement = document.createElement("_");
            testElement.classList.add("c1", "c2");
            // Polyfill for IE 10/11 and Firefox <26, where classList.add and
            // classList.remove exist but support only one argument at a time.
            if (!testElement.classList.contains("c2")) {
                var createMethod = function createMethod(method) {
                    var original = DOMTokenList.prototype[method];

                    DOMTokenList.prototype[method] = function (token) {
                        var i,
                            len = arguments.length;

                        for (i = 0; i < len; i++) {
                            token = arguments[i];
                            original.call(this, token);
                        }
                    };
                };
                createMethod('add');
                createMethod('remove');
            }
            testElement.classList.toggle("c3", false);
            // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
            // support the second argument.
            if (testElement.classList.contains("c3")) {
                var _toggle = DOMTokenList.prototype.toggle;

                DOMTokenList.prototype.toggle = function (token, force) {
                    if (1 in arguments && !this.contains(token) === !force) {
                        return force;
                    } else {
                        return _toggle.call(this, token);
                    }
                };
            }
            testElement = null;
        })();
    }
}

// http://stackoverflow.com/questions/28194786/how-to-make-document-queryselector-work-in-ie6
if (!document.querySelector) {
    document.querySelector = function (selector) {
        var head = document.documentElement.firstChild;
        var styleTag = document.createElement("STYLE");
        head.appendChild(styleTag);
        document.__qsResult = [];

        styleTag.styleSheet.cssText = selector + "{x:expression(document.__qsResult.push(this))}";
        window.scrollBy(0, 0);
        head.removeChild(styleTag);
        return document.__qsResult[0] || null;
    };
}

if (!document.querySelectorAll) {
    document.querySelectorAll = function (selector) {
        var head = document.documentElement.firstChild;
        var styleTag = document.createElement("STYLE");
        head.appendChild(styleTag);
        document.__qsResult = [];

        styleTag.styleSheet.cssText = selector + "{x:expression(document.__qsResult.push(this))}";
        window.scrollBy(0, 0);
        head.removeChild(styleTag);

        var result = [];
        for (var i in document.__qsResult) {
            result.push(document.__qsResult[i]);
        }
        return result;
    };
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





















var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var jsonToQuery = function jsonToQuery(a) {
    var add = function add(s, k, v) {
        v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;
        s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
    };
    var buildParams = function buildParams(prefix, obj, s) {
        var i = void 0;
        var len = void 0;
        var key = void 0;

        if (Object.prototype.toString.call(obj) === '[object Array]') {
            for (i = 0, len = obj.length; i < len; i++) {
                buildParams(prefix + '[' + (_typeof(obj[i]) === 'object' ? i : '') + ']', obj[i], s);
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

var JSONParse = function () {
    if (window.JSON) {
        return JSON.parse;
    } else {
        return function (jsonstr) {
            return new Function("return" + jsonstr)();
        };
    }
}();

var isMobile = function () {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}();

var bindEvent = function bindEvent(element, event, cb, capture) {
    !element.addEventListener && (event = 'on' + event);
    (element.addEventListener || element.attachEvent).call(element, event, cb, capture);
    return cb;
};

var bindClickEvent = function bindClickEvent(element, cb, stop, capture) {
    var eventType = isMobile ? 'touchstart' : 'click';
    if (stop) {
        return bindEvent(element, eventType, function (event) {
            cb.apply(this, arguments);
            if (event.preventDefault) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.returnValue = false;
            }
        }, capture);
    } else {
        return bindEvent(element, eventType, cb, capture);
    }
};

function trimCls(c) {
    return typeof c === 'string' ? c.trim().replace(/\s+/g, ' ').split(' ') : c;
}

function CtrlClass(ele) {
    if (!ele) throw new Error('ctrlClass传入元素为空');
    this.ele = ele;
    this.classList = ele.classList;
}

CtrlClass.prototype.show = function () {
    this.ele.style.display = 'block';
};

CtrlClass.prototype.hide = function () {
    this.ele.style.display = 'none';
};

CtrlClass.prototype.hasClass = function (c) {
    var _this = this;

    return trimCls(c).every(function (v) {
        return !!_this.classList.contains(v);
    });
};

CtrlClass.prototype.addClass = function (c) {
    var _this2 = this;

    trimCls(c).forEach(function (v) {
        if (!_this2.hasClass(v)) {
            _this2.classList.add(v);
        }
    });
};

CtrlClass.prototype.removeClass = function (c) {
    var _this3 = this;

    trimCls(c).forEach(function (v) {
        _this3.classList.remove(v);
    });
};

CtrlClass.prototype.toggleClass = function (c) {
    var _this4 = this;

    trimCls(c).forEach(function (v) {
        _this4.classList.toggle(v);
    });
};

var win = typeof window !== 'undefined' ? window : self;
// Get XMLHttpRequest object
var xdr = void 0;
var getXHR = win.XMLHttpRequest ? function () {
    return new win.XMLHttpRequest();
} : function () {
    return new win.ActiveXObject('Microsoft.XMLHTTP');
};
var xhr2 = getXHR().responseType === '';

function Xget(url, data, options) {
    this.headers = {
        Accept: '*/*',
        'Cache-Control': ''
    };
    this.callback = options.callback;
    this.errHandler = options.errHandler || function (msg) {
        console.log('error: ' + msg);
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
    var i = url.match(/\/\/(.+?)\//);
    this.crossOrigin = i && (i[1] ? i[1] !== location.host : false);
}

Xget.prototype.abort = function () {
    if (!this.aborted) {
        if (this.xhr && this.xhr.readyState !== 4) {
            // https://stackoverflow.com/questions/7287706/ie-9-javascript-error-c00c023f
            this.xhr.abort();
        }
        this.aborted = true;
    }
};

Xget.prototype.handleResponse = function () {
    var xhr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.xhr;

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
    var message = e && e.message;
    if (!this.aborted) {
        message = typeof message === 'string' ? message : 'Connection aborted';
        this.abort();
        this.errHandler(message);
    }
};

Xget.prototype.send = function () {
    var _this = this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$method = _ref.method,
        method = _ref$method === undefined ? 'get' : _ref$method,
        _ref$url = _ref.url,
        url = _ref$url === undefined ? this.url : _ref$url,
        _ref$options = _ref.options,
        options = _ref$options === undefined ? this.options : _ref$options,
        _ref$headers = _ref.headers,
        headers = _ref$headers === undefined ? this.headers : _ref$headers;

    // Get XHR object
    var xhr = getXHR();
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
        xhr.onload = function () {
            _this.handleResponse.apply(_this);
        };
        xhr.onerror = function () {
            _this.handleError.apply(_this);
        };
        // http://cypressnorth.com/programming/internet-explorer-aborting-ajax-requests-fixed/
        if (xdr) {
            xhr.onprogress = function () {};
        }
    } else {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                _this.handleResponse.apply(_this);
            }
        };
    }
    // Plug timeout
    if (options._async) {
        if ('timeout' in xhr) {
            xhr.timeout = options.timeout;
            xhr.ontimeout = function () {
                _this.handleTimeout.apply(_this);
            };
        } else {
            this.timeoutid = setTimeout(function () {
                _this.handleTimeout.apply(_this);
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

var select = document.getElementById('header-lang-select');

bindEvent(select, 'change', function (e) {
    var target = e.target || e.srcElement;
    location.href = target.value;
});

// Mobile nav
var $container = document.body;
var bodyClass = new CtrlClass($container);

var mnavClass = new CtrlClass(document.querySelector('#mobile-nav'));
var show = false;
bindClickEvent(document.querySelector('#main-nav-toggle'), function () {
    if (show) return;
    bodyClass.toggleClass('mobile-nav-on');
    mnavClass.show();
    show = true;
}, true);

bindClickEvent($container, function () {
    if (show === false) return;
    setTimeout(function () {
        bodyClass.removeClass('mobile-nav-on');
        mnavClass.hide();
        show = false;
    }, 100);
});

var input = document.getElementById('header-search-input');
var box = document.getElementById('header-search-box');
var boxUl = document.getElementById('header-search-list');

// http://chaoo.oschina.io/2016/11/09/%E8%87%AA%E5%AE%9A%E4%B9%89HEXO%E7%AB%99%E5%86%85%E6%90%9C%E7%B4%A2Javascript-json.html
// xhr加载数据
var searchData = void 0;

function loadData(success) {
    if (searchData && searchData.length > 0) {
        success(searchData);
    } else {
        var getJson = new Xget('/content.json', null, {
            callback: function callback(data) {
                if ((searchData = data.posts) && searchData.length > 0) {
                    success(searchData);
                }
            }
        });
        getJson.send();
    }
}

// 匹配文章内容返回结果
function matcher(post, regExp) {
    // 匹配优先级：title  > text
    return regtest(post.title, regExp) || regtest(post.text, regExp);
}

function regtest(raw, regExp) {
    regExp.lastIndex = 0;
    return regExp.test(raw);
}

// 渲染到页面
function render(data) {
    boxUl.innerHTML = '';
    try {
        data.forEach(function (post) {
            var li = document.createElement('li');
            li.innerHTML = '<a href="/' + post.path + '">' + post.title + '</a>';
            boxUl.appendChild(li);
        });
    } catch (err) {
        console.log(err);
    }
}

// 查询
function search(key) {
    // 关键字 => 正则，空格隔开的看作多个关键字
    // a b c => /a|b|c/gmi
    if (key !== '') {
        (function () {
            var regExp = new RegExp(key.replace(/[ ]/g, '|'), 'gmi');
            loadData(function (data) {
                var result = data.filter(function (post) {
                    return matcher(post, regExp);
                });
                box.style.display = 'block';

                render(result);
            });
        })();
    } else {
        render([]);
        box.style.display = 'none';
    }
}

bindEvent(input, 'keyup', function (event) {
    search(input.value);
    if (event.preventDefault) {
        event.preventDefault();
        event.stopPropagation();
    } else {
        event.returnValue = false;
    }
});

// import 'babel-polyfill';

})));
//# sourceMappingURL=custom.js.map
