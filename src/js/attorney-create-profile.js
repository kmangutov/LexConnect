
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
		"consultation",
		"updates"
	];

	var data = {};

	inputs.forEach(function(input) {
		var val = $("#" + input + "Input").val();
		console.log(input + ":\t\t" + val);
		data[input] = val;
	});

	return data;
}

$(document).ready(function() {

	$("#signup").click(function() {

		var success = function() {
			alert("Success");
		};

		var fail = function() {
			alert("Fail");
		}

		var userId = _getLoggedInUserId();
		userService.put(userId, getForm(), success, fail);

	});
});