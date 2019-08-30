<template>
  <div id="tip_alertModel" :class="{'hidden': !show}">
    <div class="t-alert-mask"></div>
    <div class="payment-box">
      <div class="tit item">{{title}}</div>
      <div class="success item" @click="successHandler">{{successBtn}}</div>
      <div class="error item" @click="errorHandler">{{errorBtn}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      title: "",
      successBtn: "",
      errorBtn: ""
    };
  },
  methods: {
    successHandler() {
      this.a_success && this.a_success();
      this.show = false;
    },
    errorHandler() {
      this.a_error && this.a_error();
      this.show = false;
    }
  }
}
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
    background: rgba(0, 0, 0, 0.5);
  }
  .payment-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: px2rem(600);
    border-radius: px2rem(10);
    background-color: #fff;
    text-align: center;
    font-size: px2rem(30);
    .tit {
    }
    .success {
        color: #ff2828;
    }
    .error {
        color: #666;
    }
    .item {
        padding: px2rem(40) 0;
        &:not(:first-child) {
            border-top: px2rem(1) solid #ececec;
        }
    }
  }
}
</style>

