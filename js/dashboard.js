
var logService = LexLogService();



Vue.component('log-item', {
	props: ['timestamp', 'value', 'user'],

	template: '<span>{{ timestamp }} - {{ value }}</span>',

	/*data: function() {
		return {
			timestamp: -1,
			value: "default_value"
		}
	}*/
});

Vue.component('log-item-list', {
	template: '#log-item-list',

	data: function() {
		return {
			logList: {}
		}
	},

	events: {
		'loaded-logList': function(data) {
			console.log("on loaded-logList");
			this.logList = data;
		}
	}
});

Vue.component('log-input', {
	template: '<input type="button" v-on:click="clicked">Log</input>',

	methods: {
		clicked: function(event) {
			logService.post("TESTTESTTEST");
		}, 
	}
});

var vm = new Vue({
	el: '#root',

	methods: {
		onLoad: function() {
			var that = this;
			logService.get(function(data) {
				var sortedData = data.sort(function(a, b) {
					return new Date(b.timestamp) - new Date(a.timestamp);
				});

				that.$broadcast('loaded-logList', sortedData);
			});
		}
	}
});

vm.onLoad();