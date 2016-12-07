export const isMobile = function() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}();

export const bindEvent = (element, event, cb, capture) => {
    !element.addEventListener && (event = 'on' + event);
    (element.addEventListener || element.attachEvent).call(element, event, cb, capture);
    return cb;
};

export const bindClickEvent = (element, cb, capture) => {
    let eventType = isMobile ? 'touchstart' : 'click';
    return bindEvent(element, eventType, cb, capture);
};
