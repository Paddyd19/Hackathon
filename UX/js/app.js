(function ($) {
	'use strict';

	var
	// Variables Declaration
	body = null,
	container = null,
	mobileMenu = null,
	resizeTime = null,
	loginForm = null,

	// Show Mobile Menu after button is clicked
	_showMobileMenu = function (e) {
		e.preventDefault();
		body.addClass('show-mobile-menu');
		_checkLogoutPosition();
	},

	_checkLogoutPosition = function () {
		var	win = $(window), nav = mobileMenu.find('nav');
		if (nav.height() + 50 > win.height()) mobileMenu.addClass('mobile-menu-resized');
		else mobileMenu.removeClass('mobile-menu-resized');
	},

	// Hide Mobile Menu after link is chosen
	_hideMobileMenu = function (e) {
		if (e.type === 'touchstart' && e.target.nodeName === 'A') return;
		body.removeClass('show-mobile-menu');
	},

	dateSupported = function () {
		var el = document.createElement('input'), invalidVal = 'foo';
		el.setAttribute('type', 'date');
		el.setAttribute('value', invalidVal);
		return el.value !== invalidVal;
	},

	/**
	 * Update radio on button change
	 */
	_mobileRadioButtons = function () {
		var btn = $(this), id = btn.data('id');
		btn.siblings('input')[0].checked = false;
		btn.siblings('#' + id)[0].checked = true;
		btn.siblings('#' + id).trigger('change');

		btn.addClass('mobile-radio-checked').siblings('.mobile-radio').removeClass('mobile-radio-checked');
	},

	/**
	 * Update button on radio change
	 */
	_onRadioChange = function () {
		var radioId = this.id, btn = $(this).siblings('.mobile-radio[data-id=' + radioId + ']');
		btn.addClass('mobile-radio-checked').siblings('.mobile-radio').removeClass('mobile-radio-checked');
	},

	_toggleSection = function (e) {
		e.preventDefault();
		var btn = $(this),
			sectionToShow = '.' + btn.data('section');

		container.find('.mobile-section-block').addClass('hidden');
		container.find('.footer').removeClass('hidden-xs');
		container.find(sectionToShow).removeClass('hidden');
		window.scrollTo(0, 0);
	},

	// Initialize events and handlers
	_init = function () {
		body = $('body');
		container = $('#container');
		mobileMenu = $('#mobileNavigation');

		container
			.on('click', '.section-button', _toggleSection)
			.on('click', '.m-menu-icon', _showMobileMenu);

		mobileMenu.on('click', _hideMobileMenu);
	};

	/// APP
	$.subscribe('app/ready', _init);

	$(document).ready(function () {
		$.publish('app/ready');
		try { window.Typekit.load(); } catch (e) {}
	});
	///

})(jQuery);