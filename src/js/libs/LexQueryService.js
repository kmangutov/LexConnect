
var LexQueryService = function() {

	var service = LexConnectService("queries");

	return {

		postQuery: function(query, pass, fail) {

			var struct = {
				user_id: _getLoggedInUserId(),
				query: query,
				timestamp: new Date()
			};

			service.post(struct, function(response){
				alert("response: " + JSON.stringify(response));
				pass(response);
			});
		},

		getQueries: function(pass, fail) {

			service.getAll(pass);
		},

		connectAttorney: function(filter, query, attorney) {

			var interestedAttorneys = [] || query.interestedAttorneys;
			interestedAttorneys.push(attorney);

			query.interestedAttorneys = interestedAttorneys;

			service.put(filter, query, function(resp) {
				alert(JSON.stringify(resp));
			});
		}
	}
}