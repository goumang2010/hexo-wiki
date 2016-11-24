import { bindEvent } from './utils.js';

const select = document.getElementById('header-lang-select');

bindEvent(select, 'change', (e) => {
    e.preventDefault();
    let option = e.target.querySelector(`[value="${e.target.value}"]`);
    location.href = option.dataset.href;
});
