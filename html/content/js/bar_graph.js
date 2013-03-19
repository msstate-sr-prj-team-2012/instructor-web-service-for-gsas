
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

/****************************************************************************
 *
 * Functions dealing with data retreiving
 *
 ****************************************************************************/
function getChart(clubGroup)
{
<<<<<<< HEAD
    $(".view_tabs li").click(function() 
    {
        myToggle($(this).attr('id'));
    });
    
    $(".round_tabs li").click(function() 
    {
        changeToRound($(this).attr('id'));
    });
    var tags = new Array("shot 1", "shot 2", "shot 3", "shot 4","hot 5");
    var values = new Array("63", "80", "95", "34","900");
    //basicbargraph(tags,values);
    graph2(tags,values);
    graph3();
    document.getElementById(mapRound).className += ' selected_tab';
});
        
 function basicbargraph(tags, value) {
    var length = 200;
=======
    var clubsText = '';
>>>>>>> Bar graph

    var yAxisText = '';

    currentRound == 'all' ? yAxisText = 'Average Distance (yards)' : yAxisText = 'Distance (yards)';

    if (clubGroup === WOODS) {
        clubsText = 'Woods';
    } else if (clubGroup === HYBRIDS) {
        clubsText = 'Hybrids';
    } else if (clubGroup === IRONS) {
        clubsText = 'Irons';
    } else {
        clubsText = 'Wedges';
    }

    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'graphContainer',
            type: 'column'
        },
        title: {
            text: 'Distance by Hole for ' + clubsText
        },
        xAxis: {
            categories: [
                'Hole 1',
                'Hole 2',
                'Hole 3',
                'Hole 4',
                'Hole 5',
                'Hole 6',
                'Hole 7',
                'Hole 8',
                'Hole 9',
                'Hole 10',
                'Hole 11',
                'Hole 12',
                'Hole 13',
                'Hole 14',
                'Hole 15',
                'Hole 16',
                'Hole 17',
                'Hole 18'
            ]
        },
        yAxis: {
            min: 0,
            title: {
                text: yAxisText
            }
        },
        legend: {
            layout: 'vertical',
            backgroundColor: '#FFFFFF',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            shadow: true
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
            series: getRoundData(clubGroup)
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
            distances.push({name:'driver',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'3 wood',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'4 wood',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'5 wood',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'7 wood',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'9 wood',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
        } else if(clubGroup === HYBRIDS) {
            distances.push({name:'2 hybrid',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'3 hybrid',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'4 hybrid',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'5 hybrid',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'6 hybrid',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
        } else if(clubGroup === IRONS) {
            distances.push({name:'2 iron',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'3 iron',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'4 iron',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'5 iron',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'6 iron',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'7 iron',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'8 iron',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'9 iron',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
        } else {
            distances.push({name:'pitching wedge',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'approach wedge',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'sand wedge',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'lob wedge',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
            distances.push({name:'high lob wedge',data:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]});
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
                                    distances[distancesIndex].data[rounds[roundIndex].holes[holeIndex].holeNumber - 1].push(parseFloat(getDistance(
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
                                    distances[distancesIndex].data[rounds[roundIndex].holes[holeIndex].holeNumber - 1].push(parseFloat(getDistance(
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
                                    distances[distancesIndex].data[rounds[roundIndex].holes[holeIndex].holeNumber - 1].push(parseFloat(getDistance(
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
                                    distances[distancesIndex].data[rounds[roundIndex].holes[holeIndex].holeNumber - 1].push(parseFloat(getDistance(
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

        // loop throught the distances and average the integers in the arrays
        for (distancesIndex = 0; distancesIndex < distances.length; distancesIndex++) {
            // distances index will line up with series index
            for (dataIndex = 0; dataIndex < distances[distancesIndex].data.length; dataIndex++) {
                // dataIndex will line up with data index in series
                if (distances[distancesIndex].data[dataIndex].length != 0) {
                    var sum = 0;
                    for (var i = 0; i < distances[distancesIndex].data[dataIndex].length; i++) {
                        sum += distances[distancesIndex].data[dataIndex][i];
                    }
                    series[distancesIndex].data[dataIndex] = parseFloat(sum / distances[distancesIndex].data[dataIndex].length);
                }
            }
        }

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
    }
<<<<<<< HEAD
    else{
        for(var i = 0;i < hole.shots.length; i++){
            var startLat = hole.shots[i].startLatitude;
            var startLong = hole.shots[i].startLongitude;
            var aimLat = hole.shots[i].aimLatitude;
            var aimLong = hole.shots[i].aimLongitude;
            var endLat = hole.shots[i].endLatitude;
            var endLong = hole.shots[i].endLongitude;
            // gets distance
            var distance = getDistance(startLat, startLong, endLat, endLong);
            // gets club name
            var club = getClubName(hole.shots[i].club);
            shotdis[i]=distance;
            shotclub[i]=club;
            shotn[i]='shot'+i+1;
            /*shotData.push({
                shot: hole.shots[i].shotNumber,
                club: club,
                distance: distance,
            })*/
        }  
=======

    var realSeries = [];

    // loop through the series. If any item's data element is all 0s, don't add it to real series
    for (var seriesIndex = 0; seriesIndex < series.length; seriesIndex++) {
        var check = 0;
        for (var i = 0; i < 18; i++) {
            check += series[seriesIndex].data[i];
        }
        if (check != 0) 
            realSeries.push(series[seriesIndex]);
>>>>>>> Bar graph
    }

    return realSeries;
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
