


Lockr.flush();
var callToActionSubmit = $('#ctoa');
var callToActionDropdown = $('#index-select');
var ctoa2 = $('#ctoa2');
var referralCode = getUrlVars()['r'];

var DEFAULT_NODE = { 
	text: "Unsure of issue",
	nodeId: 123
};

var submitForm = function(struct) {
	Lockr.set('FIRST_QUESTION', "What is your issue?");
	Lockr.set('FIRST_ANSWER', struct);
	Lockr.set('REFERRAL_CODE', referralCode);
	location.href = "questionnaire.html";
}

var clickCtoa1 = function() {
	var selected = callToActionDropdown.children("option").filter(":selected");
	var text = selected.text();
	var value = callToActionDropdown.val();
	var struct = {
		text: text,
		nodeId: value
	};
	submitForm(struct);
}

var clickCtoa2 = function() {
	submitForm(DEFAULT_NODE);
}

logService = LexLogService("index");
logService.bind(callToActionSubmit, clickCtoa1);
logService.bind(ctoa2, clickCtoa2);

