
var logConnectService = LexConnectService('logs');

var instance = Math.random();

// 'page' represents string page identifier
var LexLogService = function(page) {

	// Keep track of format backwards-compatability
	var VERSION = 1;

	// Add metadata (source, session) to an object
	var wrap = function(data) {
		var metadata = {
			page: page,
			instance: instance,
			version: VERSION,
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

	// Spent 3 hours trying to log unload I give up

	return {
		pageLoad: pageLoad,

		click: function(id, extras) {
			var obj = {
				event: "ELEMENT_CLICK",
				source: id,
			}
			if (extras) {
				obj = $.extend(obj, extras);
			}
			
			return logConnectService.post(wrap(obj));
		},

		/*
			Binds a link to client function, with us logging the click in between.
			This is to ensure that logging is complete before we redirect.

			elem: jQuery element to listen for click. Will be disabled during RPC.
			callback: Callback after RPC finished.
		*/
		bind: function(elem, callback) {
			elem.click(function() {
				elem.prop('disabled', true);
				var obj = {
					event: "CLICK",
					source: elem.attr('id'),
				};
				logConnectService.post(wrap(obj)).then(function() {
					elem.prop('disabled', false);
					if (callback) {
						callback();
					}
				}).catch(function(result) {alert(result);});
			});
		},

		/*
			Binds dropdown changes to logging.
		*/
		bindDropdown: function(elem, callback) {
			elem.change(function() {
				var val = elem.val();
				var text = elem.find('option:selected').text();

				var obj = {
					event: "CHANGE",
					source: elem.attr('id'),
					val: val,
					text: text,
				}
				logConnectService.post(wrap(obj)).then(function() {
					if (callback) {
						callback();
					}
				}).catch(function(result) {alert(result);});
			});
		}
	}











}