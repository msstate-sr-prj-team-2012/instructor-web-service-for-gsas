
/****************************************************************************
 *
 * Global Variables
 *
 ****************************************************************************/
var user = new User(localStorage.getItem('userID'));
var currentYear;

// set the currentYear
for (var i = 0; i < 3; i++) {
    if (typeof(user.stats[2012 + i]) !== 'undefined') {
        currentYear = 2012 + i;
        break;
    }
} 

/****************************************************************************
 *
 * Functions dealing with data retreiving
 *
 ****************************************************************************/
function drawChart()
{
    var drivingDistanceYears = [];
    var drivingDistances = [];
    var series = [];
    var yMin = 0;

    for (var i = 0; i < 5; i++) {
        if (typeof(user.stats[2012 + i]) !== 'undefined') {
            drivingDistanceYears.push(2012 + i);
            drivingDistances.push(user.stats[2012 + i].driving_distance);

            if (yMin === 0) {
                // set yMin initially
                yMin = user.stats[2012 + i].driving_distance;
            }

            // check to see if the current year's distance is lower than the
            // current yMin
            if (user.stats[2012 + i].driving_distance < yMin) {
                yMin = user.stats[2012 + i].driving_distance;
            }

            if (currentYear === (2012 + i)) {
                series.push({
                    type:'pie',
                    name:'GIR',
                    data:[['Green Hit',user.stats[2012 + i].GIR_percentage],['Green Miss',100-user.stats[2012 + i].GIR_percentage]],
                    center: [45, 50],
                    size: 80,
                    showInLegend: true,
                    dataLabels: {enabled: false}
                });
                series.push({
                    type:'pie',
                    name:'FIR',
                    data:[['Fairway Hit',user.stats[2012 + i].driving_accuracy],['Fairway Miss',100-user.stats[2012 + i].driving_accuracy]],
                    center: [700, 170],
                    size: 80,
                    showInLegend: true,
                    dataLabels: {enabled: false}
                });
            }
        }
    } 

    series.push({type:'line',color:'blue',name:'Driving Distance',data:drivingDistances});

    makeChart(drivingDistanceYears, series, yMin);
}

function makeChart(drivingDistanceYears, series, yMin)
{
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'graphContainer',
            type: 'line'
        },
        title: {
            text: 'Golfer Statistics'
        },
        subtitle:{
            text: 'By Year'
        },
        xAxis: {
            title: {
                text: 'Year'
            },
            categories: drivingDistanceYears
        },
        yAxis: {
            min: yMin,
            title: {
                text: 'Distance (yards)'
            }
        },
        tooltip: {
            formatter: function() {
                if (this.point.name) { // the pie chart
                    return '' + this.point.name + ': ' + this.y.toFixed(2) + ' %';
                } else {
                    return '' + this.x  + ': ' + this.y.toFixed(2) + ' yards';
                }
            }
        },
        plotOptions: {
            pie: {
                colors: ['green', 'red']
            }
        },
        labels: {
            items: [{
                html: 'FIR %',
                style: {
                    left: '710px',
                    top: '245px',
                    color: 'black'
                }
            },
            {
                html: 'GIR %',
                style: {
                    left: '50px',
                    top: '0px',
                    color: 'black'
                }
            }
            ]
        },
        series: series
    });
}

/****************************************************************************
 *
 * Functions dealing with tabs and graph showing
 *
 ****************************************************************************/
 function changeToYear(year) 
 {  
    document.getElementById(currentYear).className = "";
    document.getElementById(year).className += ' selected_tab';   
    currentYear = parseInt(year);
    
    drawChart();
}


/****************************************************************************
 *
 * Event handlers for tabs and redraws data
 *
 ****************************************************************************/

$(document).ready(function() {   
    drawChart();

    $(".view_tabs li").click(function() {
        changeToYear($(this).attr('id'));
    });
});
