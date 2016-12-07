// http://stackoverflow.com/questions/28194786/how-to-make-document-queryselector-work-in-ie6
if (!document.querySelector) {
    document.querySelector = function(selector) {
        var head = document.documentElement.firstChild;
        var styleTag = document.createElement("STYLE");
        head.appendChild(styleTag);
        document.__qsResult = [];

        styleTag.styleSheet.cssText = selector + "{x:expression(document.__qsResult.push(this))}";
        window.scrollBy(0, 0);
        head.removeChild(styleTag);
        return document.__qsResult[0] || null;
    };
}

if (!document.querySelectorAll) {
    document.querySelectorAll = function(selector) {
        var head = document.documentElement.firstChild;
        var styleTag = document.createElement("STYLE");
        head.appendChild(styleTag);
        document.__qsResult = [];

        styleTag.styleSheet.cssText = selector + "{x:expression(document.__qsResult.push(this))}";
        window.scrollBy(0, 0);
        head.removeChild(styleTag);

        var result = [];
        for (var i in document.__qsResult) {
            result.push(document.__qsResult[i]);
        }
        return result;
    };
}
