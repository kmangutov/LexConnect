
// Saving to localstorage takes time. Wait for it to happen.
var _redirect = function(href) {
	setTimeout(function() {
		location.href = href;
	}, 15);
}

var _getSessionId = function() {
	var id = Lockr.get("SESSION_ID");
	if (!id) {
		id = Math.random();
		Lockr.set("SESSION_ID", id);
	}
	return id;
}