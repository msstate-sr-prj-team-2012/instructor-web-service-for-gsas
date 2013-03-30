
/****************************************************************************
 *
 * Global Variables
 *
 ****************************************************************************/

var rounds = localStorage.getObject('rounds');
var currentRound = 'all';
var clubSelection = 'All';
var clubIDs = [];
var data = [];
var series = [];

/****************************************************************************
 *
 * Functions to retreive and calculate data
 *
 ****************************************************************************/

function getData(){
    
    if(clubSelection == 'All'){ clubIDs = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]}
    if(clubSelection == 'Woods'){ clubIDs = [1,2,3,4,5,6]}
    if(clubSelection == 'Hybrids'){ clubIDs = [7,8,9,10,11]}
    if(clubSelection == 'Irons'){ clubIDs = [12,13,14,15,16,17,18,19]}
    if(clubSelection == 'Wedges'){ clubIDs = [20,21,22,23,24]}
    
    if(currentRound == 'all'){
        getAllData();
        return;
    }
    
    // filters round objects for the currentRound selected
    var currentRoundObject = (rounds).filter(function(obj) { return (obj.ID == currentRound) })[0];
    
    for(var x = 0; x < clubIDs.length; x++){
        data = [];
        for(var y = 0; y < currentRoundObject.holes.length; y++){
                var shots = (currentRoundObject.holes[y].shots).filter((function(obj) { return (obj.club == clubIDs[x])})); 

                for(var z = 0; z < shots.length; z++){
                    var point = getPlotPoint(shots[z].startLatitude, shots[z].startLongitude, 
                                             shots[z].endLatitude, shots[z].endLongitude,
                                             shots[z].aimLatitude, shots[z].aimLongitude);
                    data.push(point); 

                } // end shots loop        
        } // end holes loop       

        series.push({
            name: getClubName(clubIDs[x]),
            data: data
        })


    } // end clubs loop
    
    createScatterChart();
} // end function


function getAllData(){ 
    
    for(var v = 0; v < clubIDs.length; v++){
        data = [];
        
        for(var x = 0; x < rounds.length; x++){
            for(var y = 0; y < rounds[x].holes.length; y++){
                    var shots = (rounds[x].holes[y].shots).filter((function(obj) { return (obj.club == clubIDs[v])})); 

                    for(var z = 0; z < shots.length; z++){
                        var point = getPlotPoint(shots[z].startLatitude, shots[z].startLongitude, 
                                                 shots[z].endLatitude, shots[z].endLongitude,
                                                 shots[z].aimLatitude, shots[z].aimLongitude);
                        data.push(point); 

                    } // end shots loop        
            } // end holes loop       
        } // end rounds loop
        
        series.push({
            name: getClubName(clubIDs[v]),
            data: data
        })
        
    } // end clubs loop
    
    createScatterChart();
} // end function


/****************************************************************************
 *
 * Create Scatter Plot
 *
 ****************************************************************************/

function createScatterChart(){
         var chart1 = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                type: 'scatter',
                zoomType: 'xy'
            },
            title: {
                text: 'Spread'
            },
            subtitle: {
                text: clubSelection
            },
            yAxis: {
                title: {
                    enabled: true,
                    text: 'Distance (yards)'
                },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true
            },
            xAxis: {
                title: {
                    text: 'Angle (degrees)'
                },
                min: -70,
                max: +70
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: 10,
                y: 10,
                borderWidth: 0
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.y} yards <br> {point.x} degrees'
                    }
                }
            }, 
            series: series
        });
        
    // clearing global memory after graph is created
    series = [];
    data = [];
    clubIDs = [];
    
}


/****************************************************************************
 *
 * Create Polar Chart
 *
 ****************************************************************************/

function createPolarChart(){ 
    var chart1 = new Highcharts.Chart({
	    chart: {
                renderTo: 'container',
                type: 'scatter',
	        polar: true,
                backgroundColor: 'transparent', 
                marginTop: 10
	    },
	    title: {
	        text: 'Spread'
	    },
            subtitle: {
                text: clubSelection
            },
	    pane: {
	        startAngle: -90,
	        endAngle: 90
	    },
            legend: {
                layout: 'vertical',
                verticalAlign: 'top',
                borderWidth: 0,
                x: 350
            },
	    xAxis: {
	        tickInterval: 15,
	        min: -90,
	        max: 90,
	        labels: {
                    formatter: function () {
                            return this.value;
                    }
	        }
	    },
	    yAxis: {
	        min: 0,
                max: 350,
                labels: {
                    formatter: function () {
                            return '';
                    }
                }
	    },
	    plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.y} yards <br> {point.x} degrees'
                    }
                }
            },
	  
	    series: series
	});
        
    // clearing global memory after graph is created
    series = [];
    data = [];
    clubIDs = [];
}

/****************************************************************************
 *
 * Finds angle, distances, and compares direction between start/end and start/aim
 *
 ****************************************************************************/

function getPlotPoint(startLat, startLon, endLat, endLon, aimLat, aimLon){
    
    // calculate magnitudes and use to find angle
    var P12 = getDistance(startLat, startLon, endLat, endLon);
    var P13 = getDistance(startLat, startLon, aimLat, aimLon);
    var P23 = getDistance(aimLat, aimLon, endLat, endLon);
    var angle = Math.acos((Math.pow(P12,2) + Math.pow(P13, 2) - Math.pow(P23,2))/(2 * P12 * P13)) * (180.0 / Math.PI);  

    // use bearings to determine hook or slice, angle is negative for slice (left)
    var aimBearing = Math.atan(P12) * (180.0 / Math.PI); 
    var endBearing = Math.atan(P13) * (180.0 / Math.PI);
    if(endBearing < aimBearing){ angle = -angle; }
    
    // [ angle, distance from start to end]
    var point = [parseFloat(angle.toFixed(2)), parseFloat(P12)];
    return point; 
}

/****************************************************************************
 *
 * Event Handlers
 *
 ****************************************************************************/

$(document).ready(function(){

    getData(); // default chart is all clubs and all rounds

    $(".round_tabs li").click(function() {
        document.getElementById(currentRound).className = "";
        document.getElementById($(this).attr('id')).className += ' selected_tab'; 
        currentRound = $(this).attr('id');
        getData();
    });

    $(".view_tabs li").click(function() {
        document.getElementById(clubSelection).className = "";
        document.getElementById($(this).attr('id')).className += ' selected_tab'; 
        clubSelection = $(this).attr('id');
        getData();
    });       

})
