// used on all pages to populate select field, set currently viewing, 
// load navigation links, and set localStorage variables


$(document).ready(function() 
{ 
    // select field: stores name and id
    $("#selectList").change(function()
    {
        localStorage.removeItem('rounds');
        localStorage['name'] = $(this).text();
        localStorage['id'] = $(this).val();
        document.location.href = '/rounds';
    });


    // input field: stores name and id
    $("#golferID").keypress(function(e) 
    {
        if (e.which == 13) 
        {
            e.preventDefault();
            
            var u = new User($(this).val());
            localStorage.removeItem('rounds');
            localStorage['name'] = u.name();
            localStorage['id'] = u.ID();         
            document.location.href = '/rounds';       
        
        }
    });
    
    // stores round ids
    $("#submit").click(function() 
    {
        var rounds = [];
        $("input:checkbox:checked").each(function(){
            rounds.push($(this).val());
        })
        localStorage['rounds'] = rounds;
        document.location.href = "/table";

    });
    
    populateSelectField();
    
});



// populates select field
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


// determines which tabs are visible
function createHomeMenu()
{
    var memberName = localStorage['name'];
    var rounds = localStorage['rounds'];
    var nav = document.getElementById("nav")
    
    // loads home tab if member and rounds are not selected
    if(rounds === undefined && memberName === undefined)
    {
        nav.innerHTML=
        "<ul>" +
            "<li class=\"selected_tab\"><a href=\"/\">home</a></li>" +
        "</ul>";
    }
    // loads home and rounds tabs if member is selected but not rounds
    else if(rounds === undefined)
    {
        nav.innerHTML=
        "<ul>" +
            "<li class=\"selected_tab\"><a href=\"/\">home</a></li>" +
            "<li><a href=\"/rounds\">rounds</a></li>" +
        "</ul>";
    }
    // loads all tabs when member and rounds are selected
    else
    {
        nav.innerHTML=
        "<ul>" +
            "<li class=\"selected_tab\"><a href=\"/\">home</a></li>" +
            "<li><a href=\"/rounds\">rounds</a></li>" +
            "<li><a href=\"/table\">table</a></li>" +
            "<li><a>graphs</a>" +
                "<ul>" +
                    "<li><a href=\"/spread\">spread</a></li>" +
                    "<li><a href=\"/distance\">distance</a></li>" +
                "</ul>" +
            "</li>" +
            "<li><a href=\"/map\">maps</a></li>" +
        "</ul>";
    }

} // end createHomeMenu



// determines which tabs are visible
function createRoundsMenu()
{
    var rounds = localStorage['rounds'];
    var nav = document.getElementById("nav")
    
    // loads home and rounds tabs if rounds are not selected
    if(rounds === undefined)
    {
        nav.innerHTML=
        "<ul>" +
            "<li><a href=\"/\">home</a></li>" +
            "<li class=\"selected_tab\"><a href=\"/rounds\">rounds</a></li>" +
        "</ul>";
    }
    // loads all tabs when member and rounds are selected
    else
    {
        nav.innerHTML=
        "<ul>" +
            "<li><a href=\"/\">home</a></li>" +
            "<li class=\"selected_tab\"><a href=\"/rounds\">rounds</a></li>" +
            "<li><a href=\"/table\">table</a></li>" +
            "<li><a>graphs</a>" +
                "<ul>" +
                    "<li><a href=\"/spread\">spread</a></li>" +
                    "<li><a href=\"/distance\">distance</a></li>" +
                "</ul>" +
            "</li>" +
            "<li><a href=\"/map\">maps</a></li>" +
        "</ul>";
    }


} // end createRoundsMenu



// writes member name to page if exists, redirects otherwise
function currentlyViewing()
{
    var memberName = localStorage['name']; 
    if(memberName === undefined)
    {
        document.location.href = '/';
    }        
    else
    {
        var currently_viewing = document.getElementById("currently_viewing");
        currently_viewing.innerHTML= "<span>currently viewing:</span>" + memberName;
    }

}








