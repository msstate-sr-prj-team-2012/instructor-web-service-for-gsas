
var roundsClass;
$(document).ready(function() 
{ 
      
    $("#select_field").change(function()
    {
        localStorage.removeItem('rounds');
        localStorage.setItem('userName', $("option[value='" + $(this).val() + "']").text());
        localStorage.setItem('userID', $(this).val());
        document.location.href = defines.BASE_PATH + '/rounds';
    });
    
    
    $("#input_field").keypress(function(e) 
    {
        if (e.which == 13) 
        {
            e.preventDefault();
            if($(this).val() === '') 
            {
                alert("Please enter a member id or email.");
                return;
            } 
            // if something invalid is input, the SDK will alert of the 
            // invalid input   
            // planning to change all alerts to html messages on page to avoid obtrusive popups
            var u = new User($(this).val());
            if(u.ID != null)
            {
                localStorage.removeItem('rounds');
                localStorage.setItem('userName', u.name);
                localStorage.setItem('userID',u.ID);       
                document.location.href = defines.BASE_PATH + '/rounds';   
            }       
        }
    });
    

    $(document).on("click", "#submit", function()
    {
        if($("input:checkbox:checked").length === 0)
        {
            alert("Please select at least one date to continue.");
            return;
        }
        if($("input:checkbox:checked").length > 10)
        {
            alert("You have selected " + $("input:checkbox:checked").length + " rounds.\n" +
            "A maximum of 10 rounds is allowed.");
            return;
        }
        
        var rounds = [];
        $("input:checkbox:checked").each(function()
        {
            rounds.push(new Round($(this).val()));
        })
        localStorage.setObject('rounds',rounds);
        document.location.href = defines.BASE_PATH + '/table';
    });
    

    $(document).on("click", "#more", function()
    {
        roundsClass.roundObjects.next();
        roundsClass.output();
    });


    if(typeof(Storage) === "undefined")
    {
        alert("NOTICE: Your browser is not up to date and will not support this web " +
        "application. Please upgrade your browser to the latest release before continuing.");
        window.open("https://www.google.com/intl/en/chrome/browser/");
    }
        
    populateSelectField();
    createNavigationMenu();
    if(window.location.pathname == defines.BASE_PATH + "/")
    {
//        createHomeMenu();
        document.getElementById('home').className += ' selected_tab'; 
    }
    else if(window.location.pathname === defines.BASE_PATH + "/rounds")
    {
        currentlyViewing();
//        createRoundsMenu();     
        roundsClass = new Rounds();
        document.getElementById('round').className += ' selected_tab'; 
    }
    else if(window.location.pathname === defines.BASE_PATH + "/map")
    {
        currentlyViewing();
        createRoundTabs();
        document.getElementById('map').className += ' selected_tab'; 
    }
    else if(window.location.pathname === defines.BASE_PATH + "/table")
    {
        currentlyViewing();
        createTable();
        document.getElementById('table').className += ' selected_tab'; 
    }
    else if(window.location.pathname === defines.BASE_PATH + "/spread")
    {
        currentlyViewing();
        document.getElementById('graphs').className += ' selected_tab'; 
    }
    else if(window.location.pathname === defines.BASE_PATH + "/distance")
    {
        currentlyViewing();
        createRoundsTabs();
        document.getElementById('graphs').className += ' selected_tab'; 
    }
    else if(window.location.pathname === defines.BASE_PATH + "/stats")
    {
        currentlyViewing();
        document.getElementById('stats').className += ' selected_tab'; 
    }
   
    
    
});


