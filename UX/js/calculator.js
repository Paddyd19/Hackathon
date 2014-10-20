(function ($) {
	'use strict';

	var
	container = null,
	sliderContainer = null,
	slides = null,
	slide, slideOrder, dir,
	coverageSliderBox = null,
	mobileCoverageSliderBox = null,
	coverageLabel = null,
	totalExpenses = null,
	totalCoverage = null,
	salary = null,
	chart = null,
	body = null,
	sumValue = 0,
	_data = {
		salary: 0,
		disabilityCoverage: 0,
		home: 0,
		transport: 0,
		shopping: 0,
		savings: 0,
		other: 0
	},
	mobileFormButton = null,

	slideBox = function () {


		slide = $(this).closest('.c-slide');
		slideOrder = slide.data('order');
		dir = ($(this).data('dir') === 'left') ? slideOrder : slideOrder - 2;

		if (slideOrder === 1) {
			_data.salary = Math.round((container.find('.c-slide-1 .c-earn-input input').val().replace(/[^0-9]/g, '') / 12) * 100) / 100;
			coverageSlider();
		}

		if (slideOrder === 2) {
			container.find('.slide-3-bottom-text span').html(_numberFormat(Math.round(_data.salary)));
			_data.disabilityCoverage = parseInt(container.find('.coverage-label span').html().replace(',', ''), 10);

			_data.home = 0;
			_data.transport = 0;
			_data.shopping = 0;
			_data.savings = 0;
			_data.other = 0;
			totalExpenses.removeClass('red').find('span').html('0');
			smallSliders();
			createChart('chart-box');
		}
		if (slideOrder === 3) {
			var sumValue = _data.home + _data.transport + _data.shopping + _data.savings + _data.other;
			container.find('.c-blue-box-calculation span').html(_numberFormat(Math.round((((_data.salary - _data.disabilityCoverage) / _data.salary) * 100) * 10) / 10));
			container.find('.c-orange-box-calculation span').html(_numberFormat(sumValue - _data.disabilityCoverage > 0 ? Math.round((sumValue - _data.disabilityCoverage) * 10) / 10 : 0));

			container.find('.c-popup-salary').html(_numberFormat(_data.salary));
			container.find('.c-popup-coverage').html(_numberFormat(_data.disabilityCoverage));
			container.find('.c-popup-gap').html(_numberFormat(_data.salary - _data.disabilityCoverage));
			container.find('.c-popup-income').html(_numberFormat(_data.salary));
			container.find('.c-popup-perc').html(_numberFormat(((_data.salary - _data.disabilityCoverage) / _data.salary) * 100 + '%'));
		}

		if (slideOrder === 1 && $(this).data('dir') === 'right') return;
		if (slideOrder === slides.length && $(this).data('dir') === 'left') return;
		sliderContainer.animate({'margin-left': -700 * dir});
	},

	coverageSlider = function (newValue) { // Added the argument

		coverageSliderBox.slider({
			range: 'min',
			min: 0,
			// max: (_data.salary * 75) / 100,
			max: 4000,
			step: 50,
			value: parseFloat(newValue) || _data.salary / 10, // Line has been changed
			slide: function (event, ui) {
				_data.disabilityCoverage = ui.value;
				container.find('.coverage-label span').html(_numberFormat(Math.round(ui.value)));
			}
		});
		coverageLabel.html(_numberFormat(coverageSliderBox.slider('value')));
	},

	/*

	In the AJAX function "done" please just call the coverageSlider function with an argument
	where the argument is a new value for the Coverage Slider

	$.ajax({
		...
	}).done(function (data) {
		coverageSlider(someNewValue);
	});

	- someNewValue above is a value retrieved from the database by ajax call.

	Function coverageSlider() above updates the coverage slider.

	*/

	mobileCoverageSlider = function () {
		mobileCoverageSliderBox.slider({
			range: 'min',
			min: 0,
			max: 4000,
			step: 50,
			value: _data.salary / 10,
			slide: function (event, ui) {
				_data.disabilityCoverage = ui.value;
				container.find('.mobile-coverage-label span').html(_numberFormat(Math.round(ui.value)));
				chart.series[1].setData([ui.value, _data.salary - ui.value], true, { duration: 0 });
				chart.series[1].update({ colors: ['#537791', '#F6F9FB'] });
				chart.series[2].update({ colors: ['#F6F9FB'] });
			}
		});
		_data.disabilityCoverage = mobileCoverageSliderBox.slider('value');
		container.find('.mobile-coverage-label span').html(_numberFormat(mobileCoverageSliderBox.slider('value')));
		chart.series[1].setData([_data.disabilityCoverage, _data.salary - _data.disabilityCoverage], true, { duration: 0 });
		chart.series[1].update({ colors: ['#537791', '#F6F9FB'] });
		chart.series[2].update({ colors: ['#F6F9FB'] });
	},

	calculate = function () {
		sumValue = _data.home + _data.transport + _data.shopping + _data.savings + _data.other;


		chart.series[2].setData([Math.max(_data.salary / 100, sumValue), _data.salary - sumValue], true, { duration: 300 });
		if (sumValue > _data.disabilityCoverage) {
			chart.series[2].update({ colors: ['#FF6238', '#F6F9FB'] });
			totalExpenses.addClass('red').find('span').html(_numberFormat(sumValue));
			container.find('.mobile-chart-desc-expenses').addClass('red').find('span').html(_numberFormat(sumValue));
			container.find('.c-slide-3 .c-top-text').html('But most people need more than just the essentials');

		}
		else {
			chart.series[2].update({ colors: ['#FFE338', '#F6F9FB'] });
			totalExpenses.removeClass('red').find('span').html(_numberFormat(sumValue));
			container.find('.mobile-chart-desc-expenses').removeClass('red').find('span').html(_numberFormat(sumValue));
			container.find('.c-slide-3 .c-top-text').html('With just a few expenses you might be covered by LTD');
		}
	},

	smallSliders = function () {
		var expenses = [30, 20, 20, 20, 10],
			newSalary = Math.round(_data.salary * 1.2);

		totalCoverage.html(_numberFormat(container.find('.coverage-label span').html()));

		container.find('.c-slider').each(function (idx) {
			var slider = $(this),
				// sliderValueSpans = container.find('.c-slider-label span'),
				labelSpan = slider.closest('.c-small-slider').siblings('.c-slider-label').find('span'),
				sliderName = slider.closest('td').data('name');

			slider.slider({
				range: 'min',
				min: 0,
				max: (newSalary / 100) * expenses[idx],
				step: 50,
				value: 0,
				slide: function (event, ui) {
					_data[sliderName] = ui.value;
					labelSpan.html(_numberFormat(ui.value));
					calculate();
				}
			});

			labelSpan.html(_numberFormat(slider.slider('value')));
		});
	},

	mobileSmallSliders = function () {
		var expenses = [30, 20, 20, 20, 10],
			newSalary = Math.round(parseInt(_data.salary, 10) * 1.2);

		container.find('.mobile-c-slider').each(function (idx) {
			var slider = $(this),
				labelSpan = slider.closest('.mobile-bottom-slider').find('.mobile-amount-label span'),
				sliderName = slider.closest('.mobile-bottom-slider').data('name');

			slider.slider({
				range: 'min',
				min: 0,
				max: (newSalary / 100) * expenses[idx],
				step: 50,
				value: 0,
				slide: function (event, ui) {
					_data[sliderName] = ui.value;
					labelSpan.html(_numberFormat(ui.value));
					calculate();
				}
			});

			labelSpan.html(_numberFormat(slider.slider('value')));
		});
	},

	createChart = function (target) {
		container.find('.' + target).each(function () {
			chart = new window.Highcharts.Chart({
				chart: {
					type: 'pie',
					// renderTo: document.getElementById('chartBox'),
					renderTo: this,
					plotBackgroundColor: '#F6F9FB',
					backgroundColor: '#F6F9FB'
				},
				title: false,
				plotOptions: {
					pie: {
						shadow: false,
						center: ['50%', '50%'],
						borderWidth: 0
					}
				},
				tooltip: { enabled: false },
				series: [{
					// Salary value only
					colors: ['#1CA8D2'],
					name: false,
					data: [ _data.salary],
					size: '70%',
					innerSize: '50%',
					dataLabels: { enabled: false }
	            }, {
					// Disability coverage value
					colors: ['#537791', '#F6F9FB'],
					name: false,
					data: [ parseInt(_data.disabilityCoverage, 10), _data.salary - _data.disabilityCoverage ],
					size: '90%',
					innerSize: '70%',
					dataLabels: { enabled: false },
	            },
				{
					// Sum of the other values
					colors: ['#FFE338', '#F6F9FB'],
					name: false,
					data: [ _data.salary / 100, _data.salary - _data.salary / 100 ],
					size: '100%',
					innerSize: '90%',
					dataLabels: { enabled: false }
	            }],
		        credits: { enabled: false },
			});
		});
	},

	showCalculationPopup = function () {
		container.find('#calculatorContainer .c-popup').css('top', $(this).data('place')).stop().fadeTo(300, 1);
	},

	hideCalculationPopup = function () {
		container.find('.c-popup').stop().fadeTo(300, 0, function () { $(this).hide(); });

	},

	createMobileChart = function () {
		createChart('mobile-chart-box');
		chart.series[0].setData([100, 0]);
		chart.series[0].update({ colors: ['#E8E6E6'] });
		chart.series[1].setData([1, 100]);
		chart.series[1].update({ colors: ['#F6F9FB'] });
		chart.series[2].setData([1, 100]);
		chart.series[2].update({ colors: ['#F6F9FB'] });
		window.scrollTo(0, 0);
	},

	updateChartEarnValue = function () {
		var btn = $(this),
			inputVal = btn.siblings('input').val().replace(/\$/g, '');

		if (inputVal.length) {
			chart.series[0].setData([Math.round(inputVal / 12), 0]);
			_data.salary = Math.round(inputVal / 12);
			chart.series[0].setData([_data.salary, 0]);

			btn.closest('.mobile-chart-bottom').addClass('submited').find('.mobile-chart-desc span').html(_numberFormat(Math.round(inputVal / 12)));
			chart.series[0].update({ colors: ['#8EC052'] });
			chart.series[1].update({ colors: ['#F6F9FB'] });
			chart.series[2].update({ colors: ['#F6F9FB'] });
		}
		window.scrollTo(0, 0);
	},

	mobileNextSlide = function () {
		var order = $(this).closest('.mobile-slide').data('order');
		container.find('.mobile-slide').fadeOut(200);
		container.find('.mobile-slide-' + (order + 1)).fadeIn(200);
		mobileFormButton.removeClass('active');

		if (order === 1) {
			mobileSmallSliders();
			mobileCoverageSlider();
			mobileFormButton.addClass('active');
		}
		if (order === 7) {
			container.find('.mobile-chart-box').hide();
			container.find('.mobile-blue-box .mobile-blue-box-bottom span').html(_numberFormat(Math.round((((_data.salary - _data.disabilityCoverage) / _data.salary) * 100) * 10) / 10));
			container.find('.mobile-orange-box .mobile-blue-box-bottom span').html(_numberFormat(sumValue - _data.disabilityCoverage > 0 ? Math.round((sumValue - _data.disabilityCoverage) * 10) / 10 : 0));
		}

		window.scrollTo(0, 0);
	},

	mobilePrevSlide = function () {
		var order = $(this).closest('.mobile-slide').data('order');
		mobileFormButton.removeClass('active');

		if (order === 3) mobileFormButton.addClass('active');

		container.find('.mobile-slide').fadeOut(200);
		container.find('.mobile-slide-' + ($(this).closest('.mobile-slide').data('order') - 1)).fadeIn(200);
		window.scrollTo(0, 0);
	},

	keepPlaceholder = function () {
		var inp = $(this);

		if (inp.val().indexOf('$') === 0) return;
		inp.val('$' + inp.val());
	},

	setVideoPosition = function () {
		var video = body.find('#myModal .modal-dialog');
		setTimeout(function () {
			video.css('margin-top', ($(window).height() / 2) - (video.height() / 2));
			console.log($(window).height() / 2, video.height() / 2);
		}, 500);

	},

	_numberFormat = function (number, prec) {
		var ext, name, numS, rgx = /(\d+)(\d{3})/;
		number = number || '0';
		prec = prec || 0;
		numS = ('' + number).split('.');
		name = numS[0];
		ext = numS[1];
		if (prec > 0) ext = ((ext || '') + new Array(prec + 1).join('0')).substr(0, prec);
		else ext = '';
		while (rgx.test(name)) name = name.replace(rgx, '$1' + ',' + '$2');
		return name + (ext ? '.' + ext : '');
	},

	showMobileLoginForm = function (e) {
		e.preventDefault();
		container.find('.mobile-login-form').show();
		mobileFormButton.html('Close Login Form').addClass('shown');
	},

	hideMobileLoginForm = function (e) {
		e.preventDefault();
		container.find('.mobile-login-form').hide();
		mobileFormButton.html('Don\'t know your coverage?').removeClass('shown');
	},

	init = function () {
		container = $('#container');
		sliderContainer = container.find('.calculator-slides');
		slides = sliderContainer.find('.c-slide');
		coverageSliderBox = container.find('#coverageSlider');
		mobileCoverageSliderBox = container.find('#mobileCoverageSlider');
		coverageLabel = container.find('.coverage-label span');
		totalExpenses = container.find('#totalExpenses');
		totalCoverage = container.find('#totalCoverage span');
		salary = container.find('.c-earn-input input');
		body = $('body');
		mobileFormButton = container.find('.mobile-show-form-button');

		// container.find('#widget').draggable();

		container
			.on('click', '.c-button-next, .c-button-prev', slideBox)
			.on('mouseenter', '.c-orange-box-calculation, .c-blue-box-calculation, .c-popup', showCalculationPopup)
			.on('mouseleave', '.c-orange-box-calculation, .c-blue-box-calculation, .c-popup', hideCalculationPopup)
			.on('click', '.calculator-button', createMobileChart)
			.on('click', '.mobile-submit-earn-button', updateChartEarnValue)
			.on('click', '.mobile-slide-next', mobileNextSlide)
			.on('click', '.mobile-slide-prev', mobilePrevSlide)
			.on('keyup', '.mobile-earn-field input, .c-earn-input input', keepPlaceholder)
			.on('click', '.mobile-video-button', setVideoPosition)
			.on('click', '.mobile-show-form-button', showMobileLoginForm)
			.on('click', '.mobile-show-form-button.shown', hideMobileLoginForm)
			.on('click', '.c-box-1 .c-button', function () { $(this).closest('.c-boxes').addClass('c-box-login'); });
	};


	$(init);
})(jQuery);