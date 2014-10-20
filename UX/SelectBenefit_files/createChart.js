

function _isIE() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1], 10) : false;
}

function createCharts(currCov, salMonthly, plan, targetElement) {

    var existing = parseInt(currCov, 10),
        salary = parseInt(salMonthly, 10),
        offer = parseInt(plan.BenefitAmount, 10),
        cat = parseInt((plan.CatastrophicOffered) ? plan.CatastrophicBenefitAmount : 0, 10),
        percentage = plan.CurrentCoveredPercentage,//((existing + offer + cat) * 100) / (salary),
        color = (_isIE() === 8) ? '#f6fafe' : 'transparent',
        chart;

        cls = '';
        if (Math.round(percentage) === 100) cls = 'chart-title-small';

    chart = new window.Highcharts.Chart({
        title: {
            // text: Math.round(percentage) + '<span class="cp-title-perc">%</span>',
            text: '<div class="chart-box"><div class="chart-title ' + cls + '">' + Math.round(percentage) + '<span class="cp-title-perc">%</span></div><div class="chart-subtitle dex">coverage</div></div>',
            floating: true,
            style: {
                color: '#3ba2c0'
            },
            useHTML: true
        },
        xAxis: {},
        credits: {
            enabled: false
        },
        colors: ['#527792', '#00a7d4', '#7FCCE5', (_isIE() === 8) ? '#FCEBA1' : 'transparent'],
        tooltip: {
            enabled: false
        },
        chart: {
            renderTo: targetElement,
            type: 'pie',
            plotBackgroundImage: '',
            plotBackgroundColor: color,
            backgroundColor: color,
            animation: {
                duration: 1000
            }
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                startAngle: 0,
                animation: false
            }
        },
        series: [{
                data:
                    [
                    ['Existing covarage', existing],
                    ['Monthly IDI amount', offer],
                    ['Catastrophic amount', (cat)],
                    ['Uncovered Salary', ((salary) - (existing + offer + cat))]
                ],
                innerSize: '70%',
                animation: {
                    duration: 500
                },
                dataLabels: {
                    enabled: false
                },
            }]
    });
};