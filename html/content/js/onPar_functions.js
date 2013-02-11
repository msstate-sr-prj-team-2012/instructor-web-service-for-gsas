
$(document).ready(function() 
{ 
      
    $("#selectList").change(function()
    {
        localStorage.removeItem('rounds');
        localStorage.setItem('name',$(this).text());
        localStorage.setItem('id', $(this).val());
        document.location.href = '/rounds';
    });
    
    
    $("#golferID").keypress(function(e) 
    {
        if (e.which == 13) 
        {
            e.preventDefault();
            
            var u = new User($(this).val());
            localStorage.removeItem('rounds');
            localStorage.setItem('name', u.name());
            localStorage.setItem('id',u.ID());       
            document.location.href = '/rounds';             
        }
    });
    

    $("#submit").click(function() 
    {
        var rounds = [];
        $("input:checkbox:checked").each(function()
        {
            var round = new Round($(this).val());
            rounds.push(round);
        })
        localStorage.setObject('rounds',rounds);
        document.location.href = "/table";
    });


    if(typeof(Storage) === "undefined")
    {
        alert("NOTICE: Your browser is not up to date and will not support this web " +
        "application. Please upgrade your browser to the latest release before continuing.");
        window.open("https://www.google.com/intl/en/chrome/browser/");
    }
        

    
    /* conditional statements to show which functions are executed
     * pathnames need to be verified
     * 
    var pathname = window.location.pathname;
    if(pathname === '/')
    {
        createHomeMenu();
    }
    if(pathname === '/rounds')
    {
        createRoundsMenu();
        populateRounds();
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
        var u = users[i];
        var memberName = u.name();
        var id = u.ID();
        document.getElementById("selectList").add(new Option(memberName, id));
    }
}



function createHomeMenu()
{
    var memberName = localStorage.getItem('name');
    var rounds = localStorage.getItem('rounds');
    var nav = document.getElementById("nav")
    
    if(rounds === null && memberName === null)
    {
        nav.innerHTML=
        "<ul>\n" +
            "<li class=\"selected_tab\"><a href=\"/\">home</a></li>\n" +
        "</ul>\n";
    }
    else if(rounds === null)
    {
        nav.innerHTML=
        "<ul>\n" +
            "<li class=\"selected_tab\"><a href=\"/\">home</a></li>\n" +
            "<li><a href=\"/rounds\">rounds</a></li>\n" +
        "</ul>\n";
    }
    else
    {
        nav.innerHTML=
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
    var rounds = localStorage.getItem('rounds');
    var nav = document.getElementById("nav")
    
    if(rounds === null)
    {
        nav.innerHTML=
        "<ul>\n" +
            "<li><a href=\"/\">home</a></li>\n" +
            "<li class=\"selected_tab\"><a href=\"/rounds\">rounds</a></li>\n" +
        "</ul>\n";
    }
    else
    {
        nav.innerHTML=
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



function currentlyViewing()
{
    var memberName = localStorage.getItem('name'); 
    if(memberName === null)
    {
        document.location.href = '/';
    }        
    else
    {
        var currently_viewing = document.getElementById("currently_viewing");
        currently_viewing.innerHTML= "<span>currently viewing:</span>" + memberName;
    }

}



function populateRounds()
{
    var rounds = new RoundGetAll(localStorage.getItem('id'));
    var html = '';
    for(var i = 0; i < rounds.length; i++)
    {
        var r = rounds[i];
        var id = r.rid;
        var date = r.startTime;
        html += "<input type=\"checkbox\" value='" +id+ "'> " + date + "<br/>\n";
    }
    document.getElementById("date_list").innerHTML = html;
}



function createRoundTabs()
{
    var rounds = localStorage.getObject('rounds');
    var html = '<ul>\n';
    for (var i = 0; i < rounds.length; i++)
    {
        var r = rounds[i];
        var rid = r.rid;
        var date = r.startTime;
        html += "<li id=\'" + rid + "'\">" + date + "</li>\n";
    }
    html += "</ul>\n";
    document.getElementByClassName("round_tabs").innerHTML = html;
}



Storage.prototype.setObject = function(key, value) 
{
    this.setItem(key, JSON.stringify(value));
}


Storage.prototype.getObject = function(key) 
{
    var value = this.getItem(key);
    return value && JSON.parse(value);
}
