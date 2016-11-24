// Mobile nav
// console.log($);
const $ = window.$;
const $container = $('body');
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
let $mnav = $('#mobile-nav');
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
