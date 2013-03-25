
// imports google font library
WebFontConfig = {
google: { families: [ 'Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800:latin' ] }
};
    (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();
      
/****************************************************************************
 *
 * Global Variables
 *
 ****************************************************************************/

var EARTH_RADIUS_IN_YARDS = 13950131.0 / 2; 
var roundsClass;

   
/****************************************************************************
 *
 * Event Handlers For All User Inputs
 *
 ****************************************************************************/  

$(document).ready(function() { 
    
  
    $("#golfer_select").change(function(){
        var admin_url = document.location.href;
        admin_url = admin_url.slice(document.location.href.length - 5, document.location.href.length);

        //Make sure that the user is not on the admin page
        if (admin_url != 'admin') {
            localStorage.removeItem('rounds');
            localStorage.setItem('userID', $("#golfer_select").select2('data').id);
            document.location.href = defines.BASE_PATH + '/rounds';
        }
    });
    
    $("#input_field").keypress(function(e) {
        if (e.which == 13) {
            e.preventDefault();       
            if($(this).val() === '') {
                alert("Please enter a member id or email.");
                return;
            } 
            var u = new User($(this).val());
            if(u.ID != null){
                localStorage.removeItem('rounds');
                localStorage.setItem('userID',u.ID);       
                document.location.href = defines.BASE_PATH + '/rounds';   
            }       
        }
    });
    
    $(document).on("click", "#submit", function(){
        if($("input:checkbox:checked").length === 0){
            alert("Please select at least one date to continue.");
            return;
        }
        if($("input:checkbox:checked").length > 10){
            alert("You have selected " + $("input:checkbox:checked").length + " rounds.\n" +
            "A maximum of 10 rounds is allowed.");
            return;
        }
        
        var rounds = [];
        $("input:checkbox:checked").each(function(){
            rounds.push(new Round($(this).val()));
        })
        localStorage.setObject('rounds',rounds);
        document.location.href = defines.BASE_PATH + '/table';
    });
    
    $(document).on("click", "#more", function(){
        roundsClass.roundObjects.next();
        roundsClass.output();
    });


    if(typeof(Storage) === "undefined"){
        alert("NOTICE: Your browser is not up to date and will not support this web " +
        "application. Please upgrade your browser to the latest release before continuing.");
        window.open("https://www.google.com/intl/en/chrome/browser/");
    }

/****************************************************************************
 *
 * Runs Functions Respective To Page Viewed & Sets Navigation Highlight
 *
 ****************************************************************************/
      
    createNavigationMenu();
    $('#golfer_select').select2({
        data:select2SelectFieldData()
    });

    if(window.location.pathname == defines.BASE_PATH + "/"){
        document.getElementById('home').className += ' selected_tab'; 
    }
    else if(window.location.pathname === defines.BASE_PATH + "/rounds"){     
        document.getElementById('round').className += ' selected_tab'; 
        roundsClass = new Rounds();
    }
    else if(window.location.pathname === defines.BASE_PATH + "/maps"){
        document.getElementById('maps').className += ' selected_tab'; 
        createRoundTabs();
    }
    else if(window.location.pathname === defines.BASE_PATH + "/table"){     
        document.getElementById('table').className += ' selected_tab'; 
    }
    else if(window.location.pathname === defines.BASE_PATH + "/spread"){
        document.getElementById('spread').className += ' selected_tab';
    }
    else if(window.location.pathname === defines.BASE_PATH + "/distance"){
        document.getElementById('distance').className += ' selected_tab';
        createRoundTabs();
    }
    else if(window.location.pathname === defines.BASE_PATH + "/stats"){
        document.getElementById('stats').className += ' selected_tab'; 
        getStatData();
    }
    else if(window.location.pathname === defines.BASE_PATH + "/admin"){
        document.getElementById('admin').className += ' selected_tab'; 
    }
});



/****************************************************************************
 *
 * Creates Navigation Menu, Redirects If Necessary, & Outputs Golfer Information 
 *
 ****************************************************************************/

function createNavigationMenu(){
    var golfer = new User(localStorage.getItem('userID'));
    var rounds = localStorage.getObject('rounds');
    
    var home = defines.BASE_PATH + "/";
    var round = defines.BASE_PATH + "/rounds";
    var table = defines.BASE_PATH + "/table";
    var spread = defines.BASE_PATH + "/spread";
    var distance = defines.BASE_PATH + "/distance";
    var maps = defines.BASE_PATH + "/maps";
    var stats = defines.BASE_PATH + "/stats";
    var admin = defines.BASE_PATH + "/admin";
    
    if(golfer === null){
        if(window.location.pathname === (defines.BASE_PATH + '/')){
            document.getElementById("nav").innerHTML=
            "<ul>\n" +
                "<li id='home' class='selected_tab'><a href=\"" + home + "\">home</a></li>\n" +
            "</ul>\n";   
        }
        // redirects to home page if golfer is not selected
        else{
            document.location.href = defines.BASE_PATH + '/';
        }        
    }
    
    else if(rounds === null){
        if(window.location.pathname === (defines.BASE_PATH + '/') || window.location.pathname === (defines.BASE_PATH + '/rounds')){
            document.getElementById("nav").innerHTML=
                "<ul>\n" +
                    "<li id='home'><a href=\"" + home + "\">Home</a></li>\n" +
                    "<li id='round'><a href=\"" + round + "\">Selection</a></li>\n" +
                "</ul>\n";
            
            // prints golfer data to page
            if(window.location.pathname === (defines.BASE_PATH + '/rounds')){
                document.getElementById("currently_viewing").innerHTML= 
                    "<span>Golfer: </span>" + golfer.name + " &nbsp;&nbsp;&nbsp;&nbsp; " +
                    "<span>Age: </span>" + getAge(golfer.birthDate) + " &nbsp;&nbsp;&nbsp;&nbsp; " +
                    "<span>Sex: </span>" + golfer.gender + " &nbsp;&nbsp;&nbsp;&nbsp; " +
                    "<span>Hand: </span>" + golfer.hand + "\n";
            }
        }  
        // redirects to rounds page if rounds are not selected
        else{
             document.location.href = defines.BASE_PATH + '/rounds';
        }        
    }
    
    else{   
        document.getElementById("nav").innerHTML=
            "<ul>\n" +
                "<li id='home'><a href=\"" + home + "\">Home</a></li>\n" +
                "<li id='round'><a href=\"" + round + "\">Selection</a></li>\n" +
                "<li id='table'><a href=\"" + table + "\">Scores</a></li>\n" +
                "<li id='maps'><a href=\"" + maps + "\">Maps</a></li>\n" +
                "<li id='distance'><a href=\"" + distance + "\">Distance</a></li>\n" +
                "<li id='spread'><a href=\"" + spread + "\">Spread</a></li>\n" +
                "<li id='stats'><a href=\"" + stats + "\">Statistics</a></li>\n" +   
		"<li id='admin'><a href=\"" + admin + "\">Admin</a></li>\n" +
            "</ul>\n";
        
        // prints golfer data to page
        if (window.location.pathname !== (defines.BASE_PATH + '/') && window.location.pathname !== (defines.BASE_PATH + '/admin')) {
            document.getElementById("currently_viewing").innerHTML= 
                "<span>Golfer: </span>" + golfer.name + " &nbsp;&nbsp;&nbsp;&nbsp; " +
                "<span>Age: </span>" + golfer.age + " &nbsp;&nbsp;&nbsp;&nbsp; " +
                "<span>Sex: </span>" + golfer.gender + " &nbsp;&nbsp;&nbsp;&nbsp; " +
                "<span>Hand: </span>" + golfer.hand + "\n";
        }
    }
} // end createNavigationMenu


/****************************************************************************
 *
 * Loads Select Field With Members In Database
 *
 ****************************************************************************/

function select2SelectFieldData()
{
    var data = new Array();
    var users = UserGetAll();
    for (var i = 0; i < users.length; i++) {
        var item = { id:users[i].ID, text:users[i].name };
        data.push(item);
    }
    return data;
}


/****************************************************************************
 *
 * Creates Round Tabs 
 *
 ****************************************************************************/

function createRoundTabs(){
    var rounds = localStorage.getObject('rounds');
    
    var html = '<ul>\n';
    html += "<li id='all' title='all rounds' class='selected_tab'>all</li>\n";
    for (var i = 0; i < rounds.length; i++){
        var d = formatDate(rounds[i].startTime);
        html += "<li id='" + rounds[i].ID + "' title='" + d.date + "\n" + d.time + "'>" + (i + 1) + "</li>\n";
    }
    html += "</ul>\n";
    
    document.getElementsByClassName("round_tabs")[0].innerHTML = html;
}



/****************************************************************************
 *
 * Creates Checkboxs For Rounds Page
 *
 ****************************************************************************/

function Rounds(){
    this.roundObjects = new RoundGetAll(localStorage.getItem('userID'));
    this.output();
}

Rounds.prototype.output = function(){
    var html = "<div class='column'>";
    for (var i = 0; i < this.roundObjects.rounds.length; i++) {
        if(i !== 0 && (i%10) === 0){ 
            html += "</div>\n<div class='column'>"; 
        }
        var d = formatDate(this.roundObjects.rounds[i].startTime);
        html += "<label><input type=\"checkbox\" value='" + this.roundObjects.rounds[i].ID + "'> &nbsp;" +          
                d.date + " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + d.time + "</label><br/>\n"; 
    }
    html += "</div>";
    document.getElementById('date_list').innerHTML = html;
    this.show();
}


Rounds.prototype.show = function(){
    if (this.roundObjects.nextPage) {
        document.getElementById('buttons').innerHTML = 
            "<button id=\"submit\">submit</button><button id=\"more\">view more</button>";
    }
    else{
        document.getElementById('buttons').innerHTML = "<button id=\"submit\">submit</button>";
    }
}


/****************************************************************************
 *
 * Modifies Storage To Accept Objects
 *
 ****************************************************************************/

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}


Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}



