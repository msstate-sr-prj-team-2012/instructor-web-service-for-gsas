
/****************************************************************************
 *
 * Global Variables
 *
 ****************************************************************************/
var WOODS = 'v1';
var HYBRIDS = 'v2';
var IRONS = 'v3';
var WEDGES = 'v4';
var currentClubGroup = WOODS;  

var rounds = localStorage.getObject('rounds');
var currentRound = 'all';

/**
 * Gray theme for Highcharts JS
 * @author Torstein Hønsi
 */

Highcharts.theme = {
   colors: ["#DDDF0D", "#7798BF", "#55BF3B", "#DF5353", "#aaeeee", "#ff0066", "#eeaaee",
      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
   chart: {
      backgroundColor: {
         linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
         stops: [
            [0, 'rgb(96, 96, 96)'],
            [1, 'rgb(16, 16, 16)']
         ]
      },
      borderWidth: 0,
      borderRadius: 15,
      plotBackgroundColor: null,
      plotShadow: false,
      plotBorderWidth: 0
   },
   title: {
      style: {
         color: '#FFF',
         font: '16px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
      }
   },
   subtitle: {
      style: {
         color: '#DDD',
         font: '12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
      }
   },
   xAxis: {
      gridLineWidth: 0,
      lineColor: '#999',
      tickColor: '#999',
      labels: {
         style: {
            color: '#999',
            fontWeight: 'bold'
         }
      },
      title: {
         style: {
            color: '#AAA',
            font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
         }
      }
   },
   yAxis: {
      alternateGridColor: null,
      minorTickInterval: null,
      gridLineColor: 'rgba(255, 255, 255, .1)',
      minorGridLineColor: 'rgba(255,255,255,0.07)',
      lineWidth: 0,
      tickWidth: 0,
      labels: {
         style: {
            color: '#999',
            fontWeight: 'bold'
         }
      },
      title: {
         style: {
            color: '#AAA',
            font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
         }
      }
   },
   legend: {
      itemStyle: {
         color: '#CCC'
      },
      itemHoverStyle: {
         color: '#FFF'
      },
      itemHiddenStyle: {
         color: '#333'
      }
   },
   labels: {
      style: {
         color: '#CCC'
      }
   },
   tooltip: {
      backgroundColor: {
         linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
         stops: [
            [0, 'rgba(96, 96, 96, .8)'],
            [1, 'rgba(16, 16, 16, .8)']
         ]
      },
      borderWidth: 0,
      style: {
         color: '#FFF'
      }
   },


   plotOptions: {
      series: {
         shadow: true
      },
      line: {
         dataLabels: {
            color: '#CCC'
         },
         marker: {
            lineColor: '#333'
         }
      },
      spline: {
         marker: {
            lineColor: '#333'
         }
      },
      scatter: {
         marker: {
            lineColor: '#333'
         }
      },
      candlestick: {
         lineColor: 'white'
      }
   },

   toolbar: {
      itemStyle: {
         color: '#CCC'
      }
   },

   navigation: {
      buttonOptions: {
         symbolStroke: '#DDDDDD',
         hoverSymbolStroke: '#FFFFFF',
         theme: {
            fill: {
               linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
               stops: [
                  [0.4, '#606060'],
                  [0.6, '#333333']
               ]
            },
            stroke: '#000000'
         }
      }
   },

   // scroll charts
   rangeSelector: {
      buttonTheme: {
         fill: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
               [0.4, '#888'],
               [0.6, '#555']
            ]
         },
         stroke: '#000000',
         style: {
            color: '#CCC',
            fontWeight: 'bold'
         },
         states: {
            hover: {
               fill: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                     [0.4, '#BBB'],
                     [0.6, '#888']
                  ]
               },
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            },
            select: {
               fill: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                     [0.1, '#000'],
                     [0.3, '#333']
                  ]
               },
               stroke: '#000000',
               style: {
                  color: 'yellow'
               }
            }
         }
      },
      inputStyle: {
         backgroundColor: '#333',
         color: 'silver'
      },
      labelStyle: {
         color: 'silver'
      }
   },

   navigator: {
      handles: {
         backgroundColor: '#666',
         borderColor: '#AAA'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(16, 16, 16, 0.5)',
      series: {
         color: '#7798BF',
         lineColor: '#A6C7ED'
      }
   },

   scrollbar: {
      barBackgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
               [0.4, '#888'],
               [0.6, '#555']
            ]
         },
      barBorderColor: '#CCC',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
               [0.4, '#888'],
               [0.6, '#555']
            ]
         },
      buttonBorderColor: '#CCC',
      rifleColor: '#FFF',
      trackBackgroundColor: {
         linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
         stops: [
            [0, '#000'],
            [1, '#333']
         ]
      },
      trackBorderColor: '#666'
   },

   // special colors for some of the demo examples
   legendBackgroundColor: 'rgba(48, 48, 48, 0.8)',
   legendBackgroundColorSolid: 'rgb(70, 70, 70)',
   dataLabelsColor: '#444',
   textColor: '#E0E0E0',
   maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
