
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
            var u = new User($(this).val());
            if(u === null || u === '')
            {
                alert("Invalid member id or email.\n Please try again.");
                return;
            }
            localStorage.removeItem('rounds');
            localStorage.setItem('userName', u.name);
            localStorage.setItem('userID',u.ID);       
            document.location.href = defines.BASE_PATH + '/rounds';          
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
    if(window.location.pathname == "/gsas/")
    {
        createHomeMenu();
    }
    else if(window.location.pathname === "/gsas/rounds")
    {
        createRoundsMenu();     
        currentlyViewing();
        roundsClass = new Rounds();
    }
    else if(window.location.pathname === "/gsas/maps")
    {
        createRoundTabs();
        currentlyViewing();
    }
    else if(window.location.pathname === "/gsas/table")
    {
        createTable();
        currentlyViewing();
    }
    else if(window.location.pathname === "/gsas/spread")
    {
        currentlyViewing();
    }
    else if(window.location.pathname === "/gsas/distance")
    {
        createRoundsTabs();
        currentlyViewing();
    }
    else if(window.location.pathname === "/gsas/stats")
    {
        currentlyViewing();
    }
   
    
    
});



function populateSelectField()
{
    var users = UserGetAll();
    for(var i = 0; i < users.length; i++)
    {
        document.getElementById("select_field").add(new Option(users[i].name, users[i].ID));
    }
}


function createHomeMenu()
{
    var memberName = localStorage.getItem('userName');
    var rounds = localStorage.getObject('rounds');
    
    if(rounds === null && memberName === null)
    {
        document.getElementById("nav").innerHTML=
        "<ul>\n" +
            "<li class=\"selected_tab\"><a href=\"/\">home</a></li>\n" +
        "</ul>\n";
    }
    else if(rounds === null)
    {
        document.getElementById("nav").innerHTML=
        "<ul>\n" +
            "<li class=\"selected_tab\"><a href=\"/\">home</a></li>\n" +
            "<li><a href=\"/rounds\">rounds</a></li>\n" +
        "</ul>\n";
    }
    else
    {
        document.getElementById("nav").innerHTML=
        "<ul>\n" +
            "<li class=\"selected_tab\"><a href=\"/\">home</a></li>\n" +
            "<li><a href=\"/rounds\">rounds</a></li>\n" +
            "<li><a href=\"/table\">table</a></li>\n" +
            "<li><a>graphs</a>\n" +
                "<ul>\n" +
                    "<li><a href=\"/spread\">spread</a></li>\n" +
                    "<li><a href=\"/distance\">distance</a></li>\n" +
                "</ul>\n" +
            "</li>\n" +
            "<li><a href=\"/map\">maps</a></li>\n" +
        "</ul>\n";
    }
} 


function createRoundsMenu()
{   
    if(localStorage.getObject('rounds') === null)
    {
        document.getElementById("nav").innerHTML=
        "<ul>\n" +
            "<li><a href=\"/\">home</a></li>\n" +
            "<li class=\"selected_tab\"><a href=\"/rounds\">rounds</a></li>\n" +
        "</ul>\n";
    }
    else
    {
        document.getElementById("nav").innerHTML=
        "<ul>\n" +
            "<li><a href=\"/\">home</a></li>\n" +
            "<li class=\"selected_tab\"><a href=\"/rounds\">rounds</a></li>\n" +
            "<li><a href=\"/table\">table</a></li>\n" +
            "<li><a>graphs</a>\n" +
                "<ul>\n" +
                    "<li><a href=\"/spread\">spread</a></li>\n" +
                    "<li><a href=\"/distance\">distance</a></li>\n" +
                "</ul>\n" +
            "</li>\n" +
            "<li><a href=\"/map\">maps</a></li>\n" +
        "</ul>\n";
    }
} 


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
    var memberName = localStorage.getItem('userName');
    if(memberName === null)
    {
        document.location.href = defines.BASE_PATH + '/';
    }        
    else
    {
        document.getElementById("currently_viewing").innerHTML= "<span>currently viewing: </span>" + memberName;
    }

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
    $("#date_list").append(html);
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
 * Testing pulling info from localStorage
 *
 ****************************************************************************/

function createTable()
{
    var rounds = localStorage.getObject('rounds');
    var html = '<table>\n' +
                '<tr style="background-color:#660000; color:#fff;"><th> Round </th><th> Date </th></tr>\n';
    for (var i = 0; i < rounds.length; i++)
    {
        html += '<tr><td>' + rounds[i].ID + '</td><td>' + rounds[i] + '</td></tr>\n';
        html += '<tr style="background-color:#660000; color:#fff;"><th> Holes </th><th> Par </th><th> Shots </th><th> Score </th></tr>\n';
        for(var x = 0; x < rounds.holes.length; x++)
        {
            html += '<tr><td>' + rounds[i].holes[x].holeNumber + '</td><td>' + rounds[i].holes[x].par + 
                    '</td><td>' + rounds[i].holes[x].shots.length + '</td><td>' + rounds[i].holes[x].holeScore + '</td></tr>';
        }
    }
    html += '</table>\n';
    document.getElementById('content').innerHTML = html;
}