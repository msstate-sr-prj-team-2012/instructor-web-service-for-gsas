

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
      
    createHoleTabs();
});

var currentView = 'v1';
var currentHole = 1;   
var currentRound = localStorage.getObject('rounds')[0].ID;

function changeToHole(hole) 
{     
    document.getElementById("h"+currentHole).className = "";
    if(currentView === 'v1')
    {
        $(".map_content").css("background","url(\"html/content/images/holes/hole" +hole+ "_map.PNG\")");
    }
    if(currentView === 'v2')
    {
        $(".map_content").css("background","url(\"html/content/images/holes/hole" +hole+ ".PNG\")");
    }
    document.getElementById("h"+hole).className += ' selected_tab';
    currentHole = hole;          
}


function changeToRound(rid) 
{     
    document.getElementById(currentRound).className = "";
    document.getElementById(rid).className += ' selected_tab'; 
    currentRound = rid;

}


function changeView(view) 
{     
    document.getElementById(currentView).className = "";
    if(view === 'v1')
    {
        $(".map_content").css("background","url(\"html/content/images/holes/hole" +currentHole+ "_map.PNG\")");
    }  
    if(view === 'v2')
    {
        $(".map_content").css("background","url(\"html/content/images/holes/hole" +currentHole+ ".PNG\")");
    }
    document.getElementById(view).className += ' selected_tab'; 
    currentView = view;
}

    
    
   
function getShotData()
{
    var round = localStorage.getObject('rounds').filter(function(obj) { return obj.ID === currentRound; });
    
    for(var i = 0; i < round.holes[currentHole].shots.length; i++)
    {
        var startLat = round.holes[currentHole].shots[i].startLatitude;
        var startLong = round.holes[currentHole].shots[i].startLongitude;
        var endLat = round.holes[currentHole].shots[i].endLatitude;
        var endLong = round.holes[currentHole].shots[i].endLongitude;
        var club = round.holes[currentHole].shots[i].club;
        
        convertGPStoPixels(startLat, startLong, endLat, endLong);
        convertGPStoYards(startLat, startLong, endLat, endLong);
    }
}



function convertGPStoPixels(startLat, startLong, endLat, endLong)
{
    var startX;
    var startY;
    var endX;
    var endY;
    drawShape(startX, startY, club);
    drawLine(startX, startY, endX, endY);
}


function drawShape(X1, Y1, X2, Y2, club)
{
    var color;
    var clubName = getClubName(club);
    var distance;
    
    // draw line between two points
    var html = "<line x1='" +X1+ "' y1='" +Y1+ "' x2='" +X2+ "' y2='" +Y2+ "' stroke='black' stroke-width='2' />\n";
    
    // draw triangle with the appropriate color
    if(club >= 1 && club <= 6)
    {
        if (club === 1) color = 'red';
        else if (club === 2) color = 'green';
        else if (club === 3) color = 'blue';
        else if (club === 4) color = 'orange';
        else if (club === 5) color = 'purple';
        else if (club === 6) color = 'lightblue';
        
        // points='topX,topY rightX,rightY leftX,leftY'  
        // drawn centered on the point with a 6px difference in each direction
        html += "<polygon points='" +X1+ "," +(Y1-6)+ " "+(X1+6)+","+(Y1+6)+" "+(X1-6)+","+(Y1+6)+"' stroke='" +color+ "' stroke-width='2' fill='white' >\n" +
                    "<title> Club: " +clubName+ " <br/> Distance: " +distance+ " </title>\n" +
                "</polygon>\n";
        
    }
    
    // draw square with the appropriate color
    else if (club >= 7 && club <= 9)
    {
        if (club === 7) color = 'red';
        else if (club === 8) color = 'green';
        else if (club === 9) color = 'blue';
        else if (club === 10) color = 'orange';
        else if (club === 11) color = 'purple';
        
        html += "<rect x='" +X1+ "' y='" +Y1+ "' width='10' height='10' stroke='" +color+ "' stroke-width='2' fill='white' >\n" +
                    "<title> Club: " +clubName+ " <br/> Distance: " +distance+ " </title>\n" +
                "</rect>\n";
    }
    
    // draw circle with the appropriate color
    else if (club >= 12 && club <= 19)
    {
        if (club === 12) color = 'red';
        else if (club === 13) color = 'green';
        else if (club === 14) color = 'blue';
        else if (club === 15) color = 'orange';
        else if (club === 16) color = 'purple';
        else if (club === 17) color = 'lightblue';
        else if (club === 18) color = 'pink';
        else if (club === 19) color = 'brown';
        
        html += "<circle cx='" +X1+ "' cy='" +Y1+ "' r='5' stroke='" +color+ "' stroke-width='2' fill='white' >" +
                    "<title> Club: " +clubName+ " <br/> Distance: " +distance+ " </title>\n" +
                "</circle>\n";
            
    }
    
    // draw diamond with the approriate color
    else if (club >= 20 && club <=24)
    {
        if (club === 20) color = 'red';
        else if (club === 21) color = 'green';
        else if (club === 22) color = 'blue';
        else if (club === 23) color = 'orange';
        else if (club === 24) color = 'purple';
        
        // points='topX,topY rightX,rightY bottomX,bottomY leftX,leftY'
        // diamond centered on point with 6px difference in each direction
        html += "<polygon points='"+X1+","+(Y1-6)+" "+(X1+6)+","+Y1+" "+X1+","+(Y1+6)+" "+(X1-6)+","+Y1+"' stroke='" +color+ "' stroke-width='2' fill='white' >\n" +
                    "<title> Club: " +clubName+ " <br/> Distance: " +distance+ " </title>\n" +
                "</polygon>\n";
        
    }
} // end draw shape


function getClubName(id)
{
    if(id === 1) return 'driver';
    else if(id === 2) return '3 wood';
    else if(id === 3) return '4 wood';
    else if(id === 4) return '5 wood';
    else if(id === 5) return '7 wood';
    else if(id === 6) return '9 wood';
    else if(id === 7) return '2 hybrid';
    else if(id === 8) return '3 hybrid';
    else if(id === 9) return '4 hybrid';
    else if(id === 10) return '5 hybrid';
    else if(id === 11) return '6 hybrid';
    else if(id === 12) return '2 iron';
    else if(id === 13) return '3 iron';
    else if(id === 14) return '4 iron';
    else if(id === 15) return '5 iron';
    else if(id === 16) return '6 iron';
    else if(id === 17) return '8 iron';
    else if(id === 18) return '8 iron';
    else if(id === 19) return '9 iron';
    else if(id === 20) return 'pitching wedge';
    else if(id === 21) return 'approach wedge';
    else if(id === 22) return 'sand wedge';
    else if(id === 23) return 'lob wedge';
    else if(id === 24) return 'high lob wedge';
    else return 'unknown';
}


function convertGPStoYards(lat1, long1, lat2, long2)
{
    var dLat = (lat2 - lat1)*(Math.PI / 180);
    var dLong = (long2 - long1)*(Math.PI / 180);
    var a = Math.pow(Math.sin(dLat/2),2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dLong/2),2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return (6967420.2 * c).toFixed(2);
}


//function createHoleTabs()
//{
//    var rounds = localStorage.getObject('rounds');
//    var html = '<ul>\n';
//    html += "<li id='h1' class='selected_tab'>" + 1 + "</li>\n";
//    for(var i = 1; i < rounds[currentRound].holes.length ; i++)
//    {
//        html += "<li id='h"+(i+1)+"'>" + (i+1) + "</li>\n";
//    }
//    html += "</ul>\n";
//    document.getElementsByClassName("hole_tabs")[0].innerHTML = html;
//}