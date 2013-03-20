/****************************************************************************
 *
 * Global Variables
 *
 ****************************************************************************/
var userID = null;
var user = null;
var rounds = [];
var selectedUser = false;

userChange = false;

$(document).ready(function () {

    //$('#administrative').hide();
    $('#userform').hide();
    $('#roundselect').hide();
    $('#golferreselect').hide();

    $('#golfer_select').change(function () {
        selectedUser = true;
    });


   /* $(document).on('click', '#passbtn', function () {
        var passcode = '12345';
        var entered = document.getElementById('pass').value;

        if (passcode == entered) {*/
            $('#passwordDiv').hide();
            $('#administrative').show();

            //allow admin functions
            setupPage();
        /*}
        else {
            $('#errmsg').show();
            document.getElementById('errmsg').innerHTML = "Error: Password entered incorrectly";
        }
    });*/
});

function setupPage() {

    //**********************************************************************
    //
    //Functionality for Edit Golfer button
    //
    //**********************************************************************
    $(document).on('click', '#editGolfer', function () {

        if (getID()) {
            $('#userform').show();
            $('#roundselect').hide();
			
			$('#golferreselect').show();
			$('#golferselect').hide();
			
            //Change the title of the form to "Edit Golfer"
            document.getElementById('formheader').innerText = "Edit Golfer";

            //Get User data from the database
            user = new User(userID);
            //**********

            //Setup the user form to display the user's current information
            document.getElementById('ufname').value = firstName(user.name);
            document.getElementById('ulname').value = lastName(user.name);
			
            document.getElementById('unickname').value = user.nickname;
            document.getElementById('uemail').value = user.email;
			
            document.getElementById('umemID1').value = getMemIDPart(user.memberID, "1");
            document.getElementById('umemID2').value = getMemIDPart(user.memberID, "2");
			
            document.getElementById('ubdatechange').value = user.birthDate;
            document.getElementById('save').value = 'Save Changes';
            
			if (user.gender == 'male') {
                document.getElementById('genderm').checked = true;
            }
            else {
                document.getElementById('genderf').checked = true;
            }

            if (user.hand == 'left') {
                document.getElementById('lefth').checked = true;
            }
            else {
                document.getElementById('righth').checked = true;
            }
            //****************************************************

            //If any of the form fields should change, then set the change flag to true
            $('#ufname').change(function () {
                userChange = true;
            });

            $('#ulname').change(function () {
                userChange = true;
            });

            $('#uemail').change(function () {
                userChange = true;
            });

            $('#umemID1').change(function () {
                userChange = true;
            });
			
			$('#umemID2').change(function () {
                userChange = true;
            });

            $('#unickname').change(function () {
                userChange = true;
            });

            $('#ubdatechange').change(function () {
                userChange = true;
            });

            $('#genderm').change(function () {
                userChange = true;
            });

            $('#genderf').change(function () {
                userChange = true;
            });

            $('#lefth').change(function () {
                userChange = true;
            });

            $('righth').change(function () {
                userChange = true;
            });

            //*******************************

            //Code to run when admin click "Save changes" while editing user info
            $(document).on('click', '#save', function () {
                //Flag for making sure information is validated
                var validated = false;

                //Make sure the user has changed any data before saving changes to the database
                if (userChange == true) {
                    //Append the last and first name of the user together to store in database
                    var name = document.getElementById('ulname').value + ', ' + document.getElementById('ufname').value;

                    //Save updated data to user object
                    user.name = name;
                    user.nickname = document.getElementById('unickname').value;
                    user.email = document.getElementById('uemail').value;

                    //Run the new member id through a regex to validate
					var cMemID1 = document.getElementById('umemID1').value + "M-" + checkmemberID(document.getElementById('umemID2').value);
                    if (checkmemberID(cMemID)) {
                        validated = true;
                        user.memberID = document.getElementById('umemID').value;
                    }
                    else {
                        validated = false;
                        //Throw an error
                        alert('Error: Use format NNNNM-NNNNNN, where N is any digit 0 - 9.  Example: 1234M-567890');
                    }

                    //Run the new email through a regex to validate
                    if (checkemail(document.getElementById('uemail').value)) {
                        validated = true;
                        user.email = document.getElementById('uemail').value;
                    }
                    else {
                        validated = false;
                        alert('Not a valid e-mail.  Use format abcd123@efgh.ijk');
                    }

                    user.birthDate = document.getElementById('ubdatechange').value;

                    //Save the new gender
                    if (document.getElementById('genderm').checked == true) {
                        user.gender = 'male';
                    }
                    else if (document.getElementById('genderf').checked == true) {
                        user.gender = 'female';
                    }
                    else {
                        validated = false;
                        alert("Alert:  Please select gender!");
                    }

                    //Save the new hand
                    if (document.getElementById('lefth').checked == true) {
                        user.hand = 'left';
                    }
                    else if (document.getElementById('righth').checked == true) {
                        user.hand = 'right';
                    }
                    else {
                        validated = false;
                        alert("Alert:  Please select gender!");
                    }

                    //Before saving, make sure both email and memberID were correct
                    if (validated) {
                        if (user.save()) {
                            alert("Changes Saved!");
                            $('#userform').hide();
                        }
                    }
                    //Set the user change flag to zero for another edit
                    userChange = false;
                }
                    //Alert the admin that no changes were detected
                else {
                    alert("No changes have been detected.  Please make changes before saving a user.");
                }
            });
        }
    });
    //**********************************************************************

    //**********************************************************************
    //
    //Functionality for Delete Golfer button
    //
    //**********************************************************************
    $(document).on('click', '#deleteGolfer', function () {
        if (getID()) {
            //display a warning message.  If confirm, delete user
            var r = confirm("WARNING: pressing this button results in the selected user being deleted.\nPress OK to continue or cancel to stop the deletion.");
            if (r == true) {
                //delete user
                //load the user data into the form for editing
                if (document.getElementById('uID').value == '') {
                    userID = $('#golfer_select').select2('data').id;
                }
                else {
                    userID = document.getElementById('uID').value;
                }
                user = new User(userID);

                if (user.del()) {
                    alert("User was deleted");
                }
            }
        }
    });
    //**********************************************************************

    //**********************************************************************
    //
    //Functionality for Add Golfer button
    //
    //**********************************************************************
    $(document).on('click', '#addGolfer', function () {
        //Flag for making sure information is validated
        var validated = false;

        //load an empty user form.
        $('#userform').show();
        $('#roundselect').hide();

        document.getElementById('formheader').innerText = "Add Golfer";

        user = new User();
        document.getElementById('ufname').value = '';
        document.getElementById('ulname').value = '';
        document.getElementById('unickname').value = '';
        document.getElementById('uemail').value = '';
        document.getElementById('umemID1').value = '';
        document.getElementById('umemID2').value = '';
        document.getElementById('ubdatechange').value = '';
        document.getElementById('save').value = 'Create User';

        //Add rounds functionality
        $(document).on('click', '#save', function () {
            //Append the last and first name of the user together to store in database
            var name = document.getElementById('ulname').value + ', ' + document.getElementById('ufname').value;

            //Save updated data to user object
            user.name = name;
            user.nickname = document.getElementById('unickname').value;
            user.birthDate = document.getElementById('ubdatechange').value;

            //Run the new member id through a regex to validate
			var cMemID1 = document.getElementById('umemID1').value + "M-" + checkmemberID(document.getElementById('umemID2').value);
			if (checkmemberID(cMemID)) {
				validated = true;
				user.memberID = document.getElementById('umemID').value;
			}
            else {
                validated = false;
                //Throw an error
                alert('Error: Use format NNNNM-NNNNNN, where N is any digit 0 - 9.  Example: 1234M-567890');
            }

            //Run the new email through a regex to validate
            if (checkemail(document.getElementById('uemail').value)) {
                validated = true;
                user.email = document.getElementById('uemail').value;
            }
            else {
                validated = false;
                alert('Not a valid e-mail.  Use format abcd123@efgh.ijk');
            }

            //Save the new gender
            if (document.getElementById('genderm').checked == true) {
                user.gender = 'male';
            }
            else if (document.getElementById('genderf').checked == true) {
                user.gender = 'female';
            }
            else {
                validated = false;
                alert("Alert:  Please select gender!");
            }

            //Save the new hand
            if (document.getElementById('lefth').checked == true) {
                user.hand = 'left';
            }
            else if (document.getElementById('righth').checked == true) {
                user.hand = 'right';
            }
            else {
                validated = false;
                alert("Alert:  Please select gender!");
            }

            //Before saving, make sure both email and memberID were correct
            if (validated) {
                if (user.save()) {
                    alert("Changes Saved!");
                    $('#userform').hide();
                }
            }
            //Set the user change flag to zero for another edit
            userChange = false;
        });
    });
    //**********************************************************************

    //**********************************************************************
    //
    //Functionality for Delete Rounds button
    //
    //**********************************************************************
    $(document).on('click', '#deleteRounds', function () {
        if (getID()) {
            user = new User(userID);
            $('#userform').hide();
            $('#roundselect').show();
            var tableStr = '';
            tableStr += "<tr>";
            tableStr += "<th colspan=2>";
            tableStr += 'All rounds for ' + user.name;
            tableStr += "</th>";
            tableStr += "<tr>";
            rounds = new RoundGetAll(user.userID);
            for (var i = 0; i < rounds.length; i++) {
                tableStr += "<tr>";
                tableStr += "<td>";
                tableStr += '<input type="checkbox" name="rounds" value="' + i + '" />';
                tableStr += "</td>";
                tableStr += "<td>";
                tableStr += rounds[i].startDate;
                tableStr += "</td>";
                tableStr += "<tr>";
            }
            document.getElementById('roundTable').innerHTML = tableStr;
        }
    });
	
	$(document).on('click', '#golferreselect', function () {
        $('#golferreselect').hide();
		$('#userform').hide();
		$('#golferselect').show();
    });
    //*********************************************************************
}

