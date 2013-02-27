
/****************************************************************************
 *
 * Global Variables
 *
 ****************************************************************************/

var EARTH_RADIUS_IN_YARDS = 13950131.0 / 2; 
var currentView = 'v1';
var currentHole = 0;   
var round = localStorage.getObject('rounds')[0];
var hole;
var html;


/****************************************************************************
 *
 * Degree/Radian conversion functions
 *
 ****************************************************************************/

function deg2rad(deg){
    deg.lat = (deg.lat * (Math.PI / 180.0));
    deg.lon = (deg.lon * (Math.PI / 180.0));
    return deg;
}

function rad2deg(rad){
    rad.lat = (rad.lat * (180.0 / Math.PI));
    rad.lon = (rad.lon * (180.0 / Math.PI));
    return rad;
}


/****************************************************************************
 *
 * Haversine 
 *
 ****************************************************************************/

function distanceInLat(pair1, pair2){
    return 2 * EARTH_RADIUS_IN_YARDS * ((pair1.lat - pair2.lat)/2);
}

function distanceInLon(pair1, pair2){
    return 2 * EARTH_RADIUS_IN_YARDS * Math.asin( Math.sqrt( Math.cos(pair1.lat) * Math.cos(pair2.lat) * Math.pow( Math.sin( (pair1.lon - pair2.lon)/2 ), 2) ) ); 
}

function distanceInLatLon(pair1, pair2){
    return 2 * EARTH_RADIUS_IN_YARDS * Math.asin( Math.sqrt( Math.pow( Math.sin( (pair1.lat - pair2.lat)/2 ), 2) + Math.cos(pair1.lat) * Math.cos(pair2.lat) * Math.pow( Math.sin( (pair1.lon - pair2.lon)/2 ), 2) ) );
}

function distanceInX(pair1, pair2){
    return pair1.x - pair2.x;
}

function distanceInY(pair1, pair2){
    return pair1.y - pair2.y;
}

function distanceInXY(pair1, pair2){
    return Math.sqrt( Math.pow(distanceInX(pair1,pair2), 2) + Math.pow(distanceInY(pair1, pair2), 2));
}


/****************************************************************************
 *
 * Trig Functions
 *
 ****************************************************************************/

// Angle Identities
function sinPixel(point1, point2){
    return distanceInY(point2, point1) / distanceInXY(point2, point1);
}

function cosPixel(point1, point2){
    return distanceInX(point2,point1) / distanceInXY(point2, point1);
}

function sinGPS(point1, point2){
    return distanceInLat(point2, point1) / distanceInLatLon(point2, point1);
}

function cosGPS(point1, point2){
    return distanceInLon(point2, point1) / distanceInLatLon(point2,point1);
}

// Sum/Difference Formulas
function sinLLplusXY(sinLL, cosLL, sinXY, cosXY){
    return sinLL*cosXY + cosLL*sinXY;
}

function sinLLminusXY(sinLL, cosLL, sinXY, cosXY){
    return sinLL*cosXY - cosLL*sinXY;
}

function cosLLplusXY(sinLL, cosLL, sinXY, cosXY){
    return cosLL*cosXY - sinLL*sinXY;
}

function cosLLminusXY(sinLL, cosLL, sinXY, cosXY){
    return cosLL*cosXY + sinLL*sinXY;
}


/****************************************************************************
 *
 * Scale Function
 *
 ****************************************************************************/

function getFlatEarthScale(TeeXY, TeeLLRadFlat, CenterXY, CenterLLRadFlat){
    var scaleX = distanceInX(CenterLLRadFlat, TeeLLRadFlat) / distanceInX(CenterXY, TeeXY);
    var scaleY = distanceInY(CenterLLRadFlat, TeeLLRadFlat) / distanceInY(CenterXY, TeeXY);
    
    var temp = {x:scaleX, y:scaleY};
    return temp;
}


/****************************************************************************
 *
 * Angle of Rotation
 *
 ****************************************************************************/

