
var queryService = LexQueryService();
var clientsService = LexConnectService("clients")


var isConnectedToAttorney = function(query) {
	return query.connectedAttorneys.find(function(currentAttorneyId) {
		currentAttorneyId === _getLoggedInUserId();
	});
}

var joinedQueries = [];
var vue_queries = new Vue({
	el: '#queries',
	
	data: {
		queries: [],
		showSelected: false,
		selectedItem: {},
		selectedId: -1,
		connectedIds: [],

		selectedConnected: false,
		selectedClientData: {},
	},

	// id refers to obj.id, not array index...
	methods: {
		select: function(id) {
			this.selectedItem = this.queries.filter(function(query) {
				return query.id == id;
			})[0];

			this.showSelected = true;
			//this.selectedItem = this.queries[id];
			this.selectedId = id;
		},

		connect: function(id) {

			var attorneyId = _getLoggedInUserId();
			alert("We will inform the client about your interest!");

			queryService.connectAttorney(id, this.selectedItem, attorneyId);
		}
	}
});



var dump = function(text, obj) {
	console.log("[" + text + "]:\t" + JSON.stringify(obj));
}

var mergeUserQuery = function(user, query, next) {
	var newObj = {user: "", query: ""};

	for(var k in user) {
		newObj["user"][k] = user[k];
	}

	for(var k in query) {
		newObj["query"][k] = query[k]
	}

	next(newObj);
}

var joinUserQuery = function(query, next) {

	var userIdFilter = {
		"_id": {
			"$oid": query.user_id
		}
	};

	clientsService.getId(query.user_id, function(userObj) {

		dump("joinUserQuery userObj", userObj);
		mergeObjects(userObj, query, next);
	});
}

var queriesLoaded = function(queries) {
	queries.forEach(function(query) {
		joinUserQuery(query, function(joined){

			dump("after joinUserQuery", joined);
			joined["id"] = joinedQueries.length;

			var connectedAttorneys = joined.connectedAttorneys || [];
			joined["connected"] = false;
			dump("connectedAttorneys ", connectedAttorneys);

			connectedAttorneys.forEach(function(connectionObject) {

				var connectedId = connectionObject["attorneyId"];

				if(_getLoggedInUserId() === connectedId) {
					//we are conneceted to this guy
					joined["connected"] = true;
				}
			});

			joinedQueries = appendToNewArray(joinedQueries, joined);
			joinedQueries.sort(function(a, b) {
				return new Date(b.timestamp) - new Date(a.timestamp);
			});

			vue_queries.queries = joinedQueries;
		});
	});
}

$(document).ready(function() {

	queryService.getQueries(function(data) {
		//console.log(JSON.stringify(data));
		vue_queries.queries = data;
		queriesLoaded(data);
		console.log(JSON.stringify(data[0]))
	});
});