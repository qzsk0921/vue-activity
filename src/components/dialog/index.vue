<template>
  <div class="container" @touchmove.prevent>
    <div :class="['popup', {'hidden': !dialogVisible}]">
      <div class="mask" @click="dialogVisible=false"></div>
      <smscode ref="smscode"></smscode>
      <order ref="order"></order>
    </div>
  </div>
</template>

<script>
import Smscode from "./smscode"
import Order from "./order"
// import { switchDialog } from "@/util/switchDialog"
// import Bus from "@/util/bus.js";

export default {
  components: {
    Smscode,
    Order,
  },
  props: {
    popVisible: {
      type: Boolean,
      default: false
    },
    dialogType: {
      type: String,
      default: "smscode"
    }
  },
  data() {
    return {
      smscodeH: null,
      orderH: null
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.popVisible;
      },
      set() {
        this.$emit("popDialogHandle", false);
      }
    }
  },
  watch: {
    dialogVisible(n) {
      if (n) {
        switch (this.dialogType) {
          case "smscode":
            if (this.smscodeH) {
              this.$refs.smscode.$el.style.transform = `translateY(-${
                this.smscodeH
              }px)`;
            } else {
              this.$nextTick(() => {
                this.smscodeH = this.$refs.smscode.$el.offsetHeight;
                this.$refs.smscode.$el.style.transform = `translateY(-${
                  this.smscodeH
                }px)`;
              });
            }
            break;
          case "order":
            if (this.orderH) {
              this.$refs.order.$el.style.transform = `translateY(-${
                this.orderH
              }px)`;
            } else {
              this.$nextTick(() => {
                this.orderH = this.$refs.order.$el.offsetHeight;
                this.$refs.order.$el.style.transform = `translateY(-${
                  this.orderH
                }px)`;
              });
            }
            break;
        }
      } else {
        switch (this.dialogType) {
          case "smscode":
            this.$refs.smscode.$el.style.transform = `translateY(${
              this.smscodeH
            }px)`;
            break;
          case "order":
            this.$refs.order.$el.style.transform = `translateY(${this.orderH}px)`;
            break;
        }
      }
    },
    dialogType (n) {
      switch(n) {
        case 'order':
          this.$refs.smscode.$el.style.transform = `translateY(${this.smscodeH}px)`
          setTimeout(() => {
              this.$nextTick(() => {
                this.orderH = this.$refs.order.$el.offsetHeight;
                this.$refs.order.$el.style.transform = `translateY(-${
                  this.orderH
                }px)`;
              });
          }, 200)
        break;
      }
    }
  },
  methods: {
    goHandle() {
      if (!name.trim()) {
        tipEl.text("请输入您的姓名");
        return;
      } else if (this.byteLength(name) > 12) {
        tipEl.text("最多输入6个中文");
      } else if (!checkMobile(phoneNum)) {
        // $('body').scrollTop(0);
        tipEl.text("请输入正确的手机号码");
        return;
      } else if (!smscode) {
        tipEl.text("请输入验证码");
        return;
      } else {
        tipEl.text("");
        signInByPhoneNum(name, phoneNum, smscode);
      }
    },
    byteLength() {
      var len = 0,
        code = 0;
      for (var i = 0; i < str.length; i++) {
        code = str.charCodeAt(i);
        if (code >= 0 && code <= 127) {
          len += 1;
        } else {
          len += 2;
        }
      }
      return len;
    },
    signInByPhoneNum(name, phoneNum, smscode) {
      $.ajax({
        type: "POST",
        url: "/meet/sign",
        data: {
          phone: phoneNum,
          code: smscode,
          smId: wrapEl.data("meet_id"),
          name: name,
          _csrf: _csrf,
          shareUserId: shareUserId
        },
        success: function(res) {
          // console.log(res)
          if (res.result === 1) {
            var data = res.data;
            location.href = data.redirectUrl + "&user_id=" + data.userId;
          } else {
            $(document).dialog({
              titleShow: false,
              style: "ios",
              content: res.msg
            })
          }
        },
        error: function(XMLHttpRequest, textStatus) {
          $(document).dialog({
            titleShow: false,
            style: "ios",
            content: textStatus
          })
        }
      })
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.popup {
  width: 100%;
  height: 100%;
  position: fixed;
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