//**********************************************************************
//
//Other Methods
//
//**********************************************************************
function lastName(name) {
    //Find the index where the comma in the name string is
    var n = name.search(',');

    return name.slice(0, n);
}

function firstName(name) {
    //Find the index where the comma in the name string is
    var n = name.search(',');

    return name.slice(n + 1, user.name.length);
}

function getMemIDPart(memID, part)
{
	if(part == "1")
	{
		var n = memID.search('M');
		return memID.slice(0, n);
	}
	else if(part == "2")
	{
		var n = memID.search('-');
		return memID.slice(n + 1, memID.length);
	}
}

function checkmemberID(memID) {
    var re = /^[0-9]{4,4}M-[0-9]{6,6}$/;
    if (memID.search(re) == -1)
        return false;
    else
        return true;
}

function checkemail(email) {

    var re = /^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/; ///^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$/;  THis was kevins.  Wouldn't work for me
    if (email.search(re) == -1)
        return false;
    else
        return true;
}

function getID() {
    //load the user data into the form for editing
    if (selectedUser) {
        userID = $('#golfer_select').select2('data').id;
        return true;
    }

    else if (userID = document.getElementById('uID').value != '') {
        userID = document.getElementById('uID').value;
        return true;
    }
    else {
        alert('Please select a golfer or enter a member ID!');
        return false;
    }
    //**************************************************
}