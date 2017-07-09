

Lockr.flush();
var hrefNewBusiness = $('#new-business');
var hrefExistingBusiness = $('#existing-business');

var submitForm = function(option) {
  var source = "marketing_business-formation";
  location.href = '../dui.html?o=' + option + '&s=' + source;
}



var clickNewBusiness = function() {
  submitForm('new-business');
}

var clickExistingBusiness = function() {
  submitForm('existing-business');
}



// Logging + callbacks
logService = LexLogService("marketing/business-formation");
logService.bind(hrefNewBusiness, clickNewBusiness);
logService.bind(hrefNewBusiness, clickExistingBusiness);