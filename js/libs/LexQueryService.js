
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


			//console.log("LexQueryService::connectAttorney \nqueryId:" + queryId + "\n\n query:" + JSON.stringify(query) + "\n\n attorneyId:" + attorneyId);


			//alert(JSON.stringify(query));
			var clone = JSON.parse(JSON.stringify(query));
			

			dump("---clone.interestedAttorneys", clone.interestedAttorneys);
			var interestedAttorneys = clone.interestedAttorneys || [];
			dump("---interestedAttorneys", interestedAttorneys);

			var me = [{attorneyId: attorneyId, timestamp: new Date()}];
			dump("---me", me);

			var newArray = interestedAttorneys.concat(me);
			dump("---newArray", newArray)

			clone.interestedAttorneys = newArray;

			dump("===newArray", newArray);
			dump("===interestedAttorneys", clone.interestedAttorneys);
			dump("query", clone);

			//console.log("==== PUT " + JSON.stringify(query));

			service.put(queryId, clone, function(resp) {
				alert(JSON.stringify(resp));
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