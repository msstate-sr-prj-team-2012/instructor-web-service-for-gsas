// file to act as sessions
// FILE IS OBSOLETE AND UNUSED
// EVERYTHING HAS BEEN REWORKED INTO select_golfer.js

$(document).ready(function() {
    $("#submit").click(function() {
        setRounds(document.getElementByID("rounds").children);
    });
});


function setMember(id, name) 
{    
    localStorage['id'] = id;
    localStorage['name'] = name;
}
function setRounds(rounds)
{
    roundArray = [];
    for (var i=0;i<rounds.length;i++)
	if (rounds[i].checked)
            roundArray.push(rounds[i].value);
    localStorage['rounds'] = roundArray;
}
function getMemberName()
{
    return localStorage['name'];
}
function getMemberID()
{
    return localStorage['id'];
}
function getRounds()
{
    return localStorage['rounds'];
}