
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

		selectedInterestExpressed: false,
		//selectedConnected: false,
		//selectedClientData: {},
	},

	// id refers to obj.id, not array index...
	methods: {

		select: function(id) {
			this.selectedItem = this.queries.filter(function(query) {
				return query.id == id;
			})[0];
			dump("selectedItem", this.selectedItem);

			this.showSelected = true;
			this.selectedId = id;

			dump("selectedItem.interestedAttorneys", this.selectedItem.interestedAttorneys);
			dump("selectedItem.connectedAttorneys", this.selectedItem.connectedAttorneys);

			// If this person isn't marked interestExpressed, check

				this.selectedInterestExpressed = false;
				if(this.selectedItem.interestedAttorneys) {
					var expressedInterest = this.selectedItem.interestedAttorneys.find(function(element, index, array) {
						return _getLoggedInUserId() == element['attorneyId'];
					});

					dump("expressedInterest", expressedInterest);
					this.selectedInterestExpressed = expressedInterest;
				} 
			
		},

		// TODO(kmangutov): fix these goddamnd interestExpressed vs expressInterest fuck
		connect: function(id) {

			var attorneyId = _getLoggedInUserId();

			queryService.connectAttorney(id, this.selectedItem, attorneyId);
			this.selectedInterestExpressed = true;

			// update to "interest expressed"
			var clone = [];
			this.queries.forEach(function(query) {

				//query.id is id in the array. so use query[_id][$oid]
				if(query["_id"]["$oid"] === id) {
					dump("query before", query);
					if(!query.interestedAttorneys) {
						query.interestedAttorneys = [];
					}

					query.interestedAttorneys.push({
						attorneyId: _getLoggedInUserId()
					});
					query.interestExpressed = true;
					dump("query after", query);
				}

				clone.push(query);

			});
			this.queries = clone;
			dump("this.queries", this.queries);
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
	vue_queries.queries = {}

	queries.forEach(function(query) {

		var current_timestamp = new Date()
		// Add a more refined timestamp we can use in our HTML
		query.formatted_timestamp = new Date(query.timestamp).format("m/dd hh:MM TT");

		query_time = new Date(query.timestamp)


		var time_diff = current_timestamp.getTime() - query_time.getTime();

		var msec = time_diff;
		var hh = Math.floor(msec / 1000 / 60 / 60);
		msec -= hh * 1000 * 60 * 60;
		var mm = Math.floor(msec / 1000 / 60);
		msec -= mm * 1000 * 60;
		var ss = Math.floor(msec / 1000);
		msec -= ss * 1000;

		//window.alert(hh);
		if (hh<120){
		//if(current_timestamp - query.timestamp)
		// Has the logged in attorney expressed interest in this candidate?
			
			if (query.interestedAttorneys) {
				query.interestExpressed = query.interestedAttorneys.find(function(element, index, array) {
					return _getLoggedInUserId() == element['attorneyId'];
				});
			} else {
				query.interestExpressed = false;
			}
		
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
		}
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