/****************************************************************************
 *
 * Creates Statistics Table
 *
 ****************************************************************************/

var statData;
var user = new User(localStorage.getItem('userID'));

function getStatData(){   
    statData = [];
    for(var i = 0;i < 2; i++) {
        if (typeof(user.stats[2012 + i]) != 'undefined') {
            statData.push({
                year: (2012 + i),
                gir: (user.stats[2012 + i].GIR_percentage).toFixed(2),
                accuracy: (user.stats[2012 + i].driving_accuracy).toFixed(2),
                distance: (user.stats[2012 + i].driving_distance).toFixed(2) 
            });
        }
    }  
    createStatGrid();
}

function createStatGrid(){
    $("#statistics").jqGrid({
        datatype: "local",
        data: statData,
        colNames:['year', 'GIR %', 'driving accuracy', 'driving distance'],
        colModel:[
            {name:'year', index: 'year', width: 60},
            {name:'gir',index:'gir', width:60, align:'center'},
            {name:'accuracy',index:'accuracy', width:60, align:'center'},
            {name:'distance',index:'distance', width:60, align:'center'}
        ],
        rowNum:10,
        sortname: 'year',
        viewrecords: true,
        caption:"Statistics",
        height: "auto"
    });
}


/****************************************************************************
 *
 * Functions to retrieve club name, distance, and angle
 *
 ****************************************************************************/

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

function getDistance(startLat, startLon, endLat, endLon){
    var dLat = (endLat - startLat) * (Math.PI / 180.0);
    var dLon = (endLon - startLon) * (Math.PI / 180.0);
    var lat1 = startLat * (Math.PI / 180.0);
    var lat2 = endLat * (Math.PI / 180.0);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (EARTH_RADIUS_IN_YARDS * c).toFixed(2);
}

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

function enablePowerTip(){
    $('[title]').powerTip({placement: 'ne', smartPlacement: true, mouseOnToPopup: true});
}

// formats date to a more readable form
function formatDate(date){
    var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");       
    var d = new Date(date);
    var a_p;
    var hour = d.getHours();
    if (hour < 12){ a_p = "am";}
    else{a_p = "pm";}
    if (hour == 0){ hour = 12;}
    if (hour > 12){ hour -= 12;}
    
    var new_date = {
        date: d.getDate() + "-" + m_names[d.getMonth()] + "-" + d.getFullYear(),
        time: hour + ":" + d.getMinutes() + " " + a_p
    };
    
    return new_date;
}
