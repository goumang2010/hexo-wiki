/*
 * customMudule v0.0.0
 * (c) 2017 Chuune
 */
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

function debounce(fn, delay) {
    var timer = void 0;
    return function () {
        var _this = this;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            fn.apply(_this, args);
        }, delay);
    };
}

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

var bindClickEvent = function bindClickEvent(element, cb) {
    var stop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

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

var _loadData = function loadData() {
    var _callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

    if (searchData && searchData.length > 0) {
        _loadData = function loadData(cb) {
            return cb(searchData);
        };
        return _loadData(_callback);
    } else {
        var getJson = new Xget('/content.json', null, {
            callback: function callback(data) {
                if ((searchData = data.posts) && searchData.length > 0) {
                    _callback(searchData);
                }
            }
        });
        getJson.send();
    }
};

_loadData();

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

function trim(str) {
    return str.toLowerCase().replace(/^\s+|\s+$/g, '');
}

// 查询
function searchKey(key, callback) {
    // 关键字 => 正则，空格隔开的看作多个关键字
    // a b c => /a|b|c/gmi
    if (key !== '') {
        var regExp = new RegExp(key.replace(/[ ]/g, '|'), 'gmi');
        _loadData(function (data) {
            var result = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var post = _step.value;

                    var title = post.title;
                    key = trim(key);
                    if (key === trim(title)) {
                        result.push({
                            pri: 0,
                            post: post
                        });
                    } else if (regtest(post.title, regExp)) {
                        result.push({
                            pri: 1,
                            post: post
                        });
                    } else if (regtest(post.text, regExp)) {
                        result.push({
                            pri: 2,
                            post: post
                        });
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            callback(result.sort(function (a, b) {
                return a.pri - b.pri;
            }).map(function (x) {
                return x.post;
            }));
        });
    } else {
        callback([]);
    }
}

function _search(key) {
    searchKey(key, function (result) {
        if (result.length) {
            box.style.display = 'block';
            render(result);
        } else {
            render([]);
            box.style.display = 'none';
        }
    });
}

var search = debounce(_search, 200);

bindEvent(input, 'keyup', function (event) {
    search(input.value);
    if (event.preventDefault) {
        event.preventDefault();
        event.stopPropagation();
    } else {
        event.returnValue = false;
    }
});

bindClickEvent(document.body, function (e) {
    if (e.target.tagName.toLowerCase() !== 'a') {
        box.style.display = 'none';
    }
});

bindClickEvent(input, function (e) {
    if (input.value) {
        box.style.display = 'block';
    }
}, false);

function getUrl(name, callback) {
    return searchKey(name, function (results) {
        var res = void 0;
        if ((res = results[0]) && (res = res.path)) {
            callback(res);
        }
    });
}

bindClickEvent(document.body, function (e) {
    var target = e.target;
    if (target.tagName.toLowerCase() === 'a') {
        var href = void 0;
        if (/^[^#/]+$/.test(href = target.getAttribute('href'))) {
            getUrl(href, function (res) {
                target.href = '/' + res;
            });
        }
    }
});

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function oldAdd(element, className) {
  var classes = element.className.split(' ');
  if (classes.indexOf(className) < 0) {
    classes.push(className);
  }
  element.className = classes.join(' ');
}

function oldRemove(element, className) {
  var classes = element.className.split(' ');
  var idx = classes.indexOf(className);
  if (idx >= 0) {
    classes.splice(idx, 1);
  }
  element.className = classes.join(' ');
}

var add = function add(element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    oldAdd(element, className);
  }
};

var remove = function remove(element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    oldRemove(element, className);
  }
};

var list = function list(element) {
  if (element.classList) {
    return Array.prototype.slice.apply(element.classList);
  } else {
    return element.className.split(' ');
  }
};

var _class = {
  add: add,
  remove: remove,
  list: list
};

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var DOM = {};

DOM.e = function (tagName, className) {
  var element = document.createElement(tagName);
  element.className = className;
  return element;
};

DOM.appendTo = function (child, parent) {
  parent.appendChild(child);
  return child;
};

function cssGet(element, styleName) {
  return window.getComputedStyle(element)[styleName];
}

function cssSet(element, styleName, styleValue) {
  if (typeof styleValue === 'number') {
    styleValue = styleValue.toString() + 'px';
  }
  element.style[styleName] = styleValue;
  return element;
}

function cssMultiSet(element, obj) {
  for (var key in obj) {
    var val = obj[key];
    if (typeof val === 'number') {
      val = val.toString() + 'px';
    }
    element.style[key] = val;
  }
  return element;
}

DOM.css = function (element, styleNameOrObject, styleValue) {
  if ((typeof styleNameOrObject === 'undefined' ? 'undefined' : _typeof$2(styleNameOrObject)) === 'object') {
    // multiple set with object
    return cssMultiSet(element, styleNameOrObject);
  } else {
    if (typeof styleValue === 'undefined') {
      return cssGet(element, styleNameOrObject);
    } else {
      return cssSet(element, styleNameOrObject, styleValue);
    }
  }
};

DOM.matches = function (element, query) {
  if (typeof element.matches !== 'undefined') {
    return element.matches(query);
  } else {
    if (typeof element.matchesSelector !== 'undefined') {
      return element.matchesSelector(query);
    } else if (typeof element.webkitMatchesSelector !== 'undefined') {
      return element.webkitMatchesSelector(query);
    } else if (typeof element.mozMatchesSelector !== 'undefined') {
      return element.mozMatchesSelector(query);
    } else if (typeof element.msMatchesSelector !== 'undefined') {
      return element.msMatchesSelector(query);
    }
  }
};

DOM.remove = function (element) {
  if (typeof element.remove !== 'undefined') {
    element.remove();
  } else {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
};

DOM.queryChildren = function (element, selector) {
  return Array.prototype.filter.call(element.childNodes, function (child) {
    return DOM.matches(child, selector);
  });
};

var dom$1 = DOM;

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var helper = createCommonjsModule(function (module, exports) {
  'use strict';

  var cls = _class;
  var dom = dom$1;

  var toInt = exports.toInt = function (x) {
    return parseInt(x, 10) || 0;
  };

  var clone = exports.clone = function (obj) {
    if (!obj) {
      return null;
    } else if (Array.isArray(obj)) {
      return obj.map(clone);
    } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof$1(obj)) === 'object') {
      var result = {};
      for (var key in obj) {
        result[key] = clone(obj[key]);
      }
      return result;
    } else {
      return obj;
    }
  };

  exports.extend = function (original, source) {
    var result = clone(original);
    for (var key in source) {
      result[key] = clone(source[key]);
    }
    return result;
  };

  exports.isEditable = function (el) {
    return dom.matches(el, "input,[contenteditable]") || dom.matches(el, "select,[contenteditable]") || dom.matches(el, "textarea,[contenteditable]") || dom.matches(el, "button,[contenteditable]");
  };

  exports.removePsClasses = function (element) {
    var clsList = cls.list(element);
    for (var i = 0; i < clsList.length; i++) {
      var className = clsList[i];
      if (className.indexOf('ps-') === 0) {
        cls.remove(element, className);
      }
    }
  };

  exports.outerWidth = function (element) {
    return toInt(dom.css(element, 'width')) + toInt(dom.css(element, 'paddingLeft')) + toInt(dom.css(element, 'paddingRight')) + toInt(dom.css(element, 'borderLeftWidth')) + toInt(dom.css(element, 'borderRightWidth'));
  };

  function toggleScrolling(handler) {
    return function (element, axis) {
      handler(element, 'ps--in-scrolling');
      if (typeof axis !== 'undefined') {
        handler(element, 'ps--' + axis);
      } else {
        handler(element, 'ps--x');
        handler(element, 'ps--y');
      }
    };
  }

  exports.startScrolling = toggleScrolling(cls.add);

  exports.stopScrolling = toggleScrolling(cls.remove);

  exports.env = {
    isWebKit: typeof document !== 'undefined' && 'WebkitAppearance' in document.documentElement.style,
    supportsTouch: typeof window !== 'undefined' && ('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch),
    supportsIePointer: typeof window !== 'undefined' && window.navigator.msMaxTouchPoints !== null
  };
});

var defaultSetting = {
  handlers: ['click-rail', 'drag-scrollbar', 'keyboard', 'wheel', 'touch'],
  maxScrollbarLength: null,
  minScrollbarLength: null,
  scrollXMarginOffset: 0,
  scrollYMarginOffset: 0,
  suppressScrollX: false,
  suppressScrollY: false,
  swipePropagation: true,
  swipeEasing: true,
  useBothWheelAxes: false,
  wheelPropagation: false,
  wheelSpeed: 1,
  theme: 'default'
};

var EventElement = function EventElement(element) {
  this.element = element;
  this.events = {};
};

EventElement.prototype.bind = function (eventName, handler) {
  if (typeof this.events[eventName] === 'undefined') {
    this.events[eventName] = [];
  }
  this.events[eventName].push(handler);
  this.element.addEventListener(eventName, handler, false);
};

EventElement.prototype.unbind = function (eventName, handler) {
  var isHandlerProvided = typeof handler !== 'undefined';
  this.events[eventName] = this.events[eventName].filter(function (hdlr) {
    if (isHandlerProvided && hdlr !== handler) {
      return true;
    }
    this.element.removeEventListener(eventName, hdlr, false);
    return false;
  }, this);
};

EventElement.prototype.unbindAll = function () {
  for (var name in this.events) {
    this.unbind(name);
  }
};

var EventManager$1 = function EventManager() {
  this.eventElements = [];
};

EventManager$1.prototype.eventElement = function (element) {
  var ee = this.eventElements.filter(function (eventElement) {
    return eventElement.element === element;
  })[0];
  if (typeof ee === 'undefined') {
    ee = new EventElement(element);
    this.eventElements.push(ee);
  }
  return ee;
};

EventManager$1.prototype.bind = function (element, eventName, handler) {
  this.eventElement(element).bind(eventName, handler);
};

EventManager$1.prototype.unbind = function (element, eventName, handler) {
  this.eventElement(element).unbind(eventName, handler);
};

EventManager$1.prototype.unbindAll = function () {
  for (var i = 0; i < this.eventElements.length; i++) {
    this.eventElements[i].unbindAll();
  }
};

EventManager$1.prototype.once = function (element, eventName, handler) {
  var ee = this.eventElement(element);
  var onceHandler = function onceHandler(e) {
    ee.unbind(eventName, onceHandler);
    handler(e);
  };
  ee.bind(eventName, onceHandler);
};

var eventManager = EventManager$1;

var guid$1 = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return function () {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };
}();

