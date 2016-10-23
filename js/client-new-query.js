

var tree = QuestionTree.get();
var breadcrumbs = [];
var loadTreeId = function() {}

var queryService = LexQueryService();

var vue_question = new Vue({
	el: '#question',
	
	data: {
		question: "",
		question_id: -1
	}
});

var vue_options = new Vue({
	el: '#options',

	data: {
		items: []
	},

	methods: {
		select: function(id, text) {
	
			selectOption(id, text);
			//need to wait till options div item updated with new height to scroll window to bottom 
			Vue.nextTick(function () {
				var elem = document.getElementById('options');
				document.body.scrollTop = document.body.scrollHeight+elem.scrollHeight;

			})

		},


	}
});

var vue_breadcrumbs = new Vue({
	el: '#breadcrumbs',

	data: {
		items: []
	},
});

var vue_submit = new Vue({
	el: '#submit',

	data: {
		show: false
	},

	methods: {
		submit: function() {

			this.show = false;
			queryService.notifyMatchedAttorneys(breadcrumbs);
			/*queryService.postQuery(breadcrumbs, function(response) {
				window.location.href = "client-dashboard.html";
			});*/
		}
	}
});

///////////////////////////////////////////////////

var mapToObjArr = function(map) {
	var keys = [];
	for(var key in map) {
		if(map.hasOwnProperty(key)) {
			keys.push(key);
		}
	}

	console.log(JSON.stringify(keys))

	var arr = [];
	for(var key in keys) {
		arr.push({
			key: keys[key],
			val: map[keys[key]]
		});
	}
	return arr;
}


var selectOption = function(id, text) {

	var historyElement = {	
		question_id: vue_question.question_id,
		question: vue_question.question,
		answer: text
	}

	breadcrumbs.push(historyElement);
	vue_breadcrumbs.items = breadcrumbs;

	if(id === -1) {
		vue_submit.show = true;

		vue_question.question = "";
		vue_question.question_id = -1;
		vue_options.items = [];
		return;
	}

	var futureNode = tree[id];

	loadTreeId(id);
}

var loadTreeId = function(id) {

	var node = tree[id];
	vue_question.question = node.value;
	vue_question.question_id = id;
	vue_options.items = mapToObjArr(node.options);
	
}

loadTreeId(QuestionTree.root);

