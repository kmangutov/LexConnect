
var user = _getLoggedInUser();

if(jQuery.isEmptyObject(user)) {
	alert("Please login");
	window.location.href = _LOGIN_PAGE;
} else {

}

$("#href-logout").click(function() {
	Lockr.set("user", {});
	window.location.href = _LOGIN_PAGE;
});