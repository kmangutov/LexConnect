
var callToActionSubmit = $('#ctoa');
var callToActionDropdown = $('#select-question1');

callToActionSubmit.click(function() {
	var selected = callToActionDropdown.children("option").filter(":selected");
	var text = selected.text();
	var value = callToActionDropdown.val();
	var struct = {
		text: text,
		nodeId: value
	};
	Lockr.set('FIRST_ANSWER', struct);
	window.location.href = "questionnaire.html";
});