function createNavigationMenu()
{
    var memberName = localStorage.getItem('userName');
    var rounds = localStorage.getObject('rounds');
    
    var home = defines.BASE_PATH + "/";
    var round = defines.BASE_PATH + "/rounds";
    var table = defines.BASE_PATH + "/table";
    var spread = defines.BASE_PATH + "/spread";
    var distance = defines.BASE_PATH + "/distance";
    var map = defines.BASE_PATH + "/map";
    var stats = defines.BASE_PATH + "/stats";
    
    if(rounds === null && memberName === null)
    {
        if(window.location.pathname !== "/gsas/")
        {
            document.location.href = defines.BASE_PATH + '/';
        }
        else
        {
            document.getElementById("nav").innerHTML=
            "<ul>\n" +
                "<li id='home'><a href=\"" + home + "\">home</a></li>\n" +
            "</ul>\n";
        }
    
        
    }
    else if(rounds === null)
    {
        if(window.location.pathname !== "/gsas/" || window.location.pathname !== "/gsas/rounds")
        {
            document.location.href = defines.BASE_PATH + '/rounds';
        }
        else
        {
            document.getElementById("nav").innerHTML=
            "<ul>\n" +
                "<li id='home'><a href=\"" + home + "\">home</a></li>\n" +
                "<li id='round'><a href=\"" + round + "\">rounds</a></li>\n" +
            "</ul>\n";
        }
    
        
    }
    else
    {   
        document.getElementById("nav").innerHTML=
            "<ul>\n" +
                "<li id='home'><a href=\"" + home + "\">home</a></li>\n" +
                "<li id='round'><a href=\"" + round + "\">rounds</a></li>\n" +
                "<li id='table'><a href=\"" + table + "\">table</a></li>\n" +
                "<li id='graphs'><a>graphs</a>\n" +
                    "<ul>\n" +
                        "<li><a href=\"" + spread + "\">spread</a></li>\n" +
                        "<li><a href=\"" + distance + "\">distance</a></li>\n" +
                    "</ul>\n" +
                "</li>\n" +
                "<li id='map'><a href=\"" + map + "\">maps</a></li>\n" +
                "<li id='stats'><a href=\"" + stats + "\">maps</a></li>\n" +
            "</ul>\n";
    }
}


function populateSelectField()
{
    var users = UserGetAll();
    for(var i = 0; i < users.length; i++)
    {
        document.getElementById("select_field").add(new Option(users[i].name, users[i].ID));
    }
}
//
//
//function createHomeMenu()
//{
//    var memberName = localStorage.getItem('userName');
//    var rounds = localStorage.getObject('rounds');
//
//    var home = defines.BASE_PATH + "/";
//    
//    if(rounds === null && memberName === null)
//    {
//        document.getElementById("nav").innerHTML=
//        "<ul>\n" +
//            "<li class=\"selected_tab\"><a href=\"" + home + "\">home</a></li>\n" +
//        "</ul>\n";
//    }
//    else if(rounds === null)
//    {
//        var rounds = defines.BASE_PATH + "/rounds";
//
//        document.getElementById("nav").innerHTML=
//        "<ul>\n" +
//            "<li class=\"selected_tab\"><a href=\"" + home + "\">home</a></li>\n" +
//            "<li><a href=\"" + rounds + "\">rounds</a></li>\n" +
//        "</ul>\n";
//    }
//    else
//    {
//        var rounds = defines.BASE_PATH + "/rounds";
//        var table = defines.BASE_PATH + "/table";
//        var spread = defines.BASE_PATH + "/spread";
//        var distance = defines.BASE_PATH + "/distance";
//        var map = defines.BASE_PATH + "/map";
//
//        document.getElementById("nav").innerHTML=
//        "<ul>\n" +
//            "<li class=\"selected_tab\"><a href=\"" + home + "\">home</a></li>\n" +
//            "<li><a href=\"" + rounds + "\">rounds</a></li>\n" +
//            "<li><a href=\"" + table + "\">table</a></li>\n" +
//            "<li><a>graphs</a>\n" +
//                "<ul>\n" +
//                    "<li><a href=\"" + spread + "\">spread</a></li>\n" +
//                    "<li><a href=\"" + distance + "\">distance</a></li>\n" +
//                "</ul>\n" +
//            "</li>\n" +
//            "<li><a href=\"" + map + "\">maps</a></li>\n" +
//        "</ul>\n";
//    }
//} 
//
//
//function createRoundsMenu()
//{   
//    var home = defines.BASE_PATH + "/";
//    var rounds = defines.BASE_PATH + "/rounds";
//
//    if(localStorage.getObject('rounds') === null)
//    {
//        document.getElementById("nav").innerHTML=
//        "<ul>\n" +
//            "<li><a href=\"" + home + "\">home</a></li>\n" +
//            "<li class=\"selected_tab\"><a href=\"" + rounds + "\">rounds</a></li>\n" +
//        "</ul>\n";
//    }
//    else
//    {
//        var table = defines.BASE_PATH + "/table";
//        var spread = defines.BASE_PATH + "/spread";
//        var distance = defines.BASE_PATH + "/distance";
//        var map = defines.BASE_PATH + "/map";
//
//        document.getElementById("nav").innerHTML=
//        "<ul>\n" +
//            "<li><a href=\"" + home + "\">home</a></li>\n" +
//            "<li class=\"selected_tab\"><a href=\"" + rounds + "\">rounds</a></li>\n" +
//            "<li><a href=\"" + table + "\">table</a></li>\n" +
//            "<li><a>graphs</a>\n" +
//                "<ul>\n" +
//                    "<li><a href=\"" + spread + "\">spread</a></li>\n" +
//                    "<li><a href=\"" + distance + "\">distance</a></li>\n" +
//                "</ul>\n" +
//            "</li>\n" +
//            "<li><a href=\"" + map + "\">maps</a></li>\n" +
//        "</ul>\n";
//    }
//} 


