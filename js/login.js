

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
	$("#client-signup-form").validate({
		rules: {
			confirm_password: {
				required: true,
				minlength: 0,
				equalTo: '#passwordInput'
			},
			email: {
				required: true,
				email: true
			}
		},
		messages: {
			confirm_password: {
				required: "Please provide a password",
				minlength: "Your password must be at least 5 characters long",
				equalTo: "Please enter the same password as above"
			},
			email: "Please enter a valid email address"

		}

	});
	$("#attorney-signup-form").validate({
		rules: {
			confirm_password: {
				required: true,
				minlength: 0,
				equalTo: '#passwordInput'
			},
			email: {
				required: true,
				email: true
			}
		},
		messages: {
			confirm_password: {
				required: "Please provide a password",
				minlength: "Your password must be at least 5 characters long",
				equalTo: "Please enter the same password as above"
			},
			email: "Please enter a valid email address"

		}

	});


	setButtonsEnabled(true);
	$("#login").click(function() {

		//setButtonsEnabled(false);

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

	//oneElement.adEventListener("click", doSomething, false);
	if (document.getElementById("attorney-signup-form")){
		document.getElementById("attorney-signup-form").addEventListener("submit", function(event) {
			event.preventDefault();
			  // actual logic, e.g. validate the form

			var success = function(data) {
				logService.log(_USE_DB + " successful signup: " + getForm().user, function(){
					console.log("SIGNUP SUCCESS: " + JSON.stringify(data))
					Lockr.set("user", data);
					window.location.href = _REGISTER_NEXT_PAGE;
				});

			};

			var fail = function(data) {


				alert("Email is taken");
				setButtonsEnabled(true);
			};


			//setButtonsEnabled(false);
			var passed_required = $("#attorney-signup-form").valid({});
			//passed_required = true;



			if(passed_required ==true){
				//setButtonsEnabled(false);
				userService.register(getForm(), success, fail);
			}

		})
	}

	if (document.getElementById("client-signup-form")){
		document.getElementById("client-signup-form").addEventListener("submit", function(event) {
			event.preventDefault();
			  // actual logic, e.g. validate the form

			var success = function(data) {
				logService.log(_USE_DB + " successful signup: " + getForm().user, function(){
					console.log("SIGNUP SUCCESS: " + JSON.stringify(data))
					Lockr.set("user", data);
					window.location.href = _REGISTER_NEXT_PAGE;
				});

			};

			var fail = function(data) {


				alert("Email is taken");
				setButtonsEnabled(true);
			};


			//setButtonsEnabled(false);
			var passed_required = $("#client-signup-form").valid({});
			//passed_required = true;



			if(passed_required ==true){
				//setButtonsEnabled(false);
				userService.register(getForm(), success, fail);
			}

		})
	}



//SHOULDNT BE NECCESSARY ANYMORE
//THE FORM TAKES CARE OF ENTER BUTTON AND BUTTON (SINCE ITS SUBMIT TYPE)
/*
	$("#signup").click(function() {

		var success = function(data) {
			logService.log(_USE_DB + " successful signup: " + getForm().user, function(){
				console.log("SIGNUP SUCCESS: " + JSON.stringify(data))
				Lockr.set("user", data);
				window.location.href = _REGISTER_NEXT_PAGE;
			});

		};

		var fail = function(data) {


			alert("Email is taken");
			setButtonsEnabled(true);
		};


		//setButtonsEnabled(false);
		var passed_required = $("#client-signup-form").valid({});
		//passed_required = true;



		if(passed_required ==true){
			//setButtonsEnabled(false);
			userService.register(getForm(), success, fail);
		}


	});


	*/
});