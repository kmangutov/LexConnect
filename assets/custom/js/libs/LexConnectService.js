
var dump = function(text, obj) {
  console.log("[" + text + "]:\t" + JSON.stringify(obj));
}



var LexConnectService = function(type) {

	var VERSION = 1;

	// Advanced security (jk) so bots don't scrape our db pw
	var a = "https://api.mon";
	var aa = "golab.com/api/1/databases/lex";
	var b = "connect2/collections/" + type;
	var c = "?ap";
	var ca = "iKey="
	var caa = "iILS";
	var d = "3iwLqva8cQ7P0hEfeCI0JouzGX7-";
	var db = a + aa + b + c + ca + caa + d;
	var key = caa + d;

	var urlForObjectId = function(collection, id) {
		var a = "https://api.mon";
		var aa = "golab.com/api/1/databases/lex";
		var b = "connect2/collections/" + collection;
		var c = "/" + id + "?apiKey=" + key;
		return a + aa + b + c;
	}

	// UNIX time
	var timestamp = function() {
		return new Date().getTime();
	}

	// Add metadata (time, version, page url) to an object
	var wrap = function(data) {
		var metadata = {
			_TIME: timestamp(),
			_VERSION: VERSION,
			_URL: window.location.href,
		}
		return $.extend(data, metadata);
	}

	return {
		getAll: function() {
			return new Promise(function(resolve, reject) {
				axios.get(db).then(function (response) {
					resolve(response.data);
				});
			});
		},

		post: function(data) {
			return axios.post(db, wrap(data));
		},
	}
}

var service = LexConnectService('events');
service.getAll().then(function (response) {alert(JSON.stringify(response))});

