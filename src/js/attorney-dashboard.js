
var queryService = LexQueryService();
var clientsService = LexConnectService("clients")


var joinedQueries = [];
var vue_queries = new Vue({
	el: '#queries',
	
	data: {
		queries: [],
		showSelected: false,
		selectedItem: {},
	},

	methods: {
		select: function(id) {
			console.log("Select " + JSON.stringify(this.queries[id]));


			this.showSelected = true;
			this.selectedItem = this.queries[id];
		}
	}
});



var dump = function(text, obj) {
	console.log("[" + text + "]:\t" + JSON.stringify(obj));
}

//var `

var mergeObjects = function(a, b, next) {
	var newObj = {};

	for(var k in a) {
		newObj[k] = a[k];
	}

	for(var k in b) {
		newObj[k] = b[k];
	}

	next(newObj);
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

	clientsService.get(userIdFilter, function(userObj) {

		var userClone = JSON.parse(JSON.stringify(userObj))[0];
		mergeObjects(userClone, query, next);
	});
}

var appentToNewArray = function(original, newItem) {
	var ret = [];
	for(var i = 0; i < original.length; i++)
		ret[i] = original[i];
	ret[i] = newItem;
	return ret;
}

var queriesLoaded = function(queries) {
	queries.forEach(function(query) {
		joinUserQuery(query, function(joined){

			joined["id"] = joinedQueries.length;
			joinedQueries = appentToNewArray(joinedQueries, joined);
		
			vue_queries.queries = joinedQueries;
			vue_queries.string = JSON.stringify(joined);

		});
	});
}

$(document).ready(function() {

	queryService.getQueries(function(data) {
		//console.log(JSON.stringify(data));
		vue_queries.queries = data;
		queriesLoaded(data);
	});
});