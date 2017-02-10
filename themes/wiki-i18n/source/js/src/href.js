import {searchKey} from './search.js';
import {bindClickEvent} from './utils';



function getUrl(name, callback) {
    return searchKey(name, (results) => {
        let res;
        if ((res = results[0]) && (res = res.path)) {
            callback(res);
        }
    });
} 

bindClickEvent(document.body, function(e) {
    let target = e.target;
    if(target.tagName.toLowerCase() === 'a') {
        let href;
        if(/^[^#/]+$/.test(href = target.getAttribute('href'))) {
            getUrl(href, (res) => {
                target.href = '/' + res;
            });
        }
    }
});