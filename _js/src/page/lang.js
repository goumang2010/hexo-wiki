import { bindEvent } from '../utils';

const select = document.getElementById('header-lang-select');

bindEvent(select, 'change', (e) => {
    let target = e.target || e.srcElement;
    location.href = target.value;
});
