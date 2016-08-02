//type == "attorneys" or "clients"

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
		}

	};
}