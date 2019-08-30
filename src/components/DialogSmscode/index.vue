<template>
  <div class="container">
    <!-- <transition name="fade"> -->
      <div :class="['popup', {'hidden': !smscodeDialogVisible}]">
        <div class="mask" @click="dialogVisible=false"></div>
        <div class="verification-box" ref="verificationBox">
          <div class="title-box">
            <i class="left"></i>
            <h3>验证手机号快速报名</h3>
            <i class="right"></i>
          </div>
          <input
            class="popup-input name-input"
            onFocus="inputFocus(1)"
            onBlur="inputBlur(1)"
            type="text"
            placeholder="填写姓名"
            v-model="name"
          >
          <input
            class="popup-input phonenum-input"
            onFocus="inputFocus(2)"
            onBlur="inputBlur(2)"
            type="number"
            placeholder="请输入手机号"
            v-model="phonenum"
          >
          <div class="code-box">
            <input
              class="smscode-input"
              onFocus="inputFocus(3)"
              onBlur="inputBlur(3)"
              type="number"
              placeholder="请输入验证码"
              v-model="smscode"
            >
            <div class="smscode-btn" onclick="getSmscodeHandle()">
              <span>获取验证码</span>
            </div>
          </div>
          <p class="err-tip"></p>
          <input
            type="hidden"
            name="_csrf"
            id="_csrf"
            value="<?= Yii::$app->getRequest()->getCsrfToken(); ?>"
          >
          <a class="go-bnt" @click="goHandle()" href="javascript: void(0);">进入报名</a>
        </div>
      </div>
    <!-- </transition> -->
  </div>
</template>

<script>
import { checkMobile } from "@/util/index";
export default {
  props: {
    smscodeDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.smscodeDialogVisible;
      },
      set() {
        this.$emit("smscodeDialogHandle", false);
      }
    }
  },
  watch: {
    dialogVisible(n) {
      if (n) {
        if (this.verificationBoxH) {
          this.$refs.verificationBox.style.transform = `translateY(-${
            this.verificationBoxH
          }px)`;
        } else {
          this.$nextTick(() => {
            this.verificationBoxH = this.$refs.verificationBox.offsetHeight;
            this.$refs.verificationBox.style.transform = `translateY(-${
              this.verificationBoxH
            }px)`;
          });
        }
      } else {
        this.$refs.verificationBox.style.transform = `translateY(${
          this.verificationBoxH
        }px)`;
      }
    }
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.popup {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  .mask {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
}
</style>

