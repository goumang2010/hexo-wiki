/**
 * [bind event]
 * @param  {[type]}   element [ele]
 * @param  {[type]}   event   [event name]
 * @param  {Function} cb      [callback func]
 * @param  {[type]}   capture [capture]
 * @example bind(ele, 'click', () => { ... })
 */
export const bindEvent = (element, event, cb, capture) => {
    !element.addEventListener && (event = 'on' + event);
    (element.addEventListener || element.attachEvent).call(element, event, cb, capture);
    return cb;
};
