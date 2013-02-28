/****************************************************************************
 *
 * Global Variables
 *
 ****************************************************************************/

var roundData = [];
var holeData = [];
var shotData = [];
var statData = [];
var currentRound = 0;
var currentHole = 1;
var rounds = localStorage.getObject('rounds');
var hole;

$(document).ready(function () {
    getRoundData();
});

/****************************************************************************
 *
 * Creates Rounds Table
 *
 ****************************************************************************/

function getRoundData(){
    roundData = [];
    for(var i = 0; i < rounds.length; i++){
        roundData.push({
                round: i + 1,
                date: rounds[i].startTime 
            });
    }
    createRoundGrid();
}

 function createRoundGrid(){
     $("#rounds").jqGrid({
            datatype: "local",
            data: roundData,
            colNames:['round', 'date'],
            colModel:[
                {name:'round',index:'round', width:140, sorttype: 'int', align:'center'},
                {name:'date',index:'date', width:400, align:'center', sorttype:'date', formatter:'date', formatoptions: {newformat:'d-M-Y'}},
            ],
            rowNum:5,
            rowList:[3,5,10],
            pager: '#pager',
            sortname: 'round',
            viewrecords: true,
            sortorder: "asc",
            caption:"Rounds",
            height: "100%",
            width: 700,

            // change of round will reload round and shot table
            onSelectRow: function(id){ 
                currentRound = ($(this).getRowData(id)['round'] - 1);
                $("#holes").jqGrid("GridUnload").trigger("reloadGrid");
                getHoleData();   
             }
        })
 }
    


/****************************************************************************
 *
 * Creates Holes Table
 *
 ****************************************************************************/       

function getHoleData(){   
    holeData = [];
    for(i = 0; i < rounds[currentRound].holes.length; i++){
        holeData.push({
            hole: rounds[currentRound].holes[i].holeNumber,
            par: rounds[currentRound].holes[i].par,
            shots: rounds[currentRound].holes[i].shots.length,
            score: rounds[currentRound].holes[i].holeScore
        })
    }
    createHoleGrid();
    $("#shots").jqGrid("GridUnload").trigger("reloadGrid");
    getShotData();
}

function createHoleGrid(){    
    $("#holes").jqGrid({
            datatype: "local",
            data: holeData,
            colNames:['hole', 'par', 'shots', 'score'],
            colModel:[
                {name:'hole',index:'hole', width:135, sorttype: 'int', align:'center'},
                {name:'par',index:'par', width:135, align:'center'},
                {name:'shots',index:'shots', width:135, align:'center'},
                {name:'score',index:'score', width:135, align:'center'}
            ],
            rowNum:9,
            rowList:[5,9,18],
            pager: '#pager2',
            sortname: 'hole',
            viewrecords: true,
            sortorder: "asc",
            caption:"Holes (Round  " + (currentRound + 1) + ")",
            height: "100%",
            width: 700,

            // change of hole will reload shot table
            onSelectRow: function(id){ 
               currentHole = $(this).getRowData(id)['hole'];
               $("#shots").jqGrid("GridUnload").trigger("reloadGrid");
               getShotData();        
             }
        });
}

        
        
/****************************************************************************
 *
 * Creates Shots Table
 *
 ****************************************************************************/

function getShotData(){
    
    // filters round object for currentHole
    hole = (rounds[currentRound].holes).filter(function(obj) { return (obj.holeNumber == currentHole) })[0];
    
    shotData = [];
    if(hole === undefined || hole.shots.length === 0){
        createShotGrid();
        $('#shots').setCaption("Shots (Hole " + currentHole + ") <span style='color:#ff0000' > -- No Data Found -- </span>").trigger("reloadGrid");
    }
    else{
        for(var i = 0;i < hole.shots.length; i++){
            var startLat = hole.shots[i].startLatitude;
            var startLong = hole.shots[i].startLongitude;
            var aimLat = hole.shots[i].aimLatitude;
            var aimLong = hole.shots[i].aimLongitude;
            var endLat = hole.shots[i].endLatitude;
            var endLong = hole.shots[i].endLongitude;

            // gets angle
            var angle = computeAngle(startLat,startLong,aimLat,aimLong,endLat,endLong);

            // gets direction
            var direction;
            if (angle > 0) {direction = 'right';}
            else if (angle < 0) {direction = 'left';}
            else if (angle == 0) {direction = 'center';}

            // gets distance
            var distance = getDistance(startLat, startLong, endLat, endLong);

            // gets club name
            var club = getClubName(hole.shots[i].club);

            shotData.push({
                shot: hole.shots[i].shotNumber,
                club: club,
                distance: distance,
                direction: direction, 
                angle: angle 
            })
        }  
        createShotGrid();
    }
}

function createShotGrid(){
    $("#shots").jqGrid({
        datatype: "local",
        data: shotData,
        colNames:['shot', 'club', 'distance (yards)', 'direction', 'angle'],
        colModel:[
            {name:'shot',index:'shot', width:80, sorttype: 'int', align:'center'},
            {name:'club',index:'club', width:150, align:'center'},
            {name:'distance',index:'distance', width:150, align:'center'},
            {name:'direction',index:'direction', width:80, align:'center'},
            {name:'angle',index:'angle', width:80, align:'center'}
        ],
        rowNum:5,
        rowList:[5,10,15],
        pager: '#pager3',
        sortname: 'shot',
        viewrecords: true,
        sortorder: "asc",
        caption:"Shots (Hole  " + currentHole + ")",
        height: "100%",
        width: 700
    });
}                    


/****************************************************************************
 *
 * Conversion Functions
 *
 ****************************************************************************/

function computeAngle(startLat,startLong,aimLat,aimLong,endLat,endLong){
    aimLat = aimLat - startLat;
    aimLong = aimLong - startLong;
    endLat = endLat - startLat;
    endLong = endLong - startLong;

    var scalar = aimLat * endLat + aimLong * endLong;
    var mag1 = Math.pow((aimLat * aimLat + aimLong + aimLong), .5);
    var mag2 = Math.pow((endLat * endLat + endLong + endLong), .5);
    
    return (Math.acos(scalar / (mag1 * mag2))*(180 / Math.PI)).toFixed(2);	
}
 
function getDistance(startLat, startLon, endLat, endLon){
    var dLat = (endLat - startLat) * (Math.PI / 180.0);
    var dLon = (endLon - startLon) * (Math.PI / 180.0);
    var lat1 = startLat * (Math.PI / 180.0);
    var lat2 = endLat * (Math.PI / 180.0);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (6975065.5 * c).toFixed(2);
}
 
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

