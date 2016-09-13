
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


	// ==== CONTRACTS 1

	var contracts_subfield =
			q("Contracts",
				a("Breach of contract"));

	// ==== FAMILY 2

	var family_subfield = 
			q("Family law",
				a("Divorce"),
				a("Probate"));

	// ==== CRIMINAL 3

	var criminal_subfield = 
			q("Criminal defense",
				a("DUI - Alcohol"),
				a("DUI - Drugs"));

	// ==== LABOR 4

	var workers_comp = 
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

	var employee_misclassification_c = 
			q("Are any of the following true: ",
				a("Distinct occupation from principal"),
				a("Relatively high degree of skill required in occupation"),
				a("The worker supplies necessary tools and instruments to him or herself"),
				a("None of the above"))

	var employee_misclassification_b = 
			q("Is the work part of the regular business of the principal?",
				a(YES, employee_misclassification_c),
				a(NO));

	var employee_misclassification_a =
			q("Are any of the following true: ",
				a("There was ability to control the worker", employee_misclassification_b),
				a("The work is usually supervised by the principal or an agent of the principal", employee_misclassification_b),
				a("None are true"));

	var employee_discrimination = 
			q("Employee discrimination",
				a("Discrimination"),
				a("Sexual harassment"),
				a("Retaliation"));

	var labor_subfield = 
			q("Labor/employment issues",
				a("Workers` Comp", workers_comp),
				a("Employee Misclassification", employee_misclassification_a),
				a("Employment Discrimination", employee_discrimination))

	// ==== PERSONAL INJURY 5

	var personal_injury_subfield = 
			q("Did the injury occur in Illinois?",
				a(YES),
				a(NO));

	// ==== IMMIGRATION 6

	var immigration_subfield = 
			q("Are you seeking green card through Job or Family?",
				a("Job"),
				a("Family"));

	// ==== UNSURE 7

	var unsure_subfield = 
			q("Unsure of issue",
				a("Suffered an injury"),
				a("I was arrested"),
				a("Work related"),
				a("Business disagreement"),
				a("Divorce"),
				a("Looking to apply for green card"),
				a("Dealing with deceased person's property/will"));

	// ==== ROOT

	//var entry = labor_subfield;
	var entry = q("Where does your issue fall?",
			a("Contracts", contracts_subfield),
			a("Family law", family_subfield),
			a("Criminal defense", criminal_subfield),
			a("Labor or employment", workers_comp),
			a("Personal injury", personal_injury_subfield),
			a("Immigration", immigration_subfield),
			a("Unsure", unsure_subfield));


	return {
		get: function() {
			console.log(entry)
			return QUESTION_MAP;
		},

		root: entry 
	}
})();
