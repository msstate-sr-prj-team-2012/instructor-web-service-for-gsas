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
    var tags = new Array("shot 1", "shot 2", "shot 3", "shot 4","hot 5")
    var values = new Array("55", "80", "95", "32","900")
    basicbargraph(tags,values);
    document.getElementById(mapRound).className += ' selected_tab';
});
        
 function basicbargraph(tags, value) {
    var length = 200;
    var html;

    for (i = 0; i < tags.length; i++) {
        html+= '<div style="font-size: 10pt; color: #AAAAAA;">' + tags[i] + ': </div><div style="font-size:0 1pt; color: #AAAAAA;"><img src="pixel.jpg" width="' + value[i] / 100 * length + '" height="15" border="1" style="border-color: #00AA00"> ' + value[i] + 'Yards</div>';
    }
    document.getElemenById('map_image').innerHTML = html;
}     
function graph2(tags, value) {
    var hi = 200;
    var wi = 40;
    var ddds;
    html+= ' <p> ';
    for (i = 0; i < tags.length; i++) {
        html+= value[i]+' yards ';
    }
    html+= '<div> </div> </p>';
    for (i = 0; i < tags.length; i++) {
    ddds=hi-value[i];
        html+= '<svg height="' + hi + '" width="' + wi + '"><rect id="redrect' + i + '"  width="20" height="' + value[i] + '"fill="red" y="'+ddds+'" /> </svg>';
    }
   html+= '<div> </div> <p> ';
    for (i = 0; i < tags.length; i++) {
        html+= tags[i]+' ';
    }
    html+= ' </p>';
    document.getElementById('map_image').innerHTML = html;
}
      
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
	var shottotal=0;
        var arrayofdistances="";
        var arrayofshots="";
	//Loop through each round
	for(i = 0;i < rounds.length; i++)
    {
		
		//loop through each hole
		for(var h = 0; h < rounds[i].holes.length; h++)
		{
			//loop through each shot
			for(var j = 0; j < rounds[i].holes[h].shots.length; j++)
			{
				var startLat = parseFloat(rounds[i].holes[h].shots[j].startLatitude);
				var startLong = parseFloat(rounds[i].holes[h].shots[j].startLongitude);
				var aimLat = parseFloat(rounds[i].holes[h].shots[j].aimLatitude);
				var aimLong = parseFloat(rounds[i].holes[h].shots[j].aimLongitude);
				var endLat = parseFloat(rounds[i].holes[h].shots[j].endLatitude);
				var endLong = parseFloat(rounds[i].holes[h].shots[j].endLongitude);
				
				var distance = convertGPStoYards(startLat, startLong, endLat, endLong);
                                arrayofdistances[shottotal]=distance;
                                arrayofshots[shottotal]=shottotal+1;
                                shottotal=shottotal+1;
                            }
                        }
	}
        return arrayofdistances, arrayofshots;
}
function convertGPStoYards(lat1, long1, lat2, long2)
{
    var dLat = (lat2 - lat1)*(Math.PI / 180);
    var dLong = (long2 - long1)*(Math.PI / 180);
    var a = Math.pow(Math.sin(dLat/2),2) + Math.cos(lat1) + Math.cos(lat2) + Math.pow(Math.sin(dLong/2),2);
    var c = 2 * Math.atan(Math.sqrt(a), Math.sqrt(1 - a));
    
    return Math.round(6967420.2 * c).toFixed(2);
}
function convertGPStoYards(lat1, long1, lat2, long2)
{
    var dLat = (lat2 - lat1)*(Math.PI / 180);
    var dLong = (long2 - long1)*(Math.PI / 180);
    var a = Math.pow(Math.sin(dLat/2),2) + Math.cos(lat1) + Math.cos(lat2) + Math.pow(Math.sin(dLong/2),2);
    var c = 2 * Math.atan(Math.sqrt(a), Math.sqrt(1 - a));
    
    return Math.round(6967420.2 * c).toFixed(2);
}
function convertGPStoYardsLat(lat1,lat2)
{
    var dLat = 13950131.0*(lat2 - lat1/2);
    return dLat;
}
function convertGPStoYardslong(lat1, long1, lat2, long2)
{
    var dlonggps = 13950131.0*Math.asin(Math.sqrt(Math.cos(lat2) * Math.cos(lat1))*Math.pow( Math.sin( ( long1 - long2)/2)),2);
    
    return dlonggps;
}