<template>
  <div class="verification-box" ref="verificationBox" @touchmove.prevent>
    <div class="title-box">
      <i class="left"></i>
      <h3>验证手机号快速报名</h3>
      <i class="right"></i>
    </div>
    <input
      class="popup-input name-input"
      type="text"
      placeholder="填写姓名"
      v-model="name"
      @focus="inputFocus(1)"
      @blur="inputBlur(1)"
    >
    <input
      class="popup-input phonenum-input"
      type="number"
      placeholder="请输入手机号"
      v-model="phonenum"
      @focus="inputFocus(2)"
      @blur="inputBlur(2)"
    >
    <div class="code-box">
      <input
        class="smscode-input"
        type="number"
        placeholder="请输入验证码"
        v-model="smscode"
        @focus="inputFocus(3)"
        @blur="inputBlur(3)"
      >
      <div class="smscode-btn" @click="getSmscodeHandle">
        <span :class="{'smscode-active': lockSmscode}">{{text}}</span>
      </div>
    </div>
    <p class="err-tip">{{tip}}</p>
    <!-- <input
      type="hidden"
      name="_csrf"
      id="_csrf"
    >-->
    <a class="go-bnt" @click="goHandle" href="javascript: void(0);">进入报名</a>
  </div>
</template>

<script>
import { checkMobile } from "@/util/index";
import Bus from "@/util/bus.js";
import { getSmscode, sign, getTicketInfo } from "@/api/common.js";
import { mapGetters } from "vuex";
import { getCookie, setCookie } from "@/util/auth.js";
import { scrollTo } from "@/util/scrollTo";

