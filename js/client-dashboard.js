
var queryService = LexQueryService();
var clientsService = LexConnectService("clients")
var attorneysService = LexConnectService("attorneys")


var ifClientConnectedTo = function(query, attorneyId, next, end) {
	query.connectedAttorneys.find(function(connectedAttorney) {
		if(connectedAttorney.attorneyId === attorneyId) {
			next();
			return;
		}
		end();
	});
}


var joinedQueries = [];
var vue_interestedAttorneys = new Vue({
	el: '#attorneys',
	
	data: {
		query: {},
		attorneys: [],
		selectedItem: {},
		selectedId: -1,
		selectedEnabled: true
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

			var that = this;
			ifClientConnectedTo(this.query, id, function() {
				// connected
				that.selectedEnabled = false;
			}, function() {
				// not connected
				that.selectedEnabled = true;
			});
		},

		connect: function(attorneyId) {
			var queryId = this.query['_id']['$oid'];
			var that = this;
			queryService.connectClientToAttorney(this.query, attorneyId, function() {
				that.selectedEnabled = false;
				alert("We will inform this attorney of your desire to speak!");
			});

			//update attorney
			attorneysService.getId(attorneyId, function(attorneyObject) {

				var connectedQueries = appendToNewArray(attorneyObject["connectedQueries"] || [], {queryId: queryId, timestamp: new Date()});

				attorneyObject.connectedQueries = connectedQueries;
				attorneysService.put(attorneyId, attorneyObject, function(result) {
					dump("client-dashboard::connect updated attorney! ", result);
				});


			});


		}
	}
});

var withMyQuery = function(query, f) {

	dump("withMyQuery ", query);

	query.interestedAttorneys.forEach(function(interestedAttorney) {
		attorneysService.getId(interestedAttorney["attorneyId"], function(attorneyObject) {

			var interestedAttorneys = vue_interestedAttorneys.attorneys || [];
			attorneyObject.timestamp = interestedAttorney.timestamp;
			attorneyObject.id = interestedAttorneys.length;
			//vue_interestedAttorneys.attorneys = appendToNewArray(interestedAttorneys, attorneyObject);

			var newAttorneyArray = appendToNewArray(interestedAttorneys, attorneyObject);
			newAttorneyArray.sort(function(a, b) {
				return new Date(b.timestamp) - new Date(a.timestamp);
			});
			vue_interestedAttorneys.attorneys = newAttorneyArray;

			dump("attorneys array", vue_interestedAttorneys.attorneys)
		});
	});
	f();
}

$(document).ready(function() {

	//setButtonsEnabled(true);
	$("#new-query").click(function() {
		window.location.href = "client-new-query.html"
	});



	queryService.getMyQuery(function(result) {
		vue_interestedAttorneys.query = result[0];
		withMyQuery(result[0], function(query) {
			
		});
	});
});