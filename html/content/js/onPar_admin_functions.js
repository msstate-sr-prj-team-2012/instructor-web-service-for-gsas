/****************************************************************************
 *
 * Global Variables
 *
 ****************************************************************************/

var userData = [];

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
    for(var i = 0; i < 10; i++){
        userData.push({
                userName: 'Chad McDaniel ' + i,
                userEmail: 'ccm290@msstate.edu'
            });
    }
	
    createUserGrid();
}

//Creates the actual table
 function createUserGrid(){
     $("#user").jqGrid({
            datatype: "local",
            data: userData,
            colNames:['User Name', 'Email'],
            colModel:[
                {name:'User Name', index:'userName', width: 140, sorttype: 'text', align:'center'},
                {name:'Email', index:'userEmail', width:400, align:'center', sorttype:'text', align:'center'},
            ],
            rowNum: 5,
            rowList:[3,5,10],
            pager: '#pager',
            sortname: 'User Name',
            viewrecords: true,
            sortorder: "asc",
            caption:"Users",
            height: "100%",
            width: 700

            // change of round will reload round and shot table
            // onSelectRow: function(id){ 
                // getUserData();   
             // }
        });
 }
 
 function getUserData()
 {
 
 }