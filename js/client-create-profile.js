
var userService = LexUserService("clients");
var logService = LexLogService();

var getForm = function() {

	var inputs = [
		"firstName",
		"lastName",
		"phone",
		"primaryAddress",
		"occupation",
		"employer",
		"income"
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

	$("#client-create-profile-form").validate({
		rules: {

		},
		messages: {

		}

	});

	
	document.getElementById("client-create-profile-form").addEventListener("submit", function(event) {
		event.preventDefault();
		  // actual logic, e.g. validate the form
	  	var success = function(response) {
			//alert(JSON.stringify(response));
			logService.log("Client " + getForm().lastName + " successfully finished profile creation", function() {
				window.location.href = "client-new-query.html";
			}, getForm());

		};

		var fail = function(response) {
			alert("Fail: " + JSON.stringify(response));
			setButtonsEnabled(true);
		}
		var passed_required = $("#client-create-profile-form").valid({});

		if (passed_required ==true){
			var userId = _getLoggedInUserId();			
			userService.put(userId, getForm(), success, fail);
		}
	});

/*
	$("#signup").click(function() {
		setButtonsEnabled(false);

		//TODO: VALIDATE FORM
		var passed_required = $("#client-create-profile-form").valid({});

		if (passed_required == true){
			var success = function(response) {
			//alert(JSON.stringify(response));

			logService.log("Client " + getForm().lastName + " successfully finished profile creation", function() {
				window.location.href = "client-new-query.html";
			}, getForm());

			};

			var fail = function(response) {
				alert("Fail: " + JSON.stringify(response));
				setButtonsEnabled(true);
			}

			var userId = _getLoggedInUserId();
			userService.put(userId, getForm(), success, fail);

		}


	});
*/
});