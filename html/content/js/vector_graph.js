var currentRound = 0;
var currentHole = 0;
var currentClub = 0;
var currentShot = 1;
var selectedHView;
var selectedHole = 0;
var html;
var rounds = localStorage.getObject('rounds');
var inc = 1;
var hole;
var Shots = 0;
//var club = 1;

function convertGPStoYards(lat1, long1, lat2, long2)
{
    var dLat = (lat2 - lat1)*(Math.PI / 180);
    var dLong = (long2 - long1)*(Math.PI / 180);
    var a = Math.pow(Math.sin(dLat/2),2) + Math.cos(lat1) + Math.cos(lat2) + Math.pow(Math.sin(dLong/2),2);
    var c = 2 * Math.atan(Math.sqrt(a), Math.sqrt(1 - a));
    
    return Math.round(6967420.2 * c).toFixed(2);
}

/****************************************************************************
 *
 * Draw the Scaled Ending Location of each shot
 *
 ****************************************************************************/
function drawLine()
{

    var shotArray = [];
    var color;

    html = "<svg>\n";

     html += "<ellipse cx= '283' cy= '350'  rx= '283' ry='325' stroke= 'black'\n ";
     html += "stroke-width= '2' fill= '#F4F4F4'>\n";
     html += "</ellipse>\n\n";

    html+="<text x=270 y=20 fill=black>AIM</text>";

    html += "<line x1 = '283'  y1= '25' x2= '283' y2= '350' \n ";
    html += "stroke='black' stroke-width='2'>\n";
    html += "<title> Aim </title>\n";
    html += "</line>\n\n";

    html += "<line x1 = '283'  y1= '25' x2= '273' y2= '45' \n ";
    html += "stroke='black' stroke-width='2'>\n";
    html += "<title> Aim </title>\n";
    html += "</line>\n\n";

    html += "<line x1 = '283'  y1= '25' x2= '293' y2= '45' \n ";
    html += "stroke='black' stroke-width='2'>\n";
    html += "<title> Aim </title>\n";
    html += "</line>\n\n";

    html += "<line x1 = '566'  y1= '0' x2= '566' y2= '350' \n ";
    html += "stroke='black' stroke-width='1'>\n";
    html += "<title> Aim </title>\n";
    html += "</line>\n\n";
    
     html += "<circle cx= '283' cy= '350' r= '5' stroke= 'black'\n ";
     html += "stroke-width= '2' fill= 'black'>\n";
     html += "</circle>\n\n";
     
    for (var i = 0; i < rounds.length; i++) {

        var holeObject = (rounds[i].holes).filter(function(obj) {
            return (obj.holeNumber === currentHole);
        })[0];

        if (holeObject !== undefined) {

            var shotObject = (holeObject.shots).filter(function(obj) {
                return (obj.shotNumber === currentShot);
            })[0];

            if (shotObject !== undefined)
            {
                shotArray.push(shotObject);
            }
        }
    }
    if (shotArray !== 0)
    {
        for (var j = 0; j < shotArray.length; j++)
        {
            var club = shotArray[j].club;
			var clubX;
            var clubY;
            var color = 'white';
			
			var avrgAimDist = 0;
			var avrgEndDist = 0;
			
            var startLat = shotArray[j].startLatitude;
            var startLon = shotArray[j].startLongitude;

            var aimLon = shotArray[j].aimLongitude;
            var aimLat = shotArray[j].aimLatitude;

            var endLon = shotArray[j].endLongitude;
            var endLat = shotArray[j].endLatitude;

            var upperAE = (aimLon * endLon) + (aimLat * aimLon);
            var A = ((aimLat * aimLon) ^ 2) ^ (1 / 2);
            var E = ((endLat * endLon) ^ 2) ^ (1 / 2);
            var lowerAE = A * E;
			
            var angle = Math.acos(upperAE / lowerAE);

            var radEndLat = (endLat * Math.PI) / 180;
            var radEndLon = (endLon * Math.PI) / 180;
			
            var pxEndLat = 5376 * Math.tan(radEndLat / 2);
            var pxEndLon = 5376 * Math.tan(radEndLon / 2);

            var radian = (angle * Math.PI) / 180;
            var px = 5376 * Math.tan(radian / 2);
      
            var aimDistance =  getDistance(startLat, startLon, aimLat, aimLon);
            var endDistance = getDistance(startLat, startLon, endLat, endLon);
			
			avrgAimDist += aimDistance;
			avrgEndDist += endDistance;
            
            var slice = px + 425;
            var hash = px - 90;
              
            var clubName = getClubName(club);
			var clubX = 100;
			var clubY = 20
            
			/****************************************************************************
			*
			* Draw All Clubs
			*
			****************************************************************************/
            // draw triangle with the appropriate color
            if (currentClub === 0)
            {
                if (club >= 1 && club <= 6)
                {
                    if (club === 1)
                        color = 'red';
                    else if (club === 2)
                        color = 'green';
                    else if (club === 3)
                        color = 'blue';
                    else if (club === 4)
                        color = 'orange';
                    else if (club === 5)
                        color = 'purple';
                    else if (club === 6)
                        color = 'lightblue';

                    // points='topX,topY rightX,rightY leftX,leftY'  
                    // drawn centered on the point with a 6px difference in each direction
                    html += "<polygon points='" + clubX + "," + (clubY - 6) + " " + (clubX + 6) + "," + (clubY + 6) + " " + (clubX - 6) + "," + (clubY + 6) + "' stroke='" + color + "' stroke-width='2' fill='white' >\n" +
                            "<title>aimDistance:"+aimDistance+"<br/>endDistance:"+endDistance+"<br/>angle:"+angle+"<br/>radian:"+radian+"<br/> pixels: "+px+"</title>\n" +
                            "</polygon>\n";

                }

                // draw square with the appropriate color
                else if (club >= 7 && club <= 9)
                {
                    if (club === 7)
                        color = 'red';
                    else if (club === 8)
                        color = 'green';
                    else if (club === 9)
                        color = 'blue';
                    else if (club === 10)
                        color = 'orange';
                    else if (club === 11)
                        color = 'purple';

                    html += "<rect x='" + clubX + "' y='" + clubY + "' width='10' height='10' stroke='" + color + "' stroke-width='2' fill='white' >\n" +
                            "<title>aimDistance:"+aimDistance+"<br/>endDistance:"+endDistance+"<br/>angle:"+angle+"<br/>radian:"+radian+"<br/> pixels: "+px+" </title>\n" +
                            "</rect>\n";
                }

                // draw circle with the appropriate color
                else if (club >= 12 && club <= 19)
                {
                    if (club === 12)
                        color = 'red';
                    else if (club === 13)
                        color = 'green';
                    else if (club === 14)
                        color = 'blue';
                    else if (club === 15)
                        color = 'orange';
                    else if (club === 16)
                        color = 'purple';
                    else if (club === 17)
                        color = 'lightblue';
                    else if (club === 18)
                        color = 'pink';
                    else if (club === 19)
                        color = 'brown';

                    html += "<circle cx='" + clubX + "' cy='" + clubY + "' r='5' stroke='" + color + "' stroke-width='2' fill='white' >" +
                            "<title>aimDistance:"+aimDistance+"<br/>endDistance:"+endDistance+"<br/>angle:"+angle+"<br/>radian:"+radian+"<br/> pixels: "+px+"</title>\n" +
                            "</circle>\n";

                }

                // draw diamond with the approriate color
                else if (club >= 20 && club <= 24)
                {
                    if (club === 20)
                        color = 'red';
                    else if (club === 21)
                        color = 'green';
                    else if (club === 22)
                        color = 'blue';
                    else if (club === 23)
                        color = 'orange';
                    else if (club === 24)
                        color = 'purple';

                    // points='topX,topY rightX,rightY bottomX,bottomY leftX,leftY'
                    // diamond centered on point with 6px difference in each direction
                    html += "<polygon points='" + clubX + "," + (clubY - 6) + " " + (clubX + 6) + "," + clubY + " " + clubX + "," + (clubY + 6) + " " + (clubX - 6) + "," + clubY + "' stroke='" + color + "' stroke-width='2' fill='white' >\n" +
                            "<title>aimDistance:"+aimDistance+"<br/>endDistance:"+endDistance+"<br/>angle:"+angle+"<br/>radian:"+radian+"<br/> pixels: "+px+"</title>\n" +
                            "</polygon>\n";

                }
            }
			/****************************************************************************
			*
			* Draw Only Drivers
			*
			****************************************************************************/
            else if (currentClub === 1)
            {
                if (club === 1)
                    color = 'red';
                else if (club === 2)
                    color = 'green';
                else if (club === 3)
                    color = 'blue';
                else if (club === 4)
                    color = 'orange';
                else if (club === 5)
                    color = 'purple';
                else if (club === 6)
                    color = 'lightblue';

                // points='topX,topY rightX,rightY leftX,leftY'  
                // drawn centered on the point with a 6px difference in each direction
                html += "<polygon points='" + clubX + "," + (clubY - 6) + " " + (clubX + 6) + "," + (clubY + 6) + " " + (clubX - 6) + "," + (clubY + 6) + "' stroke='" + color + "' stroke-width='2' fill='white' >\n" +
                        "<title>aimDistance:"+aimDistance+"<br/>endDistance:"+endDistance+"<br/>angle:"+angle+"<br/>radian:"+radian+"<br/> pixels: "+px+"</title>\n" +
                        "</polygon>\n";


            }
			/****************************************************************************
			*
			* Draw only woods
			*
			****************************************************************************/
            else if (currentClub === 2)
            {

                // draw square with the appropriate color
                /* else if (club >= 7 && club <= 9)
                 {*/
                if (club === 7)
                    color = 'red';
                else if (club === 8)
                    color = 'green';
                else if (club === 9)
                    color = 'blue';
                else if (club === 10)
                    color = 'orange';
                else if (club === 11)
                    color = 'purple';

                html += "<rect x='" + clubX + "' y='" + clubY + "' width='10' height='10' stroke='" + color + "' stroke-width='2' fill='white' >\n" +
                        "<title>aimDistance:"+aimDistance+"<br/>endDistance:"+endDistance+"<br/>angle:"+angle+"<br/>radian:"+radian+"<br/> pixels: "+px+"</title>\n" +
                        "</rect>\n";
            }

			/****************************************************************************
			*
			* Draw only hybrids
			*
			****************************************************************************/
            else if (currentClub === 3)
            {
                if (club === 12)
                    color = 'red';
                else if (club === 13)
                    color = 'green';
                else if (club === 14)
                    color = 'blue';
                else if (club === 15)
                    color = 'orange';
                else if (club === 16)
                    color = 'purple';
                else if (club === 17)
                    color = 'lightblue';
                else if (club === 18)
                    color = 'pink';
                else if (club === 19)
                    color = 'brown';

                html += "<circle cx='" + clubX + "' cy='" + clubY + "' r='5' stroke='" + color + "' stroke-width='2' fill='white' >" +
                        "<title>aimDistance:"+aimDistance+"<br/>endDistance:"+endDistance+"<br/>angle:"+angle+"<br/>radian:"+radian+"<br/> pixels: "+px+"</title>\n" +
                        "</circle>\n";

            }
			/****************************************************************************
			*
			* Draw only irons
			*
			****************************************************************************/
            else if (currentClub === 4)
            {
                if (club === 20)
                    color = 'red';
                else if (club === 21)
                    color = 'green';
                else if (club === 22)
                    color = 'blue';
                else if (club === 23)
                    color = 'orange';
                else if (club === 24)
                    color = 'purple';

                // points='topX,topY rightX,rightY bottomX,bottomY leftX,leftY'
                // diamond centered on point with 6px difference in each direction
                html += "<polygon points='" + clubX + "," + (clubY - 6) + " " + (clubX + 6) + "," + clubY + " " + clubX + "," + (clubY + 6)+ " " + (clubX - 6) + "," + clubY + "' stroke='" + color + "' stroke-width='2' fill='white' >\n" +
                        "<title>aimDistance:"+aimDistance+"<br/>endDistance:"+endDistance+"<br/>angle:"+angle+"<br/>radian:"+radian+"<br/> pixels: "+px+"</title>\n" +
                        "</polygon>\n";


            }
        } // end draw shape
    }

    html += "</svg>\n";
    document.getElementsByClassName("vector_graph")[0].innerHTML = html;
}
/****************************************************************************
 *
 * Creates Shot Tabs 
 *
 ****************************************************************************/

