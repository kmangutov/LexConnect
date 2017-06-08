

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
  return $('textarea[name=' + name + ']').value;
}

// you can only fucking access an element if it's visible fuck...
var lastState = {};
var saveState = function() {
  var currentState = {
    county_val: getUrlVars()['c'],
    source: getUrlVars()['s'],
    questionnaire: 'dui',
    first_dui: radioVal('first_dui'),
    vehicle_owner: radioVal('vehicle_owner'),
    physical_location: radioVal('physical_location'),
    engine_running: radioVal('engine_running'),
    tests_given: checkboxVal('tests_given'),
    freeform: freeformVal('freeform')
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
    lastStep: 7,
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

