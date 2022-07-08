const app = new Vue({
  el: '#app',
  data: {
    screenWidth: document.body.clientWidth,
    number: '',
    nickname: '',
    avatarURL: ''
  },
  computed: {
    zoom() {
      if (this.screenWidth < 600) {
        return this.screenWidth / 1200;
      } else {
        return 0.5;
      }
    }
  },
  mounted() {
    window.onresize = () => {
      console.log(document.body.clientWidth);
      this.screenWidth = document.body.clientWidth;
    };
  },
  destroyed() { },
  methods: {
    setAvatar(file) {
      this.avatarURL = URL.createObjectURL(file.raw);
    },
    numberChange(value) {
      JsBarcode("#barcode", `XT Fans No. ${value}`, {
        width: 1,
        height: 25,
        displayValue: false,
        background: "transparent",
        margin: 0
      });
    },
    gen() {
      domtoimage.toJpeg(document.getElementById('preview'), { quality: 1.0, style: { zoom: 'unset' } })
        .then(dataUrl => {
          var link = document.createElement('a');
          link.download = 'xt-card.jpg';
          link.href = dataUrl;
          link.click();
        });
    }
  }
});