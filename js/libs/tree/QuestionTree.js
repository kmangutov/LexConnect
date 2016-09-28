
/*	The QuestionTree helps users communicate their situation without a law education quickly and easily.
		QUESTION_MAP is a Map of Questions. Each Question resides under an id in the QUESTION_MAP.

		An Answer is composed of a String _value_ (the answer text) and pointer _next_ to the question it leads to.
		A _next_ of -1 indicates there are no more questions and the questionnaire is complete.

		A Question is defined as a String _value_ (the prompt) and a list of possible Answers.

		Answers are generated using the "a" function. Questions are generated using the "q" function that takes
		a string value (The actual question) and a list of answers (The possible solutions).
		The "q" function automatically inserts the resulting structure into the QUESTION_MAP.
*/

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


		/* Notice that that here we iterate through the arguments. This will be the answers.

			e.g.
				var criminal_subfield = 
						q("Criminal defense",
							a("DUI - Alcohol"),
							a("DUI - Drugs"));
		*/
		for (var i = 1; i < arguments.length; i++) {
			var ans = arguments[i];
			obj.options[ans.value] = ans.next;
		}

		QUESTION_MAP[id] = obj;
		return id;
	}

	// value: String, answer text.
	// next: int, pointer to id of next question in QUESTION_MAP
	var a = function(value, next) {
		next = next || -1;

		return {
			value: value,
			next: next
		};
	}

	var YES = "Yes";
	var NO = "No";

	// ==== CONTRACTS 1 ============================================

	var contracts_subfield =
			q("Contracts",
				a("Breach of contract"));

	// ==== FAMILY 2 ===============================================

	var family_subfield = 
			q("Family law",
				a("Divorce"),
				a("Probate"));

	// ==== CRIMINAL 3 ==============================================

	var criminal_subfield = 
			q("Criminal defense",
				a("DUI - Alcohol"),
				a("DUI - Drugs"));

	// ==== LABOR 4 =================================================

	var accident_prong_3 = 
			q("Is there a connection between your occupation and the injury you suffered?", a(YES, q("Did this injury take place within the period of your employment?", a(YES, q("Did your injury take place in an area where the employee could reasonably be expected to be by the employer?", a(YES, q("Did the injury occur while fulfilling your work duties OR doing something related to them?", a(YES), a(NO))), a(NO))), a(NO))), a(NO));

	var workers_comp = 
			q("Are you an employee?",
				a(YES, q("Did your injury occur over a gradual period of time",
					a("Gradual injury",
						q("Was this a pre-existing condition?",
							a(YES, 
								q("Did your work worsen the pre-existing condition", 
									a(YES, accident_prong_3), 
									a(NO) )),
							a(NO))),
					a("Definite-time injury",
						q("Can it be traced to a specific date, time, or cause?",
							a(YES, accident_prong_3),
							a(NO))))),
				a(NO));


	
	var employee_misclassification_prong_c = q("Is this a distinct occupation from the principal?", a(YES, q("Is there a relatively high degree of skill required in your occupation?", a(YES, q("Do you supply your own tools and instrumentalities?", a(YES), a(NO))), a(NO))), a(NO));

	var employee_misclassification_c = 
			q("Are any of the following true: ",
				a("Distinct occupation from principal"),
				a("Relatively high degree of skill required in occupation"),
				a("The worker supplies necessary tools and instruments to him or herself"),
				a("None of the above"))

	var employee_misclassification_b = 
			q("Is the work part of the regular business of the principal?",
				a(YES, employee_misclassification_prong_c),
				a(NO));

	var employee_misclassification_a =
			q("Are any of the following true: ",
				a("There was ability to control the worker", employee_misclassification_b),
				a("The work is usually supervised by the principal or an agent of the principal", employee_misclassification_b),
				a("None are true"));

	var mixed_motive_test = q("Are you in a protected class?", a(YES, q("Did you apply and were you minimally qualified for this position?", a(YES, q("Was there an adverse employment decision?", a(YES), a(NO))), a(NO))), a(NO));

	var mcdonnell_douglas_test = q("Are you in a protected class?", a(YES, q("Did you apply and were you minimally qualified for this position?", a(YES, q("Was there an adverse employment decision?", a(YES, q("Do you suspect that there was pretext for discrimination?", a(YES), a(NO))), a(NO))), a(NO))), a(NO));
	
	var individual_disparate_treatment_prong = q("Is there direct evidence of intentional discrimination? (conduct, statements, etc.)", a(YES, mixed_motive_test), a(NO, mcdonnell_douglas_test));

	var systemic_disparate_treatment_prong = q("Does a discriminatory policy exist? Or does an informal practice/pattern exist?", a(YES, q("Is there a legitimate bussiness reason for this policy/practice?", a(YES), a(NO))), a(NO));


	var disparate_impact_theory = q("Are you in a protected class?", a(YES, q("Is there a policy/practice that has unequal effect on this protected class?", a(YES, q("Is there a legitimate bussiness reason for this policy/practice?", a(YES), a(NO))), a(NO))), a(NO));

	var disparate_treatment_theory = q("Was this intentional discimination targeted only at you?", a(YES, individual_disparate_treatment_prong), a(NO, systemic_disparate_treatment_prong));

	var discrimination_prong = q("Was there intentional conduct towards you that felt discriminatory?", a(YES, disparate_treatment_theory), a(NO, disparate_impact_theory))

	// ===== Sexual Harassment in Employee Discrimination

	var quid_pro_quo_prong = q("Were there unwelcome sexual demands?", a(YES, q("Were they made by a supervisor?", a(YES, q("As a result of refusing, did you suffer negative consequences at work?", a(YES), a(NO))), a(NO))), a(NO));

	var hostile_work_environment_prong = q("Was there unwelcome sexual conduct by the supervisor because of your sex?", a(YES, q("Was the conduct severe eough to create a hostile enviroment?", a(YES, q("Did your employer take 'tangile employment action' against you?", a(YES), a(NO, q("Did you take reasonable measures to correct the abusive environment?", a(YES), a(NO))))), a(NO))), a(NO));

	var sexual_harassment_prong = ("What kind of sexual harassment did you experience?", a("Quid Pro Quo (Sexual Favors)", quid_pro_quo_prong), a("Hostile Work Enviroment", hostile_work_environment_prong));

	// ===== Retaliation in Employee Discrimination


	var retaliation_prong = q("Were you engaged in a statutorily protected activity?", a(YES, q("Was a materially adverse action committed by the employer?", a(YES, q("Is there a casual connection between the protected activity and the employer's adverse action?", a(YES), a(NO))), a(NO))), a(NO));

	var employee_discrimination = 
			q("Employee discrimination",
				a("Discrimination", discrimination_prong),
				a("Sexual harassment", sexual_harassment_prong),
				a("Retaliation", retaliation_prong));

	var labor_subfield = 
			q("Labor/employment issues",
				a("Workers` Comp", workers_comp),
				a("Employee Misclassification", employee_misclassification_a),
				a("Employment Discrimination", employee_discrimination))

	// ==== PERSONAL INJURY 5 ====================================

	// CAR ACCIDENT CHECKLIST

	var checklist0 = 
		q("Did the injuries prevent you from doing your normal day-to-day activities?",
			a(YES),
			a(NO));

	var checklist1 = 
		q("Were you prevented from working at your job because of your injuries from the accident?",
			a(YES, checklist0),
			a(NO, checklist0));

	var checklist2 = 
		q("Did you have any pre-existing injuries?",
			a(YES,
				q("Did the accident exacerbate those injuries?"),
					a(YES, checklist1)),
			a(NO), checklist1);

	var checklist3 = 
		q("Did you visit the hospital/doctor after the accident?",
			a(YES, checklist2),
			a(NO, checklist2));

	var checklist4 = 
		q("Was an ambulance called to the scene of the accident?",
			a(YES, checklist3),
			a(NO, checklist3));

	var checklist5_ENTRY =
		q("Were you wearing your seat belt at the time of the collision?",
			a(YES, checklist4),
			a(NO, checklist4),
			a("N/A", checklist4));

	// END CAR ACCIDENT CHECKLIST



	var injuries_extent =
		q("What is the extent of your injuries?",
			a("W"));

	var personal_injury_subfield = 
			q("Did the injury occur in Illinois?",
				a(YES, 
					q("Were you personally injured?",
						/***  TODO KIRILL PICK UP FROM HERE **/
						a(YES, checklist5_ENTRY),
						a(NO))),
				a(NO));

	// ==== IMMIGRATION 6 =========================================

	var immigration_subfield = 
			q("Are you seeking green card through Job or Family?",
				a("Job"),
				a("Family"));

	// ==== UNSURE 7 ==============================================

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
			a("Labor or employment", labor_subfield),
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
