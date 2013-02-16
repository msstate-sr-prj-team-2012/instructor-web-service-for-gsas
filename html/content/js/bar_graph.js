//get all rounds
var rounds = localStorage.getObject('rounds');
    
$(document).ready(function() 
{
    $(".view_tabs li").click(function() 
    {
        myToggle($(this).attr('id'));
    });
    
    $(".round_tabs li").click(function() 
    {
        changeToRound($(this).attr('id'));
    });
    
    document.getElementById(mapRound).className += ' selected_tab';
	
	var chartHybrid = new Highcharts.Chart({
                    chart: {
                        renderTo: "graphContainer",
                        type: "column"
                    },
                    title: {
                        text: "Average Distance by Hole"
                    },
                    xAxis: {
                        categories: [
                            "Hole 1",
                            "Hole 2",
                            "Hole 3",
                            "Hole 4",
                            "Hole 5",
                            "Hole 6",
                            "Hole 7",
                            "Hole 8",
                            "Hole 9",
                            "Hole 10",
                            "Hole 11",
							"Hole 12",
							"Hole 13",
							"Hole 14",
							"Hole 15",
							"Hole 16",
							"Hole 17",
                            "Hole 18"
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: "Distance (yards)"
                        }
                    },
                    legend: {
                        layout: "vertical",
                        backgroundColor: "#FFFFFF",
                        align: "left",
                        verticalAlign: "top",
                        x: 100,
                        y: 25,
                        floating: true,
                        shadow: true
                    },
                    tooltip: {
                        formatter: function() {
                            return ""+
                                this.x +": "+ this.y +" yards";
                        }
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                        series: hybrids
                });
});
        
       
      
var graphView = 'v1';
var mapRound = localStorage.getObject('rounds')[0].rid;

function changeView(view)
{
    document.getElementById(graphView).className = ""; 
    document.getElementById(view).className += ' selected_tab'; 
    graphView = view;
}       

function changeToRound(rid) 
{     
    document.getElementById(mapRound).className = "";
    document.getElementById(rid).className += ' selected_tab'; 
    mapRound = rid;
}

function myToggle(id)
{
    changeView(id);
    
    if(id === 'v1')
    {
			
            $("#containerWood").show();
			
    }
    else if(id === 'v2')
    {
            $("#containerHybrid").show();
    }
    else if(id === 'v3')
    {
            $("#containerIron").show();
    }
    else if(id === 'v4')
    {
            $("#containerWedge").show();
    }
}

function getDistanceData(shots, clubName)
{
	currentRound = 0;
	currentHole = 0;
	
	//Loop through each round
	for(i = 0;i < rounds.length; i++)
    {
		
		//loop through each hole
		for(int h = 0; h < rounds[i].holes.length; h++)
		{
			//loop through each shot
			for(int j = 0; j < rounds[i].holes[h].shots.length; j++)
			{
				var startLat = parseFloat(rounds[i].holes[h].shots[j].startLatitude);
				var startLong = parseFloat(rounds[i].holes[h].shots[j].startLongitude);
				var aimLat = parseFloat(rounds[i].holes[h].shots[j].aimLatitude);
				var aimLong = parseFloat(rounds[i].holes[h].shots[j].aimLongitude);
				var endLat = parseFloat(rounds[i].holes[h].shots[j].endLatitude);
				var endLong = parseFloat(rounds[i].holes[h].shots[j].endLongitude);
				
				var distance = convertGPStoYards(startLat, startLong, endLat, endLong);
		}
	}
}
function convertGPStoYards(lat1, long1, lat2, long2)
{
    var dLat = (lat2 - lat1)*(Math.PI / 180);
    var dLong = (long2 - long1)*(Math.PI / 180);
    var a = Math.pow(Math.sin(dLat/2),2) + Math.cos(lat1) + Math.cos(lat2) + Math.pow(Math.sin(dLong/2),2);
    var c = 2 * Math.atan(Math.sqrt(a), Math.sqrt(1 - a));
    
    return Math.round(6967420.2 * c).toFixed(2);
}