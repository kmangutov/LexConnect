
var userService = LexUserService("attorneys")

var getForm = function() {

	var inputs = [
		"firstName",
		"lastName",
		"phone",
		"url",
		"primaryAddress",
		"secondaryAddress",
		"firmSize",
		"practice",
		"consultation"
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

		var success = function(response) {
			window.location.href = "attorney-dashboard.html";
		};

		var fail = function() {
			alert("Fail");
			setButtonsEnabled(true);
		}

		var userId = _getLoggedInUserId();
		userService.put(userId, getForm(), success, fail);

	});
});