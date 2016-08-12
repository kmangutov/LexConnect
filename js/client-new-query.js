
var loadTreeId = function() {}

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
		}
	}
});

var vue_breadcrumbs = new Vue({
	el: '#breadcrumbs',

	data: {
		items: []
	},
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

var tree = QuestionTree.get();
var breadcrumbs = [];

var selectOption = function(id, text) {

	if(id === -1) {
		alert("End test");
		return;
	}

	var futureNode = tree[id];

	var historyElement = {	
		question_id: vue_question.question_id,
		question: vue_question.question,
		answer: text
	}

	breadcrumbs.push(historyElement);
	console.log(JSON.stringify(breadcrumbs));
	vue_breadcrumbs.items = breadcrumbs;

	loadTreeId(id);
}

var loadTreeId = function(id) {

	var node = tree[id];
	vue_question.question = node.value;
	vue_question.question_id = id;
	vue_options.items = mapToObjArr(node.options);
}

loadTreeId(QuestionTree.root);

