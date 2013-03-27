
var rounds = localStorage.getObject('rounds');

var currentHole = 1;
var currentRound2;
var series = [];

$(document).ready(function(){
    currentRound2 = ($(".round_tabs2:first-child").attr("id")).split('_')[0];
    getData();
    
     $(".hole_tabs2 li").click(function() {
        document.getElementById("h"+currentHole).className = "";
        document.getElementById("h"+$(this).text()).className += ' selected_tab';
        currentHole = $(this).text();       
        getData(); 
    });
    
    $(".round_tabs2 li").click(function() {
        document.getElementById(currentRound2+"_2").className = "";
        document.getElementById($(this).attr('id')).className += ' selected_tab';
        currentRound2 = ($(this).attr('id')).split('_')[0];  
        getData(); 
    });
    
});


function getData(){
    
    var currentRoundObject = (rounds).filter(function(obj) { return (obj.ID == currentRound2) })[0];
    var currentHoleObject = (currentRoundObject.holes).filter(function(obj) { return (obj.holeNumber == currentHole)})[0]; 
    
    if(currentHoleObject.length == 0){
        var html = '<text x="350" y="160" font-size="17" fill="red" > -- No Data Found -- </text>\n';
        document.getElementById('container').innerHTML = '';
    }
    
    else{
        for(var i = 0; i < currentHoleObject.shots.length; i++){
            
            var distance = getDistance(
                currentHoleObject.shots[i].startLatitude,
                currentHoleObject.shots[i].startLongitude,
                currentHoleObject.shots[i].endLatitude,
                currentHoleObject.shots[i].endLongitude
            )
                
            series.push({
                name: getClubName(currentHoleObject.shots[i].club),
                data: [parseFloat(distance)]
            })
        }
        
        createBarGraph();
    }
  
}

function createBarGraph(){
    
    var chart1 = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'bar'
        },
        title: {
            text: 'Distance'
        },
        subtitle:{
            text: 'Hole ' + currentHole
        },
        xAxis: {
            categories: [' ']
        },
        yAxis: {
            title: {
                text: 'Distance (yards)'
            }
        },
        tooltip: {
            formatter: function() {
                return this.series.name + '<br><b>'+ this.y +' yards<b>';
            }
        },
         plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: series
    });
    
    // clearing global memory after graph is created
    series = [];

}