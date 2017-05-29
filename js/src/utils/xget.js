import {
    jsonToQuery,
    JSONParse
} from './common.js';

const win = typeof window !== 'undefined' ? window : self;
// Get XMLHttpRequest object
let xdr;
let getXHR = win.XMLHttpRequest ? function () {
    return new win.XMLHttpRequest();
} : function () {
    return new win.ActiveXObject('Microsoft.XMLHTTP');
};
let xhr2 = (getXHR().responseType === '');

function Xget(url, data, options) {
    this.headers = {
        Accept: '*/*',
        'Cache-Control': ''
    };
    this.callback = options.callback;
    this.errHandler = options.errHandler || function (msg) {
        console.log(`error: ${msg}`);
    };
    // Prepare URL
    this.url = url + '?' + jsonToQuery(data);
    this.options = {
        _async: true,
        timeout: 30000,
        attempts: 2
    };
    this.attempts = 0;
    this.aborted = false;
    // timeout id
    this.timeoutid = null;
    // Guess if we're dealing with a cross-origin request
    let i = url.match(/\/\/(.+?)\//);
    this.crossOrigin = i && (i[1] ? i[1] !== location.host : false);
}

Xget.prototype.abort = function () {
    if (!this.aborted) {
        if (this.xhr && this.xhr.readyState !== 4) { // https://stackoverflow.com/questions/7287706/ie-9-javascript-error-c00c023f
            this.xhr.abort();
        }
        this.aborted = true;
    }
};

Xget.prototype.handleResponse = function (xhr = this.xhr) {
    clearTimeout(this.timeoutid);
    // Verify if the request has not been previously aborted
    if (this.aborted) {
        return;
    }
    // Handle response
    try {
        // Process response
        if (xhr.responseType === 'json') {
            if ('response' in xhr && xhr.response === null) {
                throw 'The request response is empty';
            }
            this.response = xhr.response;
        } else {
            this.response = JSONParse(xhr.responseText);
        }
        // Late status code verification to allow passing data when, per example, a 409 is returned
        // --- https://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
        if ('status' in xhr && !/^2|1223/.test(xhr.status)) {
            throw xhr.status + ' (' + xhr.statusText + ')';
        }
        // Fulfilled
        this.callback(this.response);
    } catch (e) {
        // Rejected
        this.handleError(e);
    }
};

Xget.prototype.handleTimeout = function () {
    if (!this.aborted) {
        if (!this.options.attempts || ++this.attempts !== this.options.attempts) {
            this.xhr.abort();
            this.send();
        } else {
            this.handleError({
                message: 'Timeout (' + this.url + ')'
            });
        }
    }
};

Xget.prototype.handleError = function (e) {
    console.log(e);
    let message = e && e.message;
    if (!this.aborted) {
        message = typeof message === 'string' ? message : 'Connection aborted';
        this.abort();
        this.errHandler(message);
    }
};

Xget.prototype.send = function ({
    method = 'get',
    url = this.url,
    options = this.options,
    headers = this.headers
} = {}) {
    // Get XHR object
    let xhr = getXHR();
    if (this.crossOrigin && win.XDomainRequest) {
        xhr = new XDomainRequest(); // CORS with IE8/9
        xdr = true;
    }
    // Open connection
    if (xdr) {
        xhr.open(method, url);
    } else {
        xhr.open(method, url, options._async);
    }
    this.xhr = xhr;

    // Set headers
    if (!xdr) {
        for (var i in headers) {
            if (headers[i]) {
                xhr.setRequestHeader(i, headers[i]);
            }
        }
    }
    // Plug response handler
    if (xhr2 || xdr) {
        xhr.onload = () => {
            this.handleResponse.apply(this);
        };
        xhr.onerror = () => {
            this.handleError.apply(this);
        };
        // http://cypressnorth.com/programming/internet-explorer-aborting-ajax-requests-fixed/
        if (xdr) {
            xhr.onprogress = function () {};
        }
    } else {
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this.handleResponse.apply(this);
            }
        };
    }
    // Plug timeout
    if (options._async) {
        if ('timeout' in xhr) {
            xhr.timeout = options.timeout;
            xhr.ontimeout = () => {
                this.handleTimeout.apply(this);
            };
        } else {
            this.timeoutid = setTimeout(() => {
                this.handleTimeout.apply(this);
            }, options.timeout);
        }
        // http://cypressnorth.com/programming/internet-explorer-aborting-ajax-requests-fixed/
    } else if (xdr) {
        xhr.ontimeout = function () {};
    }

    // Send request
    if (xdr) {
        // https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest
        setTimeout(function () {
            xhr.send(null);
        }, 0);
    } else {
        xhr.send(null);
    }
};

export default Xget;
