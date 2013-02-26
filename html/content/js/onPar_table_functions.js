
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
    


/****************************************************************************
 *
 * Creates Holes Table
 *
 ****************************************************************************/       

    function getHoleData()
    {   
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
        getShotData();
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
                   currentHole = ($(this).getRowData(id)['hole'] - 1);
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
       

    function getShotData()
    {                      
        if((currentHole) > rounds[currentRound].holes.length)
        {
            currentHole = 0;
        }
        
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
			else {direction = 'Error';}

            // gets distance
            var distance = convertGPStoYards(startLat, startLong, endLat, endLong);
            
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



function computeAngle(startLat,startLong,aimLat,aimLong,endLat,endLong)
{
    aimLat = aimLat - startLat;
    aimLong = aimLong - startLong;
    endLat = endLat - startLat;
    endLong = endLong - startLong;

    var scalar = aimLat * endLat + aimLong * endLong;
    var mag1 = Math.pow((aimLat * aimLat + aimLong + aimLong), .5);
    var mag2 = Math.pow((endLat * endLat + endLong + endLong), .5);
    
    return (Math.acos(scalar / (mag1 * mag2))*(180 / Math.PI)).toFixed(2);	
}
 
 
function convertGPStoYards(lat1, long1, lat2, long2)
{
    var dLat = (lat2 - lat1)*(Math.PI / 180);
    var dLong = (long2 - long1)*(Math.PI / 180);
    var a = Math.pow(Math.sin(dLat/2),2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dLong/2),2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return (6967420.2 * c).toFixed(2);
}
 
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

