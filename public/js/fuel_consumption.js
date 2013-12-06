/**/
var fuel_chart;

$(document).ready(function () {
    $('#choose_car').change(function(i, val) {
        var car_id = $(this).attr('value');
        if (car_id !== undefined && car_id !== null)
        {
            if (fuel_chart)
                fuel_chart.showLoading();

            var title = $(this).children('option:selected').text();
            $.getJSON("/api/fuel_data/" + car_id,
                      { }, function(d) {
                render_chart(title, d);
            });
        }
    });

    // Draw an empty char to indicate where the data is going.
    render_chart(' ', { data: [] });
});

function render_chart(title, data) {
    if (fuel_chart)
    {
        fuel_chart.setTitle({ text: title });
        fuel_chart.series[0].setData(data.data);
        fuel_chart.hideLoading();
        return;
    }
    
    fuel_chart = new Highcharts.Chart({
        chart: {
            renderTo: 'chart',
            type: 'spline'
        },
        title: {
            text: title
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: 'Miles per Gallon (mpg)'
            },
            min: 0
        },
/*
        tooltip: {
            formatter: function() {
                return Highcharts.dateFormat('%a, %d %b %Y %H:%M', this.x) + 
                       ': <br/><b>'+ this.y.toFixed(2) +' Ws</b>';
            }
        },
*/
        series: [{
            name: 'Miles per Gallon',
            data: data.data
        }]
    });
}