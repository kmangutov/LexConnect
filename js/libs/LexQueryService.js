
var LexQueryService = function() {

	var service = LexConnectService("queries");
	var attorneyService = LexConnectService("attorneys");
	var userService = LexConnectService("attorneys");

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

		/**
			An attorney expressed interest in a client query.

			query: query object from database pertaining to the client's search query
			attorneyId: the attorney expressing interest in the query
		*/
		connectAttorney: function(queryId, query, attorneyId) {
			var clone = JSON.parse(JSON.stringify(query));			

			var interestedAttorneys = clone.interestedAttorneys || [];
			var me = [{attorneyId: attorneyId, timestamp: new Date()}];
			var newArray = interestedAttorneys.concat(me);
			clone.interestedAttorneys = newArray;

			alert("send email to client");
			dump("information we know (query)", clone);
			dump("information we know (me)", _getLoggedInUser());


			attorneyService.getId(_getLoggedInUserId(), function(attorney) {
				dump("attorney", attorney);

				var obj = {
					recipientEmail: query.user,
					clientFirstName: query.firstName,
					clientLastName: query.lastName,
					attorneyFirstName: attorney.firstName,
					attorneyLastName: attorney.lastName,
					attorneyUrl: attorney.url,
				}

				dump("email_param_obj", obj);
				emailjs.send("gmail", "on_attorney_interest", obj);
			});

			service.put(queryId, clone, function(resp) {
				alert(JSON.stringify(resp));
			});
		},

		/**
			A client confirms connection with an attorney.
		*/
		connectClientToAttorney: function(query, attorneyId, next) {

			var queryId = query["_id"]["$oid"];

			var connectedAttorneys = [] || query.connectedAttorneys;
			connectedAttorneys.push({attorneyId: attorneyId, timestamp: new Date()})

			query.connectedAttorneys = connectedAttorneys;

			console.log("=============== entering userService getId")
			attorneyService.getId(attorneyId, function(attorney) {
				console.log("============= connectClientToAttorney");

				//send to attorney from client
				var obj = {
					recipientEmail: attorney.user,
					attorneyFirstName: attorney.firstName,
					attorneyLastName: attorney.lastName,
					clientFirstName: query.firstName,
					clientLastName: query.lastName,
					clientPhone: query.phone,
					
					clientOccupation: query.occupation,
					clientEmployer: query.employer,
					clientIncome: query.clientIncome,
					clientEmail: query.user,

					clientPrimaryAddress: query.primaryAddress,
					clientSecondaryAddress: query.secondaryAddress,
				}

				dump("email_param_obj", obj);

				emailjs.send("gmail", "on_connection_to_attorney", obj);
			});
			

			service.put(queryId, query, function(resp) {
				dump("LexQueryService::connectClientToAttorney ", resp);
				next();
			});
		}
	}
}