function angleOfRotation(TeeXY, CenterXY, TeeLLRad, CenterLLRad){
    var sinXY = sinPixel(TeeXY, CenterXY); 
    var cosXY = cosPixel(TeeXY, CenterXY); 
    var sinLL = sinGPS(TeeLLRad, CenterLLRad); 
    var cosLL = cosGPS(TeeLLRad, CenterLLRad); 
    var sinRot = sinLLminusXY(sinLL, cosLL, sinXY, cosXY); 
    var cosRot = cosLLminusXY(sinLL, cosLL, sinXY, cosXY);
    var sinRotation = Math.asin(sinRot); 
    var cosRotation = Math.acos(cosRot); 
    
    var temp = {sinRot: sinRotation, cosRot: cosRotation}; 
    return temp;
}


/****************************************************************************
 *
 * Conversion Functions Needed To Measure Rotations and Scale
 *
 ****************************************************************************/

function convertXY0toXY1(xy, height){
    var temp = {
            x: xy.x,
            y: (height - xy.y)
    };
    return temp;
}

function convertXY1toXY2(xy, angle){
    var temp = {
            x: (xy.x * Math.cos(angle.sinRot) - xy.y * Math.sin(angle.cosRot)),
            y: (xy.x * Math.sin(angle.sinRot) - xy.y * Math.cos(angle.cosRot))
    };
    return temp;
}


/****************************************************************************
 *
 * Conversion Functions For GPS to Pixels
 *
 ****************************************************************************/

function scaleConvert(locationLL, CenterXY, CenterLLRadFlat, scaleFlat){
    var locationX = (((locationLL.lon - CenterLLRadFlat.x)) / scaleFlat.x) + CenterXY.x;
    var locationY = (((locationLL.lat - CenterLLRadFlat.y)) / scaleFlat.y) + CenterXY.y;
    
    var temp = { x: locationX, y: locationY};
    return temp;
}    

function convertXY2toXY1(xy, angle){
    var y = ((Math.sin(angle.sinRot)*xy.x) - (Math.cos(angle.sinRot)*xy.y)) / ((Math.cos(angle.sinRot)*Math.cos(angle.cosRot)) - (Math.sin(angle.cosRot)*Math.sin(angle.sinRot)));
    var temp = {
            x: ((xy.x + (y * Math.sin(angle.cosRot))) / Math.cos(angle.sinRot)),
            y: y
    };
    return temp;
}

function convertXY1toXY0(xy){
    var temp = { 
        x: xy.y, 
        y: xy.x
    };
    return temp;
}


/****************************************************************************
 *
 * Functions which set the view, round, and hole values
 *
 ****************************************************************************/

function changeToHole(hole) {     
    document.getElementById("h"+(currentHole+1)).className = "";
    if(currentView === 'v1'){
        $(".map_content").css("background","url(\"html/content/images/holes/hole" +hole+ "_map.PNG\")");
    }
    if(currentView === 'v2'){
        $(".map_content").css("background","url(\"html/content/images/holes/hole" +hole+ ".PNG\")");
    }
    document.getElementById("h"+hole).className += ' selected_tab';
    currentHole = hole - 1;          
}

function changeToRound(id) {     
    document.getElementById(round.ID).className = ""; 
    document.getElementById(id).className += ' selected_tab'; 
    // filters localStorage for new round object 
    round = localStorage.getObject('rounds').filter(function(obj) { return (obj.ID == id) })[0]; 
}

function changeView(view) {     
    document.getElementById(currentView).className = "";
    if(view === 'v1'){
        $(".map_content").css("background","url(\"html/content/images/holes/hole" +(currentHole+1)+ "_map.PNG\")");
    }  
    if(view === 'v2'){
        $(".map_content").css("background","url(\"html/content/images/holes/hole" +(currentHole+1)+ ".PNG\")");
    }
    document.getElementById(view).className += ' selected_tab'; 
    currentView = view;
}


/****************************************************************************
 *
 * Functions to draw the coordinates
 *
 ****************************************************************************/

