
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
				pass(response);
			});
		},

		getQueries: function(pass, fail) {

			service.getAll(pass);
		},

		getMyQuery: function(f) {

			var userId = _getLoggedInUserId();
			var userIdFilter = {
				"user_id":  userId
			}

			service.get(userIdFilter, f);
	
		},


		connectAttorney: function(queryId, query, attorneyId) {

			alert(JSON.stringify(query));
			
			console.log("Interested attorneys " + query.interestedAttorneys);
			
			var interestedAttorneys = [] || query.interestedAttorneys;
			interestedAttorneys.push({attorneyId: attorneyId, timestamp: new Date()});

			query.interestedAttorneys = interestedAttorneys;

			service.put(queryId, query, function(resp) {
				//alert(JSON.stringify(resp));
			});
		},

		connectClientToAttorney: function(query, attorneyId, next) {

			var queryId = query["_id"]["$oid"];

			var connectedAttorneys = [] || query.connectedAttorneys;
			connectedAttorneys.push({attorneyId: attorneyId, timestamp: new Date()})

			query.connectedAttorneys = connectedAttorneys;

			//TODO: alert attorney via email

			service.put(queryId, query, function(resp) {
				dump("LexQueryService::connectClientToAttorney ", resp);
				next();
			});


		}
	}
}