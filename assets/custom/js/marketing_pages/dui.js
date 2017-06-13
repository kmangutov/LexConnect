

Lockr.flush();
var callToActionSubmit = $('#ctoa');
var callToActionDropdown = $('#index-select');
var ctoa2 = $('#ctoa2');

var submitForm = function() {
  var countyVal = callToActionDropdown.val();
  var source = "marketing_dui";
  location.href = '../dui.html?c=' + countyVal + '&s=' + source;
}

var clickCtoa1 = function() {
  submitForm();
}

var clickCtoa2 = function() {
  submitForm();
}

// Logging + callbacks
logService = LexLogService("marketing/dui");
logService.bind(callToActionSubmit, clickCtoa1);
logService.bind(ctoa2, clickCtoa2);
logService.bindDropdown(callToActionDropdown);