var _$1 = helper;
var cls = _class;
var defaultSettings = defaultSetting;
var dom$3 = dom$1;
var EventManager = eventManager;
var guid = guid$1;

var instances$1 = {};

function Instance(element) {
  var i = this;

  i.settings = _$1.clone(defaultSettings);
  i.containerWidth = null;
  i.containerHeight = null;
  i.contentWidth = null;
  i.contentHeight = null;

  i.isRtl = dom$3.css(element, 'direction') === "rtl";
  i.isNegativeScroll = function () {
    var originalScrollLeft = element.scrollLeft;
    var result = null;
    element.scrollLeft = -1;
    result = element.scrollLeft < 0;
    element.scrollLeft = originalScrollLeft;
    return result;
  }();
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;
  i.event = new EventManager();
  i.ownerDocument = element.ownerDocument || document;

  function focus() {
    cls.add(element, 'ps--focus');
  }

  function blur() {
    cls.remove(element, 'ps--focus');
  }

  i.scrollbarXRail = dom$3.appendTo(dom$3.e('div', 'ps__scrollbar-x-rail'), element);
  i.scrollbarX = dom$3.appendTo(dom$3.e('div', 'ps__scrollbar-x'), i.scrollbarXRail);
  i.scrollbarX.setAttribute('tabindex', 0);
  i.event.bind(i.scrollbarX, 'focus', focus);
  i.event.bind(i.scrollbarX, 'blur', blur);
  i.scrollbarXActive = null;
  i.scrollbarXWidth = null;
  i.scrollbarXLeft = null;
  i.scrollbarXBottom = _$1.toInt(dom$3.css(i.scrollbarXRail, 'bottom'));
  i.isScrollbarXUsingBottom = i.scrollbarXBottom === i.scrollbarXBottom; // !isNaN
  i.scrollbarXTop = i.isScrollbarXUsingBottom ? null : _$1.toInt(dom$3.css(i.scrollbarXRail, 'top'));
  i.railBorderXWidth = _$1.toInt(dom$3.css(i.scrollbarXRail, 'borderLeftWidth')) + _$1.toInt(dom$3.css(i.scrollbarXRail, 'borderRightWidth'));
  // Set rail to display:block to calculate margins
  dom$3.css(i.scrollbarXRail, 'display', 'block');
  i.railXMarginWidth = _$1.toInt(dom$3.css(i.scrollbarXRail, 'marginLeft')) + _$1.toInt(dom$3.css(i.scrollbarXRail, 'marginRight'));
  dom$3.css(i.scrollbarXRail, 'display', '');
  i.railXWidth = null;
  i.railXRatio = null;

  i.scrollbarYRail = dom$3.appendTo(dom$3.e('div', 'ps__scrollbar-y-rail'), element);
  i.scrollbarY = dom$3.appendTo(dom$3.e('div', 'ps__scrollbar-y'), i.scrollbarYRail);
  i.scrollbarY.setAttribute('tabindex', 0);
  i.event.bind(i.scrollbarY, 'focus', focus);
  i.event.bind(i.scrollbarY, 'blur', blur);
  i.scrollbarYActive = null;
  i.scrollbarYHeight = null;
  i.scrollbarYTop = null;
  i.scrollbarYRight = _$1.toInt(dom$3.css(i.scrollbarYRail, 'right'));
  i.isScrollbarYUsingRight = i.scrollbarYRight === i.scrollbarYRight; // !isNaN
  i.scrollbarYLeft = i.isScrollbarYUsingRight ? null : _$1.toInt(dom$3.css(i.scrollbarYRail, 'left'));
  i.scrollbarYOuterWidth = i.isRtl ? _$1.outerWidth(i.scrollbarY) : null;
  i.railBorderYWidth = _$1.toInt(dom$3.css(i.scrollbarYRail, 'borderTopWidth')) + _$1.toInt(dom$3.css(i.scrollbarYRail, 'borderBottomWidth'));
  dom$3.css(i.scrollbarYRail, 'display', 'block');
  i.railYMarginHeight = _$1.toInt(dom$3.css(i.scrollbarYRail, 'marginTop')) + _$1.toInt(dom$3.css(i.scrollbarYRail, 'marginBottom'));
  dom$3.css(i.scrollbarYRail, 'display', '');
  i.railYHeight = null;
  i.railYRatio = null;
}

