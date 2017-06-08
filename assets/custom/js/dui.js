

var countyVal = getUrlVars()['c'];
var source = getUrlVars()['s'];


alert("CountyVal: " + countyVal + ", source: " + source);


var DEFAULT_STEP = 2;

var vue = new Vue({
  el: '#description-row',
  data: {
    step: DEFAULT_STEP,
    lastStep: 7,
  },
  methods: {
    back() {
      if (this.step > DEFAULT_STEP) {
        this.step--;
      }
    },

    next() {
      if (this.step == this.lastStep) {
        window.location.href = 'email.html';
        this.step = -1;
        return;
      }
      this.step++;
    },
  }
})