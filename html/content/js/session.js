
$(document).ready(function() {
    $("#submit").click(function() {
        setRounds(document.getElementByID("rounds").children);
    });
});


var memberName = '';
var memberID = '';   
var roundArray = [];

function setMember(id, name) 
{    
    memberID = id;
    memberName = name;
}
function setRounds(rounds)
{
    roundArray = [];
    for (var i=0;i<rounds.length;i++)
	if (rounds[i].checked)
            roundArray.push(rounds[i].value);
}
function getMemberName()
{
    return memberName;
}
function getMemberID()
{
    return memberID;
}
function getRounds()
{
    return roundArray;
}