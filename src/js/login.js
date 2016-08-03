

var userService = LexUserService(_USE_DB);

var getForm = function() {
	var user = $("#emailInput").val();
	var password = md5($("#passwordInput").val());

	return {
		user: user,
		password: password
	}
};

$(document).ready(function() {
	
	$("#login").click(function() {

		var success = function(data) {
			Lockr.set("user", data);	
			window.location.href = _LOGIN_NEXT_PAGE;
		};

		var fail = function(data) {
			alert("Invalid credentials");
		};

		userService.login(getForm(), success, fail);

	});

	$("#signup").click(function() {

		var success = function(data) {
			Lockr.set("user", data);
			window.location.href = _REGISTER_NEXT_PAGE;
		};

		var fail = function(data) {
			alert("Email is taken");
		};

		userService.register(getForm(), success, fail);

	});
});