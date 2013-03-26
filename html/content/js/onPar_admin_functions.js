/****************************************************************************
 *
 * Global Variables
 *
 ****************************************************************************/
var userID = null;
var user = null;
var selectedUser = false;
var roundClass = [];

userChange = false;

$(document).ready(function () {
    $('#userform').hide();
    $('#roundselect').hide();
	
	$("#shortthemes a").click(function(e){
		e.preventDefault();
		$("link#theme").attr('href',$(this).attr('href'));
		$("#shortthemes a").removeClass('selected');
		$(this).addClass('selected');
	});
	
	$("#golfer_select").change(function () {
        var admin_url = document.location.href;
        admin_url = admin_url.slice(document.location.href.length - 5, document.location.href.length);

        //Make sure that the user is not on the admin page
        if (admin_url != 'admin') {
            localStorage.removeItem('rounds');
            localStorage.setItem('userID', $("#golfer_select").select2('data').id);
            document.location.href = defines.BASE_PATH + '/rounds';
        }
    });
	
    $('#golfer_select').change(function () {
        selectedUser = true;
    });
	
	$('#golfer_select').select2({
        data:select2SelectFieldData()
    });
	
	function select2SelectFieldData()
	{
		var data = new Array();
		var users = UserGetAll();
		for (var i = 0; i < users.length; i++) {
			var item = { id:users[i].ID, text:users[i].name };
			data.push(item);
		}
		return data;
	}

	$('#administrative').show();
	$('#golferreselect').hide();

	//allow admin functions
	setupPage();
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
			
			if(user.memberID != null)
			{
				document.getElementById('umemID1').value = getMemIDPart(user.memberID, "1");
				document.getElementById('umemID2').value = getMemIDPart(user.memberID, "2");
			}
			else
			{
				document.getElementById('umemID1').value = "";
				document.getElementById('umemID2').value = "";
			}
			
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
                var validated = true;

                //Make sure the user has changed any data before saving changes to the database
                if (userChange == true) {
                    //Append the last and first name of the user together to store in database
                    var name = document.getElementById('ulname').value + ', ' + document.getElementById('ufname').value;

                    //Save updated data to user object
                    user.name = name;
                    user.nickname = document.getElementById('unickname').value;
                    user.email = document.getElementById('uemail').value;

                    //Run the new member id through a regex to validate
					if(document.getElementById('umemID1').value != "" && document.getElementById('umemID2').value)
					{
						var cMemID = document.getElementById('umemID1').value + "M-" + document.getElementById('umemID2').value;
						if (checkmemberID(cMemID)) {
							user.memberID = cMemID;
						}
						else {
							validated = false;
							//Throw an error
							showError('Error: Check MemID');
						}
					}
					else
					{
						user.memberID = cMemID;
					}

                    //Run the new email through a regex to validate
                    if (checkemail(document.getElementById('uemail').value)) {
                        user.email = document.getElementById('uemail').value;
                    }
                    else {
                        validated = false;
						
						showError('Not a valid e-mail.  Use format abcd123@efgh.ijk');
                    }
					
					if(checkdate(document.getElementById('ubdatechange').value))
					{					
						user.birthDate = document.getElementById('ubdatechange').value;
					}
					else {
                        validated = false;
						
						showError('Use for YYYY-MM-DD for entering dates!');
						
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
						
						showError("Please select gender!");
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
						
						showError("Please select gender!");
                    }

                    //Before saving, make sure both email and memberID were correct
                    if (validated) {
                        if (user.save()) {
							
							//Modify the message box to show "Change
							showConfirmation("Changes Saved!");
						
                            $('#userform').hide();
							
							$('#golfer_select').select2({
								data:select2SelectFieldData()
							});
                        }
						else
						{
							showConfirmation("An error has occurred while trying to save the changes!");
						}
                    }
                    //Set the user change flag to zero for another edit
                    userChange = false;
                }
                    //Alert the admin that no changes were detected
                else {
				
					//Modify the message box to show "Change
					showError("No changes have been detected.  Please make changes before saving a user.");
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
            smoke.confirm("WARNING: pressing this button results in the selected user being deleted.\nPress OK to continue or cancel to stop the deletion.",
				function(e){
					if (e){
						user = new User(userID);
						if (user.del()) {showConfirmation("User was deleted!");}
						
						//Update the golfer selection box
						$('#golfer_select').select2({
							data:select2SelectFieldData()
						});
					}
				}
			);
        }
    });
    //**********************************************************************

    //**********************************************************************
    //
    //Functionality for Add Golfer button
    //
    //**********************************************************************
    $(document).on('click', '#addGolfer', function () {
        $('#golferreselect').show();
		$('#golferselect').hide();
		
		//Flag for making sure information is validated
        var validated = true;

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
			if(document.getElementById('umemID1').value != "" && document.getElementById('umemID2').value)
			{
				var cMemID = document.getElementById('umemID1').value + "M-" + document.getElementById('umemID2').value;
				if (checkmemberID(cMemID)) {
					user.memberID = cMemID;
				}
				else {
					validated = false;
					//Throw an error
					showError('Error: Check MemID');
				}
			}
			else
			{
				user.memberID = cMemID;
			}

            //Run the new email through a regex to validate
            if (checkemail(document.getElementById('uemail').value)) {
                user.email = document.getElementById('uemail').value;
            }
            else {
                validated = false;
				
				//Modify the message box to show "Change
				showError("Not a valid e-mail.  Use format abcd123@efgh.ijk");
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
                showError("Please select gender!");
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
                showError("Please select gender!");
            }

            //Before saving, make sure both email and memberID were correct
            if (validated) {
                if (user.save()) {
                    showConfirmation("Changes Saved!");
					
                    $('#userform').hide();
					
					//Update the golfer selection box
					$('#golfer_select').select2({
						data:select2SelectFieldData()
					});
                }
				else
				{
					showError("An error has occurred");
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
            $('#golferreselect').show();
			$('#golferselect').hide();
			
			user = new User(userID);
            $('#userform').hide();
            $('#roundselect').show();
            var tableStr = '';
			document.getElementById('roundTable').innerHTML = '';
			document.getElementById('tablehead').innerHTML = 'All rounds for ' + user.name;
			
			if(user.ID != null)
			{
				var roundClass = new RoundGetAll(user.ID);
				
				if(roundClass.rounds.length > 0)
				{
					for (var i = 0; i < roundClass.rounds.length; i++) {
						tableStr += "<tr>";
						tableStr += '<td  class="roundsDelcheckboxTd">';
						tableStr += '<input type="checkbox" value="'+ roundClass.rounds[i].ID +'" />';
						tableStr += "</td>";
						tableStr += "<td>";
						tableStr += roundClass.rounds[i].startTime;
						tableStr += "</td>";
						tableStr += "</tr>";
					}
					
					document.getElementById('roundTable').innerHTML = tableStr;
					
					$(document).on('click', '#deleteRoundButton', function () {
						if($("input:checkbox:checked").length == 0)
						{
							showError('Please select at least one date to continue.');
							return;
						}
						else
						{
							$("input:checkbox:checked").each(function(i){
								//showError($(this).val());
								roundClass.rounds[$(this).val()].del();
							});
						}
					});
					
					$('#deleteRoundButton').show();
				}
				else
				{
					document.getElementById('tablehead').innerHTML = "No rounds for this user!";
					$('#deleteRoundButton').hide();
				}
			}
        }
    });
	
	$(document).on('click', '#golferreselect', function () {
        $('#golferreselect').hide();
		$('#userform').hide();
		$('#roundselect').hide();
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

    var re = /^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/; 
	// /^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$/;  THis was kevins.  Wouldn't work for me
    if (email.search(re) == -1)
        return false;
    else
        return true;
}


function checkdate(date)
{
	var redate = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/;
	if (date.search(redate) == -1)
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
		showError('Please select a golfer or enter a member ID!');
        return false;
    }
    //**************************************************
}

function showError(error)
{
	smoke.alert('<p style="color: red;">' + error + '</p>');
}

function showConfirmation(message)
{
	smoke.alert(message);
}

function select2SelectFieldData()
{
    var data = new Array();
    var users = UserGetAll();
    for (var i = 0; i < users.length; i++) {
        var item = { id:users[i].ID, text:users[i].name };
        data.push(item);
    }
    return data;
}