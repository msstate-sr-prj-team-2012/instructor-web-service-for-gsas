

$(document).ready(function() 
{
    $(".hole_tabs li").click(function() 
    {
        changeToHole($(this).text());
    });

    $(".round_tabs li").click(function() 
    {
        changeToRound($(this).attr('id'));
    });

    $(".view_tabs li").click(function() 
    {
        changeView($(this).attr('id'));
    });
      
});

var mapView = 'v1';
var mapHole = 1;   
var mapRound = localStorage.getObject('rounds')[0].ID;

function changeToHole(hole) 
{     
    document.getElementById("h"+mapHole).className = "";
    if(mapView === 'v1')
    {
        document.getElementById("image").src="html/content/images/holes/hole"+hole+"_map.PNG";
    }
    if(mapView === 'v2')
    {
        document.getElementById("image").src="html/content/images/holes/hole"+hole+".PNG";
    }
    document.getElementById("h"+hole).className += ' selected_tab';
    mapHole = hole;          
}


function changeToRound(rid) 
{     
    document.getElementById(mapRound).className = "";
    document.getElementById(rid).className += ' selected_tab'; 
    mapRound = rid;

}


function changeView(view) 
{     
    document.getElementById(mapView).className = "";
    if(view === 'v1')
    {
        document.getElementById("image").src="html/content/images/holes/hole"+mapHole+"_map.PNG";
    }  
    if(view === 'v2')
    {
        document.getElementById("image").src="html/content/images/holes/hole"+mapHole+".PNG";
    }
    document.getElementById(view).className += ' selected_tab'; 
    mapView = view;
}


    
/* gets current round object
var round = localStorage.getObject('rounds').filter(function(obj) { return obj.ID == mapRound; });
// do stuff 
*/