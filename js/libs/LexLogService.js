

function getFormattedDate() {
    var date = new Date();

    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    hour = (hour < 10 ? "0" : "") + hour;
    min = (min < 10 ? "0" : "") + min;
    sec = (sec < 10 ? "0" : "") + sec;

    var str = date.getFullYear() + "-" + month + "-" + day + "_" +  hour + ":" + min + ":" + sec;

    /*alert(str);*/

    return str;
}

var LexLogService = function() {

	var service = LexConnectService("logs");

	return {
		// Log text: string, obj: optional obj
		log: function(text, next, obj1, obj2) {
			var now = Date.now();
			var obj = {
				timestamp: now,
				value: text,
				ts_formatted: getFormattedDate(),
				obj1: obj1,
				obj2: obj2
			};
			service.post(obj, function(data) {
				// Done posting.
				next(data);
			});
		},

		get: function(next) {
			return service.getAll(function(data){
				next(data);
			});
		}
	};
};