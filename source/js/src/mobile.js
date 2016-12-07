// Mobile nav
// console.log($);
import {CtrlClass, bindClickEvent} from './utils';

const $container = document.body;
const bodyClass = new CtrlClass($container);
let isMobileNavAnim = false;
let mobileNavAnimDuration = 200;
let startMobileNavAnim = function () {
    isMobileNavAnim = true;
};

let stopMobileNavAnim = function () {
    setTimeout(function () {
        isMobileNavAnim = false;
    }, mobileNavAnimDuration);
};
let mnavClass = new CtrlClass(document.querySelector('#mobile-nav'));

bindClickEvent(document.querySelector('#main-nav-toggle'), function () {
    if (isMobileNavAnim) return;
    startMobileNavAnim();
    bodyClass.toggleClass('mobile-nav-on');
    mnavClass.show();
    stopMobileNavAnim();
});

// $(input).val('kkkk');
bindClickEvent($container, function () {
    if (isMobileNavAnim || !bodyClass.hasClass('mobile-nav-on')) return;
    bodyClass.removeClass('mobile-nav-on');
    mnavClass.hide();
});
