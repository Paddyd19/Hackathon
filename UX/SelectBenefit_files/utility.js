﻿function scrollToAnchor(anchor) {
    if (window.location.hash == '#' + anchor) {
        window.location.hash = '#';
    }
    window.location.hash = '#' + anchor;
}



if (!Array.prototype.some) {
    Array.prototype.some = function (fun /*, thisArg */) {
        'use strict';

        if (this === void 0 || this === null)
            throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function')
            throw new TypeError();

        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(thisArg, t[i], i, t))
                return true;
        }

        return false;
    };
}