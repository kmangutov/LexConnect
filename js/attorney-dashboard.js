
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

	methods: {
		select: function(id) {
			console.log("Select " + JSON.stringify(this.queries[id]));


			this.showSelected = true;
			this.selectedItem = this.queries[id];
			this.selectedId = id;
		},

		connect: function(id) {

			var attorneyId = _getLoggedInUserId();
			alert("Connect " + attorneyId + " to " + id);

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

			alert(_getLoggedInUserId());
			dump("after joinUserQuery", joined);
			joined["id"] = joinedQueries.length;

			var connectedAttorneys = joined.connectedAttorneys || [];
			joined["connected"] = false;
			dump("connectedAttorneys ", connectedAttorneys);

			connectedAttorneys.forEach(function(connectionObject) {

				var connectedId = connectionObject["attorneyId"];

				alert(_getLoggedInUserId() + "==" + connectedId + "?");
				if(_getLoggedInUserId() === connectedId) {
					//we are conneceted to this guy
					alert("yes");
					joined["connected"] = true;
				}
			});

			joinedQueries = appendToNewArray(joinedQueries, joined);
			vue_queries.queries = joinedQueries;
/*
			joinedQueries = appendToNewArray(joinedQueries, joined);
		
			vue_queries.queries = joinedQueries;
			vue_queries.string = JSON.stringify(joined);
*/
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