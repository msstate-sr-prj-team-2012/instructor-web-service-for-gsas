
$(document).ready(function() 
{ 
      
    $("#select_field").change(function()
    {
        localStorage.removeItem('rounds');
        localStorage.setItem('userName',$(this).text());
        localStorage.setItem('userID', $(this).val());
        document.location.href = defines.BASE_PATH + '/rounds';
    });
    
    
    $("#input_field").keypress(function(e) 
    {
        if (e.which == 13) 
        {
            e.preventDefault();
            
            var u = new User($(this).val());
            localStorage.removeItem('rounds');
            localStorage.setItem('userName', u.name());
            localStorage.setItem('userID',u.ID());       
            document.location.href = defines.BASE_PATH + '/rounds';          
        }
    });
    

    $("#submit").click(function() 
    {
        var rounds = [];
        $("input:checkbox:checked").each(function()
        {
            rounds.push(new Round($(this).val()));
        })
        localStorage.setObject('rounds',rounds);
        document.location.href = defines.BASE_PATH + '/table';
    });
    
    
    $("#more").click(function() 
    {
        rounds.roundsClass.next();
        rounds.output();
    });


    if(typeof(Storage) === "undefined")
    {
        alert("NOTICE: Your browser is not up to date and will not support this web " +
        "application. Please upgrade your browser to the latest release before continuing.");
        window.open("https://www.google.com/intl/en/chrome/browser/");
    }
        

    
    /* conditional statements determine which functions are executed
     * pathnames need to be verified
     * 
    if(window.location.pathname; === '/')
    {
        createHomeMenu();
    }
    if(window.location.pathname; === '/rounds')
    {
        createRoundsMenu();
        var rounds = new Rounds();
        currentlyViewing();
    }
    else
    {
        createRoundTabs();
        currentlyViewing();
    }*/
   populateSelectField();
    
    
    
});



function populateSelectField()
{
    var users = UserGetAll();
    for(var i = 0; i < users.length; i++)
    {
        document.getElementById("select_field").add(new Option(users[i].name(), users[i].ID()));
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
        html += "<li id=\'" + rounds[i].ID() + "'\">" + rounds[i].startTime() + "</li>\n";
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
        document.getElementById("currently_viewing").innerHTML= "<span>currently viewing:</span>" + memberName;
    }

}

/****************************************************************************
 *
 * Rounds
 *
 ****************************************************************************/

function Rounds()
{
    this.roundClass = new RoundGetAll(localStorage.getItem('userID'));
    this.output();
}


rounds.prototype.output = function()
{
    var html = '';
    for (var i = 0; i < this.roundClass.rounds.length; i++) 
    {
        html += "<input type=\"checkbox\" value='" + this.roundClass.rounds[i].ID() + "'>" +          
            this.roundClass.rounds[i].startTime() + "<br/>\n";
    }
    $("#date_list").append(html);
    this.show();
}


rounds.prototype.show = function()
{
    if (this.roundClass.nextPage) 
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
