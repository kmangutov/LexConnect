
var userService = LexUserService("clients")

var getForm = function() {

	var inputs = [
		"firstName",
		"lastName",
		"phone",
		"primaryAddress",
		"secondaryAddress",
		"occupation",
		"employer",
		"income",
		"updates"
	];

	var data = {};

	inputs.forEach(function(input) {
		var val = $("#" + input + "Input").val();
		data[input] = val;
	});

	return data;
}

var setButtonsEnabled = function(enabled) {
	$("#signup").prop("disabled", !enabled);
}

$(document).ready(function() {

	setButtonsEnabled(true);
	$("#signup").click(function() {
		setButtonsEnabled(false);

		//TODO: VALIDATE FORM

		var success = function(response) {
			//alert(JSON.stringify(response));
			window.location.href = "client-new-query.html";
		};

		var fail = function(response) {
			alert("Fail: " + JSON.stringify(response));
			setButtonsEnabled(true);
		}

		var userId = _getLoggedInUserId();
		userService.put(userId, getForm(), success, fail);

	});
});