// retrieves data, runs conversion, draws data to screen
function drawData(){
    html = "<svg>"; 
    // filters round object for currentHole
    hole = (round.holes).filter(function(obj) { return (obj.holeNumber == currentHole) })[0];
    // shows message if no data
    if(hole === undefined || hole.shots.length === 0){
        html += '<text x="260" y="160" font-size="20" fill="red" > No Shot Data For This Hole </text>';
        $('.map_content').css('background', '#fff');
        document.getElementById('par').innerHTML = '';
    }
    // iterates through shots of the current hole
    else{    
        for (var i = 0; i < hole.shots.length; i++){ 
          var startLocationXY = main(hole.shots[i].startLatitude, hole.shots[i].startLongitude);
          var endLocationXY = main(hole.shots[i].endLatitude, hole.shots[i].endLongitude);
          var distance = getDistance(hole.shots[i].startLatitude, hole.shots[i].startLongitude, hole.shots[i].endLatitude, hole.shots[i].endLongitude);
          drawShape(startLocationXY, endLocationXY, hole.shots[i].club, distance, round.startTime);
        }
                  
          document.getElementById('par').innerHTML =
            "<ul>\n" +
                "<li>par: <span>" +round.holes[currentHole].par+ "</span></li>\n" +
                "<li>score: <span>" +round.holes[currentHole].holeScore+ "</span></li>\n" +
            "</ul>\n";
    }
    
    html += "</svg>";     
    document.getElementById('svg').innerHTML = html;   
}
      
function drawShape(start, end, club, distance, startTime){
    var color;
    var clubName = getClubName(club);
    // draw line between two points
    html += "<line x1='" +start.x+ "' y1='" +start.y+ "' x2='" +end.x+ "' y2='" +end.y+ "' stroke='black' stroke-width='2'>\n" +
                "<title> Date: " + startTime.split(' ')[0] + "<br/> Time: " + startTime.split(' ')[1] + " </title>\n" +
            "</line>\n";

    // draw triangle with the appropriate color
    if(club >= 1 && club <= 6){
        if (club === 1) color = 'red';
        else if (club === 2) color = 'green';
        else if (club === 3) color = 'blue';
        else if (club === 4) color = 'orange';
        else if (club === 5) color = 'purple';
        else if (club === 6) color = 'lightblue';

        // points='topX,topY rightX,rightY leftX,leftY'  
        // drawn centered on the point with a 6px difference in each direction
        html += "<polygon points='" +start.x+ "," +(start.y-6)+ " "+(start.x+6)+","+(start.y+6)+" "+(start.x-6)+","+(start.y+6)+"' stroke='" +color+ "' stroke-width='2' fill='white' >\n" +
                    "<title> Club: " +clubName+ " <br/> Distance: " +distance+ " yards</title>\n" +
                "</polygon>\n";
    }

    // draw square with the appropriate color
    else if (club >= 7 && club <= 9){
        if (club === 7) color = 'red';
        else if (club === 8) color = 'green';
        else if (club === 9) color = 'blue';
        else if (club === 10) color = 'orange';
        else if (club === 11) color = 'purple';

        html += "<rect x='" +start.x+ "' y='" +start.y+ "' width='10' height='10' stroke='" +color+ "' stroke-width='2' fill='white' >\n" +
                    "<title> Club: " +clubName+ " <br/> Distance: " +distance+ " yards</title>\n" +
                "</rect>\n";
    }

    // draw circle with the appropriate color
    else if (club >= 12 && club <= 19){
        if (club === 12) color = 'red';
        else if (club === 13) color = 'green';
        else if (club === 14) color = 'blue';
        else if (club === 15) color = 'orange';
        else if (club === 16) color = 'purple';
        else if (club === 17) color = 'lightblue';
        else if (club === 18) color = 'pink';
        else if (club === 19) color = 'brown';

        html += "<circle cx='" +start.x+ "' cy='" +start.y+ "' r='5' stroke='" +color+ "' stroke-width='2' fill='white' >" +
                    "<title> Club: " +clubName+ " <br/> Distance: " +distance+ " yards</title>\n" +
                "</circle>\n";
    }

    // draw diamond with the approriate color
    else if (club >= 20 && club <=24){
        if (club === 20) color = 'red';
        else if (club === 21) color = 'green';
        else if (club === 22) color = 'blue';
        else if (club === 23) color = 'orange';
        else if (club === 24) color = 'purple';

        // points='topX,topY rightX,rightY bottomX,bottomY leftX,leftY'
        // diamond centered on point with 6px difference in each direction
        html += "<polygon points='"+start.x+","+(start.y-6)+" "+(start.x+6)+","+start.y+" "+start.x+","+(start.y+6)+" "+(start.x-6)+","+start.y+"' stroke='" +color+ "' stroke-width='2' fill='white' >\n" +
                    "<title> Club: " +clubName+ " <br/> Distance: " +distance+ " yards</title>\n" +
                "</polygon>\n";
    }
} // end draw shape


