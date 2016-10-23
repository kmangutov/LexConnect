
var QuestionTree = (function() {

	var QUESTION_MAP = {};

	var size = function() {
		return Object.keys(QUESTION_MAP).length;
	}

	var none = function() {

		return -1;
	}

	var q = function(value) {

		var id = size() + 1;
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

	var a = function(value, next) {
		
		next = next || -1;

		return {
			value: value,
			next: next
		};
	}

	var YES = "Yes";
	var NO = "No";

	
	var entry = 
	q("Are you an employee?",
		a(YES, q("Was this an accidental injury?",
			a("Gradual injury",
				q("Was this a pre-existing condition?",
					a(YES),
					a(NO))),
			a("Definite-time injury",
				q("Can it be traced to a specific date, time, or cause?",
					a(YES),
					a(NO))))),
		a(NO));


	return {
		get: function() {
			console.log(entry)
			return QUESTION_MAP;
		},

		root: entry 
	}
})();
