//{id, }

var QUESTION_MAP = {};

var __size = function() {
	return Object.keys(QUESTION_MAP).length;
}

var __none = function() {

	return -1;
}

var __question = function(value) {

	var id = __size() + 1;
	var obj = {
		value: value,
		options: {}
	};

	for (var i = 1; i < arguments.length; i++) {
		var ans = arguments[i];
		obj.options[ans.value] = ans.next;
	}

	QUESTION_MAP[id] = obj;
	return id;
}

var __answer = function(value, next) {
	
	return {
		value: value,
		next: next
	};
}