const isIOS = (navigator.userAgent.toLowerCase().indexOf('iphone') != -1) || (navigator.userAgent.toLowerCase().indexOf('ipad') != -1);
const app = new Vue({
  el: '#app',
  data: {
    screenWidth: document.body.clientWidth,
    number: '',
    nickname: '',
    avatarURL: '',
    showViewer: false,
    artifactURL: ''
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
      this.screenWidth = document.body.clientWidth;
    };
    let loadingInstance = ELEMENT.Loading.service({
      target: '#app',
      lock: true,
      text: '字体加载中...'
    });
    document.fonts.ready.then(_ => {
      loadingInstance.close();
    });
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
      this.artifactURL = '';
      domtoimage.toJpeg(document.getElementById('preview'), { quality: 1.0, style: { zoom: 'unset' } })
        .then(dataUrl => {
          if (isIOS) {
            this.artifactURL = dataUrl;
            this.showViewer = true;
          } else {
            var link = document.createElement('a');
            link.download = 'xt-card.jpg';
            link.href = dataUrl;
            link.click();
          }
        });
    }
  }
});
