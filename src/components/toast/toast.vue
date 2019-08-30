<template>
  <div id="tip_alertModel" :class="{'hidden': (!show && show!==undefined)}">
    <div class="t-alert-mask"></div>
    <div class="toast-box">
      <span class="toast-icon"></span>
      {{content}}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: "",
      content: ""
    };
  },
  watch: {
    show(n, o) {
      this.show = n
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#tip_alertModel {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  .t-alert-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
  }
  .toast-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: px2rem(450);
    border-radius: px2rem(10);
    color: #fff;
    text-align: center;
    font-size: px2rem(36);
    line-height: px2rem(120);
    padding: 0 px2rem(35);
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .toast-icon {
      margin-right: px2rem(40);
      width: px2rem(60);
      height: px2rem(60);
      border: 2px solid rgba(255, 255, 255, 0.4);
      border-bottom-color: rgba(255, 255, 255, 0.1);
      border-radius: 100%;
      animation: rotate 1.2s linear infinite;
      vertical-align: middle;
    }
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

