

var userService = LexUserService(_USE_DB);
var logService = LexLogService();

var getForm = function() {
	var user = $("#emailInput").val();
	var password = md5($("#passwordInput").val());

	return {
		user: user,
		password: password
	}
};

var setButtonsEnabled = function(enabled) {
	$("#login").prop("disabled", !enabled);
	$("#signup").prop("disabled", !enabled);
}

$(document).ready(function() {
	
	setButtonsEnabled(true);
	$("#login").click(function() {

		setButtonsEnabled(false);

		var success = function(data) {
			logService.log(_USE_DB + " successful login: " + getForm().user, function(){
				Lockr.set("user", data);	
				window.location.href = _LOGIN_NEXT_PAGE;
			});

		};

		var fail = function(data) {
			alert("Invalid credentials");
			setButtonsEnabled(true);
		};

		userService.login(getForm(), success, fail);

	});

	$("#signup").click(function() {

		setButtonsEnabled(false);

		var success = function(data) {
			logService.log(_USE_DB + " successful signup: " + getForm().user, function(){
				console.log("SIGNUP SUCCESS: " + JSON.stringify(data))
				Lockr.set("user", data);
				window.location.href = _REGISTER_NEXT_PAGE;
			});

		};

		var fail = function(data) {
			alert("Email is taken");
			setButtonsEnabled(true);h
		};

		userService.register(getForm(), success, fail);

	});
});