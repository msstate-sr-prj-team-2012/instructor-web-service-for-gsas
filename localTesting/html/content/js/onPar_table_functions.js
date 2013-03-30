var rounds = localStorage.getObject('rounds');
var roundData = [];
var holeData = [];
var shotData = [];
var scoreboard_round = 0;
var scoreboard_hole = 1;

$(document).ready(function () {
    getRoundData();
});

function getRoundData(){
    for(var i = 0; i < rounds.length; i++){
        var total_score;
        
        var total_par = 0;        
        for(var x = 0; x < rounds[i].holes.length; x++){
            total_par += rounds[i].holes[x].par;
        } 

        if(rounds[i].totalScore < total_par){
            total_score = '<span style="color:#04B404">' + rounds[i].totalScore + '</span>';
        }
        else if(rounds[i].totalScore > total_par){
            total_score = '<span style="color:#DF7401">' + rounds[i].totalScore + '</span>';
        }
        else{   
            total_score = rounds[i].totalScore;
        }
        
        
        roundData.push({
                round: i + 1,
                date: rounds[i].startTime, 
                score: total_score
            });
    }
    createRoundGrid();
    roundData = []; // clearing memory after its been used
    getHoleData();
}

 function createRoundGrid(){
     $("#rounds").jqGrid({
            datatype: "local",
            data: roundData,
            colNames:['round', 'date', 'score'],
            colModel:[
                {name:'round',index:'round', width:60, sorttype: 'int', align:'center'},
                {name:'date',index:'date', width:100, align:'center', sorttype:'date', formatter:'date', formatoptions: {newformat:'d-M-Y'}},
                {name:'score',index:'score', width:60, align:'center'},
            ],
            rowNum:20,
            sortname: 'round',
            viewrecords: true,
            sortorder: "asc",
            caption:"Rounds",
            height: "100%",
            width: 220,

            // change of round will reload round and shot table
            onSelectRow: function(id){ 
                scoreboard_round = ($(this).getRowData(id)['round'] - 1);
                $("#holes").jqGrid("GridUnload").trigger("reloadGrid");
                getHoleData();   
             }
        });
 }
    
function getHoleData(){   
    for(i = 0; i < rounds[scoreboard_round].holes.length; i++){
        var score;
        if(rounds[scoreboard_round].holes[i].holeScore < rounds[scoreboard_round].holes[i].par){
            score = '<span style="color:#04B404">' + rounds[scoreboard_round].holes[i].holeScore + '</span>';
        }
        else if(rounds[scoreboard_round].holes[i].holeScore > rounds[scoreboard_round].holes[i].par){
            score = '<span style="color:#DF7401">' + rounds[scoreboard_round].holes[i].holeScore + '</span>';
        }
        else{   
            score = rounds[scoreboard_round].holes[i].holeScore;
        }
        holeData.push({
            hole: rounds[scoreboard_round].holes[i].holeNumber,
            par: rounds[scoreboard_round].holes[i].par,
            shots: rounds[scoreboard_round].holes[i].shots.length,
            putts: rounds[scoreboard_round].holes[i].putts,
            score: score
        })
    }
    createHoleGrid();
    holeData = []; // clearing memory after its been used
    $("#shots").jqGrid("GridUnload").trigger("reloadGrid");
    getShotData();
}

function createHoleGrid(){    
    $("#holes").jqGrid({
            datatype: "local",
            data: holeData,
            colNames:['hole', 'par', 'shots', 'putts', 'score'],
            colModel:[
                {name:'hole',index:'hole', width:60, sorttype: 'int', align:'center'},
                {name:'par',index:'par', width:60, align:'center'},
                {name:'shots',index:'shots', width:60, align:'center'},
                {name:'putts',index:'putts', width:60, align:'center'},
                {name:'score',index:'score', width:60, align:'center'}
            ],
            rowNum:20,
            sortname: 'hole',
            viewrecords: true,
            sortorder: "asc",
            caption:"Holes (Round  " + (scoreboard_round + 1) + ")",
            height: "100%",
            width: 300,

            // change of hole will reload shot table
            onSelectRow: function(id){ 
               scoreboard_hole = $(this).getRowData(id)['hole'];
               $("#shots").jqGrid("GridUnload").trigger("reloadGrid");
               getShotData();        
             }
        });
}

function getShotData(){
    
    // filters round object for currentHole
    var shotsHole = (rounds[scoreboard_round].holes).filter(function(obj) { return (obj.holeNumber == scoreboard_hole) })[0];
    
    if(shotsHole === undefined || shotsHole.shots.length === 0){
        createShotGrid();
        $('#shots').setCaption("Shots (Hole " + scoreboard_hole + ")  <span style='color:#D8D8D8;font-weight:normal;' >  &nbsp;&nbsp; -- No Data Found -- </span>").trigger("reloadGrid");
    }
    else{
        for(var i = 0;i < shotsHole.shots.length; i++){
            var startLat = shotsHole.shots[i].startLatitude;
            var startLong = shotsHole.shots[i].startLongitude;
            var endLat = shotsHole.shots[i].endLatitude;
            var endLong = shotsHole.shots[i].endLongitude;

            var distance = getDistance(startLat, startLong, endLat, endLong);
            var club = getClubName(shotsHole.shots[i].club);

            shotData.push({
                shot: shotsHole.shots[i].shotNumber,
                club: club,
                distance: distance
            })
        }  
        createShotGrid();
    }
    shotData = []; // clearing memory after its been used
}

function createShotGrid(){
    $("#shots").jqGrid({
        datatype: "local",
        data: shotData,
        colNames:['shot', 'club', 'distance (yards)'],
        colModel:[
            {name:'shot',index:'shot', width:60, sorttype: 'int', align:'center'},
            {name:'club',index:'club', width:110, align:'center'},
            {name:'distance',index:'distance', width:110, align:'center'}
        ],
        rowNum:20,
        sortname: 'shot',
        viewrecords: true,
        sortorder: "asc",
        caption:"Shots (Hole  " + scoreboard_hole + ")",
        height: "100%",
        width: 280
    });
}                    
