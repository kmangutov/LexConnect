

console.log("wtf " + JSON.stringify(Lockr.get("history")));

var html = "<table>";
Lockr.get("history").forEach(function(row) {
	html += "<tr><td>" + row.question + "</td><td>" + row.answer + "</td></tr>";
});
html += "</table>";


$('#submit').click(function() {

	$('#submit').text("Working...");
	$('#submit').prop('disabled', true);

	var obj = {
		zip: $('#zipcode').val(),
		email: $('#email').val(), 
		html: html
	}
	emailjs.send("gmail", "form_submission", obj)
		.then(function(response) {
			window.location.href = "thanks.html";
		});

});