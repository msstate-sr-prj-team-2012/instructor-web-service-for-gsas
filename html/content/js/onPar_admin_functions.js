/****************************************************************************
 *
 * Global Variables
 *
 ****************************************************************************/
var userID = null;
var user = null;

var changebdate = false;

$(document).ready(function () {

    //$('#administrative').hide();
    $('#userform').hide();


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
    $(document).on('click', '#editGolfer', function () {

        $('#ubdatechange').hide();
        $('#userform').show();
        
        $(document).on('click', '#datechange', function () {
            $('#ubdatechange').show();
            $('#ubdate').hide();
            $('#datechange').hide();
            changebdate = true;

        });

        //load the user data into the form for editing
        userID = document.getElementById('uID').value;
        user = new User(userID);
        document.getElementById('uname').value = user.name;
        document.getElementById('uemail').value = user.email;
        document.getElementById('umemID').value = user.memberID;
        document.getElementById('ubdate').value = user.birthDate;
        if (user.gender == 'male') {
            document.getElementById('genderm').checked = true;
        }
        else {
            document.getElementById('genderf').checked = true;
        }


        //Add rounds functionality
        $(document).on('click', '#save', function () {
            user.name = document.getElementById('uname').value;
            user.email = document.getElementById('uemail').value;
            user.memberID = document.getElementById('umemID').value;
            if (changebdate)
            {
                user.birthDate = document.getElementById('ubdatechange').value;
            }

            if (document.getElementById('genderm').checked == true) {
                user.gender = 'male';
            }
            else {
                user.gender = 'female';
            }

            user.save();
        });
    });

    $(document).on('click', '#deleteGolfer', function () {
        //display a warning message.  If confirm, delete user
        var r = confirm("WARNING: pressing this button results in the selected user being deleted.\nPress OK to continue or cancel to stop the deletion.");
        if (r == true) {
            //delete user
            userID = document.getElementById('uID');
            user = new User(userID);
            user.del();
        }
    });

    $(document).on('click', '#addGolfer', function () {
        //load an empty user form.
        $('#userform').show();
        user = new User(userID);
        document.getElementById('ufname').value = '';
        document.getElementById('ulname').value = '';
        document.getElementById('email').value = '';
        document.getElementById('email').value = '';
        document.getElementById('email').value = '';

    });
}