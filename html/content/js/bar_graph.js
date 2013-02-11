        
$(document).ready(function() 
{
    $(".view_tabs li").click(function() 
    {
        myToggle($(this).attr('id'));
    });
    
    $(".round_tabs li").click(function() 
    {
        changeToRound($(this).attr('id'));
    });
    
    document.getElementById(mapRound).className += ' selected_tab'; 
});
        
        
      
var graphView = 'v1';
var mapRound = localStorage.getObject('rounds')[0].rid;

function changeView(view)
{
    document.getElementById(graphView).className = ""; 
    document.getElementById(view).className += ' selected_tab'; 
    graphView = view;
}       

function changeToRound(rid) 
{     
    document.getElementById(mapRound).className = "";
    document.getElementById(rid).className += ' selected_tab'; 
    mapRound = rid;
}

function myToggle(id)
{
    changeView(id);
    
    if(id === 'v1')
    {
            $("#containerWood").show();
    }
    else if(id === 'v2')
    {
            $("#containerHybrid").show();
    }
    else if(id === 'v3')
    {
            $("#containerIron").show();
    }
    else if(id === 'v4')
    {
            $("#containerWedge").show();
    }
}