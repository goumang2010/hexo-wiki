/*
 * customMudule v0.0.0
 * (c) 2016 Chuune
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

/**
 * [bind event]
 * @param  {[type]}   element [ele]
 * @param  {[type]}   event   [event name]
 * @param  {Function} cb      [callback func]
 * @param  {[type]}   capture [capture]
 * @example bind(ele, 'click', () => { ... })
 */
var bindEvent = function bindEvent(element, event, cb, capture) {
  !element.addEventListener && (event = 'on' + event);
  (element.addEventListener || element.attachEvent).call(element, event, cb, capture);
  return cb;
};

var input = document.getElementById('header-search-input');
var box = document.getElementById('header-search-box');
var boxUl = box.children[0];

// http://chaoo.oschina.io/2016/11/09/%E8%87%AA%E5%AE%9A%E4%B9%89HEXO%E7%AB%99%E5%86%85%E6%90%9C%E7%B4%A2Javascript-json.html
// xhr加载数据
var searchData = void 0;

function loadData(success) {
    if (!searchData) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/content.json', true);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                var res = JSON.parse(this.response || this.responseText);
                searchData = res instanceof Array ? res : res.posts;
                success(searchData);
            } else {
                console.error(this.statusText);
            }
        };
        xhr.onerror = function () {
            console.error(this.statusText);
        };
        xhr.send();
    } else {
        success(searchData);
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
    data.forEach(function (post) {
        var li = document.createElement('li');
        li.innerHTML = '<a href="/' + post.path + '">' + post.title + '</a>';
        boxUl.append(li);
    });
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

input.addEventListener('input', function (e) {
    e.preventDefault();
    e.stopPropagation();
    search(input.value);
});

var select = document.getElementById('header-lang-select');
bindEvent(select, 'change', function (e) {
    e.preventDefault();
    var option = e.target.querySelector('[value="' + e.target.value + '"]');
    location.href = option.dataset.href;
});

// Mobile nav
// console.log($);
var $ = window.$;
var $container = $('body');
var isMobileNavAnim = false;
var mobileNavAnimDuration = 200;
var startMobileNavAnim = function startMobileNavAnim() {
    isMobileNavAnim = true;
};

var stopMobileNavAnim = function stopMobileNavAnim() {
    setTimeout(function () {
        isMobileNavAnim = false;
    }, mobileNavAnimDuration);
};
var $mnav = $('#mobile-nav');
$('#main-nav-toggle').on('click', function () {
    if (isMobileNavAnim) return;
    startMobileNavAnim();
    $container.toggleClass('mobile-nav-on');
    $mnav.show();
    stopMobileNavAnim();
});
// $(input).val('kkkk');
bindClickEvent($container, function () {
    if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;
    $container.removeClass('mobile-nav-on');
    $mnav.hide();
});

function bindClickEvent($ele, callback) {
    $ele.on('click', callback);
    $ele.on('touch', callback);
}

})));
