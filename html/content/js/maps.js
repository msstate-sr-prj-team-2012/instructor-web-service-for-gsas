

$(document).ready(function() {
    $(".hole_tabs li").click(function() {
        changeToHole($(this).text());
    });

     $(".round_tabs li").click(function() {
        changeToRound($(this).text());
    });

     $(".view_tabs li").click(function() {
        changeView($(this).text());
    });
});


var mapHole = 1;   
var mapRound = 1;
var mapView = 1;

function changeToHole(hole) 
{     
    document.getElementById("h"+mapHole).className = "";
    if(mapView == 1)
    {
        document.getElementById("image").src="images/holes/hole"+hole+"_map.PNG";
    }
    if(mapView == 2)
    {
        document.getElementById("image").src="images/holes/hole"+hole+".PNG";
    }
    document.getElementById("h"+hole).className += ' selected_tab';
    mapHole = hole;          
}

function changeToRound(round) 
{     
    document.getElementById("r"+mapRound).className = "";
    document.getElementById("r"+round).className += ' selected_tab'; 
    mapRound = round;
}

function changeView(view) 
{     
    document.getElementById("v"+mapView).className = "";
    if(view == 'satellite')
    {
        view = 1;
        document.getElementById("image").src="images/holes/hole"+mapHole+"_map.PNG";
    }  
    if(view == 'drawing')
    {
        view = 2;
        document.getElementById("image").src="images/holes/hole"+mapHole+".PNG";
    }
    document.getElementById("v"+view).className += ' selected_tab'; 
    mapView = view;
}
