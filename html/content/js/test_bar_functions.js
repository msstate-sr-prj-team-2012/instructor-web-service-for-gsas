
// alters storage to store objects
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}


// setting static data for testing
localStorage.setObject('rounds', [{"ID":107,"course":{"ID":1,"name":"MSU Institute of Golf","location":"Starkville, Mississippi"},"totalScore":0,"teeID":3,"startTime":"2013-02-26 09:36:46","holes":[{"ID":604,"roundID":107,"holeScore":3,"FIR":true,"GIR":true,"putts":2,"distance":181,"par":3,"holeNumber":2,"firstRefLat":33.481981,"firstRefLong":-88.735298,"secondRefLat":33.480494,"secondRefLong":-88.735148,"firstRefX":204,"firstRefY":658,"secondRefX":193,"secondRefY":127,"shots":[{"ID":528,"holeID":604,"club":16,"shotNumber":1,"aimLatitude":33.480580981879,"aimLongitude":-88.735133937476,"startLatitude":42.1234,"startLongitude":-88,"endLatitude":42.1234,"endLongitude":-88.1234}]},{"ID":605,"roundID":107,"holeScore":4,"FIR":true,"GIR":true,"putts":2,"distance":357,"par":4,"holeNumber":4,"firstRefLat":33.484588,"firstRefLong":-88.735346,"secondRefLat":33.487371,"secondRefLong":-88.734201,"firstRefX":210,"firstRefY":715,"secondRefX":186,"secondRefY":83,"shots":[{"ID":529,"holeID":605,"club":1,"shotNumber":1,"aimLatitude":33.486457962092,"aimLongitude":-88.734796375282,"startLatitude":33.478722,"startLongitude":-88.733456,"endLatitude":33.486457962092,"endLongitude":-88.734796375282}]},{"ID":606,"roundID":107,"holeScore":4,"FIR":true,"GIR":true,"putts":2,"distance":345,"par":4,"holeNumber":1,"firstRefLat":33.478639,"firstRefLong":-88.733391,"secondRefLat":33.481269,"secondRefLong":-88.734566,"firstRefX":208,"firstRefY":664,"secondRefX":196,"secondRefY":116,"shots":[{"ID":530,"holeID":606,"club":1,"shotNumber":1,"aimLatitude":33.480279999418,"aimLongitude":-88.733859786365,"startLatitude":33.478722,"startLongitude":-88.7333456,"endLatitude":33.480279999418,"endLongitude":-88.733859786365},{"ID":531,"holeID":606,"club":19,"shotNumber":2,"aimLatitude":33.481269,"aimLongitude":-88.734566,"startLatitude":42.1234,"startLongitude":-88,"endLatitude":42.1234,"endLongitude":-88.1234}]},{"ID":607,"roundID":107,"holeScore":3,"FIR":false,"GIR":true,"putts":2,"distance":136,"par":3,"holeNumber":8,"firstRefLat":33.483125,"firstRefLong":-88.734362,"secondRefLat":33.482194,"secondRefLong":-88.734641,"firstRefX":231,"firstRefY":512,"secondRefX":247,"secondRefY":216,"shots":[{"ID":532,"holeID":607,"club":20,"shotNumber":1,"aimLatitude":33.483155077656,"aimLongitude":-88.734370417083,"startLatitude":33.483343,"startLongitude":-88.734376,"endLatitude":33.483155077656,"endLongitude":-88.734370417083}]}]},{"ID":106,"course":{"ID":1,"name":"MSU Institute of Golf","location":"Starkville, Mississippi"},"totalScore":0,"teeID":3,"startTime":"2013-02-22 11:32:53","holes":[{"ID":603,"roundID":106,"holeScore":4,"FIR":true,"GIR":true,"putts":2,"distance":345,"par":4,"holeNumber":1,"firstRefLat":33.478639,"firstRefLong":-88.733391,"secondRefLat":33.481269,"secondRefLong":-88.734566,"firstRefX":208,"firstRefY":664,"secondRefX":196,"secondRefY":116,"shots":[{"ID":527,"holeID":603,"club":1,"shotNumber":1,"aimLatitude":33.480317838558,"aimLongitude":-88.73368476257,"startLatitude":32.429858307467,"startLongitude":-90,"endLatitude":32.429858307467,"endLongitude":-90.155324557731}]}]},{"ID":104,"course":{"ID":1,"name":"MSU Institute of Golf","location":"Starkville, Mississippi"},"totalScore":0,"teeID":3,"startTime":"2013-02-21 13:52:25","holes":[{"ID":600,"roundID":104,"holeScore":4,"FIR":true,"GIR":true,"putts":2,"distance":345,"par":4,"holeNumber":1,"firstRefLat":33.478639,"firstRefLong":-88.733391,"secondRefLat":33.481269,"secondRefLong":-88.734566,"firstRefX":208,"firstRefY":664,"secondRefX":196,"secondRefY":116,"shots":[{"ID":524,"holeID":600,"club":1,"shotNumber":1,"aimLatitude":33.480307316021,"aimLongitude":-88.733942667141,"startLatitude":35.063100173078,"startLongitude":-89,"endLatitude":35.063100173078,"endLongitude":-89.80605634254}]}]}]);


