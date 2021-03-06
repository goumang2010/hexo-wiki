import {
    bindEvent,
    bindClickEvent,
    Xget,
    debounce
} from './utils';
const input = document.getElementById('header-search-input');
const box = document.getElementById('header-search-box');
const boxUl = document.getElementById('header-search-list');

// http://chaoo.oschina.io/2016/11/09/%E8%87%AA%E5%AE%9A%E4%B9%89HEXO%E7%AB%99%E5%86%85%E6%90%9C%E7%B4%A2Javascript-json.html
// xhr加载数据
let searchData;

export var loadData = function (callback = () => {}) {
    if (searchData && (searchData.length > 0)) {
        loadData = (cb) => cb(searchData);
        return loadData(callback);
    } else {
        let getJson = new Xget('/content.json', null, {
            callback(data) {
                if ((searchData = data.posts) && (searchData.length > 0)) {
                    callback(searchData);
                }
            }
        });
        getJson.send();
    }
};

loadData();

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

function trim(str) {
    return str.toLowerCase().replace(/^\s+|\s+$/g, '');
}

// 查询
export function searchKey(key, callback) {
    // 关键字 => 正则，空格隔开的看作多个关键字
    // a b c => /a|b|c/gmi
    if (key !== '') {
        let regExp = new RegExp(key.replace(/[ ]/g, '|'), 'gmi');
        loadData(function (data) {
            let result = [];
            for (let post of data) {
                let title = post.title;
                key = trim(key);
                if (key === trim(title)) {
                    result.push({
                        pri: 0,
                        post
                    });
                } else if (regtest(post.title, regExp)) {
                    result.push({
                        pri: 1,
                        post
                    });
                } else if (regtest(post.text, regExp)) {
                    result.push({
                        pri: 2,
                        post
                    });
                }
            }
            callback(result.sort((a, b) => a.pri - b.pri).map(x => x.post));
        });
    } else {
        callback([]);
    }
}

function _search(key) {
    searchKey(key, (result) => {
        if (result.length) {
            box.style.display = 'block';
            render(result);
        } else {
            render([]);
            box.style.display = 'none';
        }
    });
}

const search = debounce(_search, 200);

bindEvent(input, 'keyup', (event) => {
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