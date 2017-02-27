
var nameTextField = $('#name');
var emailTextField = $('#email');

var referralInfoForm = $('#referral-info');
var submitButton = $('#submit');

var hiddenForm = $('#hidden-form');
var linkText = $('#referral-link');

var initValidation = function() {
	referralInfoForm.validate({
		rules: {
			name: {
				required: true,
			},
			email: {
				required: true,
				email: true
			}
		},
		messages: {
			name: "Please enter your name",
			email: "Please enter a valid email address",
		}
	});
}

var sendEmail = function(callback) {
	var obj = {
		name: nameTextField.val(),
		email: emailTextField.val(),
		code: generateCode()
	};
	var emailPromise = emailjs.send("gmail", "create_referral_link", obj);
	emailPromise.then(callback);
}

var initListeners = function() {
	submitButton.click(function() {
		if (referralInfoForm.valid()) {
			submitButton.text('Working...');
			submitButton.prop('disabled', true);

			sendEmail(function() {
				hiddenForm.show();
				linkText.text("http://tryzealous.com/?r=" + generateCode());
				submitButton.text('Thanks!');
			});
		}
	});
}

var generateCode = function() {
	var hash = md5(emailTextField.val());
	return hash.substring(0, 5);
}

$(document).ready(function() {
	submitButton.prop('disabled', false);
	hiddenForm.hide();
	initValidation();
	initListeners();
});