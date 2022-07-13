<template>
  <div id="app-container" class="app-container" v-loading="fontLoading" element-loading-text="字体加载中..."
    v-resize.initial="onResize">
    <div id="preview" class="main" :style="{ zoom: containerWidth / 1200 }">
      <img class="avatar" :style="{ backgroundColor: avatarBgColor, objectFit: avatarMode }" :src="avatarURL ? avatarURL : onePixelPNG" alt="" />
      <img v-show="number" id="barcode" alt="" />
      <div class="text-area">
        <p class="number"><span>水军编号：</span><span>{{ number }}</span></p>
        <p class="nickname"><span>小星星昵称：</span><span>{{ nickname }}</span></p>
      </div>
    </div>
    <el-form class="form" label-width="auto">
      <el-form-item label="编号">
        <el-input v-model="number" type="number" @input="numberChange"></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="nickname" type="text"></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <el-upload drag action="" :auto-upload="false" :show-file-list="false" accept="image/jpeg,image/png"
          :on-change="setAvatar">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            <el-radio v-model="avatarMode" label="contain">适应</el-radio>
            <el-radio v-model="avatarMode" label="cover">填充</el-radio>
            <el-radio v-model="avatarMode" label="fill">拉伸</el-radio>
            <el-color-picker v-model="avatarBgColor"></el-color-picker>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-button class="btn-gen" type="primary" :loading="generating" @click="gen">生成</el-button>

    <transition name="el-fade-in-linear">
      <div v-show="showViewer" class="wrap">
        <transition name="el-zoom-in-top">
          <div v-show="showViewer" class="content">
            <img :src="artifactURL" />
            <p style="color:#333;">长按保存图片</p>
            <el-link type="info" @click="showViewer = false">关闭</el-link>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import resize from "vue-resize-directive";

const isIOS = (navigator.userAgent.toLowerCase().indexOf('iphone') != -1) || (navigator.userAgent.toLowerCase().indexOf('ipad') != -1);
export default {
  directives: {
    resize,
  },
  data() {
    return {
      fontLoading: true,
      containerWidth: 0,
      number: '',
      nickname: '',
      avatarURL: '',
      avatarMode: 'contain',
      avatarBgColor: '',
      onePixelPNG: 'data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
      showViewer: false,
      artifactURL: '',
      generating: false
    }
  },
  computed: {
  },
  mounted() {
    document.fonts.ready.then(_ => {
      this.fontLoading = false;
    });
  },
  destroyed() { },
  methods: {
    setAvatar(file) {
      if (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png') {
        this.avatarURL = URL.createObjectURL(file.raw);
      } else {
        this.$message.error('头像只支持jpg/png格式');
      }
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
      this.generating = true;
      this.artifactURL = '';
      domtoimage.toJpeg(document.getElementById('preview'), { quality: 1.0, style: { zoom: 'unset' } }).then(dataUrl => {
        if (isIOS) {
          this.artifactURL = dataUrl;
          this.showViewer = true;
        } else {
          var link = document.createElement('a');
          link.download = 'xt-card.jpg';
          link.href = dataUrl;
          link.click();
        }
      }).catch(err => {
        this.$message.error('生成失败');
      }).finally(_ => {
        this.generating = false;
      });
    },
    onResize() {
      this.containerWidth = document.getElementById("app-container").clientWidth;
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'VonwaonBitmap';
  src: url('../../assets/card/VonwaonBitmap-12pxLite.ttf')format('truetype');
}

.app-container {
  display: flex;
  position: relative;
  flex-direction: column;
}

.main {
  position: relative;
  width: 1200px;
  height: 800px;
  background: url("../../assets/card/bg.jpg") no-repeat top left / 100% 100%;
  zoom: 0.5;
}

.el-form {
  width: 100%;
  margin-top: 20px;
  box-sizing: border-box;
  padding: 0 10px;
}

>>> .el-upload {
  width: 100%;
}

>>> .el-upload-dragger {
  width: unset;
}

>>> .el-upload__tip {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

>>> .el-upload__tip > * {
  margin-top: 5px;
  margin-bottom: 5px;
}

.avatar {
  display: block;
  position: absolute;
  border-radius: 999999px;
  width: 267px;
  height: 267px;
  top: 33px;
  left: 874px;
}

#barcode {
  display: block;
  position: absolute;
  width: 393px;
  height: 25px;
  top: 414px;
  left: 800px;
}

.text-area {
  position: absolute;
  font-family: 'VonwaonBitmap';
  top: 502px;
  left: 804px;
  width: 388px;
}

.text-area p {
  margin: 0;
  padding: 0;
  letter-spacing: 3px;
  line-height: 40px;
  word-break: break-all;
}

.number {
  color: white;
  font-size: 33px;
}

.nickname {
  margin-top: 22px !important;
  color: #eeefed;
  font-size: 28px;
}

.btn-gen {
  margin: 0 16%;
}

.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .6);
  z-index: 20;
}

.wrap>.content {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 600px;
  background-color: white;
  padding: 40px 10px;
  box-sizing: border-box;
  border-radius: 18px;
}

.wrap>.content>img {
  display: block;
  width: 100%;
}
</style>