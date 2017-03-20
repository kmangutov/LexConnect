
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
		    ev.preventDefault();
		    // Remove existing iframe
		    $('#twtrshare iframe').remove();
		    // Generate new markup
		    $('#twtrshare').attr('href', "https://twitter.com/intent/tweet?text="+ encodeURIComponent("Need a lawyer? Try Zealous!") +"&url="+ encodeURIComponent("http://tryzealous.com/?r="+generateCode()));
		    twttr.widgets.load();
});

$('#fbshare').click(function() {
	  FB.ui({
	    method: 'share',
	    mobile_iframe: true,
	    quote: 'Need a Lawyer? Try Zealous!',
	    href: 'tryzealous.com/?r='+generateCode(),
	  }, function(response){
	  	console.log(response);
	  });
});

/*
document.getElementById('copyBtn').onclick = function() {
			// Copies a string to the clipboard. Must be called from within an 
			// event handler such as click. May return false if it failed, but
			// this is not always possible. Browser support for Chrome 43+, 
			// Firefox 42+, Safari 10+, Edge and IE 10+.
			// IE: The clipboard feature may be disabled by an administrator. By
			// default a prompt is shown the first time the clipboard is 
			// used (per session).
			function copyToClipboard(text) {
			    if (window.clipboardData && window.clipboardData.setData) {
			        // IE specific code path to prevent textarea being shown while dialog is visible.
			        return clipboardData.setData("Text", text); 

			    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
			        var textarea = document.createElement("textarea");
			        textarea.textContent = text;
			        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
			        document.body.appendChild(textarea);
			        textarea.select();
			        try {
			            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
			        } catch (ex) {
			            console.warn("Copy to clipboard failed.", ex);
			            return false;
			        } finally {
			            document.body.removeChild(textarea);
			        }
			    }
			}

			copyToClipboard(linkText.text());
}
*/

$(document).ready(function() {
	submitButton.prop('disabled', false);
	hiddenForm.hide();
	initValidation();
	initListeners();
});