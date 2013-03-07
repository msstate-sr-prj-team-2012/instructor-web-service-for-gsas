var EARTH_RADIUS_IN_YARDS = 13950131.0 / 2;
var currentRound = 0;
var currentHole = 0;
var currentClub = 0;
var currentShot = 0;
var selectedHView;
var selectedHole = 0;
var html;
var rounds = localStorage.getObject('rounds');
var inc = 1;
var hole;
var Shots = 0;
/****************************************************************************
 *
 * Degree/Radian conversion functions
 *
 ****************************************************************************/
function drawLine()
{

    var shotArray = [];
    html = "<svg>\n";

    html += "<ellipse cx= '425' cy= '350'  rx= '425' ry='325' stroke= 'black'\n ";
    html += "stroke-width= '2' fill= 'lightblue'>\n";
    html += "</ellipse>\n\n";

    html += "<line x1 = '425'  y1= '25' x2= '425' y2= '350' \n ";
    html += "stroke='black' stroke-width='3'>\n";
    html += "<title> Aim </title>\n";
    html += "</line>\n\n";

    html += "<circle cx= '425' cy= '350' r= '5' stroke= 'black'\n ";
    html += "stroke-width= '2' fill= 'black'>\n";
    html += "</circle>\n\n";

    html += "<circle cx= '425' cy= '25'  r= '3' stroke= 'black'\n ";
    html += "stroke-width= '2' fill= 'black'>\n";
    html += "</circle>\n\n";



    for (var i = 0; i < rounds.length; i++) {

        var holeObject = (rounds[i].holes).filter(function(obj) {
            return (obj.holeNumber === currentHole);
        })[0];

        if (holeObject !== undefined)/* || holeObject.length !== 0)*/ {

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

            var slice = px +425;
            var hash = px - 90;
            if (startLon <= aimLon && startLat < aimLat)//Start South : Aim/End North
            {
                if (aimLon > endLon)
                {
                    html += "<line x1 = '425'  y1= '350' x2= '" + px + "' y2= '" + px + "' \n ";
                    html += "stroke='black' stroke-width='2'>\n";
                    html += "<title> " + px + "</title>\n";
                    html += "</line>\n\n";
                    html += "<circle cx= '"+pxEndLon+"' cy= '"+pxEndLat+"' r= '3' stroke= 'black'\n ";
                    html += "stroke-width= '2' fill= 'black'>\n";
                    html += "</circle>\n\n";
                }
                if (aimLon <= endLon)
                {
                    html += "<line x1 = '425'  y1= '350' x2= '" + slice + "' y2= '" + px + "' \n ";
                    html += "stroke='black' stroke-width='2'>\n";
                    html += "<title> " + px + "</title>\n";
                    html += "</line>\n\n";
                    html += "<circle cx= '"+pxEndLon+"' cy= '"+pxEndLat+"' r= '3' stroke= 'black'\n ";
                    html += "stroke-width= '2' fill= 'black'>\n";
                    html += "</circle>\n\n";
                }
            }
            if (startLon >= aimLon && startLat > aimLat)//Start North : Aim/End South
            {
                if (aimLon > endLon)
                {
                    html += "<line x1 = '425'  y1= '350' x2= '" + slice + "' y2= '" + px + "' \n ";
                    html += "stroke='black' stroke-width='2'>\n";
                    html += "<title> " + px + "</title>\n";
                    html += "</line>\n\n";
                    html += "<circle cx= '"+pxEndLon+"' cy= '"+pxEndLat+"' r= '3' stroke= 'black'\n ";
                    html += "stroke-width= '2' fill= 'black'>\n";
                    html += "</circle>\n\n";
                }
                if (aimLon <= endLon)
                {
                    html += "<line x1 = '425'  y1= '350' x2= '" + px + "' y2= '" + px + "' \n ";
                    html += "stroke='black' stroke-width='2'>\n";
                    html += "<title> " + px + "</title>\n";
                    html += "</line>\n\n";
                    html += "<circle cx= '"+pxEndLon+"' cy= '"+pxEndLat+"' r= '3' stroke= 'black'\n ";
                    html += "stroke-width= '2' fill= 'black'>\n";
                    html += "</circle>\n\n";
                }
            }
            //  var startToAimDistance = Math.sqrt(((startLon - aimLon) ^ 2) + ((startLat - aimLat) ^ 2));
            //  var startToEndDistance = Math.sqrt(((startLon - endLon) ^ 2) + ((startLat - endLat) ^ 2));
        }
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
                        html += "<li id = '" + curHole + "h' title=' Hole: " + curHole + "'class='selected_tab'>" + i + "</li>\n";

                    }
                    else if (holeNum > curHole)
                    {
                        curHole = holeNum;
                        html += "<li id = '" + curHole + "h' title=' Hole: " + curHole + "'>" + i + "</li>\n";
                    }
                }
            }
        }
    }
    html += "</ul>\n";
    document.getElementsByClassName("hole_tabs")[0].innerHTML = html;
    createShotTabs();
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
    document.getElementById(currentHole + "h").className = "";
    document.getElementById(cHole).className += ' selected_tab';
    currentHole = parseInt(cHole);
    // createShotTabs();

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

    $(".hole_tabs li").click(function()
    {
        changeToHole($(this).attr('id'));
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

    });
}
);


