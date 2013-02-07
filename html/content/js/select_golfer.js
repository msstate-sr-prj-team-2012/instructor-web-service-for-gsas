
$(document).ready(function() {

    $("#selectList").change(function(){
//        createCookie($(this).val()); 
        
        setMember($(this).val(), $(this).text()); // my current javascript "session" variables
        document.location.href = 'select_rounds.html';
    });


    $("#golferID").keypress(function(e) {
        if (e.which == 13) {
            e.preventDefault();
//            createCookie($(this).val()); 
            
            var u = new User($(this).val());
            setMember(u.memberID(), u.name());
            
            document.location.href = 'select_rounds.html';
        }
    });
    
});

var users = UserGetAll();
for(var i = 0; i < users.length; i++)
{
    var u = users[i];
    var memberName = u.name();
    var memberID = u.memberID();
    document.getElementById("selectList").add(new Option(memberName, memberID));
}



onload=function()
{
  var memberName = getMemberName();
  if(memberName)
  {
      var currently_viewing = document.getElementById("memberName")
      currently_viewing.innerHTML=memberName;
  }
}