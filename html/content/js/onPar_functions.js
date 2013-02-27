
var roundsClass;
$(document).ready(function() { 
    
    
/****************************************************************************
 *
 * Event Handlers For All User Inputs
 *
 ****************************************************************************/  
      
    $("#select_field").change(function(){
        localStorage.removeItem('rounds');
        localStorage.setItem('userName', $("option[value='" + $(this).val() + "']").text());
        localStorage.setItem('userID', $(this).val());
        document.location.href = defines.BASE_PATH + '/rounds';
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
                localStorage.setItem('userName', u.name);
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
    //populateSelectField();
    var users = {"data":select2SelectFieldData()};
    console.log(JSON.stringify(users));
    $("#golfer_select").select2({data:[{"id":1, "text":"Benton, Kevin"}]});

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

 
});



/****************************************************************************
 *
 * Creates Navigation Menu & Redirects If Necessary
 *
 ****************************************************************************/

function createNavigationMenu(){
    var memberName = localStorage.getItem('userName');
    var rounds = localStorage.getObject('rounds');
    
    var home = defines.BASE_PATH + "/";
    var round = defines.BASE_PATH + "/rounds";
    var table = defines.BASE_PATH + "/table";
    var spread = defines.BASE_PATH + "/spread";
    var distance = defines.BASE_PATH + "/distance";
    var maps = defines.BASE_PATH + "/maps";
    var stats = defines.BASE_PATH + "/stats";
    
    if(rounds === null && memberName === null){
        if(window.location.pathname === (defines.BASE_PATH + '/')){
            document.getElementById("nav").innerHTML=
            "<ul>\n" +
                "<li id='home' class='selected_tab'><a href=\"" + home + "\">home</a></li>\n" +
            "</ul>\n";   
        }
        else{
            document.location.href = defines.BASE_PATH + '/';
        }        
    }
    
    else if(rounds === null){
        if(window.location.pathname === (defines.BASE_PATH + '/') || window.location.pathname === (defines.BASE_PATH + '/rounds')){
            document.getElementById("nav").innerHTML=
                "<ul>\n" +
                    "<li id='home'><a href=\"" + home + "\">home</a></li>\n" +
                    "<li id='round'><a href=\"" + round + "\">rounds</a></li>\n" +
                "</ul>\n";
            if(window.location.pathname === (defines.BASE_PATH + '/rounds')){
                document.getElementById("currently_viewing").innerHTML= 
                "<span>currently viewing: </span>" + localStorage.getItem('userName');
            }
        }       
        else{
             document.location.href = defines.BASE_PATH + '/rounds';
        }        
    }
    
    else{   
        document.getElementById("nav").innerHTML=
            "<ul>\n" +
                "<li id='home'><a href=\"" + home + "\">home</a></li>\n" +
                "<li id='round'><a href=\"" + round + "\">rounds</a></li>\n" +
                "<li id='table'><a href=\"" + table + "\">table</a></li>\n" +
                "<li id='stats'><a href=\"" + stats + "\">stats</a></li>\n" +
                "<li id='spread'><a href=\"" + spread + "\">spread</a></li>\n" +
                "<li id='distance'><a href=\"" + distance + "\">distance</a></li>\n" +
                "<li id='maps'><a href=\"" + maps + "\">maps</a></li>\n" +
            "</ul>\n";
        if(window.location.pathname !== (defines.BASE_PATH + '/')){
            document.getElementById("currently_viewing").innerHTML= 
            "<span>currently viewing: </span>" + localStorage.getItem('userName');
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
    for (var i = 0; i < user.length; i++) {
        var item = { "id":users[i].ID, "text":users[i].name };
        console.log(JSON.stringify(item));
        data.push(item);
    }
    console.log(JSON.stringify(data));
    return data;
}

function populateSelectField(){
    var users = UserGetAll();
    for(var i = 0; i < users.length; i++) {
        document.getElementById("select_field").add(new Option(users[i].name, users[i].ID));
    }
}



/****************************************************************************
 *
 * Creates Round Tabs 
 *
 ****************************************************************************/

function createRoundTabs(){
    var rounds = localStorage.getObject('rounds');
    
    var html = '<ul>\n';
    html += "<li id='" + rounds[0].ID + "' title=' Date: " + rounds[0].startTime.split(' ')[0] + "\n Time: " + rounds[0].startTime.split(' ')[1] + "' class='selected_tab'>" + 1 + "</li>\n";
    for (var i = 1; i < rounds.length; i++){
        html += "<li id='" + rounds[i].ID + "' title=' Date: " + rounds[i].startTime.split(' ')[0] + "\n Time: " + rounds[i].startTime.split(' ')[1] + "'>" + (i + 1) + "</li>\n";
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
        html += "<label><input type=\"checkbox\" value='" + this.roundObjects.rounds[i].ID + "'> " +          
            this.roundObjects.rounds[i].startTime + "</label><br/>\n";     
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
    for(var i = 0;i < 2; i++){
        statData.push({
            year: (2012 + i),
            gir: (user.stats[2012 + i].GIR_percentage).toFixed(2),
            accuracy: (user.stats[2012 + i].driving_accuracy).toFixed(2),
            distance: (user.stats[2012 + i].driving_distance).toFixed(2) 
        })
    }  
    createStatGrid();
}

function createStatGrid(){
    $("#statistics").jqGrid({
        datatype: "local",
        data: statData,
        colNames:['year', 'GIR %', 'driving accuracy', 'driving distance'],
        colModel:[
            {name:'year', index: 'year', width: 150},
            {name:'gir',index:'gir', width:150, align:'center'},
            {name:'accuracy',index:'accuracy', width:150, align:'center'},
            {name:'distance',index:'distance', width:150, align:'center'}
        ],
        rowNum:5,
        rowList:[5,10],
        pager: '#pager',
        sortname: 'year',
        viewrecords: true,
        caption:"Statistics",
        height: "auto"
    });
}