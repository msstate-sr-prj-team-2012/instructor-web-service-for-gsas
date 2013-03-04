/****************************************************************************
 *
 * Global Variables
 *
 ****************************************************************************/

var userData = [];
var users = select2SelectFieldData();

$(document).ready(function () {
    getUserData();
});

/****************************************************************************
 *
 * Creates Rounds Table
 *
 ****************************************************************************/

function getUserData(){
    userData = [];
    
	for(var i = 0; i < 7; i++)
	{
        userData.push({ name: 'Chad McDaniel', userEmail: 'ccm290@msstate.edu'});
    }
	
    createUserGrid();
}

//Creates the actual table
 function createUserGrid(){
     $("#users").jqGrid({
            datatype: "local",
            data: userData,
            colNames:['Name', 'Email'],
            colModel:[
                {name:'Name',  index:'name', width:140},
                {name:'Email', index:'userEmail', width:140}
            ],
            rowNum:5,
            rowList:[3,5,10],
            pager:'#pager',
            sortname:'User Name',
            viewrecords:true,
            sortorder:"asc",
            caption:"Users",
            height:"100%",
            width:280

            // change of round will reload round and shot table
            // onSelectRow: function(id){ 
                // getUserData();   
             // }
        });
 }
 
 /*function getUserData()
 {
 
 }*/