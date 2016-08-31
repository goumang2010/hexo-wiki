(function () {
  const form = document.getElementById('header-search-form');
  const input = document.getElementById('header-search-input');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let text = input.value.trim();
    if (text === '') {
      return;
    }
    let googleSearchPrefix = 'https://www.google.com/#newwindow=1&q=';
    let siteUrl = window.HEXO_DATA.config.url;
    window.open(`${googleSearchPrefix}site:${siteUrl}+${text}`, '_blank');
  });

  let select = document.getElementById('header-lang-select');
  select.addEventListener('change', (e) => {
    e.preventDefault();
    let option = e.target.querySelector(`[value="${e.target.value}"]`);
    location.href = option.dataset.href;
  });
}());
