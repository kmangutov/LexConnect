
var user = _getLoggedInUser();

if(jQuery.isEmptyObject(user)) {
	alert("Please login");
	window.location.href = _LOGIN_PAGE;
} else {

}