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

export const jsonToQuery = function (a) {
	var add = function (s, k, v) {
		v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;
		s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
	}, buildParams = function (prefix, obj, s) {
		var i, len, key;

		if (Object.prototype.toString.call(obj) === '[object Array]') {
			for (i = 0, len = obj.length; i < len; i++) {
				buildParams(prefix + '[' + (typeof obj[i] === 'object' ? i : '') + ']', obj[i], s);
			}
		} else if (obj && obj.toString() === '[object Object]') {
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (prefix) {
						buildParams(prefix + '[' + key + ']', obj[key], s, add);
					} else {
						buildParams(key, obj[key], s, add);
					}
				}
			}
		} else if (prefix) {
			add(s, prefix, obj);
		} else {
			for (key in obj) {
				add(s, key, obj[key]);
			}
		}
		return s;
	};
	return buildParams('', a, []).join('&').replace(/%20/g, '+');
};

export const JSONParse = function() {
		if (window.JSON) {
			return JSON.parse;
		} else {
			return function(jsonstr) {
				return (new Function("return" + jsonstr))();
			};
		}
	}();