var highchartsOptions = Highcharts.setOptions(Highcharts.theme);

/****************************************************************************
 *
 * Functions dealing with data retreiving
 *
 ****************************************************************************/
function getChart(clubGroup)
{
    var clubsText = '';

    var yAxisText = '';
    var xAxisText = '';
    var title = '';
    var subtitle = '';
    var categories = [];

    if (clubGroup === WOODS) {
        clubsText = 'Woods';
    } else if (clubGroup === HYBRIDS) {
        clubsText = 'Hybrids';
    } else if (clubGroup === IRONS) {
        clubsText = 'Irons';
    } else {
        clubsText = 'Wedges';
    }

    var series = getRoundData(clubGroup);

    if (currentRound == 'all') {
        yAxisText = 'Distance (yards)';
        xAxisText = 'Clubs';
        title = 'Average Distance Between All Rounds';
        subtitle = clubsText;

        for (var i = 0; i < series.length; i++) {
            categories.push(series[i].name);
        }

    } else {
        yAxisText = 'Distance (yards)';
        xAxisText = 'Holes';
        title = 'Distance By Hole';
        subtitle = clubsText;
        categories = [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18'
        ];
    }

    makeChart(clubsText, yAxisText, xAxisText, title, subtitle, categories, series);
}

function makeChart(clubsText, yAxisText, xAxisText, title, subtitle, categories, series)
{
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'graphContainer',
            type: 'column'
        },
        title: {
            text: title
        },
        subtitle:{
            text: subtitle
        },
        xAxis: {
            title: {
                text: xAxisText
            },
            categories: categories
        },
        yAxis: {
            min: 0,
            title: {
                text: yAxisText
            }
        },
        tooltip: {
            formatter: function() {
                return ''+
                    this.x +': '+ this.y +' yards';
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: series
    });
}

