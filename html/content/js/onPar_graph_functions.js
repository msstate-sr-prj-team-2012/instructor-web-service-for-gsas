
var holeData = [];
var shotData = [];
var statData = [];
$(document).ready(function () 
{
    var currentRound = 0;
    var currentHole = 0;
    var rounds = localStorage.getObject('rounds');

      
/****************************************************************************
 *
 * Creates Rounds Table
 *
 ****************************************************************************/
    

    var roundData = [];
    for(var i = 0; i < rounds.length; i++)
    {
        roundData.push({
                round: i + 1,
                date: rounds[i].startTime 
            })
    }
        
     $("#rounds").jqGrid({
            datatype: "local",
            data: roundData,
            colNames:['round', 'date'],
            colModel:[
                {name:'round',index:'round', width:140, sorttype: 'int', align:'center'},
                {name:'date',index:'date', width:400, align:'center', sorttype:'date', formatter:'date', formatoptions: {newformat:'d-M-Y'}},
            ],
            rowNum:10,
            rowList:[5,10],
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
                $("#rounds").jqGrid('setGridState', 'hidden');
                $("#holes").jqGrid('setGridState', 'visible');
             }
        })   
    


/****************************************************************************
 *
 * Creates Holes Table
 *
 ****************************************************************************/       

    function getHoleData()
    {
        
        if((currentHole) > rounds[currentRound].holes.length)
        {
            currentHole = 0;
        }
        
        holeData = [];
        for(i = 0; i < rounds[currentRound].holes.length; i++)
        {
            holeData.push({
                hole: rounds[currentRound].holes[i].holeNumber,
                par: rounds[currentRound].holes[i].par,
                shots: rounds[currentRound].holes[i].shots.length,
                score: rounds[currentRound].holes[i].holeScore
            })
        }
        createHoleGrid();
        
        $("#shots").jqGrid("GridUnload").trigger("reloadGrid");
    }
        
    function createHoleGrid()
    {    
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
                rowList:[9,18],
                pager: '#pager2',
                sortname: 'hole',
                viewrecords: true,
                sortorder: "asc",
                caption:"Holes (Round  " + (currentRound + 1) + ")",
                height: "100%",
                width: 700,

                // change of hole will reload shot table
                onSelectRow: function(id){ 
                   currentHole = ($(this).getRowData(id)['hole'] - 1);
                   $("#shots").jqGrid("GridUnload").trigger("reloadGrid");
                   getShotData();        
                   $("#holes").jqGrid('setGridState', 'hidden');
                   $("#shots").jqGrid('setGridState', 'visible');
                 }

            });
    }
    
        
        
/****************************************************************************
 *
 * Create Vector Graph
 *
 ****************************************************************************/
       

    function getShotData()
    {    
        shotData = [];
        for(i = 0;i < rounds[currentRound].holes[currentHole].shots.length; i++)
        {
            var startLat = rounds[currentRound].holes[currentHole].shots[i].startLatitude;
            var startLong = rounds[currentRound].holes[currentHole].shots[i].startLongitude;
            var aimLat = rounds[currentRound].holes[currentHole].shots[i].aimLatitude;
            var aimLong = rounds[currentRound].holes[currentHole].shots[i].aimLongitude;
            var endLat = rounds[currentRound].holes[currentHole].shots[i].endLatitude;
            var endLong = rounds[currentRound].holes[currentHole].shots[i].endLongitude;

            // gets angle
            var angle = computeAngle(startLat,startLong,aimLat,aimLong,endLat,endLong);

            // gets direction
            var direction;
            if (angle > 0) {direction = 'right';}
            else if (angle < 0) {direction = 'left';}
            else if (angle == 0) {direction = 'center';}

            // gets distance
            var distance = distance(startLat, startLong, endLat, endLong);
            
            // gets club name
            var club = getClubName(rounds[currentRound].holes[currentHole].shots[i].club);
        
            shotData.push({
                shot: rounds[currentRound].holes[currentHole].shots[i].shotNumber,
                club: club,
                distance: distance,
                direction: direction, 
                angle: angle 
            })
        }  
        createShotGrid();
    }

    
        
   function createShotGrid()
   {
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
            caption:"Shots (Hole  " + (currentHole + 1) + ")",
            height: "100%",
            width: 700

        });
   }                    
});