function createShotTabs()
{
    var checkedHole;
    var highShot = 0;
    Shots = 0;
    currentShot = 0;

    html = '<ul>\n';
    for (var i = 0; i < rounds.length; i++)
    {
        currentRound = i;
        for (var j = 0; j < rounds[currentRound].holes.length; j++)
        {
            var checkedHole = rounds[currentRound].holes[j].holeNumber;

            if (checkedHole === currentHole || "" + checkedHole + "" === currentHole)
            {
                var newCurrent = j;
                for (var k = 0; k < rounds[currentRound].holes[newCurrent].shots.length; k++)
                {
                    var curshot = k;
                    var curHole = newCurrent;
                    var shotNum = rounds[currentRound].holes[curHole].shots[curshot].shotNumber;

                    if (Shots === 0)
                    {
                        Shots = shotNum;
                        currentShot = parseInt(shotNum);
                        html += "<li id ='" + Shots + "s' title =' Shot:" + currentShot + "' class=' selected_tab'>" + shotNum + "</li>\n";

                        highShot += 1;
                    }
                    else if (shotNum > highShot)
                    {
                        Shots = shotNum;
                        html += "<li id ='" + Shots + "s' title =' Shot:" + shotNum + "'>" + shotNum + "</li>\n";
                        highShot += 1;
                    }
                }
            }
        }
    }
    html += "</ul>\n";
    document.getElementsByClassName("shot_tabs")[0].innerHTML = html;
    drawLine();
}

