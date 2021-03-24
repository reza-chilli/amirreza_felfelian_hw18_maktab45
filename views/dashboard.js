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
function deleteUser () {
  $.ajax(
  {
    method : "GET",
    url : "/dashboard/deleteUser",
    success : function() {
      window.location.href = '/auth/signinPage'
    }
  });
}