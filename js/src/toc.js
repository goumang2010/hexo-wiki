import Ps from 'perfect-scrollbar';

var container = document.querySelector('div.toc');
container && Ps.initialize(container, {
    suppressScrollX: true
});