function getId(element) {
  return element.getAttribute('data-ps-id');
}

function setId(element, id) {
  element.setAttribute('data-ps-id', id);
}

function removeId(element) {
  element.removeAttribute('data-ps-id');
}

var add$1 = function add(element) {
  var newId = guid();
  setId(element, newId);
  instances$1[newId] = new Instance(element);
  return instances$1[newId];
};

var remove$1 = function remove(element) {
  delete instances$1[getId(element)];
  removeId(element);
};

var get = function get(element) {
  return instances$1[getId(element)];
};

var instances_1 = {
  add: add$1,
  remove: remove$1,
  get: get
};

var _ = helper;
var dom = dom$1;
var instances = instances_1;

var destroy$1 = function destroy(element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  i.event.unbindAll();
  dom.remove(i.scrollbarX);
  dom.remove(i.scrollbarY);
  dom.remove(i.scrollbarXRail);
  dom.remove(i.scrollbarYRail);
  _.removePsClasses(element);

  instances.remove(element);
};

var instances$4 = instances_1;

var createDOMEvent = function createDOMEvent(name) {
  var event = document.createEvent("Event");
  event.initEvent(name, true, true);
  return event;
};

var updateScroll$1 = function updateScroll(element, axis, value) {
  if (typeof element === 'undefined') {
    throw 'You must provide an element to the update-scroll function';
  }

  if (typeof axis === 'undefined') {
    throw 'You must provide an axis to the update-scroll function';
  }

  if (typeof value === 'undefined') {
    throw 'You must provide a value to the update-scroll function';
  }

  if (axis === 'top' && value <= 0) {
    element.scrollTop = value = 0; // don't allow negative scroll
    element.dispatchEvent(createDOMEvent('ps-y-reach-start'));
  }

  if (axis === 'left' && value <= 0) {
    element.scrollLeft = value = 0; // don't allow negative scroll
    element.dispatchEvent(createDOMEvent('ps-x-reach-start'));
  }

  var i = instances$4.get(element);

  if (axis === 'top' && value >= i.contentHeight - i.containerHeight) {
    // don't allow scroll past container
    value = i.contentHeight - i.containerHeight;
    if (value - element.scrollTop <= 1) {
      // mitigates rounding errors on non-subpixel scroll values
      value = element.scrollTop;
    } else {
      element.scrollTop = value;
    }
    element.dispatchEvent(createDOMEvent('ps-y-reach-end'));
  }

  if (axis === 'left' && value >= i.contentWidth - i.containerWidth) {
    // don't allow scroll past container
    value = i.contentWidth - i.containerWidth;
    if (value - element.scrollLeft <= 1) {
      // mitigates rounding errors on non-subpixel scroll values
      value = element.scrollLeft;
    } else {
      element.scrollLeft = value;
    }
    element.dispatchEvent(createDOMEvent('ps-x-reach-end'));
  }

  if (i.lastTop === undefined) {
    i.lastTop = element.scrollTop;
  }

  if (i.lastLeft === undefined) {
    i.lastLeft = element.scrollLeft;
  }

  if (axis === 'top' && value < i.lastTop) {
    element.dispatchEvent(createDOMEvent('ps-scroll-up'));
  }

  if (axis === 'top' && value > i.lastTop) {
    element.dispatchEvent(createDOMEvent('ps-scroll-down'));
  }

  if (axis === 'left' && value < i.lastLeft) {
    element.dispatchEvent(createDOMEvent('ps-scroll-left'));
  }

  if (axis === 'left' && value > i.lastLeft) {
    element.dispatchEvent(createDOMEvent('ps-scroll-right'));
  }

  if (axis === 'top' && value !== i.lastTop) {
    element.scrollTop = i.lastTop = value;
    element.dispatchEvent(createDOMEvent('ps-scroll-y'));
  }

  if (axis === 'left' && value !== i.lastLeft) {
    element.scrollLeft = i.lastLeft = value;
    element.dispatchEvent(createDOMEvent('ps-scroll-x'));
  }
};

