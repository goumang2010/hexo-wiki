// Mobile nav
import {CtrlClass, bindClickEvent} from './utils';

const $container = document.body;
const bodyClass = new CtrlClass($container);

let mnavClass = new CtrlClass(document.querySelector('#mobile-nav'));
let show = false;
bindClickEvent(document.querySelector('#main-nav-toggle'), function () {
    if (show) return;
    bodyClass.toggleClass('mobile-nav-on');
    mnavClass.show();
    show = true;
}, true);

bindClickEvent($container, function () {
    if (show === false) return;
    setTimeout(function() {
        bodyClass.removeClass('mobile-nav-on');
        mnavClass.hide();
        show = false;
    }, 100);
});