export default {
  data() {
    return {
      name: "",
      phonenum: null,
      smscode: null,
      tip: null,
      text: "获取验证码",
      lockSmscode: false,
      nameBlur: true,
      phonenumBlur: true,
      smscodeBlur: true
    };
  },
  computed: {
    ...mapGetters(["smId", "shareUserId", "mobileSystem", "download"])
  },
  watch: {
    // focusCount: function (n) {
    //   this.$nextTick(() => {
    //     this.text = n
    //     if (n === 0) {
    //       Bus.$emit('scrollTop')
    //     }
    //   })
    // },
    // blurStatus: {
    //   handle: function(n) {
    //     alert(7777)
    //     if (n.name && n.phone && n.smscode) {
    //       alert(999)
    //     }
    //   },
    //   deep: true
    // }
  },
  methods: {
    getSmscodeHandle() {
      if (this.lockSmscode) return;
      if (!checkMobile(this.phonenum)) {
        this.tip = "请输入正确的手机号码";
      } else {
        this.lockSmscode = true;
        getSmscode({
          phone: this.phonenum
        })
          .then(res => {
            if (res.result === 1) {
              let time = 60;
              this.tip = "";
              let timer = setInterval(() => {
                time--;
                this.text = `${time}s后重发`;
                if (time <= 0) {
                  clearInterval(timer);
                  this.text = "重发";
                  this.lockSmscode = false;
                }
              }, 1000);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    goHandle() {
      if (!this.name.trim()) {
        this.tip = "请输入您的姓名";
        return;
      } else if (this.byteLength(this.name) > 12) {
        this.tip = "最多输入6个中文";
      } else if (!checkMobile(this.phonenum)) {
        // $('body').scrollTop(0);
        this.tip = "请输入正确的手机号码";
        return;
      } else if (!this.smscode) {
        this.tip = "请输入验证码";
        return;
      } else {
        this.tip = "";
        this.signInByPhonenum(this.name, this.phonenum, this.smscode);
      }
      // this.signInByPhonenum(this.name, this.phonenum, this.smscode)
    },
    byteLength(str) {
      let len = 0,
        code = 0;
      for (let i = 0; i < str.length; i++) {
        code = str.charCodeAt(i);
        if (code >= 0 && code <= 127) {
          len += 1;
        } else {
          len += 2;
        }
      }
      return len;
    },
    signInByPhonenum(name, phonenum, smscode) {
      sign({
        phone: phonenum,
        code: smscode,
        smId: this.smId,
        name: name,
        shareUserId: this.shareUserId
      })
        .then(res => {
          // 101 付款报名成功 102 报名成功需要去支付
          // console.log(res)
          if (res.result === 1 || res.result === 102) {
            const data = res.data;
            this.$store.commit("SET_USERID", data.userId);
            setCookie("userId", data.userId);

            let commonParams = getCookie("commonParams") || {};
            try {
              commonParams = JSON.parse(commonParams);
            } catch (err) {
              console.log(err);
            }
            // if (typeof this.$store.getters.commonParams != 'undefined') {

            //   if (typeof commonParams != "object") {
            //         params = JSON.parse('' + this.$store.getters.commonParams + '')
            //     } else {
            //         params = this.$store.getters.commonParams
            //     }
            // } else {

            // }
            commonParams.userId = data.userId;
            this.$store.commit("SET_COMMONPARAMS", commonParams);
            setCookie("commonParams", commonParams);

            this.getTicketInfo();
          } else if (res.result === 101) {
            const _this = this;
            this.$alert({
              content: res.msg,
              cancelBtn: true, //这个是启用取消按钮，
              confirm() {
                // 这里执行点击确定按钮需要做的事，默认执行关闭弹框
                location.href = _this.download;
              },
              cancel() {
                // 这里执行点击取消按钮需要做的事，默认执行关闭弹框
              }
            });
            // this.$router.push({name: 'success'})
          } else {
            this.$alert({
              content: res.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getTicketInfo() {
      getTicketInfo({
        smId: this.smId
      })
        .then(res => {
          //  console.log(res)
          if (res.result === 1) {
            Bus.$emit("meetInfo", res.data);
            Bus.$emit("switchDialog", "order", true);
          } else {
            console.log(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    inputFocus(type) {
      // params: 1:name,2:phonenum,3:smscode
      if (this.mobileSystem === "apple") {
        switch (type) {
          case 1:
            this.nameBlur = false;
            this.phonenumBlur = true;
            this.smscodeBlur = true;
            break;
          case 2:
            this.nameBlur = true;
            this.phonenumBlur = false;
            this.smscodeBlur = true;
            break;
          case 3:
            this.nameBlur = true;
            this.phonenumBlur = true;
            this.smscodeBlur = false;
            break;
        }
      }
    },
    inputBlur(type) {
      if (this.mobileSystem === "apple") {
        switch (type) {
          case 1:
            this.nameBlur = true;
            break;
          case 2:
            this.phonenumBlur = true;
            break;
          case 3:
            this.smscodeBlur = true;
            break;
        }
        setTimeout(() => {
          if (this.nameBlur && this.phonenumBlur && this.smscodeBlur) {
            scrollTo(0);
          }
        }, 200);
      }
    }
  }
};
</script>

<style rel="stylesheet" lang="scss" scoped>
.verification-box {
  transition: all 0.2s;
  position: fixed;
  top: 100%;
  width: 100%;
  /* height: 8.533333rem; */
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: px2rem(60);
  border-top-left-radius: px2rem(20);
  border-top-right-radius: px2rem(20);
  .title-box {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: px2rem(58) 0;
    h3 {
      font-size: px2rem(34);
      color: rgb(46, 46, 46);
    }
    i {
      width: px2rem(62);
      height: px2rem(2);
      background-color: rgba(0, 0, 0, 0.6);
    }
    .left {
      margin-right: px2rem(18);
    }
    .right {
      margin-left: px2rem(18);
    }
  }
  .popup-input {
    width: px2rem(630);
    height: px2rem(80);
    background-color: rgb(248, 248, 248);
    padding-left: px2rem(40);
    outline: none;
    border: none;
    margin-bottom: px2rem(20);
    border-radius: px2rem(40);
    font-size: px2rem(28);
    &:-webkit-input-placeholder {
      font-size: px2rem(28);
      color: rgb(195, 195, 195);
    }
  }
  .code-box {
    display: flex;
    align-items: center;
    position: relative;
    width: px2rem(630);
    background-color: rgb(248, 248, 248);
    border-radius: px2rem(40);
    overflow: hidden;
    .smscode-input {
      width: 70%;
      height: px2rem(80);
      padding-left: px2rem(40);
      outline: none;
      border: none;
      background-color: rgb(248, 248, 248);
      padding-right: px2rem(40);
      font-size: px2rem(28);
      &:-webkit-input-placeholder {
        font-size: px2rem(28);
        color: rgb(195, 195, 195);
      }
    }
    .smscode-btn {
      padding: 0 px2rem(40);
      position: absolute;
      right: 0;
      top: 0;
      height: px2rem(80);
      line-height: px2rem(80);
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        color: rgb(46, 46, 46);
        font-size: px2rem(28);
      }
      &:before {
        content: "";
        display: inline-block;
        position: absolute;
        left: 0;
        width: px2rem(2);
        height: px2rem(40);
        background-color: rgb(238, 238, 238);
      }
    }
  }
  .go-bnt {
    /* margin-top: px2rem(40); */
    width: px2rem(630);
    height: px2rem(90);
    background-color: rgb(255, 168, 0);
    color: #fff;
    font-size: px2rem(32);
    border-radius: px2rem(45);
    text-align: center;
    line-height: px2rem(90);
  }
  .err-tip {
    height: px2rem(70);
    line-height: px2rem(70);
    color: #ff2828;
    font-size: px2rem(22);
  }
  .smscode-active {
    color: rgb(195, 195, 195) !important;
  }
}
</style>

