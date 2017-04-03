
var logConnectService = LexConnectService('logs');

var session = Math.random();

// 'page' represents string page identifier
var LexLogService = function(page) {

	// Add metadata (source, session) to an object
	var wrap = function(data) {
		var metadata = {
			page: page,
			session: session,
		}
		return $.extend(data, metadata);
	}

	var pageLoad = function() {
		var obj = {
			event: "PAGE_LOAD",
		}
		return logConnectService.post(wrap(obj));
	}

	// If we're initializing this the page is laoded
	pageLoad();

	return {
		pageLoad: pageLoad,

		click: function(id) {
			var obj = {
				event: "ELEMENT_CLICK",
				source: id,
			}
			return logConnectService.post(wrap(obj));
		},

		// Binds a link to client function, with us logging the click in between.
		bind: function(id, callback) {
			var elem = $("#" + id);
			elem.click(function() {
				elem.prop('disabled', true);
				var obj = {
					event: "ELEMENT_CLICK",
					source: id,
				};
				logConnectService.post(wrap(obj)).then(function() {
					elem.prop('disabled', false);
					callback();
				});
			});
		}
	}
}