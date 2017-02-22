


$(document).ready(function() {

	$("#referral-signup-form").validate({
		rules: {
			email: {
				required: true,
				email: true
			}

		},
		messages: {
			email: "Please enter a valid email address",
		}

});

	$('#Submit').click(function() {
		if($("#referral-signup-form").valid()){

			$('#Submit').text("Please Wait...");
			$('#Submit').prop('disabled', true);

			var obj = {
				name: $('#name').val(),
				email: $('#email').val()
			}

			emailjs.send("gmail", "form_submission", obj).then(function (response2) {
				emailjs.send("gmail", "email_submission_thanks", obj).then(function (response) {
					window.location.href = "thanks.html";
				});
			});
		}

	});
});