var _$3 = helper;
var cls$2 = _class;
var dom$4 = dom$1;
var instances$3 = instances_1;
var updateScroll = updateScroll$1;

function getThumbSize(i, thumbSize) {
  if (i.settings.minScrollbarLength) {
    thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
  }
  if (i.settings.maxScrollbarLength) {
    thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
  }
  return thumbSize;
}

function updateCss(element, i) {
  var xRailOffset = { width: i.railXWidth };
  if (i.isRtl) {
    xRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth - i.contentWidth;
  } else {
    xRailOffset.left = element.scrollLeft;
  }
  if (i.isScrollbarXUsingBottom) {
    xRailOffset.bottom = i.scrollbarXBottom - element.scrollTop;
  } else {
    xRailOffset.top = i.scrollbarXTop + element.scrollTop;
  }
  dom$4.css(i.scrollbarXRail, xRailOffset);

  var yRailOffset = { top: element.scrollTop, height: i.railYHeight };
  if (i.isScrollbarYUsingRight) {
    if (i.isRtl) {
      yRailOffset.right = i.contentWidth - (i.negativeScrollAdjustment + element.scrollLeft) - i.scrollbarYRight - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
    }
  } else {
    if (i.isRtl) {
      yRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth * 2 - i.contentWidth - i.scrollbarYLeft - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
    }
  }
  dom$4.css(i.scrollbarYRail, yRailOffset);

  dom$4.css(i.scrollbarX, { left: i.scrollbarXLeft, width: i.scrollbarXWidth - i.railBorderXWidth });
  dom$4.css(i.scrollbarY, { top: i.scrollbarYTop, height: i.scrollbarYHeight - i.railBorderYWidth });
}

var updateGeometry$1 = function updateGeometry(element) {
  var i = instances$3.get(element);

  i.containerWidth = element.clientWidth;
  i.containerHeight = element.clientHeight;
  i.contentWidth = element.scrollWidth;
  i.contentHeight = element.scrollHeight;

  var existingRails;
  if (!element.contains(i.scrollbarXRail)) {
    existingRails = dom$4.queryChildren(element, '.ps__scrollbar-x-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        dom$4.remove(rail);
      });
    }
    dom$4.appendTo(i.scrollbarXRail, element);
  }
  if (!element.contains(i.scrollbarYRail)) {
    existingRails = dom$4.queryChildren(element, '.ps__scrollbar-y-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        dom$4.remove(rail);
      });
    }
    dom$4.appendTo(i.scrollbarYRail, element);
  }

  if (!i.settings.suppressScrollX && i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth) {
    i.scrollbarXActive = true;
    i.railXWidth = i.containerWidth - i.railXMarginWidth;
    i.railXRatio = i.containerWidth / i.railXWidth;
    i.scrollbarXWidth = getThumbSize(i, _$3.toInt(i.railXWidth * i.containerWidth / i.contentWidth));
    i.scrollbarXLeft = _$3.toInt((i.negativeScrollAdjustment + element.scrollLeft) * (i.railXWidth - i.scrollbarXWidth) / (i.contentWidth - i.containerWidth));
  } else {
    i.scrollbarXActive = false;
  }

  if (!i.settings.suppressScrollY && i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight) {
    i.scrollbarYActive = true;
    i.railYHeight = i.containerHeight - i.railYMarginHeight;
    i.railYRatio = i.containerHeight / i.railYHeight;
    i.scrollbarYHeight = getThumbSize(i, _$3.toInt(i.railYHeight * i.containerHeight / i.contentHeight));
    i.scrollbarYTop = _$3.toInt(element.scrollTop * (i.railYHeight - i.scrollbarYHeight) / (i.contentHeight - i.containerHeight));
  } else {
    i.scrollbarYActive = false;
  }

  if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
    i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
  }
  if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
    i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
  }

  updateCss(element, i);

  if (i.scrollbarXActive) {
    cls$2.add(element, 'ps--active-x');
  } else {
    cls$2.remove(element, 'ps--active-x');
    i.scrollbarXWidth = 0;
    i.scrollbarXLeft = 0;
    updateScroll(element, 'left', 0);
  }
  if (i.scrollbarYActive) {
    cls$2.add(element, 'ps--active-y');
  } else {
    cls$2.remove(element, 'ps--active-y');
    i.scrollbarYHeight = 0;
    i.scrollbarYTop = 0;
    updateScroll(element, 'top', 0);
  }
};

var instances$5 = instances_1;
var updateGeometry$3 = updateGeometry$1;
var updateScroll$3 = updateScroll$1;