/****************************************************************************
 *
 * Create Hole Tabs
 *
 ****************************************************************************/

function createHoleTabs() {

    var holeNum;
    var curHole;
    html = '<ul>\n';
    for (var i = 1; i < 19; i++)
    {
        for (var j = 0; j < rounds.length; j++)
        {
            currentRound = j;
            for (var k = 0; k < rounds[currentRound].holes.length; k++) {

                holeNum = rounds[currentRound].holes[k].holeNumber;

                if (holeNum === i)
                {
                    if (currentHole === 0)
                    {
                        curHole = holeNum;
                        currentHole = holeNum;
                        html += "<li id = '" + curHole + "' title=' Hole: " + curHole + "'class='selected_tab'>" + i + "</li>\n";

                    }
                    else if (holeNum > curHole)
                    {
                        curHole = holeNum;
                        html += "<li id = '" + curHole + "' title=' Hole: " + curHole + "'>" + i + "</li>\n";
                    }
                }
            }
        }
    }
    html += "</ul>\n";
    document.getElementsByClassName("hole_tabs")[0].innerHTML = html;
    //createShotTabs();
}


/****************************************************************************
 *
 * Change from shot to shot
 *
 ****************************************************************************/
function changeToShot(shots)
{
    document.getElementById(currentShot + "s").className = "";
    document.getElementById(shots).className += ' selected_tab';
    currentShot = parseInt(shots);
    // drawLine();


}
/****************************************************************************
 *
 * Change between Holes 
 *
 ****************************************************************************/
function changeToHole(cHole)
{
    document.getElementById(currentHole).className = "";
    document.getElementById(cHole).className += ' selected_tab';
    currentHole = cHole;//parseInt(cHole);
    //createShotTabs();

}

/****************************************************************************
 *
 * Change between Clubs 
 *
 ****************************************************************************/
function changeClubs(club)
{
    document.getElementById(currentClub + "c").className = "";
    document.getElementById(club).className += ' selected_tab';
    currentClub = parseInt(club);
}

/****************************************************************************
 *
 * Compute Shot Data from Rounds
 *
 ****************************************************************************/

$(document).ready(function()
{
    createHoleTabs();
    createShotTabs();

    $(".hole_tabs li").click(function()
    {
        changeToHole($(this).text());
		createShotTabs();
		
    });
    $(".shot_tabs li").click(function()
    {
        changeToShot($(this).attr('id'));
        drawLine();

    });
    $(".club_tabs li").click(function()
    {
        changeClubs($(this).attr('id'));
        drawLine();

    });
}
);