(function ($) {
    'use strict';

    var
	// Variables Declaration
	body = null,
	container = null,
	mobileMenu = null,
	resizeTime = null,
	loginForm = null,
	// loginFormSubmitBtn = null,

	// Show Mobile Menu after button is clicked
	_showMobileMenu = function (e) {
	    e.preventDefault();
	    body.addClass('show-mobile-menu');
	    _checkLogoutPosition();
	},

	_checkLogoutPosition = function () {
	    var win = $(window), nav = mobileMenu.find('nav');
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

	_mobileRadioButtons = function () {
	    var btn = $(this), id = btn.data('id');
	    btn.siblings('input').prop('checked', false);
	    btn.siblings('#' + id).prop('checked', true).trigger('change');

	    btn.siblings('.mobile-radio').removeClass('mobile-radio-checked');
	    btn.addClass('mobile-radio-checked');
	},


	/**
	 * Update button on radio change
	 */
	_onRadioChange = function () {
	    var radioId = this.id, btn = $(this).siblings('.mobile-radio[data-id=' + radioId + ']');
	    btn.addClass('mobile-radio-checked').siblings('.mobile-radio').removeClass('mobile-radio-checked');
	},

	_inputKeyDown = function (e) {
	    var max = parseInt(this.maxLength, 10), next, key = e.keyCode, K = window.UTIL.keys, pos = window.UTIL.getCaretPosition(this);

	    if ((key === K.BACKSPACE && !this.value.length) || (key === K.LEFT && pos === 0)) {
	        e.preventDefault();
	        next = $(this).prevAll('input.ssn-pass-field:first');
	        if (next.length) window.UTIL.setCaretPosition(next[0]);
	    }
	    else if (key === K.RIGHT && pos === this.value.length) {
	        e.preventDefault();
	        next = $(this).nextAll('input.ssn-pass-field:first');
	        if (next.length) window.UTIL.setCaretPosition(next[0], 0);
	    }
	    else if (K.isAlphaNumeric(key, e) && this.value.length >= max - 1 && pos === this.value.length) {
	        next = $(this).nextAll('input.ssn-pass-field:first');
	        setTimeout(function () { if (next.length) next.select(); }, 50);
	    }
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

    _startChat = function (event) {
        event.preventDefault();
        var windowName = "ChatPopUp";
        //var windowSize = "width=640,height=525,left=300,top=200,toolbar=no,location=no,titlebar=no,resizable=no,menubar=no,status=no";
        var chatWinHeight = (navigator.userAgent.toLowerCase().indexOf('msie') > -1) ? "511" : "515"
        var windowSize = "width=605,height=" + chatWinHeight + ",left=300,top=200,toolbar=no,location=no,titlebar=no,resizable=no,menubar=no,status=no";
        var chatWindow = window.open('', windowName, windowSize);
        // if (typeof chatWindow === 'undefined' || chatWindow.closed) { //chatWindow is global variable
        try
        {
            if (chatWindow.location.href.indexOf("blank") > -1) // should break here because the URL is an external URL
            {
                chatWindow.location.replace(ChatURL);
            }
        }
        catch (err) { }
        chatWindow.focus();
        return false;
    },
   
    setLayoutHeight = function () {

        $('.body-container').css('min-height', 0);
        $('.body-container').css('padding-top', 0);
        $('.body-container').css('padding-bottom', 0);

        var border = body.find('.body-border').length ? 16 : 0;
        var footerHeight = $('.footer').outerHeight();
        var bodypos = $('.body-container').position();
        var windowheight = $(window).outerHeight();

        // height of header and black title bar added together
        var headerHeight = $('#header-main').outerHeight() + $('#title-main').outerHeight();

        // height of header, content and footer added together
        var con_foot_head = $('.body-container').outerHeight() + footerHeight + headerHeight;

            var heightToAdd = $(window).outerHeight() - border - con_foot_head;
            var currentHeight = $('.body-container').outerHeight();
            var newHeight = currentHeight + heightToAdd;

            if (con_foot_head < $(window).height() - border) {
                
                $('.body-container').css('padding-top', heightToAdd / 2);
                $('.body-container').css('padding-bottom', heightToAdd / 2);

                if ($('.body-container').css('min-height') < newHeight) {
                    $('.body-container').css('min-height', newHeight);
                }
            }
            else {
                $('.body-container').css('min-height', 0);
                $('.body-container').css('padding-top', 0);
                $('.body-container').css('padding-bottom', 0);
            }
    },

	// Initialize events and handlers
	_init = function () {
	    body = $('body');
	    container = $('#container');
	    mobileMenu = $('#mobileNavigation');
	    loginForm = $('#loginForm');

	    window.FastClick.attach(document.body);
	    body.find('.loader-div').hide();

	    if (!dateSupported()) {
	        var theDatepicker = container.find('.datepicker');
	        theDatepicker.datepicker({ 'autoclose': true, 'format': 'mm/dd/yyyy' });
	        theDatepicker.attr('maxlength', '10');
	    }

	    container.find('#ssnFourLogin, #workersId').dPassword();
	    $('input').placeholder();
	    
	    // EVENT LISTENERS
	    //
	    container
			.on('click', '.m-menu-icon', _showMobileMenu)
			.on('click', '.mobile-radio', _mobileRadioButtons)
            .on('click', '.section-button', _toggleSection)
            .on('keydown', '.ssn-pass-field', _inputKeyDown)
            .on('change', '.radio-buttons input[type=radio]', _onRadioChange)
            //.on('mouseenter', '.ttip', function ()
            //{
            //    $(this).find('.ttip-text').fadeIn(300);
            //})
	        //.on('mouseenter', '.ttip', function ()
	        //{
	        //    $(this).find('.ttip-text').fadeIn(300);
	        //})
	        //.on('mouseleave', '.ttip', function ()
	        //{
	        //    $(this).find('.ttip-text').stop(true).fadeOut(100);
	        //})
	        //.on('mouseleave', '.ttip', function ()
	        //{
	        //    $(this).find('.ttip-text').stop(true).fadeOut(100);
	        //})

	    mobileMenu.on('click', _hideMobileMenu);

	    body.on('click', 'a', function (e) { $.publish('app/show-loader', [e.target]); })
            .on('click', '.chat-now-button,#LiveChat', _startChat)
            .on('click', '.chat-close, .chat-collapsed', function () {
                if ($(this).hasClass('temp')) {
                    return;
                }
                $(this).closest('.chat-container').toggleClass('inactive');
            });

	    $(window).on('resize', function () {
	        if (resizeTime) clearTimeout(resizeTime);
	        resizeTime = setTimeout(_checkLogoutPosition, 300);
	       setLayoutHeight();
	    });

        // This code is to try to fix page height to be 100%
	    setLayoutHeight();
	};

    /// APP
    $.subscribe('app/ready', _init);

    $(document).ready(function () {
        $.publish('app/ready');
        try { window.Typekit.load(); } catch (e) { }
    });
})(jQuery);