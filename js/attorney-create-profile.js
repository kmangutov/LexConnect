
var userService = LexUserService("attorneys")
var logService = LexLogService();

var getForm = function() {

	var inputs = [
		"firstName",
		"lastName",
		"phone",
		"url",
		"primaryAddress",
		"secondaryAddress",
		"county",
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

	$("#attorney-create-profile-form").validate({
		rules: {

		},
		messages: {

		}

	});

	
	document.getElementById("attorney-create-profile-form").addEventListener("submit", function(event) {
		event.preventDefault();
		  // actual logic, e.g. validate the form
	  	var success = function(response) {
			//alert(JSON.stringify(response));
			logService.log("Attorney " + getForm().lastName + " successfully finished profile creation", function() {
				window.location.href = "attorney-dashboard.html";
			}, getForm());

		};

		var fail = function(response) {
			alert("Fail: " + JSON.stringify(response));
			setButtonsEnabled(true);
		}
		var passed_required = $("#attorney-create-profile-form").valid({});

		if (passed_required ==true){
			var userId = _getLoggedInUserId();			
			userService.put(userId, getForm(), success, fail);
		}
	});


/*
	$("#signup").click(function() {
		setButtonsEnabled(false);

		var success = function(response) {
			logService.log("Attorney " + getForm().lastName + " successfully finished profile creation", function() {
				window.location.href = "attorney-dashboard.html";
			}, getForm());

		};

		var fail = function() {
			alert("Fail");
			setButtonsEnabled(true);
		}

		var userId = _getLoggedInUserId();
		userService.put(userId, getForm(), success, fail);

	});
*/
});