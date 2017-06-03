var vue = new Vue({
  el: '#description-row',
  data: {
    step: 0,
    lastStep: 7,
  },
  methods: {
    back() {
      if (this.step > 0) {
        this.step--;
      }
    },

    next() {
      if (this.step == this.lastStep) {
        window.location.href = "email.html";
        this.step = -1;
        return;
      }
      this.step++;
    },
  }
})