function getRoundData(clubGroup)
{
    // set a new variable to host the data
    var series = [];

    //figure out which clubs are being used (which group)
    if(clubGroup === WOODS) {
        series.push({name:'driver',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'3 wood',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'4 wood',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'5 wood',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'7 wood',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'9 wood',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
    } else if(clubGroup === HYBRIDS) {
        series.push({name:'2 hybrid',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'3 hybrid',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'4 hybrid',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'5 hybrid',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'6 hybrid',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
    } else if(clubGroup === IRONS) {
        series.push({name:'2 iron',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'3 iron',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'4 iron',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'5 iron',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'6 iron',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'7 iron',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'8 iron',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'9 iron',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
    } else {
        series.push({name:'pitching wedge',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'approach wedge',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'sand wedge',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'lob wedge',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
        series.push({name:'high lob wedge',data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
    }

    // cycle through the round data
    // the if statements just checks to see if all is checked
    // if all is selected, rounds will be an array
    // else there is only a single round
    if (rounds.length >= 1) {
        // multiple rounds
        // find the average
        var distances = [];

        if(clubGroup === WOODS) {
            distances.push({name:'driver',data:[]});
            distances.push({name:'3 wood',data:[]});
            distances.push({name:'4 wood',data:[]});
            distances.push({name:'5 wood',data:[]});
            distances.push({name:'7 wood',data:[]});
            distances.push({name:'9 wood',data:[]});
        } else if(clubGroup === HYBRIDS) {
            distances.push({name:'2 hybrid',data:[]});
            distances.push({name:'3 hybrid',data:[]});
            distances.push({name:'4 hybrid',data:[]});
            distances.push({name:'5 hybrid',data:[]});
            distances.push({name:'6 hybrid',data:[]});
        } else if(clubGroup === IRONS) {
            distances.push({name:'2 iron',data:[]});
            distances.push({name:'3 iron',data:[]});
            distances.push({name:'4 iron',data:[]});
            distances.push({name:'5 iron',data:[]});
            distances.push({name:'6 iron',data:[]});
            distances.push({name:'7 iron',data:[]});
            distances.push({name:'8 iron',data:[]});
            distances.push({name:'9 iron',data:[]});
        } else {
            distances.push({name:'pitching wedge',data:[]});
            distances.push({name:'approach wedge',data:[]});
            distances.push({name:'sand wedge',data:[]});
            distances.push({name:'lob wedge',data:[]});
            distances.push({name:'high lob wedge',data:[]});
        }

        for (var roundIndex = 0; roundIndex < rounds.length; roundIndex++) {
            for (var holeIndex = 0; holeIndex < rounds[roundIndex].holes.length; holeIndex++) {
                for (var shotIndex = 0; shotIndex < rounds[roundIndex].holes[holeIndex].shots.length; shotIndex++) {
                    if(clubGroup === WOODS) {
                        if (rounds[roundIndex].holes[holeIndex].shots[shotIndex].club >= defines.DRIVER &&
                            rounds[roundIndex].holes[holeIndex].shots[shotIndex].club <= defines.NINE_WOOD) {
                            // find the distance and put it in the proper place in the series data
                            for (var distancesIndex = 0; distancesIndex < distances.length; distancesIndex++) {
                                if (distances[distancesIndex].name == getClubName(rounds[roundIndex].holes[holeIndex].shots[shotIndex].club)) {
                                    distances[distancesIndex].data.push(parseFloat(getDistance(
                                        rounds[roundIndex].holes[holeIndex].shots[shotIndex].startLatitude,
                                        rounds[roundIndex].holes[holeIndex].shots[shotIndex].startLongitude,
                                        rounds[roundIndex].holes[holeIndex].shots[shotIndex].endLatitude,
                                        rounds[roundIndex].holes[holeIndex].shots[shotIndex].endLongitude
                                    )));
                                    break;
                                }
                            }
                        }
                    } else if(clubGroup === HYBRIDS) {
                        if (rounds[roundIndex].holes[holeIndex].shots[shotIndex].club >= defines.TWO_HYBRID &&
                            rounds[roundIndex].holes[holeIndex].shots[shotIndex].club <= defines.SIX_HYBRID) {
                            // find the distance and put it in the proper place in the series data
                            for (var distancesIndex = 0; distancesIndex < distances.length; distancesIndex++) {
                                if (distances[distancesIndex].name == getClubName(rounds[roundIndex].holes[holeIndex].shots[shotIndex].club)) {
                                    distances[distancesIndex].data.push(parseFloat(getDistance(
                                        rounds[roundIndex].holes[holeIndex].shots[shotIndex].startLatitude,
                                        rounds[roundIndex].holes[holeIndex].shots[shotIndex].startLongitude,
                                        rounds[roundIndex].holes[holeIndex].shots[shotIndex].endLatitude,
                                        rounds[roundIndex].holes[holeIndex].shots[shotIndex].endLongitude
                                    )));
                                    break;
                                }
                            }
                        }
                    } else if(clubGroup === IRONS) {
                        if (rounds[roundIndex].holes[holeIndex].shots[shotIndex].club >= defines.TWO_IRON &&
                            rounds[roundIndex].holes[holeIndex].shots[shotIndex].club <= defines.NINE_IRON) {
                            // find the distance and put it in the proper place in the series data
                            for (var distancesIndex = 0; distancesIndex < distances.length; distancesIndex++) {
                                if (distances[distancesIndex].name == getClubName(rounds[roundIndex].holes[holeIndex].shots[shotIndex].club)) {
                                    distances[distancesIndex].data.push(parseFloat(getDistance(
                                        rounds[roundIndex].holes[holeIndex].shots[shotIndex].startLatitude,
                                        rounds[roundIndex].holes[holeIndex].shots[shotIndex].startLongitude,
                                        rounds[roundIndex].holes[holeIndex].shots[shotIndex].endLatitude,
                                        rounds[roundIndex].holes[holeIndex].shots[shotIndex].endLongitude
                                    )));
                                    break;
                                }
                            }
                        }
                    } else {
                        if (rounds[roundIndex].holes[holeIndex].shots[shotIndex].club >= defines.PW &&
                            rounds[roundIndex].holes[holeIndex].shots[shotIndex].club <= defines.HLW) {
                            // find the distance and put it in the proper place in the series data
                            for (var distancesIndex = 0; distancesIndex < distances.length; distancesIndex++) {
                                if (distances[distancesIndex].name == getClubName(rounds[roundIndex].holes[holeIndex].shots[shotIndex].club)) {
                                    distances[distancesIndex].data.push(parseFloat(getDistance(
                                        rounds[roundIndex].holes[holeIndex].shots[shotIndex].startLatitude,
                                        rounds[roundIndex].holes[holeIndex].shots[shotIndex].startLongitude,
                                        rounds[roundIndex].holes[holeIndex].shots[shotIndex].endLatitude,
                                        rounds[roundIndex].holes[holeIndex].shots[shotIndex].endLongitude
                                    )));
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        var realSeries = [];

        // loop throught the distances and average the integers in the arrays
        for (distancesIndex = 0; distancesIndex < distances.length; distancesIndex++) {
            // distances index will line up with series index
            if (distances[distancesIndex].data.length !== 0) {
                // average the distances in the data portion of the object
                var sum = 0;
                for (var i = 0; i < distances[distancesIndex].data.length; i++) {
                    sum += distances[distancesIndex].data[i];
                }

                var newData = [];
                newData.push(sum / distances[distancesIndex].data.length);

                distances[distancesIndex].data = newData;

                // add this item from the list
                // because there is data for that club
                realSeries.push(distances[distancesIndex]);
            }
        }

        // pad the series with 0s so everything shows up in the correct place
        for (var j = 0; j < realSeries.length; j++) {
            var data = realSeries[j].data[realSeries[j].data.length - 1];
            var newData = [];
            for (var k = 0; k < realSeries.length; k++) {
                if (k == j) {
                    newData.push(data);
                } else {
                    newData.push(0);
                }
            }
            realSeries[j].data = newData;
        }

        series = realSeries;

    } else {
        // single round
        for (var holeIndex = 0; holeIndex < rounds.holes.length; holeIndex++) {
            for (var shotIndex = 0; shotIndex < rounds.holes[holeIndex].shots.length; shotIndex++) {
                // see if the club is in the group needed
                if(clubGroup === WOODS) {
                    if (rounds.holes[holeIndex].shots[shotIndex].club >= defines.DRIVER &&
                        rounds.holes[holeIndex].shots[shotIndex].club <= defines.NINE_WOOD) {
                        // find the distance and put it in the proper place in the series data
                        for (var seriesIndex = 0; seriesIndex < series.length; seriesIndex++) {
                            if (series[seriesIndex].name == getClubName(rounds.holes[holeIndex].shots[shotIndex].club)) {
                                series[seriesIndex].data[rounds.holes[holeIndex].holeNumber - 1] = parseFloat(getDistance(
                                    rounds.holes[holeIndex].shots[shotIndex].startLatitude,
                                    rounds.holes[holeIndex].shots[shotIndex].startLongitude,
                                    rounds.holes[holeIndex].shots[shotIndex].endLatitude,
                                    rounds.holes[holeIndex].shots[shotIndex].endLongitude
                                ));
                                break;
                            }
                        }
                    }
                } else if(clubGroup === HYBRIDS) {
                    if (rounds.holes[holeIndex].shots[shotIndex].club >= defines.TWO_HYBRID &&
                        rounds.holes[holeIndex].shots[shotIndex].club <= defines.SIX_HYBRID) {
                        // find the distance and put it in the proper place in the series data
                        for (var seriesIndex = 0; seriesIndex < series.length; seriesIndex++) {
                            if (series[seriesIndex].name == getClubName(rounds.holes[holeIndex].shots[shotIndex].club)) {
                                series[seriesIndex].data[rounds.holes[holeIndex].holeNumber - 1] = parseFloat(getDistance(
                                    rounds.holes[holeIndex].shots[shotIndex].startLatitude,
                                    rounds.holes[holeIndex].shots[shotIndex].startLongitude,
                                    rounds.holes[holeIndex].shots[shotIndex].endLatitude,
                                    rounds.holes[holeIndex].shots[shotIndex].endLongitude
                                ));
                                break;
                            }
                        }
                    }
                } else if(clubGroup === IRONS) {
                    if (rounds.holes[holeIndex].shots[shotIndex].club >= defines.TWO_IRON &&
                        rounds.holes[holeIndex].shots[shotIndex].club <= defines.NINE_IRON) {
                        // find the distance and put it in the proper place in the series data
                        for (var seriesIndex = 0; seriesIndex < series.length; seriesIndex++) {
                            if (series[seriesIndex].name == getClubName(rounds.holes[holeIndex].shots[shotIndex].club)) {
                                series[seriesIndex].data[rounds.holes[holeIndex].holeNumber - 1] = parseFloat(getDistance(
                                    rounds.holes[holeIndex].shots[shotIndex].startLatitude,
                                    rounds.holes[holeIndex].shots[shotIndex].startLongitude,
                                    rounds.holes[holeIndex].shots[shotIndex].endLatitude,
                                    rounds.holes[holeIndex].shots[shotIndex].endLongitude
                                ));
                                break;
                            }
                        }
                    }
                } else {
                    if (rounds.holes[holeIndex].shots[shotIndex].club >= defines.PW &&
                        rounds.holes[holeIndex].shots[shotIndex].club <= defines.HLW) {
                        // find the distance and put it in the proper place in the series data
                        for (var seriesIndex = 0; seriesIndex < series.length; seriesIndex++) {
                            if (series[seriesIndex].name == getClubName(rounds.holes[holeIndex].shots[shotIndex].club)) {
                                series[seriesIndex].data[rounds.holes[holeIndex].holeNumber - 1] = parseFloat(getDistance(
                                    rounds.holes[holeIndex].shots[shotIndex].startLatitude,
                                    rounds.holes[holeIndex].shots[shotIndex].startLongitude,
                                    rounds.holes[holeIndex].shots[shotIndex].endLatitude,
                                    rounds.holes[holeIndex].shots[shotIndex].endLongitude
                                ));
                                break;
                            }
                        }
                    }
                }
            }
        }

        var realSeries = [];

        // loop through the series. If any item's data element is all 0s, don't add it to real series
        for (var seriesIndex = 0; seriesIndex < series.length; seriesIndex++) {
            var check = 0;
            for (var i = 0; i < 18; i++) {
                check += series[seriesIndex].data[i];
            }
            if (check != 0) 
                realSeries.push(series[seriesIndex]);
        }

        series = realSeries;
    }

    return series;
}

/****************************************************************************
 *
 * Functions dealing with tabs and graph showing
 *
 ****************************************************************************/
 function changeView(view) {     
    document.getElementById(currentClubGroup).className = "";

    if(view === WOODS) {
        getChart(WOODS);
    } else if(view === HYBRIDS) {
        getChart(HYBRIDS);
    } else if(view === IRONS) {
        getChart(IRONS);
    } else {
        getChart(WEDGES);
    }

    document.getElementById(view).className += ' selected_tab'; 
    currentClubGroup = view;
}

function changeToRound(id) {     
    document.getElementById(currentRound).className = "";
    document.getElementById(id).className += ' selected_tab';
    currentRound = id;  
    
    // filters localStorage for new round object 
    if (id === 'all'){
        rounds = localStorage.getObject('rounds');
    } else {
        rounds = localStorage.getObject('rounds').filter(function(obj) { return (obj.ID == id) })[0]; 
    }
    
    if(currentClubGroup === WOODS) {
        getChart(WOODS);
    } else if(currentClubGroup === HYBRIDS) {
        getChart(HYBRIDS);
    } else if(currentClubGroup === IRONS) {
        getChart(IRONS);
    } else {
        getChart(WEDGES);
    }
}


/****************************************************************************
 *
 * Event handlers for tabs and redraws data
 *
 ****************************************************************************/

$(document).ready(function() {   
    getChart(WOODS);

    $(".round_tabs li").click(function() {
        changeToRound($(this).attr('id'));
    });

    $(".view_tabs li").click(function() {
        changeView($(this).attr('id'));
    });       
});