function bindClickRailHandler(element, i) {
  function pageOffset(el) {
    return el.getBoundingClientRect();
  }
  var stopPropagation = function stopPropagation(e) {
    e.stopPropagation();
  };

  i.event.bind(i.scrollbarY, 'click', stopPropagation);
  i.event.bind(i.scrollbarYRail, 'click', function (e) {
    var positionTop = e.pageY - window.pageYOffset - pageOffset(i.scrollbarYRail).top;
    var direction = positionTop > i.scrollbarYTop ? 1 : -1;

    updateScroll$3(element, 'top', element.scrollTop + direction * i.containerHeight);
    updateGeometry$3(element);

    e.stopPropagation();
  });

  i.event.bind(i.scrollbarX, 'click', stopPropagation);
  i.event.bind(i.scrollbarXRail, 'click', function (e) {
    var positionLeft = e.pageX - window.pageXOffset - pageOffset(i.scrollbarXRail).left;
    var direction = positionLeft > i.scrollbarXLeft ? 1 : -1;

    updateScroll$3(element, 'left', element.scrollLeft + direction * i.containerWidth);
    updateGeometry$3(element);

    e.stopPropagation();
  });
}

var clickRail = function clickRail(element) {
  var i = instances$5.get(element);
  bindClickRailHandler(element, i);
};

var _$4 = helper;
var dom$5 = dom$1;
var instances$6 = instances_1;
var updateGeometry$4 = updateGeometry$1;
var updateScroll$4 = updateScroll$1;