// global variables
var EARTH_RADIUS_IN_YARDS = 13950131.0 / 2; 
var rounds = localStorage.getObject('rounds');
var clubIDs = [];
var clubNames = [];
var series = [];
var data = [];

$(document).ready(function() { 
    createCategories();
    
    // event handler for submit button
    $(document).on("click", "#submit", function(){
        if($("input:checkbox:checked").length === 0){
            alert("Please select at least one club to continue.");
            return;
        }
        
        $("input:checkbox:checked").each(function(){
            clubIDs.push($(this).attr('id'));
        })
        
            // sizes chart taking into account the number of clubs and rounds selected, allowing 30px for each round bar height
            var height = clubIDs.length * rounds.length * 30;
            $('#container').css('height', height);
    
        // calls get data using the inputs selected
        getData();
    });
    
})

// creates checkbox field
function createCategories(){
    var html = '';
    for(var i = 1; i < 25; i++){
        html += "<input type='checkbox' id='" +i+ "' value='" + getClubName(i) + "'> " + getClubName(i) + "<br>\n";
    }
    document.getElementById('categories').innerHTML = html;
}



// pulls data from storage by selected categories
function getData(){

        // looping through all rounds selected
        for(var x = 0; x < rounds.length; x++){
            
            data = []; // clears data -- data should consist of an array of average distances pertaining to each club, ie [distanceClub1, distanceClub2]
            
            // looping through all clubs selected
            for(var i = 0; i < clubIDs.length; i++){
                
                var distance = 0; // clears distance
                var shotCount = 0; // initializing shotCount variable
                
               // looping through all holes within that round
                for(var y = 0; y < rounds[x].holes.length; y++){

                   // filters for shots within the current hole that use the current club
                    var shots = (rounds[x].holes[y].shots).filter(function(obj) { return (obj.club == clubIDs[i]) }); 

                    // looping through all shots found and calculating data
                    for (var z = 0; z < shots.length; z++){ 
                        distance += parseFloat(getDistance(shots[z].startLatitude, shots[z].startLongitude, shots[z].endLatitude, shots[z].endLongitude)); 
                        shotCount++;
                    } 

                } // end holes loop

                // adds average distance of that club to data array
                var averageDistance = (distance / shotCount).toFixed(2); 
                data.push(parseFloat(averageDistance)); 

            } // end clubID loop
                
            // creates the series after data for each club has been retrieved
            series.push({
                name: 'Date: ' + rounds[x].startTime.split(' ')[0] + ' <br> Time: ' + rounds[x].startTime.split(' ')[1] + '<br> ',
                data: data
            })     
            

        } // end rounds loop
        
    
    // gets club names
    for(var a = 0; a < clubIDs.length; a++){
        clubNames.push(getClubName(parseFloat(clubIDs[a])));
    } 
    
    // call createBarGraph once all data has been retrieved
    createBarGraph();
    
} // end function
    



// creates bar graph
function createBarGraph(){
    
    var chart1 = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'bar'
        },
        title: {
            text: 'Average Distance'
        },
        xAxis: {
            categories: clubNames
        },
        yAxis: {
            title: {
                text: 'Distance (yards)'
            }
        },
        series: series
    });
    

    // clearing global memory after graph is created
    clubIDs = [];
    clubNames = [];
    series = [];
    data = [];
}

// returns club name
function getClubName(club){
    if(club === defines.DRIVER) return 'driver';
    else if(club === defines.THREE_WOOD) return '3 wood';
    else if(club === defines.FOUR_WOOD) return '4 wood';
    else if(club === defines.FIVE_WOOD) return '5 wood';
    else if(club === defines.SEVEN_WOOD) return '7 wood';
    else if(club === defines.NINE_WOOD) return '9 wood';
    else if(club === defines.TWO_HYBRID) return '2 hybrid';
    else if(club === defines.THREE_HYBRID) return '3 hybrid';
    else if(club === defines.FOUR_HYBRID) return '4 hybrid';
    else if(club === defines.FIVE_HYBRID) return '5 hybrid';
    else if(club === defines.SIX_HYBRID) return '6 hybrid';
    else if(club === defines.TWO_IRON) return '2 iron';
    else if(club === defines.THREE_IRON) return '3 iron';
    else if(club === defines.FOUR_IRON) return '4 iron';
    else if(club === defines.FIVE_IRON) return '5 iron';
    else if(club === defines.SIX_IRON) return '6 iron';
    else if(club === defines.SEVEN_IRON) return '7 iron';
    else if(club === defines.EIGHT_IRON) return '8 iron';
    else if(club === defines.NINE_IRON) return '9 iron';
    else if(club === defines.PW) return 'pitching wedge';
    else if(club === defines.AW) return 'approach wedge';
    else if(club === defines.SW) return 'sand wedge';
    else if(club === defines.LW) return 'lob wedge';
    else if(club === defines.HLW) return 'high lob wedge';
    else return 'unknown';
}


// distance formula
function getDistance(startLat, startLon, endLat, endLon){
    var dLat = (endLat - startLat) * (Math.PI / 180.0);
    var dLon = (endLon - startLon) * (Math.PI / 180.0);
    var lat1 = startLat * (Math.PI / 180.0);
    var lat2 = endLat * (Math.PI / 180.0);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (EARTH_RADIUS_IN_YARDS * c).toFixed(2);
}

