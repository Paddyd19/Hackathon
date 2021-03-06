!function (a) {
    "use strict";
    var b = /[^\[\]]+/g, c = /^[\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?$/, d = function (a) {
        return "number" == typeof a ? !0 : "string" != typeof a ? !1 : a.match(c)
    }, e = function (a) {
        var b = document.createElement("div");
        return b.innerHTML = a, b.innerText || b.textContent
    };
    a.fn.extend({
        formParams: function (a, b) {
            return "boolean" == typeof a && (b = a, a = null), a ? this.setParams(a, b) : "FORM" === this[0].nodeName && this[0].elements ? jQuery(jQuery.makeArray(this[0].elements)).getParams(b) : void 0
        }, setParams: function (b, c) {
            return this.find("[name]").each(function () {
                var d, f, g, h, i, j = a(this).attr("name"), k = b[j];
                if (j.indexOf("[") > -1) {
                    for (d = j.replace(/\]/g, "").split("["), g = null, h = b, f = 0; g = d[f++];) {
                        if (!h[g]) {
                            h = void 0;
                            break
                        }
                        h = h[g]
                    }
                    k = h
                }
                (c === !0 || void 0 !== k) && ((null === k || void 0 === k) && (k = ""), "string" == typeof k && k.indexOf("&") > -1 && (k = e(k)), "radio" === this.type ? this.checked = this.value == k : "checkbox" === this.type ? this.checked = k : "placeholder" in document.createElement("input") ? this.value = k : (i = a(this), this.value != k && "" !== k && i.data("changed", !0), "" === k ? i.data("changed", !1).val(i.attr("placeholder")) : this.value = k))
            }), this
        }, getParams: function (c) {
            var e, f, g = {};
            return c = void 0 === c ? !1 : c, this.each(function () {
                var h, i, j, k, l, m, n = this, o = a(n), p = n.type && n.type.toLowerCase();
                if ("submit" !== p && n.name && !n.disabled && (h = n.name, i = a.data(n, "value") || a.fn.val.call([n]), j = h.match(b), "radio" !== n.type || n.checked)) {
                    for ("checkbox" === n.type && (i = n.checked), o.data("changed") !== !0 && i === o.attr("placeholder") && (i = ""), c && (d(i) ? (l = parseFloat(i), m = l + "", i.indexOf(".") > 0 && (m = l.toFixed(i.split(".")[1].length)), m === i && (i = l)) : "true" === i ? i = !0 : "false" === i && (i = !1), "" === i && (i = void 0)), e = g, f = 0; f < j.length - 1; f++)
                        e[j[f]] || (e[j[f]] = {}), e = e[j[f]];
                    k = j[j.length - 1], e[k] ? (a.isArray(e[k]) || (e[k] = void 0 === e[k] ? [] : [e[k]]), e[k].push(i)) : e[k] || (e[k] = i)
                }
            }), g
        }
    })
}(jQuery);
