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

