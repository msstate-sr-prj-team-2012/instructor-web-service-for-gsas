/****************************************************************************
 *
 * Global Variables
 *
 ****************************************************************************/
var userID = null;
var user = null;
$(document).ready(function () {
    getUserData();
	$('#userform').hide();
	$('#roundselect').hide();
	
	$(document).on("click", "#editGolfer", function(){
        //load the user data into the form for editing
		userID = document.getElementById('uID');
		user = new User(userID);
		document.getElementById('ufname') = user.name;
		document.getElementById('ulname') = user.name;
		document.getElementById('email') = user.email;
		document.getElementById('memberID') = user.email;		
		document.getElementById('birthyear') = user.birthdate;
		document.getElementById('gender') = user.DBgender;
		$('#userform').show();
		
		//Add rounds functionality
		
		$(document).on("click", '#save', function(){
		//update user
		}
     
		
    });
	
	$(document).on("click", "#deleteGolfer", function(){
        //display a warning message.  If confirm, delete user
		var r = confirm("WARNING: pressing this button results in the selected user being deleted.\nPress OK to continue or cancell to stop the deletion.");
		if (r==true)
		{
			//delete user
			userID = $("#golfer_select").select2('data').id);
			user = new User(userID);
			user.del();
		}
		
    });
	$(document).on("click", "#addGolfer", function(){
        //load an empty user form.
		
    });
	
	//Load all user data 
	$('#golfer_select').select2({
        data:select2SelectFieldData()
    });
});

