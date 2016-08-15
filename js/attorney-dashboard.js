
var queryService = LexQueryService();
var clientsService = LexConnectService("clients")


var vue_queries = new Vue({
	el: '#queries',
	
	data: {
		queries: []
	}
});

//var 

$(document).ready(function() {

	alert("ready");
	queryService.getQueries(function(data) {
		//console.log(JSON.stringify(data));
		vue_queries.queries = data;

		for(var i = 0; i < data.length; i++) {
			var datum = data[i];
			//console.log(JSON.stringify(datum) +",\n");

			var userIdFilter = {
				"_id": {
					"$oid": datum.user_id
				}
			};

			clientsService.get(userIdFilter, function(userObj) {
				//vue_queries.queries[i].user = userObj;
				//^^ why doesnt this work wtf
				console.log(i);

				console.log(JSON.stringify(data[i]));

				data[i].user = userObj;
				vue_queries.queries = data;
			});
		}
	});
});