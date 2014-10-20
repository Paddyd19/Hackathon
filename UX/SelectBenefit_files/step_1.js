(function ($) {
    'use strict';

    var
	container = null,
	resizeTime = null,

	_removeSliderMargin = function () {
	    if ($(window).width() > 767) container.find('#cpContainerBasic').css('margin-left', 0);
	},

	_init = function () {
	    container = $('#container');

	    //window.coveragePanel({ target: 'cpContainer', cls: 'cp-basic cp-single', type: 'single', data: window.chartData });
	    // window.coveragePanel({ target: 'cpContainerUpgrade', cls: 'cp-upgrade cp-single', type: 'single', url: 'requests/coverage-upgrade.json' });

	    $(window)
			.on('resize', function () {
			    if (resizeTime) clearTimeout(resizeTime);
			    resizeTime = setTimeout(_removeSliderMargin, 300);
			});
	};

    $.subscribe('app/ready', _init);

}(jQuery));