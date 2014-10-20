 /*!
 * v0.0.4
 * Copyright (c) 2013 First Opinion
 * formatter.js is open sourced under the MIT license.
 *
 * thanks to digitalBush/jquery.maskedinput for some of the trickier
 * keycode handling
 */
!function(a, b, c) {
    function d(a, b) {
        var c = this;
        if (c.el = a, !c.el)
            throw new TypeError("Must provide an existing element");
        if (c.opts = l.extend({}, e, b), "undefined" == typeof c.opts.pattern)
            throw new TypeError("Must provide a pattern");
        var d = g.parse(c.opts.pattern);
        c.mLength = d.mLength, c.chars = d.chars, c.inpts = d.inpts, c.hldrs = {}, c.focus = 0, l.addListener(c.el, "keydown", function(a) {
            c._keyDown(a)
        }), l.addListener(c.el, "keypress", function(a) {
            c._keyPress(a)
        }), l.addListener(c.el, "paste", function(a) {
            c._paste(a)
        }), c.opts.persistent && (c._processKey(null, !0), c.el.blur(), l.addListener(c.el, "focus", function(a) {
            c._focus(a)
        }), l.addListener(c.el, "click", function(a) {
            c._focus(a)
        }), l.addListener(c.el, "touchstart", function(a) {
            c._focus(a)
        }))
    }
    var e = {persistent: !1,repeat: !1,placeholder: " "}, f = {9: new RegExp("[0-9]"),a: new RegExp("[A-Za-z]"),"*": new RegExp("[A-Za-z0-9]")};
    d.prototype._keyDown = function(a) {
        var b = a.which || a.keyCode;
        return b && l.isDelKey(b) ? (this._processKey(null, b), l.preventDefault(a)) : void 0
    }, d.prototype._keyPress = function(a) {
        var b, c;
        return a.which ? b = a.which : (b = a.keyCode, c = l.isSpecialKey(b)), l.isDelKey(b) || c || l.isModifier(a) ? void 0 : (this._processKey(String.fromCharCode(b), !1), l.preventDefault(a))
    }, d.prototype._paste = function(a) {
        return this._processKey(l.getClip(a), !1), l.preventDefault(a)
    }, d.prototype._focus = function() {
        var a = this;
        setTimeout(function() {
            var b = k.get(a.el), c = b.end > a.focus;
            isFirstChar = 0 === b.end, (c || isFirstChar) && k.set(a.el, a.focus)
        }, 0)
    }, d.prototype._processKey = function(a, b) {
        if (this.sel = k.get(this.el), this.val = this.el.value, this.delta = 0, this.sel.begin !== this.sel.end)
            this.delta = -1 * Math.abs(this.sel.begin - this.sel.end), this.val = l.removeChars(this.val, this.sel.begin, this.sel.end);
        else if (b)
            if (b && 46 == b) {
                for (; this.chars[this.sel.begin]; )
                    this._nextPos();
                this.sel.begin < this.val.length && (this._nextPos(), this.val = l.removeChars(this.val, this.sel.end - 1, this.sel.end), this.delta = -1)
            } else
                b && this.sel.begin - 1 >= 0 && (this.val = l.removeChars(this.val, this.sel.end - 1, this.sel.end), this.delta = -1);
        b || (this.val = l.addChars(this.val, a, this.sel.begin), this.delta += a.length), this._formatValue()
    }, d.prototype._nextPos = function() {
        this.sel.end++, this.sel.begin++
    }, d.prototype._formatValue = function() {
        this.curPos = this.sel.end, this.newPos = this.curPos + this.delta, this._removeChars(), this._validateInpts(), this._addChars(), this.el.value = this.val.substr(0, this.mLength), k.set(this.el, this.newPos)
    }, d.prototype._removeChars = function() {
        this.sel.end > this.focus && (this.delta += this.sel.end - this.focus);
        for (var a = 0, b = 0; b <= this.mLength; b++) {
            var c, d = this.chars[b], e = this.hldrs[b], f = b + a;
            f = b >= this.sel.begin ? f + this.delta : f, c = this.val[f], (d && d == c || e && e == c) && (this.val = l.removeChars(this.val, f, f + 1), a--)
        }
        this.hldrs = {}, this.focus = this.val.length
    }, d.prototype._validateInpts = function() {
        for (var a = 0; a < this.val.length; a++) {
            var b = this.inpts[a];
            f[b] && f[b].test(this.val[a]) || this.inpts[a] && (this.val = l.removeChars(this.val, a, a + 1), this.focusStart--, this.newPos--, this.delta--, a--)
        }
    }, d.prototype._addChars = function() {
        if (this.opts.persistent) {
            for (var a = 0; a <= this.mLength; a++)
                this.val[a] || (this.val = l.addChars(this.val, this.opts.placeholder, a), this.hldrs[a] = this.opts.placeholder), this._addChar(a);
            for (; this.chars[this.focus]; )
                this.focus++
        } else
            for (var b = 0; b <= this.val.length; b++)
                this._addChar(b)
    }, d.prototype._addChar = function(a) {
        var b = this.chars[a];
        return b ? (l.isBetween(a, [this.sel.begin - 1, this.newPos + 1]) && (this.newPos++, this.delta++), a <= this.focus && this.focus++, this.delta < 0 && this.val[a] == b ? !0 : (this.hldrs[a] && (delete this.hldrs[a], this.hldrs[a + 1] = this.opts.placeholder), this.val = l.addChars(this.val, b, a), void 0)) : !0
    };
    var g = {}, h = 4, i = new RegExp("{{([^}]+)}}", "g"), j = function(a) {
        for (var b, c = []; b = i.exec(a); )
            c.push(b);
        return c
    };
    g.parse = function(a) {
        var b = {inpts: {},chars: {}}, c = j(a), d = a.length, e = 0, f = 0, g = 0, i = function(a) {
            for (var c = a.length, d = 0; c > d; d++)
                b.inpts[f] = a[d], f++;
            e++, g += a.length + h - 1
        };
        for (g; d > g; g++)
            g == c[e].index ? i(c[e][1]) : b.chars[g - e * h] = a[g];
        return b.mLength = g - e * h, b
    };
    var k = {};
    k.get = function(a) {
        if ("number" == typeof a.selectionStart)
            return {begin: a.selectionStart,end: a.selectionEnd};
        var b = c.selection.createRange();
        if (b && b.parentElement() == a) {
            var d = a.createTextRange(), e = a.createTextRange(), f = a.value.length;
            return d.moveToBookmark(b.getBookmark()), e.collapse(!1), d.compareEndPoints("StartToEnd", e) > -1 ? {begin: f,end: f} : {begin: -d.moveStart("character", -f),end: -d.moveEnd("character", -f)}
        }
        return {begin: 0,end: 0}
    }, k.set = function(a, b) {
        if (a.setSelectionRange)
            a.focus(), a.setSelectionRange(b, b);
        else if (a.createTextRange) {
            var c = a.createTextRange();
            c.collapse(!0), c.moveEnd("character", b), c.moveStart("character", b), c.select()
        }
    };
    var l = {}, m = "undefined" != typeof navigator ? navigator.userAgent : null, n = /iphone/i.test(m);
    l.extend = function(a) {
        for (var b = 1; b < arguments.length; b++)
            for (var c in arguments[b])
                a[c] = arguments[b][c];
        return a
    }, l.addChars = function(a, b, c) {
        return a.substr(0, c) + b + a.substr(c, a.length)
    }, l.removeChars = function(a, b, c) {
        return a.substr(0, b) + a.substr(c, a.length)
    }, l.isBetween = function(a, b) {
        return b.sort(function(a, b) {
            return a - b
        }), a > b[0] && a < b[1]
    }, l.addListener = function(a, b, c) {
        return "undefined" != typeof a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent("on" + b, c)
    }, l.preventDefault = function(a) {
        return a.preventDefault ? a.preventDefault() : a.returnValue = !1
    }, l.getClip = function(a) {
        return a.clipboardData ? a.clipboardData.getData("Text") : b.clipboardData ? b.clipboardData.getData("Text") : void 0
    }, l.isDelKey = function(a) {
        return 8 === a || 46 === a || n && 127 === a
    }, l.isSpecialKey = function(a) {
        var b = {35: "end",36: "home",37: "leftarrow",38: "uparrow",39: "rightarrow",40: "downarrow"};
        return b[a]
    }, l.isModifier = function(a) {
        return a.ctrlKey || a.altKey || a.metaKey
    };
    var o = "formatter";
    a.fn[o] = function(b) {
        return this.each(function() {
            a.data(this, "plugin_" + o) || a.data(this, "plugin_" + o, new d(this, b))
        })
    }
}(jQuery, window, document);
