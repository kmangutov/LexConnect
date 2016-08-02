

attorneysService = LexConnectService("attorneys")

$(document).ready(function() {

	alert(Lockr.get("user_id"));
	$("#login").click(function() {
		alert("clicked");

		var data = {
			user: $("#emailInput").val(),
			password: md5($("#passwordInput").val())
		}

		attorneysService.post(data, function(id) {
			alert("Success: " + id);
			Lockr.set("user_id", id);
		});
	});
});