

var userService = LexUserService("attorneys")

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
			console.log("login success " + JSON.stringify(data));
		};

		var fail = function(data) {
			alert("Invalid credentials");
		};

		userService.login(getForm(), success, fail);


	});

	$("#signup").click(function() {

		var success = function(data) {
			console.log("signup success " + JSON.stringify(data));
		};

		var fail = function(data) {
			alert("Email is taken");
		};

		userService.register(getForm(), success, fail);

	});
});