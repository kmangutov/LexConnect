
var queryService = LexQueryService();
var clientsService = LexConnectService("clients")
var attorneysService = LexConnectService("attorneys")




var joinedQueries = [];
var vue_interestedAttorneys = new Vue({
	el: '#attorneys',
	
	data: {
		query: {},
		attorneys: [],
		selectedItem: {},
		selectedId: -1,
	},

	methods: {
		select: function(id) {
			console.log("Select " + JSON.stringify(id));
			dump("attorneys", this.attorneys);

			var attorney = this.attorneys.find(function(att) {
				console.log("::find " + JSON.stringify(att))
				return att['_id']['$oid'] === id;
			});

			dump("selected attorney data", attorney);

			this.showSelected = true;
			this.selectedItem = attorney;
			this.selectedId = id;
		},

		connect: function(attorneyId) {
			var queryId = this.query['_id']['$oid'];
			queryService.connectClientToAttorney(this.query, attorneyId, function() {
				alert("This attorney will reach out to you soon!");
			});

			//update attorney
			attorneysService.getId(attorneyId, function(attorneyObject) {



				var connectedQueries = appendToNewArray(attorneyObject["connectedQueries"] || [], {queryId: queryId, timestamp: new Date()});

				attorneyObject.connectedQueries = connectedQueries;
				attorneysService.put(attorneyId, attorneyObject, function(result) {
					dump("client-dashboard::connect updated attorney! ", result);
				});/*objectId, data, f*/
			});
			
		}
	}
});

var withMyQuery = function(query, f) {

	dump("withMyQuery ", query);

	query.interestedAttorneys.forEach(function(interestedAttorney) {
		attorneysService.getId(interestedAttorney["attorneyId"], function(attorneyObject) {

			var interestedAttorneys = vue_interestedAttorneys.attorneys || [];
			vue_interestedAttorneys.attorneys = appendToNewArray(interestedAttorneys, attorneyObject);
		});
	});
	f();
}

$(document).ready(function() {

	queryService.getMyQuery(function(result) {
		vue_interestedAttorneys.query = result[0];
		withMyQuery(result[0], function(query) {
			
		});
	});
});