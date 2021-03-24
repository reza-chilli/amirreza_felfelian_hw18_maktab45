function editUser () {
  let newUserName = document.getElementById("newUser").value;
  $.ajax(
  {
    method : "POST",
    data : {"username" : newUserName},
    url : "/dashboard/editUser",
    success : function() {
      window.location.href = '/dashboard'
    }
  });
}