function bindMouseScrollXHandler(element, i) {
  var currentLeft = null;
  var currentPageX = null;

  function updateScrollLeft(deltaX) {
    var newLeft = currentLeft + deltaX * i.railXRatio;
    var maxLeft = Math.max(0, i.scrollbarXRail.getBoundingClientRect().left) + i.railXRatio * (i.railXWidth - i.scrollbarXWidth);

    if (newLeft < 0) {
      i.scrollbarXLeft = 0;
    } else if (newLeft > maxLeft) {
      i.scrollbarXLeft = maxLeft;
    } else {
      i.scrollbarXLeft = newLeft;
    }

    var scrollLeft = _$4.toInt(i.scrollbarXLeft * (i.contentWidth - i.containerWidth) / (i.containerWidth - i.railXRatio * i.scrollbarXWidth)) - i.negativeScrollAdjustment;
    updateScroll$4(element, 'left', scrollLeft);
  }

  var mouseMoveHandler = function mouseMoveHandler(e) {
    updateScrollLeft(e.pageX - currentPageX);
    updateGeometry$4(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function mouseUpHandler() {
    _$4.stopScrolling(element, 'x');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarX, 'mousedown', function (e) {
    currentPageX = e.pageX;
    currentLeft = _$4.toInt(dom$5.css(i.scrollbarX, 'left')) * i.railXRatio;
    _$4.startScrolling(element, 'x');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

function bindMouseScrollYHandler(element, i) {
  var currentTop = null;
  var currentPageY = null;

  function updateScrollTop(deltaY) {
    var newTop = currentTop + deltaY * i.railYRatio;
    var maxTop = Math.max(0, i.scrollbarYRail.getBoundingClientRect().top) + i.railYRatio * (i.railYHeight - i.scrollbarYHeight);

    if (newTop < 0) {
      i.scrollbarYTop = 0;
    } else if (newTop > maxTop) {
      i.scrollbarYTop = maxTop;
    } else {
      i.scrollbarYTop = newTop;
    }

    var scrollTop = _$4.toInt(i.scrollbarYTop * (i.contentHeight - i.containerHeight) / (i.containerHeight - i.railYRatio * i.scrollbarYHeight));
    updateScroll$4(element, 'top', scrollTop);
  }

  var mouseMoveHandler = function mouseMoveHandler(e) {
    updateScrollTop(e.pageY - currentPageY);
    updateGeometry$4(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function mouseUpHandler() {
    _$4.stopScrolling(element, 'y');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarY, 'mousedown', function (e) {
    currentPageY = e.pageY;
    currentTop = _$4.toInt(dom$5.css(i.scrollbarY, 'top')) * i.railYRatio;
    _$4.startScrolling(element, 'y');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

var dragScrollbar = function dragScrollbar(element) {
  var i = instances$6.get(element);
  bindMouseScrollXHandler(element, i);
  bindMouseScrollYHandler(element, i);
};

var _$5 = helper;
var dom$6 = dom$1;
var instances$7 = instances_1;
var updateGeometry$5 = updateGeometry$1;
var updateScroll$5 = updateScroll$1;

function bindKeyboardHandler(element, i) {
  var hovered = false;
  i.event.bind(element, 'mouseenter', function () {
    hovered = true;
  });
  i.event.bind(element, 'mouseleave', function () {
    hovered = false;
  });

  var shouldPrevent = false;
  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if (scrollTop === 0 && deltaY > 0 || scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if (scrollLeft === 0 && deltaX < 0 || scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  i.event.bind(i.ownerDocument, 'keydown', function (e) {
    if (e.isDefaultPrevented && e.isDefaultPrevented() || e.defaultPrevented) {
      return;
    }

    var focused = dom$6.matches(i.scrollbarX, ':focus') || dom$6.matches(i.scrollbarY, ':focus');

    if (!hovered && !focused) {
      return;
    }

    var activeElement = document.activeElement ? document.activeElement : i.ownerDocument.activeElement;
    if (activeElement) {
      if (activeElement.tagName === 'IFRAME') {
        activeElement = activeElement.contentDocument.activeElement;
      } else {
        // go deeper if element is a webcomponent
        while (activeElement.shadowRoot) {
          activeElement = activeElement.shadowRoot.activeElement;
        }
      }
      if (_$5.isEditable(activeElement)) {
        return;
      }
    }

    var deltaX = 0;
    var deltaY = 0;

    switch (e.which) {
      case 37:
        // left
        if (e.metaKey) {
          deltaX = -i.contentWidth;
        } else if (e.altKey) {
          deltaX = -i.containerWidth;
        } else {
          deltaX = -30;
        }
        break;
      case 38:
        // up
        if (e.metaKey) {
          deltaY = i.contentHeight;
        } else if (e.altKey) {
          deltaY = i.containerHeight;
        } else {
          deltaY = 30;
        }
        break;
      case 39:
        // right
        if (e.metaKey) {
          deltaX = i.contentWidth;
        } else if (e.altKey) {
          deltaX = i.containerWidth;
        } else {
          deltaX = 30;
        }
        break;
      case 40:
        // down
        if (e.metaKey) {
          deltaY = -i.contentHeight;
        } else if (e.altKey) {
          deltaY = -i.containerHeight;
        } else {
          deltaY = -30;
        }
        break;
      case 33:
        // page up
        deltaY = 90;
        break;
      case 32:
        // space bar
        if (e.shiftKey) {
          deltaY = 90;
        } else {
          deltaY = -90;
        }
        break;
      case 34:
        // page down
        deltaY = -90;
        break;
      case 35:
        // end
        if (e.ctrlKey) {
          deltaY = -i.contentHeight;
        } else {
          deltaY = -i.containerHeight;
        }
        break;
      case 36:
        // home
        if (e.ctrlKey) {
          deltaY = element.scrollTop;
        } else {
          deltaY = i.containerHeight;
        }
        break;
      default:
        return;
    }

    updateScroll$5(element, 'top', element.scrollTop - deltaY);
    updateScroll$5(element, 'left', element.scrollLeft + deltaX);
    updateGeometry$5(element);

    shouldPrevent = shouldPreventDefault(deltaX, deltaY);
    if (shouldPrevent) {
      e.preventDefault();
    }
  });
}

var keyboard = function keyboard(element) {
  var i = instances$7.get(element);
  bindKeyboardHandler(element, i);
};

var instances$8 = instances_1;
var updateGeometry$6 = updateGeometry$1;
var updateScroll$6 = updateScroll$1;

function bindMouseWheelHandler(element, i) {
  var shouldPrevent = false;

  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if (scrollTop === 0 && deltaY > 0 || scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if (scrollLeft === 0 && deltaX < 0 || scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  function getDeltaFromEvent(e) {
    var deltaX = e.deltaX;
    var deltaY = -1 * e.deltaY;

    if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
      // OS X Safari
      deltaX = -1 * e.wheelDeltaX / 6;
      deltaY = e.wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
      // Firefox in deltaMode 1: Line scrolling
      deltaX *= 10;
      deltaY *= 10;
    }

    if (deltaX !== deltaX && deltaY !== deltaY /* NaN checks */) {
        // IE in some mouse drivers
        deltaX = 0;
        deltaY = e.wheelDelta;
      }

    if (e.shiftKey) {
      // reverse axis with shift key
      return [-deltaY, -deltaX];
    }
    return [deltaX, deltaY];
  }

  function shouldBeConsumedByChild(deltaX, deltaY) {
    var child = element.querySelector('textarea:hover, select[multiple]:hover, .ps-child:hover');
    if (child) {
      var style = window.getComputedStyle(child);
      var overflow = [style.overflow, style.overflowX, style.overflowY].join('');

      if (!overflow.match(/(scroll|auto)/)) {
        // if not scrollable
        return false;
      }

      var maxScrollTop = child.scrollHeight - child.clientHeight;
      if (maxScrollTop > 0) {
        if (!(child.scrollTop === 0 && deltaY > 0) && !(child.scrollTop === maxScrollTop && deltaY < 0)) {
          return true;
        }
      }
      var maxScrollLeft = child.scrollLeft - child.clientWidth;
      if (maxScrollLeft > 0) {
        if (!(child.scrollLeft === 0 && deltaX < 0) && !(child.scrollLeft === maxScrollLeft && deltaX > 0)) {
          return true;
        }
      }
    }
    return false;
  }

  function mousewheelHandler(e) {
    var delta = getDeltaFromEvent(e);

    var deltaX = delta[0];
    var deltaY = delta[1];

    if (shouldBeConsumedByChild(deltaX, deltaY)) {
      return;
    }

    shouldPrevent = false;
    if (!i.settings.useBothWheelAxes) {
      // deltaX will only be used for horizontal scrolling and deltaY will
      // only be used for vertical scrolling - this is the default
      updateScroll$6(element, 'top', element.scrollTop - deltaY * i.settings.wheelSpeed);
      updateScroll$6(element, 'left', element.scrollLeft + deltaX * i.settings.wheelSpeed);
    } else if (i.scrollbarYActive && !i.scrollbarXActive) {
      // only vertical scrollbar is active and useBothWheelAxes option is
      // active, so let's scroll vertical bar using both mouse wheel axes
      if (deltaY) {
        updateScroll$6(element, 'top', element.scrollTop - deltaY * i.settings.wheelSpeed);
      } else {
        updateScroll$6(element, 'top', element.scrollTop + deltaX * i.settings.wheelSpeed);
      }
      shouldPrevent = true;
    } else if (i.scrollbarXActive && !i.scrollbarYActive) {
      // useBothWheelAxes and only horizontal bar is active, so use both
      // wheel axes for horizontal bar
      if (deltaX) {
        updateScroll$6(element, 'left', element.scrollLeft + deltaX * i.settings.wheelSpeed);
      } else {
        updateScroll$6(element, 'left', element.scrollLeft - deltaY * i.settings.wheelSpeed);
      }
      shouldPrevent = true;
    }

    updateGeometry$6(element);

    shouldPrevent = shouldPrevent || shouldPreventDefault(deltaX, deltaY);
    if (shouldPrevent) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  if (typeof window.onwheel !== "undefined") {
    i.event.bind(element, 'wheel', mousewheelHandler);
  } else if (typeof window.onmousewheel !== "undefined") {
    i.event.bind(element, 'mousewheel', mousewheelHandler);
  }
}

var mouseWheel = function mouseWheel(element) {
  var i = instances$8.get(element);
  bindMouseWheelHandler(element, i);
};

var _$6 = helper;
var instances$9 = instances_1;
var updateGeometry$7 = updateGeometry$1;
var updateScroll$7 = updateScroll$1;

function bindTouchHandler(element, i, supportsTouch, supportsIePointer) {
  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    var scrollLeft = element.scrollLeft;
    var magnitudeX = Math.abs(deltaX);
    var magnitudeY = Math.abs(deltaY);

    if (magnitudeY > magnitudeX) {
      // user is perhaps trying to swipe up/down the page

      if (deltaY < 0 && scrollTop === i.contentHeight - i.containerHeight || deltaY > 0 && scrollTop === 0) {
        return !i.settings.swipePropagation;
      }
    } else if (magnitudeX > magnitudeY) {
      // user is perhaps trying to swipe left/right across the page

      if (deltaX < 0 && scrollLeft === i.contentWidth - i.containerWidth || deltaX > 0 && scrollLeft === 0) {
        return !i.settings.swipePropagation;
      }
    }

    return true;
  }

  function applyTouchMove(differenceX, differenceY) {
    updateScroll$7(element, 'top', element.scrollTop - differenceY);
    updateScroll$7(element, 'left', element.scrollLeft - differenceX);

    updateGeometry$7(element);
  }

  var startOffset = {};
  var startTime = 0;
  var speed = {};
  var easingLoop = null;
  var inGlobalTouch = false;
  var inLocalTouch = false;

  function globalTouchStart() {
    inGlobalTouch = true;
  }
  function globalTouchEnd() {
    inGlobalTouch = false;
  }

  function getTouch(e) {
    if (e.targetTouches) {
      return e.targetTouches[0];
    } else {
      // Maybe IE pointer
      return e;
    }
  }
  function shouldHandle(e) {
    if (e.targetTouches && e.targetTouches.length === 1) {
      return true;
    }
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
      return true;
    }
    return false;
  }
  function touchStart(e) {
    if (shouldHandle(e)) {
      inLocalTouch = true;

      var touch = getTouch(e);

      startOffset.pageX = touch.pageX;
      startOffset.pageY = touch.pageY;

      startTime = new Date().getTime();

      if (easingLoop !== null) {
        clearInterval(easingLoop);
      }

      e.stopPropagation();
    }
  }
  function touchMove(e) {
    if (!inLocalTouch && i.settings.swipePropagation) {
      touchStart(e);
    }
    if (!inGlobalTouch && inLocalTouch && shouldHandle(e)) {
      var touch = getTouch(e);

      var currentOffset = { pageX: touch.pageX, pageY: touch.pageY };

      var differenceX = currentOffset.pageX - startOffset.pageX;
      var differenceY = currentOffset.pageY - startOffset.pageY;

      applyTouchMove(differenceX, differenceY);
      startOffset = currentOffset;

      var currentTime = new Date().getTime();

      var timeGap = currentTime - startTime;
      if (timeGap > 0) {
        speed.x = differenceX / timeGap;
        speed.y = differenceY / timeGap;
        startTime = currentTime;
      }

      if (shouldPreventDefault(differenceX, differenceY)) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }
  function touchEnd() {
    if (!inGlobalTouch && inLocalTouch) {
      inLocalTouch = false;

      if (i.settings.swipeEasing) {
        clearInterval(easingLoop);
        easingLoop = setInterval(function () {
          if (!instances$9.get(element)) {
            clearInterval(easingLoop);
            return;
          }

          if (!speed.x && !speed.y) {
            clearInterval(easingLoop);
            return;
          }

          if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
            clearInterval(easingLoop);
            return;
          }

          applyTouchMove(speed.x * 30, speed.y * 30);

          speed.x *= 0.8;
          speed.y *= 0.8;
        }, 10);
      }
    }
  }

  if (supportsTouch) {
    i.event.bind(window, 'touchstart', globalTouchStart);
    i.event.bind(window, 'touchend', globalTouchEnd);
    i.event.bind(element, 'touchstart', touchStart);
    i.event.bind(element, 'touchmove', touchMove);
    i.event.bind(element, 'touchend', touchEnd);
  } else if (supportsIePointer) {
    if (window.PointerEvent) {
      i.event.bind(window, 'pointerdown', globalTouchStart);
      i.event.bind(window, 'pointerup', globalTouchEnd);
      i.event.bind(element, 'pointerdown', touchStart);
      i.event.bind(element, 'pointermove', touchMove);
      i.event.bind(element, 'pointerup', touchEnd);
    } else if (window.MSPointerEvent) {
      i.event.bind(window, 'MSPointerDown', globalTouchStart);
      i.event.bind(window, 'MSPointerUp', globalTouchEnd);
      i.event.bind(element, 'MSPointerDown', touchStart);
      i.event.bind(element, 'MSPointerMove', touchMove);
      i.event.bind(element, 'MSPointerUp', touchEnd);
    }
  }
}

var touch = function touch(element) {
  if (!_$6.env.supportsTouch && !_$6.env.supportsIePointer) {
    return;
  }

  var i = instances$9.get(element);
  bindTouchHandler(element, i, _$6.env.supportsTouch, _$6.env.supportsIePointer);
};

var _$7 = helper;
var instances$10 = instances_1;
var updateGeometry$8 = updateGeometry$1;
var updateScroll$8 = updateScroll$1;

function bindSelectionHandler(element, i) {
  function getRangeNode() {
    var selection = window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : '';
    if (selection.toString().length === 0) {
      return null;
    } else {
      return selection.getRangeAt(0).commonAncestorContainer;
    }
  }

  var scrollingLoop = null;
  var scrollDiff = { top: 0, left: 0 };
  function startScrolling() {
    if (!scrollingLoop) {
      scrollingLoop = setInterval(function () {
        if (!instances$10.get(element)) {
          clearInterval(scrollingLoop);
          return;
        }

        updateScroll$8(element, 'top', element.scrollTop + scrollDiff.top);
        updateScroll$8(element, 'left', element.scrollLeft + scrollDiff.left);
        updateGeometry$8(element);
      }, 50); // every .1 sec
    }
  }
  function stopScrolling() {
    if (scrollingLoop) {
      clearInterval(scrollingLoop);
      scrollingLoop = null;
    }
    _$7.stopScrolling(element);
  }

  var isSelected = false;
  i.event.bind(i.ownerDocument, 'selectionchange', function () {
    if (element.contains(getRangeNode())) {
      isSelected = true;
    } else {
      isSelected = false;
      stopScrolling();
    }
  });
  i.event.bind(window, 'mouseup', function () {
    if (isSelected) {
      isSelected = false;
      stopScrolling();
    }
  });
  i.event.bind(window, 'keyup', function () {
    if (isSelected) {
      isSelected = false;
      stopScrolling();
    }
  });

  i.event.bind(window, 'mousemove', function (e) {
    if (isSelected) {
      var mousePosition = { x: e.pageX, y: e.pageY };
      var containerGeometry = {
        left: element.offsetLeft,
        right: element.offsetLeft + element.offsetWidth,
        top: element.offsetTop,
        bottom: element.offsetTop + element.offsetHeight
      };

      if (mousePosition.x < containerGeometry.left + 3) {
        scrollDiff.left = -5;
        _$7.startScrolling(element, 'x');
      } else if (mousePosition.x > containerGeometry.right - 3) {
        scrollDiff.left = 5;
        _$7.startScrolling(element, 'x');
      } else {
        scrollDiff.left = 0;
      }

      if (mousePosition.y < containerGeometry.top + 3) {
        if (containerGeometry.top + 3 - mousePosition.y < 5) {
          scrollDiff.top = -5;
        } else {
          scrollDiff.top = -20;
        }
        _$7.startScrolling(element, 'y');
      } else if (mousePosition.y > containerGeometry.bottom - 3) {
        if (mousePosition.y - containerGeometry.bottom + 3 < 5) {
          scrollDiff.top = 5;
        } else {
          scrollDiff.top = 20;
        }
        _$7.startScrolling(element, 'y');
      } else {
        scrollDiff.top = 0;
      }

      if (scrollDiff.top === 0 && scrollDiff.left === 0) {
        stopScrolling();
      } else {
        startScrolling();
      }
    }
  });
}

var selection = function selection(element) {
  var i = instances$10.get(element);
  bindSelectionHandler(element, i);
};

var instances$11 = instances_1;
var updateGeometry$9 = updateGeometry$1;

function bindNativeScrollHandler(element, i) {
  i.event.bind(element, 'scroll', function () {
    updateGeometry$9(element);
  });
}

var nativeScroll = function nativeScroll(element) {
  var i = instances$11.get(element);
  bindNativeScrollHandler(element, i);
};

var _typeof$3 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _$2 = helper;
var cls$1 = _class;
var instances$2 = instances_1;
var updateGeometry = updateGeometry$1;

// Handlers
var handlers = {
  'click-rail': clickRail,
  'drag-scrollbar': dragScrollbar,
  'keyboard': keyboard,
  'wheel': mouseWheel,
  'touch': touch,
  'selection': selection
};
var nativeScrollHandler = nativeScroll;

var initialize$1 = function initialize(element, userSettings) {
  userSettings = (typeof userSettings === 'undefined' ? 'undefined' : _typeof$3(userSettings)) === 'object' ? userSettings : {};

  cls$1.add(element, 'ps');

  // Create a plugin instance.
  var i = instances$2.add(element);

  i.settings = _$2.extend(i.settings, userSettings);
  cls$1.add(element, 'ps--theme_' + i.settings.theme);

  i.settings.handlers.forEach(function (handlerName) {
    handlers[handlerName](element);
  });

  nativeScrollHandler(element);

  updateGeometry(element);
};

var _$8 = helper;
var dom$7 = dom$1;
var instances$12 = instances_1;
var updateGeometry$10 = updateGeometry$1;
var updateScroll$9 = updateScroll$1;

var update$1 = function update(element) {
  var i = instances$12.get(element);

  if (!i) {
    return;
  }

  // Recalcuate negative scrollLeft adjustment
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;

  // Recalculate rail margins
  dom$7.css(i.scrollbarXRail, 'display', 'block');
  dom$7.css(i.scrollbarYRail, 'display', 'block');
  i.railXMarginWidth = _$8.toInt(dom$7.css(i.scrollbarXRail, 'marginLeft')) + _$8.toInt(dom$7.css(i.scrollbarXRail, 'marginRight'));
  i.railYMarginHeight = _$8.toInt(dom$7.css(i.scrollbarYRail, 'marginTop')) + _$8.toInt(dom$7.css(i.scrollbarYRail, 'marginBottom'));

  // Hide scrollbars not to affect scrollWidth and scrollHeight
  dom$7.css(i.scrollbarXRail, 'display', 'none');
  dom$7.css(i.scrollbarYRail, 'display', 'none');

  updateGeometry$10(element);

  // Update top/left scroll to trigger events
  updateScroll$9(element, 'top', element.scrollTop);
  updateScroll$9(element, 'left', element.scrollLeft);

  dom$7.css(i.scrollbarXRail, 'display', '');
  dom$7.css(i.scrollbarYRail, 'display', '');
};

var destroy = destroy$1;
var initialize = initialize$1;
var update = update$1;

var main = {
  initialize: initialize,
  update: update,
  destroy: destroy
};

var index = main;

var container = document.querySelector('div.toc');
container && index.initialize(container, {
    suppressScrollX: true
});

// import 'babel-polyfill';

})));
