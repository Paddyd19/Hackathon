window.UTIL = (function () {
	'use strict';

	var
	_keyCodes = {
		BCKSPC    : 8,
		BACKSPACE : 8,
		TAB       : 9,
		ENTER     : 13,
		ESC       : 27,
		SPACE     : 32,
		PGUP      : 33,
		PGDOWN    : 34,
		END       : 35,
		HOME      : 36,
		LEFT      : 37,
		UP        : 38,
		RIGHT     : 39,
		DOWN      : 40,
		INS       : 45,
		DEL       : 46,
		A         : 65,
		X         : 88,
		C         : 67,
		V         : 86,
		Z         : 90,
		F1        : 112,
		F2        : 113,
		F5        : 116,
		MINUS     : 173,
		DOT       : 190,

		NUMMINUS  : 109,
		NUMDOT    : 110,

		digits : {
			48  : 1,		// 0
			49  : 1,		// 1
			50  : 1,		// 2
			51  : 1,		// 3
			52  : 1,		// 4
			53  : 1,		// 5
			54  : 1,		// 6
			55  : 1,		// 7
			56  : 1,		// 8
			57  : 1,		// 9
			173 : 1,		// minus
			190 : 1,		// dot
			96  : 1,		// numpad 0
			97  : 1,		// numpad 1
			98  : 1,		// numpad 2
			99  : 1,		// numpad 3
			100 : 1,		// numpad 4
			101 : 1,		// numpad 5
			102 : 1,		// numpad 6
			103 : 1,		// numpad 7
			104 : 1,		// numpad 8
			105 : 1,		// numpad 9
			109 : 1,		// numpad minus
			110 : 1			// numpad dot
		},
		allowedChars : {
			8  : 1,		// backspace
			46 : 1,		// del
			35 : 1,		// end
			36 : 1,		// home
			37 : 1,		// left
			39 : 1		// right
		},
		isAllowed : function (k, e) {
			var isAllowed = this.allowedChars[k] === 1,
				isCtrlXCV = (e && e.ctrlKey === true) && (k === this.X || k === this.C || k === this.V);
			return this.isDigit || isAllowed || isCtrlXCV;
		},
		isDigit : function (k) { return this.digits[k] === 1; },
		isAlpha : function (k, e) { return (k >= 65 && k <= 90 && !e.ctrlKey); },				// a - z
		isAlphaNumeric : function (k, e) { return this.isAlpha(k, e) || this.isDigit(k); }
	},

	/**
	 * Check whether a string might be a number
	 * @param v {string}	a stringified number
	 * @returns	{boolean}	true or false
	 */
	_isNumber = function (v) {
		if (typeof v === 'number') return true;
		if (typeof v !== 'string') return false;
		return (/^[\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?$/).test(v);
	},

	_formatNumber = function (number, precision) {
		var ext, name, numS, rgx = /(\d+)(\d{3})/;
		number = (number + '').replace(/,/g, '');
		numS = ('' + (parseFloat(number).toFixed(precision) || 0)).split('.');
		name = numS[0];
		ext = numS[1] || '';
		if (precision > 0) ext = (ext + new Array(precision + 1).join('0')).substr(0, precision);
		while (rgx.test(name)) name = name.replace(rgx, '$1' + ',' + '$2');
		return name + (ext ? '.' + ext : '');
	},

	_setCaretPosition = function (ctrl, pos) {
		if (typeof pos === 'undefined') pos = ctrl.value.length;
		if (ctrl.setSelectionRange) {
			ctrl.focus();
			ctrl.setSelectionRange(pos, pos);
		}
		else if (ctrl.createTextRange) {
			var range = ctrl.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	},

	_getCaretPosition = function (ctrl) {	/* jshint eqeqeq: false */
		var caretPos = 0, sel;
		// IE
		if (document.selection) {
			ctrl.focus();
			sel = document.selection.createRange();
			sel.moveStart('character', -ctrl.value.length);
			caretPos = sel.text.length;
		}
		// Firefox
		else if (ctrl.selectionStart || ctrl.selectionStart == '0') caretPos = ctrl.selectionStart;
		return caretPos;
	};

	return {
		keys: _keyCodes,
		isNumber: _isNumber,
		formatNumber: _formatNumber,
		setCaretPosition: _setCaretPosition,
		getCaretPosition: _getCaretPosition
	};

}());
