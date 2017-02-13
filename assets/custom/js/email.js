

console.log("wtf " + JSON.stringify(Lockr.get("history")));

var html = "<table>";

if(Lockr.get("history")){
Lockr.get("history").forEach(function(row) {
	html += "<tr><td>" + row.question + "</td><td>" + row.answer + "</td></tr>";
});
}

html += "</table>";

$(document).ready(function() {

	$("#client-signup-form").validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			zipcode: {
				required: true,
				digits: true,
				minlength: 5,
				maxlength: 5
			}
		},
		messages: {
			email: "Please enter a valid email address",
			zipcode: "Please enter a valid 5 digit zipcode"
		}

});

	$('#Submit').click(function() {
		if($("#client-signup-form").valid()){

			$('#Submit').text("Please Wait...");
			$('#Submit').prop('disabled', true);

			var obj = {
				zip: $('#zipcode').val(),
				email: $('#email').val(), 
				html: html
			}
			emailjs.send("gmail", "form_submission", obj).then(function (response2) {
				emailjs.send("gmail", "email_submission_thanks", obj).then(function (response) {
					window.location.href = "thanks.html";
				});
			});
		}

	});
});