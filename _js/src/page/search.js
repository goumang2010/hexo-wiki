import { bindEvent, Xget } from '../utils';
const input = document.getElementById('header-search-input');
const box = document.getElementById('header-search-box');
const boxUl = document.getElementById('header-search-list');

// http://chaoo.oschina.io/2016/11/09/%E8%87%AA%E5%AE%9A%E4%B9%89HEXO%E7%AB%99%E5%86%85%E6%90%9C%E7%B4%A2Javascript-json.html
// xhr加载数据
let searchData;

function loadData(success) {
    if (searchData && (searchData.length > 0)) {
        success(searchData);
    } else {
        let getJson = new Xget('/content.json', null, {
            callback(data) {
                if ((searchData = data.posts) && (searchData.length > 0)) {
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
            let li = document.createElement('li');
            li.innerHTML = `<a href="/${post.path}">${post.title}</a>`;
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
        let regExp = new RegExp(key.replace(/[ ]/g, '|'), 'gmi');
        loadData(function (data) {
            let result = data.filter(function (post) {
                return matcher(post, regExp);
            });
            box.style.display = 'block';

            render(result);
        });
    } else {
        render([]);
        box.style.display = 'none';
    }
}

bindEvent(input, 'keyup', (event) => {
    search(input.value);
    if (event.preventDefault) {
        event.preventDefault();
        event.stopPropagation();
    } else {
        event.returnValue = false;
    }
});
