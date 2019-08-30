<template>
  <div id="tip_alertModel" :class="{'hidden': !show}">
    <div class="t-alert-mask"></div>
    <div class="t-alert-container">
      <div class="t-alert-title">
        <span>{{title}}</span>
        <!-- <img @click="close" src="" alt=""> -->
      </div>
      <div class="t-alert-content">
        <span class="content-text">{{content}}</span>
      </div>
      <div class="t-alert-confirm">
        <!-- 默认是没有取消按钮的，data定义默认true false -->
        <button @click="cancel" v-show="cancelBtn" class="cancel-btn">取消</button>
        <button @click="confirm">{{comfirmBtnT}}</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: true, // 通过这个属性，控制是否移除dom元素
      title: "", // 顶部标题
      content: "", // 内容
      cancelBtn: false, // 取消按钮
      comfirmBtnT: ""
    };
  },
  methods: {
    close() {
      // 右上角关闭
      this.a_close && this.a_close();
      this.show = false;
      // 删除判断增加的window属性
      delete window.alertIsShow;
    },
    confirm() {
      // 确定
      this.a_confirm && this.a_confirm();
      this.show = false;
      // 删除判断增加的window属性
      delete window.alertIsShow;
    },
    cancel() {
      // 取消
      this.a_cancel && this.a_cancel();
      this.show = false;
      // 删除判断增加的window属性
      delete window.alertIsShow;
    }
  },
  // watch: {
  //   show(cur, old) {
  //     // 通过监控data里的show属性  弹框有三个事件（右上角取消  确定按钮  取消按钮）
  //     // 每个事件写了 this.show = false
  //     // 当弹框出现的时候 点击任何一个事件  都会触发这里的监控事件  将页面上的弹框Dom移除
  //     if (cur == false) {
  //       let tip_alert = document.getElementById("tip_alertModel");
  //       tip_alert.parentNode.removeChild(tip_alert);
  //     }
  //   }
  // }
};
</script>

<style rel="stylesheet" lang="scss" scoped>
// @import "../../style/animate.scss";

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

  .t-alert-container {
    width: px2rem(600);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: auto;
    background: #fff;
    border-radius: px2rem(15);
    color: #333;
    text-align: center;
    .t-alert-title {
      border-bottom: px2rem(1) solid #ececec;
      span {
        line-height: px2rem(92);
        font-size: px2rem(32);
        font-weight: 500;
      }

      // img {
      //   position: absolute;
      //   top: 50%;
      //   right: 10px;
      //   transform: translate(0, -50%);
      //   cursor: pointer;
      // }
    }
    .t-alert-content {
      text-align: center;
      span {
        font-size: px2rem(28);
        font-family: PingFangSC-Regular;
        font-weight: 400;
        // color: rgba(51, 51, 51, 1);
      }

      span.content-text {
        box-sizing: border-box;
        display: inline-block;
        width: 100%;
        height: auto;
        font-size: px2rem(30);
        font-weight: 400;
        padding: px2rem(70) px2rem(40);
      }
      .t-content-list {
        min-width: 320px;
        height: auto;
        text-align: left;
        .list-title {
          position: relative;
          padding: 10px 0 10px 10px;
          img {
            position: absolute;
            display: inline-block;
            width: 20px;
            margin-right: 10px;
          }
          span {
            display: inline-block;
            padding-left: 31px;
            vertical-align: middle;
          }
        }
        .list-content {
          width: 100%;
          height: auto;
          ul {
            padding-bottom: 10px;
            li {
              width: 100%;
              height: auto;
              padding-bottom: 10px;
              span {
                vertical-align: top;
              }
              span.title {
                display: inline-block;
                text-align: left;
                padding-left: 41px;
                padding-right: 3px;
              }
            }
          }
        }
      }
    }

    .t-alert-confirm {
      width: 100%;
      padding: px2rem(20) 0;
      text-align: center;
      border-top: 1px solid #ececec;
      display: flex;
      justify-content: center;
      button {
        padding: px2rem(13) px2rem(70);
        font-size: px2rem(30);
        color: #333;
        font-weight: 400;
        background: #ffa800;
        border-radius: px2rem(15);
        outline: none;
        border: none;
        cursor: pointer;
        color: #fff;
      }
      .cancel-btn {
        border: 1px solid #ececec;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #333;
        background: transparent;
        margin-right: px2rem(80);
      }
    }
  }
}
</style>