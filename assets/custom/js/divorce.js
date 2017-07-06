
var textVal = function(name) {
    var texts = $('input[type=text][name=' + name + ']');
    if (!texts.val()) return;
  return $('input[type=text][name=' + name + ']').val();
}


var radioVal = function(name) {
  var radios = $('input[type=radio][name=' + name + ']:checked');
  if (radios.length == 0) return;
  return $('input[type=radio][name=' + name + ']:checked').get(0).value;
}

var checkboxVal = function(name) {

  var checkBoxGroup = $('input[type=checkbox][name=' + name + ']:checked');

  if (checkBoxGroup.length == 0) return;

  var selectionArray = [];
  checkBoxGroup.each(function() {
    if(this.checked) {
      selectionArray.push(this.value);
    }
  });

  return selectionArray.join(',');
}

var freeformVal = function(name) {
  return $('textarea[name=' + name + ']').val();
}

// you can only fucking access an element if it's visible fuck...
var lastState = {};
var saveState = function() {
  var currentState = {
    county_val: getUrlVars()['c'],
    source: getUrlVars()['s'],
    questionnaire: 'divorce',
    primary_earner: radioVal('primary_earner'),
    minor_children: radioVal('minor_children'),
    alimony: radioVal('alimony'),
    employed: radioVal('employed'),
    home_value: textVal('home_value'),
    vehicle_value: textVal('vehicle_value'),
    cash_value: textVal('cash_value'),
    stocks_value: textVal('stocks_value'),
    other_value: textVal('other_value'),

    mortgage_debt: textVal('mortgage_debt'),
    vehicle_debt: textVal('vehicle_debt'),
    otherloan_debt: textVal('otherloan_debt'),
    card_debt: textVal('card_debt'),
    medical_debt: textVal('medical_debt'),
    other_debt: textVal('other_debt'),


    freeform: escape(freeformVal('freeform'))
  }

  console.log("curretnState: " + JSON.stringify(currentState));

  lastState = $.extend(lastState, currentState);

  console.log("save state " + JSON.stringify(lastState));
}

var stateUriSuffix = function() {
  var suffix = "?";
  var state = lastState;
  for (var prop in state) {
    suffix += prop + '=' + state[prop] + '&';
  }
  return suffix;
}

var DEFAULT_STEP = 2;

var vue = new Vue({
  el: '#description-row',
  data: {
    step: DEFAULT_STEP,
    lastStep: 8,
  },
  methods: {
    back() {
      saveState();
      if (this.step > DEFAULT_STEP) {
        this.step--;
      }
    },

    next() {
      saveState();
      if (this.step == this.lastStep) {
        window.location.href = 'email.html' + stateUriSuffix();
        this.step = -1;
        return;
      }
      this.step++;
    },
  }
})

