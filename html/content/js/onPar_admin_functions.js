/****************************************************************************
 *
 * Global Variables
 *
 ****************************************************************************/
var userID = null;
var user = null;

var changebdate = false;
var rounds = [];

$(document).ready(function () {
    $('#golfer_select2').select2({
        data: select2SelectFieldData()
    });

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

        $('#ubdate').show();
        $('#datechange').show();
        $('#ubdatechange').hide();
        $('#ubdatechangetext').hide();
        $('#roundselect').hide();
        $('#userform').show();

        document.getElementById('formheader').innerText = "Edit Golfer";
        
        $(document).on('click', '#datechange', function () {
            $('#ubdatechange').show();
            $('#ubdatechangetext').show();
            $('#ubdate').hide();
            $('#datechange').hide();
            changebdate = true;

        });

        //load the user data into the form for editing
        if (document.getElementById('uID').value != '')
        {
            userID = document.getElementById('uID').value;
        }
        else if (document.getElementById('golfer_select2').value != '')
        {
            userID = $('#golfer_select2').select2('data').userID;
        }

        user = new User(userID);
        document.getElementById('uname').value = user.name;
        document.getElementById('uemail').value = user.email;
        document.getElementById('umemID').value = user.memberID;
        document.getElementById('ubdate').value = user.birthDate;
        document.getElementById('save').value = 'Save Changes';
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
        $('#ubdate').hide();
        $('#datechange').hide();
        $('#ubdatechange').show();
        $('#ubdatechangetext').show();
        $('#roundselect').hide();
        $('#userform').show();

        document.getElementById('formheader').innerText = "Add Golfer";

        user = new User();
        document.getElementById('uname').value = '';
        document.getElementById('uemail').value = '';
        document.getElementById('umemID').value = '';
        document.getElementById('ubdate').value = '';
        document.getElementById('save').value = 'Create User';

        //Add rounds functionality
        $(document).on('click', '#save', function () {
            user.name = document.getElementById('uname').value;
            user.email = document.getElementById('uemail').value;
            user.memberID = document.getElementById('umemID').value;
            user.birthDate = document.getElementById('ubdatechange').value;

            if (document.getElementById('genderm').checked == true) {
                user.gender = 'male';
            }
            else {
                user.gender = 'female';
            }

            user.save();
        });
    });

    $(document).on('click', '#deleteRounds', function () {
        $('#userform').hide();
        $('#roundselect').show();
        var tableStr = '';
        tableStr += "<tr>";
        tableStr += "<th colspan=2>";
        tableStr += 'All rounds for '; //+ user.name;
        tableStr += "</th>";
        tableStr += "<tr>";
        /*rounds = new RoundGetAll(user.userID);
        for(var i = 0; i < rounds.length; i++)
        {
            tableStr += "<tr>";
            tableStr += "<td>";
            tableStr += '<input type="checkbox" name="rounds" value="' + i + '" />';
            tableStr += "</td>";
            tableStr += "<td>";
            tableStr += rounds[i].startDate;
            tableStr += "</td>";
            tableStr += "<tr>";
        }*/
        document.getElementById('roundTable').innerHTML = tableStr;
    });
}