function createRoundTabs()
{
    var rounds = localStorage.getObject('rounds');
    var html = '<ul>\n';
    for (var i = 0; i < rounds.length; i++)
    {
        html += "<li id=\'" + rounds[i].ID + "'\">" + rounds[i].startTime + "</li>\n";
    }
    html += "</ul>\n";
    document.getElementByClassName("round_tabs").innerHTML = html;
}


function currentlyViewing()
{
//    var memberName = localStorage.getItem('userName');
//    var rounds = localStorage.getObject('rounds');
//    if (memberName == null)
//    {
//        document.location.href = defines.BASE_PATH + '/';
//    }
//    else if(rounds == null)
//    {
//        if(window.location.pathname === defines.BASE_PATH + "/rounds")
//        {
//            document.getElementById("currently_viewing").innerHTML= "<span>currently viewing: </span>" + memberName;
//        }
//        else
//        {
//            document.location.href = defines.BASE_PATH + '/rounds';
//        }
//    }  
//    else
//    {
//        document.getElementById("currently_viewing").innerHTML= "<span>currently viewing: </span>" + memberName;
//    }
    document.getElementById("currently_viewing").innerHTML= 
        "<span>currently viewing: </span>" + localStorage.getItem('userName');

}

/****************************************************************************
 *
 * Rounds
 *
 ****************************************************************************/

function Rounds()
{
    this.roundObjects = new RoundGetAll(localStorage.getItem('userID'));
    this.output();
}


Rounds.prototype.output = function()
{
    var html = '';
    for (var i = 0; i < this.roundObjects.rounds.length; i++) 
    {
        html += "<label><input type=\"checkbox\" value='" + this.roundObjects.rounds[i].ID + "'> " +          
            this.roundObjects.rounds[i].startTime + "</label><br/>\n";
    }
    document.getElementById('date_list').innerHTML = html;
    this.show();
}


Rounds.prototype.show = function()
{
    if (this.roundObjects.nextPage) 
    {
        document.getElementById('buttons').innerHTML = 
            "<button id=\"submit\">submit</button><button id=\"more\">view more</button>";
    }
    else
    {
        document.getElementById('buttons').innerHTML = "<button id=\"submit\">submit</button>";
    }
}


/****************************************************************************
 *
 * Storage
 *
 ****************************************************************************/

Storage.prototype.setObject = function(key, value) 
{
    this.setItem(key, JSON.stringify(value));
}


Storage.prototype.getObject = function(key) 
{
    var value = this.getItem(key);
    return value && JSON.parse(value);
}


/****************************************************************************
 *
 * Testing pulling info from localStorage  (TEMP - very rough styling)
 * (i suggest using a data table plugin/framework)
 *
 ****************************************************************************/

function createTable()
{
    var rounds = localStorage.getObject('rounds');
    var html = '<div style="position: relative;top:100px;">\n';
    for (var i = 0; i < rounds.length; i++)
    {
        html += '<table style="border-collapse: collapse;border-spacing: 10px;border-top: 50px transparent solid;">\n';
        html += '<tr style="color:#660000;padding-top:20px;border-bottom: 1px solid #000;"><th> Round </th><th> Date </th></tr>\n';
        html += '<tr><td>' + rounds[i].ID + '</td><td>' + rounds[i].startTime + '</td></tr>\n';
        html += '<tr style="color:#660000;border-bottom: 1px solid #000;border-left: 40px transparent solid; border-top: 10px transparent solid;"><th> Holes </th><th> Par </th><th> Shots </th><th> Score </th></tr>\n';
        for(var x = 0; x < rounds[i].holes.length; x++)
        {
            html += '<tr style="border-left: 40px transparent solid;"><td>' + rounds[i].holes[x].holeNumber + '</td><td>' + rounds[i].holes[x].par + 
                    '</td><td>' + rounds[i].holes[x].shots.length + '</td><td>' + rounds[i].holes[x].holeScore + '</td></tr>';
        }
        html += '</table>\n';
    }
    html += '</div>';
    
    document.getElementById('content').innerHTML = html;
}