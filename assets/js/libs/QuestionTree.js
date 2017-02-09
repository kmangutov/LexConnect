
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
			q("Is there a valid contract?", 
				a(YES, q("Did you perform your duties under the contract?", 
					a(YES, 
						q("Were you harmed as a result of that breach?", 
							a(YES), 
							a(NO))), 
					a(NO))), 
			a(NO));

	// ==== FAMILY 2 ===============================================

	var child_has_medical_condition = q("Does the child have a medical condition/disability that requires financial assistance?", a(YES), a(NO));
	
	var child_intends_to_attend_college = q("Does the child intend to attend college?", a(YES), a(NO, child_has_medical_condition));

	var custodial_parent_involuntary_reduction = q("Have you (the custodial parent) received an involuntary reduction in your income?", a(YES), a(NO, child_has_medical_condition));

	var reduction_in_child_support = q("Was there an involuntary reduction in your income?", a(YES), a(NO, q("Has one of the children reached 18 years of age?", a(YES, child_intends_to_attend_college), a(NO))));
	
	var increase_in_child_support = q("Has the child become a non-minor (18 years or older)?", a(YES, q("Is the non-minor child still in high school?", a(YES), a(NO, child_intends_to_attend_college))), a(NO, q("Has the child graduated from high school?", a(YES, child_intends_to_attend_college), a(NO, custodial_parent_involuntary_reduction))));

	var child_support_prong = q("Are you the parent paying for child support?", a(YES, reduction_in_child_support), a(NO, increase_in_child_support));

	
	//----

	var relocation_creates_burden = q("Will this relocation place a significant burden on visitation rights for the other parent?", a(YES, child_wants_to_live_with_you), a(NO, child_wants_to_live_with_you));

	var active_involvement_in_upbringing = q("Have you been actively involved in decisions related to your child's upbringing?", a(YES), a(NO));

	var primary_caretaker = q("Are you the primary caretaker?", a(YES), a(NO, active_involvement_in_upbringing));

	var child_wants_to_live_with_you = q("Has the child stated that he/she would like to live with you?", a(YES, primary_caretaker), a(NO, primary_caretaker));

	var relocating_out_of_state = q("Are you relocating out of the state?", a(YES, relocation_creates_burden), a(NO, child_wants_to_live_with_you));

	var physical_verbal_abuse = q("Has the other parent every physically or verbally abused you and/or the child?", a(YES, relocating_out_of_state), a(NO, relocating_out_of_state));

	var parent_mental_illness = q("Does the other parent have a history of mental illness?", a(YES, physical_verbal_abuse), a(NO, physical_verbal_abuse));

	//var best_interest_of_child = q("We would like to ask about ", )

	var wed_parent_custody = parent_mental_illness;

	var unwed_parent_custody = q("Are you the male parent of the child?", a(YES, q("Have you established paternity of the child?", a(YES, parent_mental_illness), a(NO))), a(NO));

	var parent_custody = q("Were the two parents ever married?", a(YES, wed_parent_custody), a(NO, unwed_parent_custody));

	





	var non_parent_custody = q("Are you the child's step-parent or relative?", a(YES, q("Are you currently in physical possesion of the child?", a(YES, q("Did one of the parents voluntarily hand the child into your possesion?", a(YES, q("Did you establish a parent-child relationship with the child?", a(YES, q("Are either parents (if still living) unfit to care for the child?", a(YES), a(NO))), a(NO))), a(NO))), a(NO))), a(NO));

	var custody_rights_prong = q("Are you the child's parent?", a(YES, parent_custody), a(NO, non_parent_custody));


	var divorce = q("What's your divorce issue?", a("Child Support", child_support_prong), a("Custody Rights", custody_rights_prong));

	var family_subfield = 
			q("What do you need help with?",
				a("Divorce", divorce),
				a("Probate"));

	// ==== CRIMINAL 3 ==============================================

	var officer_smelled_alcohol = q("Did the arresting officer report smelling alcohol on you?", a(YES), a(NO, q("Did the arresting officer report you having slurred speech?", a(YES), a(NO, q("Did you provide a statement to the arresting officer of how many drinks you have had?", a(YES), a(NO))))));

	var field_sobriety_test = q("Was a field sobriety test (i.e. one leg stand) administered?", a("Yes - Passed", officer_smelled_alcohol), a("Yes - Failed"), a("Not administered", officer_smelled_alcohol));

	var breathalyzer_test = q("Was a breathalyzer test administered?", a("Yes - Passed", officer_smelled_alcohol), a("Yes - Failed"), a("Not administered", field_sobriety_test));

	var sobriety_tests_given = q("Was a blood/urine test administered?", a("Yes - Passed", officer_smelled_alcohol), a("Yes - Failed"), a("Not administered", breathalyzer_test))

	var dui_alcohol = q("Were you ticketed in Illinois?", a(YES, q("Were you in possesion of the ignition keys?", a(YES, sobriety_tests_given), a(NO, q("Are you the owner of the vehicle that was pulled over by the police?", a(YES, sobriety_tests_given), a(NO, q("Were you in the driver's seat?", a(YES, sobriety_tests_given), a(NO))))))), a(NO))


	



	var found_drugs_in_vehicle = q("Found drugs in the vehicle", a(YES), a(NO));

	var slurred_speech = q("Slurred speech", a(YES, found_drugs_in_vehicle), a(NO, found_drugs_in_vehicle));

	var trouble_standing = q("Trouble standing and/or unsteady feet", a(YES, slurred_speech), a(NO, slurred_speech));

	var dilated_pupils = q("Dilated pupils", a(YES, trouble_standing), a(NO, trouble_standing));
	
	var needle_marks_in_skin = q("Needle marks in skin", a(YES, dilated_pupils), a(NO, dilated_pupils));	

	var driving_erratically = q("Driving erratically or in a dangerous manner", a(YES, needle_marks_in_skin), a(NO, needle_marks_in_skin));

	var reported_issues_by_arresting_officer = q("Please answer yes or no to whether the following issues were reported by the arresting officer", a("OK", driving_erratically));

	var officer_conducted_field_sobriety_test = q("Did the arresting officer conduct a field sobriety test (i.e one-leg stand, pupil reaction)?", a("Yes - Passed", reported_issues_by_arresting_officer), a("Yes - Failed", q("Did the arresting officer report you driving erratically or in a dangerous manner?", a(YES), a(NO))), a("No - Did Not Conduct", reported_issues_by_arresting_officer));

	var drug_has_intoxicating_effect = q("Does the drug have an intoxicating effect?", a(YES, officer_conducted_field_sobriety_test), a(NO, q("Were you also driving under the influence of alcohol?", a(YES, sobriety_tests_given), a(NO, officer_conducted_field_sobriety_test))));

	var drug_was_controlled_substance = q("Was the alleged drug a controlled substance (illegal and/or doctor prescribed drug?", a(YES, q("Do you have a prescription?", a(YES, drug_has_intoxicating_effect), a(NO))), a(NO, drug_has_intoxicating_effect));

	var dui_drugs = q("Were you ticketed in Illinois?", a(YES, q("Were you in possesion of the ignition keys?", a(YES, drug_was_controlled_substance), a(NO, q("Are you the owner of the vehicle that was pulled over by the police?", a(YES, drug_was_controlled_substance), a(NO, q("Were you in the driver's seat?", a(YES, drug_was_controlled_substance), a(NO))))))), a(NO));

	var criminal_subfield = 
			q("",
				a("DUI - Alcohol", dui_alcohol),
				a("DUI - Drugs", dui_drugs),
				a("Other"));

	// ==== LABOR 4 =================================================

	var accident_prong_3 = 
			q("Is there a connection between your occupation and the injury you suffered?", a(YES, q("Did this injury take place within the period of your employment?", a(YES, q("Did your injury take place in an area where the employee could reasonably be expected to be by the employer?", a(YES, q("Did the injury occur while fulfilling your work duties OR doing something related to them?", a(YES), a(NO))), a(NO))), a(NO))), a(NO));

	var workers_comp = 
			q("Are you an employee?",
				a(YES, q("Did your injury occur over a gradual period of time?",
					a("Gradual injury",
						q("Was this a pre-existing condition?",
							a(YES, 
								q("Did your work worsen the pre-existing condition?", 
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
				a("None of the above"));

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

	var discrimination_prong = q("Was there intentional conduct towards you that felt discriminatory?", a(YES, disparate_treatment_theory), a(NO, disparate_impact_theory));

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
			q("Labor or employment issues",
				a("Workers` Comp", workers_comp),
				a("Employee Misclassification", employee_misclassification_a),
				a("Employment Discrimination", employee_discrimination));

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
			a(NO, checklist1));

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

	var car_accident_root =
		q("Were you one of the drivers of the cars involved in the collision?",
			a(YES,
				q("Were you driving over the speed limit and/or following too closely prior to the collision?",
					a(YES, checklist5_ENTRY),
					a(NO, 
						q("Did you fail to apply the brakes to avoid the collision?",
							a(YES, checklist5_ENTRY),
							a(NO, 
								q("Did you fail to follow the rules of the road? (i.e. yielding right of way)",
									a(YES, checklist5_ENTRY),
									a(NO,
										q("Did you fail to keep a proper lookout? (i.e. eyes on the road)",
											a(YES, checklist5_ENTRY),
											a(NO,
												q("Was there anything you could have reasonable done to avoid the collision?",
													a(YES, checklist5_ENTRY),
													a(NO, checklist5_ENTRY))))))))))),
			a(NO,
				q("As a passenger did you distract/disturb your driver?",
							a(YES, checklist5_ENTRY),
							a(NO,
								q("As a passenger did you have reason to believe that the driver was a negligent driver?",
									a(YES),
									a(NO))))));

	var what_caused = 
		q("What caused the injury?",
			a("Car accident", car_accident_root),
			a("Slip and fall", checklist5_ENTRY),
			a("Consumer product"),
			a("Medical mistake"),
			a("Work-related injury" /** TODO(KIRILL) **/));
	
	var personal_injury_subfield = 
			q("Did the injury occur in Illinois?",
				a(YES, 
					q("Were you personally injured?",
						/***  TODO KIRILL PICK UP FROM HERE **/
						a(YES, what_caused),
						a(NO,
							q("Do you have a special relationship with the person who was injured?",
								a(YES, what_caused),
								a(NO))))),
				a(NO));

	// ==== IMMIGRATION 6 =========================================

	var immigration_subfield = 
			q("Are you seeking green card through Job or Family?",
				a("Job"),
				a("Family"));

	// ==== UNSURE 7 ==============================================

	var unsure_subfield = 
			q("Unsure of issue",
				a("Suffered an injury", personal_injury_subfield),
				a("I was arrested", criminal_subfield),
				a("Work related", labor_subfield),
				a("Business disagreement", contracts_subfield),
				a("Divorce", family_subfield),
				a("Looking to apply for green card", immigration_subfield),
				a("Dealing with deceased person's property/will", contracts_subfield));

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