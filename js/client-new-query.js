
var loadTreeId = function() {}

var vue_question = new Vue({
	el: '#question',
	
	data: {
		question: ""
	}
});

var vue_options = new Vue({
	el: '#options',

	data: {
		items: []
	},

	methods: {
		select: function(id) {
			loadTreeId(id);
		}
	}
});

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
var past = [];

var loadTreeId = function(id) {

	past.push(id);

	var node = tree[id];
	vue_question.question = node.value;
	vue_options.items = mapToObjArr(node.options);
}

loadTreeId(QuestionTree.root);

