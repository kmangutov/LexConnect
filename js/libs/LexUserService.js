//type == "attorneys" or "clients"

var _getLoggedInUser = function() {
	var user = Lockr.get("user");
	return user[0];

}

var _getLoggedInUserId = function() {
	var user = _getLoggedInUser();
	var userId = user["_id"]["$oid"];
	return userId;
}

var LexUserService = function(type) {

	var service = LexConnectService(type);

	return {

		login: function(data, pass, fail) {

			service.get(data, function(response) {

				if(response.length >= 1) {
					pass(response);
				}
				else {
					console.log("No such account exists");
					fail(response);
				}

			});
		},

		register: function(data, pass, fail) {

			service.get({user: data.user}, function(response) {

				if(response.length >= 1) {
					console.log("Email taken");
					fail(response);
				}
				else {
					console.log(JSON.stringify(data));
					service.post(data, function(response2) {
						pass(response2);
					});
				}
			});
		},

		put: function(id, data, pass, fail) {

			var query = {"_id": {"$oid": id}};
			service.put(query, data, function(response) {

				if(response["n"] == 1)
					pass(response);
				else
					fail(response);

			});
		}

	};
}