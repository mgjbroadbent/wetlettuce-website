/**/
var elec_chart; // globally available
var power_data;

$(document).ready(function() {
    $.getJSON('/api/power', function(data) {
        power_data = data.data;
        render_chart(power_data);
    });
});

function render_chart(data) {
    elec_chart = new Highcharts.StockChart({
        chart: {
            renderTo: 'chart',
            type: 'spline'
        },
        title: {
            text: 'Electricity Consumption'
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: 'Power (average/max) (Ws)'
            },
            min: 0
        },
        rangeSelector: {
            selected: 0
        },
        tooltip: {
            formatter: function() {
                return Highcharts.dateFormat('%a, %d %b %Y %H:%M', this.x) + 
                       ': <br/><b>'+ this.y.toFixed(2) +' Ws</b>';
            }
        },
        series: [{
            name: 'Power (average) [Ws]',
            data: data.power_avg
        }, {
            name: 'Power (max) [Ws]',
            data: data.power_max
        }]
    });
}