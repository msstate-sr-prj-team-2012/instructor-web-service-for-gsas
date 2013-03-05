/****************************************************************************
 *
 * Global Variables
 *
 ****************************************************************************/
var userID = null;
var user = null;

$(document).ready(function () {

    $('#aadministrative').hide();

    $(document).on('click', '#passbtn', function () {
        var passcode = '12345';
        var entered = document.getElementById('pass').value;

        if (passcode == entered) {
            $('#passwordDiv').hide();
            $('#administrative').show();

            //allow admin functions
            setupPage();
        }
        else {
            documet.getElementById('errmsg').innerHTML = "Error: Password entered incorrectly";
            $('#errmsg').show();
        }
    });
});

function setupPage()
{
	$(document).on('click', '#editGolfer', function(){
        //load the user data into the form for editing
		userID = document.getElementById('uID');
		user = new User(userID);
		document.getElementById('ufname').value = user.name;
		document.getElementById('ulname').value = user.name;
		document.getElementById('email').value = user.email;
		document.getElementById('memberID').value = user.email;
		document.getElementById('birthyear').value = user.birthdate;
		document.getElementById('gender').value = user.DBgender;

		//Add rounds functionality
		
		$(document).on('click', '#save', function(){
		//update user
            var name = null;
		});
    });
	
	$(document).on('click', '#deleteGolfer', function(){
        //display a warning message.  If confirm, delete user
		var r = confirm("WARNING: pressing this button results in the selected user being deleted.\nPress OK to continue or cancel to stop the deletion.");
		if (r==true)
		{
			//delete user
			userID = document.getElementById('uID');
			user = new User(userID);
			user.del();
		}
    });
	
	$(document).on('click', '#addGolfer', function(){
        //load an empty user form.
		$('#userform').show();
    });
}