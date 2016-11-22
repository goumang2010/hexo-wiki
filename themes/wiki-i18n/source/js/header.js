(function() {
  const input = document.getElementById('header-search-input');
  const box = document.getElementById('header-search-box');
  const boxUl = box.children[0];

  // http://chaoo.oschina.io/2016/11/09/%E8%87%AA%E5%AE%9A%E4%B9%89HEXO%E7%AB%99%E5%86%85%E6%90%9C%E7%B4%A2Javascript-json.html
  // xhr加载数据
  let searchData;

  function loadData(success) {
    if (!searchData) {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', '/content.json', true);
      xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
          let res = JSON.parse(this.response || this.responseText);
          searchData = res instanceof Array ? res : res.posts;
          success(searchData);
        } else {
          console.error(this.statusText);
        }
      };
      xhr.onerror = function() {
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
    data.forEach(function(post) {
      let li = document.createElement('li');
      li.innerHTML = `<a href="/${post.path}">${post.title}</a>`;
      boxUl.append(li);
    });
  }

  // 查询
  function search(key) {
    // 关键字 => 正则，空格隔开的看作多个关键字
    // a b c => /a|b|c/gmi
    if (key !== '') {
      let regExp = new RegExp(key.replace(/[ ]/g, '|'), 'gmi');
      loadData(function(data) {
        let result = data.filter(function(post) {
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


  input.addEventListener('input', (e) => {
    e.preventDefault();
    e.stopPropagation();
    search(input.value);
  });

  let select = document.getElementById('header-lang-select');
  select.addEventListener('change', (e) => {
    e.preventDefault();
    let option = e.target.querySelector(`[value="${e.target.value}"]`);
    location.href = option.dataset.href;
  });
}());
