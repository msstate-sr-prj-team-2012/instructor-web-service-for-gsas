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

function getDistanceData()
{
	currentRound = 0;
	currentHole = 0;
	
	//Loop through each round
	for(i = 0;i < rounds.length; i++)
    {
		
		//loop through each hole
		for(var h = 0; h < rounds[i].holes.length; h++)
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