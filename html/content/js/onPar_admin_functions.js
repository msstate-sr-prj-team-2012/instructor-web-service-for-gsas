/****************************************************************************
 *
 * Global Variables
 *
 ****************************************************************************/

var userData = [];
var users = localStorage.getObject('rounds');

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
    for(var i = 0; i < 10/*users.length*/; i++){
        userData.push({
                userName: "Chad McDaniel, //users[i].name,
                userEmail: ccm290@msstate.edu//users[i].email 
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
                {name:'User Name', index:'user', width: 140, sorttype: 'string', align:'center'},
                {name:'Email', index:'email', width:400, align:'center', sorttype:'string', align:'center'},
            ],
            rowNum:5,
            rowList:[3,5,10],
            pager: '#pager',
            sortname: 'User Name',
            viewrecords: true,
            sortorder: "asc",
            caption:"Users",
            height: "100%",
            width: 700,

            // change of round will reload round and shot table
            onSelectRow: function(id){ 
                getUserData();   
             }
        })
 }
 
 function getUserData()
 {
 
 }