/****************************************************************************
 *
 * Retreive club name and distance functions
 *
 ****************************************************************************/

function getClubName(id){
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

function getDistance(startLat, startLon, endLat, endLon){
    var dLat = (endLat - startLat) * (Math.PI / 180.0);
    var dLon = (endLon - startLon) * (Math.PI / 180.0);
    var lat1 = startLat * (Math.PI / 180.0);
    var lat2 = endLat * (Math.PI / 180.0);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (EARTH_RADIUS_IN_YARDS * c).toFixed(2);
}


/****************************************************************************
 *
 * Main Function to run conversion
 *
 ****************************************************************************/

function main(latitude, longitude){    
    // known location gps
    var LocationLLDeg = {
        lat: latitude,
        lon: longitude      
    };
    var LocationLLRad = deg2rad(LocationLLDeg); 
    
    // known tee point/gps
    var TeeXY0 = { 
        x: hole.firstRefX, 
        y: hole.firstRefY
    }; 
    var TeeLLDeg = { 
        lat: hole.firstRefLat, 
        lon: hole.firstRefLong 
    }; 
    var TeeLLRad = deg2rad(TeeLLDeg); 
    var TeeLLRadFlat = { x: TeeLLRad.lon, y: TeeLLRad.lat };

    // known green point/gps
    var CenterXY0 = {
        x: hole.secondRefX,
        y: hole.secondRefY
    };
    var CenterLLDeg = {
        lat: hole.secondRefLat,
        lon: hole.secondRefLong
    };  
    var CenterLLRad = deg2rad(CenterLLDeg);  
    var CenterLLRadFlat = { x: CenterLLRad.lon, y: CenterLLRad.lat };

    // invert coordinate system with image size
    var height = 800;
    var TeeXY1 = convertXY0toXY1(TeeXY0, height); 
    var CenterXY1 = convertXY0toXY1(CenterXY0, height); 
    
    // rotate coordinate system to point north
    var rotation = angleOfRotation(TeeXY1, CenterXY1, TeeLLRad, CenterLLRad);
    var TeeXY2 = convertXY1toXY2(TeeXY1, rotation); 
    var CenterXY2 = convertXY1toXY2(CenterXY1, rotation); 
    
    // use new points to calculate the scale
    var flatEarthScale = getFlatEarthScale(TeeXY2, TeeLLRadFlat, CenterXY2, CenterLLRadFlat);  
    
    // convert gps coordinates to pixel location (1. scale, 2. rotation, 3. invert)
    var LocationXY2 = scaleConvert(LocationLLRad, CenterXY2, CenterLLRadFlat, flatEarthScale);
    var LocationXY1 = convertXY2toXY1(LocationXY2, rotation);
    var LocationXY0 = convertXY1toXY0(LocationXY1);
    
    return LocationXY0; 
}


/****************************************************************************
 *
 * Event handlers for tabs and redraws data
 *
 ****************************************************************************/

$(document).ready(function() {   
    drawData();
    
    $(".hole_tabs li").click(function() {
        changeToHole($(this).text());
        drawData(); 
    });

    $(".round_tabs li").click(function() {
        changeToRound($(this).attr('id'));
        drawData();
    });

    $(".view_tabs li").click(function() {
        changeView($(this).attr('id'));
        drawData();
    });            
});

