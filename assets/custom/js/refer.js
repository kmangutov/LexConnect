
var nameTextField = $('#name');
var emailTextField = $('#email');

var referralInfoForm = $('#referral-info');
var submitButton = $('#submit');

var hiddenForm = $('#hidden-form');
var linkText = $('#referral-link');

logService = LexLogService("refer");

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
	var logPromise = logService.click("sendEmail", obj);
	var emailPromise = emailjs.send("gmail", "create_referral_link", obj);
	emailPromise.then(callback);
}

var initListeners = function(ev) {
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

//below are functions to set the share links for fb and twitter
//copy function just copies it to clipbaord

$('#twtrshare').click(function(ev) {

			logService.click("twitterShare");

		    ev.preventDefault();
		    // Remove existing iframe
		    $('#twtrshare iframe').remove();
		    // Generate new markup
		    $('#twtrshare').attr('href', "https://twitter.com/intent/tweet?text="+ encodeURIComponent("Need a lawyer? Try Zealous!") +"&url="+ encodeURIComponent("http://tryzealous.com/?r="+generateCode()));
		    twttr.widgets.load();
});

$('#fbshare').click(function() {

	logService.click("fbShare");

	  FB.ui({
	  	app_id:  403623496664520,
	    method: 'share',
	    mobile_iframe: true,
	    quote: 'Need a Lawyer? Try Zealous!',
	    href: 'tryzealous.com/?r='+generateCode(),
	  }, function(response){
	  	console.log(response);
	  });
});


$(document).ready(function() {
	submitButton.prop('disabled', false);
	hiddenForm.hide();
	initValidation();
	initListeners();
});