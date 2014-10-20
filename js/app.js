(function ($) {
	'use strict';

	var
	container = null,
	loginForm = null,

	validateLoginForm = function () {
		var isValid = true;
		loginForm.find('input').each(function () {
			if (!this.value.length) isValid = false;
		});
		if (!isValid) container.find('.login-error-msg').toggleClass('valid', !isValid);

		return isValid;
	},

	init = function () {
		container = $('.container');
		loginForm = container.find('#topLoginForm');

		container.on('submit', '#topLoginForm', validateLoginForm);
		try { window.Typekit.load(); } catch (e) { }
	};

	$(document).ready(init);

})(jQuery);