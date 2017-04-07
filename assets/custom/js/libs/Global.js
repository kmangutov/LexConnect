
// Saving to localstorage takes time. Wait for it to happen.
var _redirect = function(href) {
	setTimeout(function() {
		location.href = href;
	}, 15);
}