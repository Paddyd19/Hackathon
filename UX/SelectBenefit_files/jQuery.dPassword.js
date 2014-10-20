(function ($) {
	$.fn.dPassword = function (options) {

		var defaults = {
			interval: 50,
			duration: 200,
			replacement: window.unescape('%u25CF'),
			prefix: 'password_'
		},
		opts = $.extend(defaults, options),
		checker = [],
		timer = [],

		getId = function (id) { return id.replace(opts.prefix, ''); },
		getStars = function (count) { return new Array(count).join(opts.replacement); },
		setPassword = function (id, str) {
			var tmp = '', i = 0, len = str && str.length, el = $('#' + id), val = el.val();
			for (; i < len; i++) tmp += (str.charAt(i) === opts.replacement ? val.charAt(i) : str.charAt(i));
			setValue(el, tmp);
		},

		setValue = function (el, v) { el.val(v); },

		check = function (id, oldValue, initialCall) {
			var el = $('#' + opts.prefix + id), bullets = el.val();

			if (oldValue !== bullets) {
				setPassword(id, bullets);
				if (bullets && bullets.length > 1) {
					setValue(el, getStars(bullets.length) + bullets.charAt(bullets.length - 1));
				}
				clearTimeout(timer[id]);
				timer[id] = setTimeout(function () { convertLastChar(id); }, opts.duration);
			}
			if (!initialCall) {
				checker[id] = setTimeout(function () { check(id, bullets, false); }, opts.interval);
			}
		},

		convertLastChar = function (id) {
			var el = $('#' + opts.prefix + id), val = el.val();
			if (!val) return;
			setValue(el, getStars(val.length + 1));
		};


		return $(this).each(function () {
			var el = $(this), id = this.id, name = opts.prefix + this.name,
				cls = this.className ? ' class="' + this.className + ' dp-field"' : '',
				maxlength = el.attr('maxlength') || '';

			checker.push(id);
			timer.push(id);

			el.hide().after(' <input name="' + name + '" id="' + opts.prefix + id + '" type="text" maxlength="' + maxlength + '" value="' + this.value + '" ' + cls + '/>');

			$('label[for=' + id + ']').attr('for', opts.prefix + id);
			el.removeAttr('tabindex', '').removeAttr('accesskey', '');

			$('#' + opts.prefix + id)
				.on('keyup', function () {
					var id = getId(this.id);
					clearTimeout(checker[id]);
					checker[id] = setTimeout(function () { check(id, ''); }, opts.interval);
				})
				.on('blur', function () {
					var id = getId(this.id);
					clearTimeout(checker[id]);
					check(id, '');
				});

			setTimeout(function () { check(id, '', true); }, opts.interval);
		});

	};
})(jQuery);