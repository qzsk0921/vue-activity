<template>
  <div class="contation">
    <section class="activity-banner">
      <div class="img-box">
        <img :src="meet_info.cover" alt>
      </div>
      <div class="text-box">
        <p class="theme">{{meet_info.meet_theme}}</p>
        <p class="original-price" v-if="chainsType==3">{{meet_info.original_price_h5}}</p>
        <p class="price-range">
          <span>{{meet_info.price_range_h5}}</span>
          <span v-if="meet_info.meet_title_tail_h5">{{meet_info.meet_title_tail_h5}}</span>
          <del v-if="chainsType!=3">{{meet_info.original_price_h5}}</del>
        </p>
        <p>
          <span v-for="(item, i) in meet_info.info_list" :key="i">
            {{item}}
            <i v-if="(meet_info.info_list.length-1)!==i">·</i>
          </span>
        </p>
      </div>
    </section>
    <section class="activity-discount" v-if="meet_discount_info.discount_list">
      <div class="title">
        <span>拼活动优惠</span>
        <router-link class="instruction" :to="{ name: 'instruction'}">活动规则</router-link>
      </div>
      <div class="discount-box">
        <div
          class="discount-list"
          ref="discount_list"
          @touchstart="touchstart"
          @touchmove="touchmove"
          @touchend="touchend"
        >
          <div
            class="item"
            v-for="(item, i) in meet_discount_info.discount_list"
            :key="i"
            ref="discount_item"
          >
            <div :class="['box', {'active':meet_discount_info.current_discount===i}]">
              <span>{{item.count}}</span>
              <span>{{item.price}}</span>
            </div>
            <span class="arrow" v-show="i!==(meet_discount_info.discount_list.length-1)"></span>
          </div>
        </div>
      </div>
    </section>
    <section class="activity-desc">
      <div class="item" v-for="v in meet_desc.list" :key="v.title">
        <img :src="v.icon" alt>
        <span class="desc-tit">{{v.title}}</span>
        <span class="desc-info">{{v.content}}</span>
      </div>
    </section>
    <section class="activity-introduction">
      <h3>{{meet_detail.module_name}}</h3>
      <p v-html="meet_detail.content"></p>
    </section>
    <footer class="foot-box">
      <!-- <a class="btn" href="https://quhepai.com/mobile/download"> -->
      <div class="btn" @click="clickhandle">
        <span>{{bottom_button.title}}</span>
      </div>
    </footer>
    <!-- <dialog-smscode :smscodeDialogVisible="smscodeDialogVisible" @smscodeDialogHandle="smscodeDialogHandle"></dialog-smscode> -->
    <pin-dialog
      :popVisible="popVisible"
      :dialogType="dialogType"
      @popDialogHandle="popDialogHandle"
    />
  </div>
</template>

<script>
import PinDialog from "@/components/dialog";
import Bus from "@/util/bus.js";
import { meetDetail, getTicketInfo, signCheck } from "@/api/common.js";
import { getQueryString } from "@/util/index";
import { mapGetters } from "vuex";

export default {
  components: {
    PinDialog,
  },
  data() {
    return {
      pic:
        "http://s3.quhepai.com/uploads/common/201907/17/meet/pic/21bb14897aceac5f2d7a7fa7af8513dd.jpg",
      meet_info: {},
      meet_desc: {},
      meet_detail: {
        content: null,
        module_name: null
      },
      bottom_button: {},
      meet_discount_info: {
        current_discount: -1 //索引
      },
      // current_discount: 3,
      popVisible: false,
      dialogType: "smscode", //smscode:验证码报名弹窗，order:支付弹窗
      startPointX: null,
      diffX: null,
      startTime: null,
      endTime: null,
      distance: null //本次X偏移位置
    };
  },
  created() {
    this.getMeetDetail();
  },
  mounted() {
    Bus.$on("switchDialog", (dialogName, popVisible) => {
      this.dialogType = dialogName;
      this.popVisible = popVisible;
    });
    if (this.meet_discount_info.current_discount > 2) {
      let i = this.meet_discount_info.current_discount - 1;
      this.$nextTick(() => {
        let width = this.$refs.discount_item[0].offsetWidth;
        this.$refs.discount_list.style.transform = `translateX(-${width *
          i}px)`;
      });
    }
  },
  watch: {
    bottom_button(n) {
      if (n.status === 3) {
        this.getTicketInfo();
      }
    }
  },
  computed: {
    ...mapGetters(["smId", "shareUserId", "chainsType"])
  },
  methods: {
    getMeetDetail() {
      // alert(this.$store.getters.commonParams.userId)
      meetDetail({
        smId: this.smId,
        shareUserId: this.shareUserId
      })
        .then(res => {
          if (res.result === 1) {
            let data = res.data;
            this.meet_info = data.meet_info;
            this.bottom_button = data.h5btn;
            this.meet_desc = data.meet_desc;
            this.meet_detail = data.meet_detail;
            if (data.meet_discount_info) {
              this.meet_discount_info = data.meet_discount_info;
            }
          }
        })
        .catch(err => {
          this.$alert({
            content: err
          });
        });
    },
    clickhandle() {
      if (this.bottom_button.status === 1) {
        this.$router.push({ name: "success" })
        return
      } else {
        this.signCheck()
      }
    },
    signCheck() {
      signCheck({
        smId: this.smId
      })
        .then(res => {
          if (res.result === 1) {
            this.popVisible = true;
            if (this.bottom_button.status === 3) {
              this.dialogType = "order";
            }
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
    // toRegistration() {
    //     this.popVisible = true
    // },
    // toCheckRegistration() {

    // },
    popDialogHandle(v) {
      this.popVisible = v;
    },
    touchstart(e) {
      // this.startPointX = e.touches[0].pageX
      // this.startTime = this.getTime()
    },
    touchend(e) {
      // this.endTime = this.getTime()
      // let durationTime = this.endTime - this.startTime
      // let start = this.startPoint
      // let end = e.changedTouches[0].pageX
      // let distance = this.distance = end - start
      // if (durationTime < 200 && Math.abs(distance)>100) {
      //     this.$refs.discount_list.style.transform = `translateX(${this.translateX * 2}px)`
      // }
    },
    touchmove(e) {
      // let diffX = e.changedTouches[0].pageX - this.startPointX
      // this.$refs.discount_list.style.transform = `translateX(${diffX}px)`
      // this.browserVendor("transform", `translateX(${this.translateX}px)`)
    },
    getTime() {
      // 获取当前时间
      return parseInt(new Date().getTime());
    },
    getTicketInfo(smId) {
      getTicketInfo({
        smId: smId || this.smId
      })
        .then(res => {
          // console.log(res)
          if (res.result === 1) {
            Bus.$emit("meetInfo", res.data);
            // Bus.$emit('switchDialog', 'order')
          } else {
            console.log(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
    // browserVendor(styleStr, val) {
    //     // 浏览器兼容
    //     let vendors = ["t", "webkitT", "MozT", "msT", "OT"],
    //         styleObj,
    //         len = vendors.length;
    //     let elementStyle = this.$el.childNodes[0].style;
    //     for (var i = 0; i < len; i++) {
    //         styleObj = vendors[i] + styleStr.substr(1);
    //         if (styleObj in elementStyle) {
    //         elementStyle[styleObj] = val;
    //         }
    //     }
    // },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.contation {
  background-color: #ececec;
  padding-bottom: px2rem(90);
  .activity-banner {
    background-color: #fff;
    padding: px2rem(20) px2rem(34) px2rem(29);
    line-height: 1;
    .img-box {
      width: 100%;
      position: relative;
      height: px2rem(400);
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        border-radius: px2rem(20);
      }
    }
    .text-box {
      .theme {
        margin-top: px2rem(40);
        font-size: px2rem(32);
        color: #2e2e2e;
      }
      .original-price {
        text-decoration: line-through;
        color: #aaa;
        font-size: px2rem(30);
        margin-top: px2rem(30);
      }
      .price-range {
        font-size: px2rem(40);
        color: #ffa800;
        margin-top: px2rem(36);
        span {
          &:not(:first-child) {
            margin-left: px2rem(20);
            font-size: px2rem(28);
          }
        }
        del {
          margin-left: px2rem(20);
          color: #c3c3c3;
          font-size: px2rem(24);
        }
      }
      p {
        // &:first-child {
        //   margin-top: px2rem(40);
        //   font-size: px2rem(32);
        //   color: #2e2e2e;
        // }
        // &:nth-child(2) {
        //   text-decoration: line-through;
        //   color: #aaa;
        //   font-size: px2rem(30);
        //   margin-top: px2rem(30);
        // }
        // &:nth-child(3) {
        //   font-size: px2rem(40);
        //   color: #ffa800;
        //   margin-top: px2rem(36);
        //   span {
        //     &:not(:first-child) {
        //       margin-left: px2rem(20);
        //       font-size: px2rem(28);
        //     }
        //   }
        // }
        &:last-child {
          margin-top: px2rem(50);
          font-size: px2rem(24);
          color: #c3c3c3;
          display: flex;
          align-items: center;
          span {
            display: flex;
            align-items: center;
            i {
              margin: 0 px2rem(10);
            }
          }
        }
      }
    }
  }
  .activity-discount {
    margin-top: px2rem(20);
    padding: px2rem(30) 0 0 px2rem(34);
    background-color: #fff;
    .title {
      display: flex;
      justify-content: space-between;
      padding: 0 px2rem(34) 0 px2rem(10);
      border-left: px2rem(4) solid #ffa800;
      line-height: 1;
      // margin-right: px2rem(34);
      span {
        line-height: 1;
        font-size: px2rem(26);
        color: #2e2e2e;
      }
      .instruction {
        font-size: px2rem(22);
        color: #4a88cc;
      }
    }
    .discount-box {
      overflow: auto;
      margin-top: px2rem(34);
      padding-bottom: px2rem(30);
      .discount-list {
        width: auto;
        display: flex;
        transition: transform 0.2s;
        .item {
          display: flex;
          align-items: center;
          .box {
            width: px2rem(180);
            height: px2rem(120);
            border: 1px solid #eee;
            border-radius: px2rem(12);
            color: #989898;
            font-size: px2rem(24);
            line-height: 1.8;
            padding: px2rem(15) px2rem(25);
            display: flex;
            flex-direction: column;
            white-space: nowrap;
            justify-content: space-between;
          }
          &:last-child {
            margin-right: px2rem(34);
            .box {
              margin-right: px2rem(34);
            }
          }
        }
        .arrow {
          margin: 0 px2rem(20) 0 px2rem(15);
          &:before {
            content: "";
            display: block;
            width: px2rem(20);
            height: px2rem(20);
            border-top: 1px solid #ffa800;
            border-right: 1px solid #ffa800;
            transform: rotate(45deg);
          }
        }
      }
    }
  }
  .activity-desc {
    margin-top: px2rem(20);
    padding: 0 px2rem(34);
    background-color: #fff;
    .item {
      display: flex;
      align-items: center;
      height: px2rem(110);
      img {
        width: px2rem(34);
        height: px2rem(34);
      }
      .desc-tit {
        margin-left: px2rem(22);
        color: #2e2e2e;
        font-size: px2rem(28);
      }
      .desc-info {
        margin-left: px2rem(34);
        color: #989898;
        font-size: px2rem(28);
      }
    }
    .item:not(:first-child) {
      border-top: 1px solid #eee;
    }
  }
  .activity-introduction {
    margin-top: 0.266667rem;
    padding: 0.533333rem 0.453333rem;
    background-color: #fff;
    h3 {
      font-size: 0.426667rem;
      margin-bottom: 0.426667rem;
    }
    img {
      width: 9.093333rem;
      height: 5.333333rem;
      object-fit: cover;
    }
    p {
      font-size: 0.373333rem;
      color: #989898;
      line-height: 0.586667rem;
    }
  }
  .foot-box {
    width: 100%;
    max-width: px2rem(1024);
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: px2rem(9) 0;
    .btn {
      height: px2rem(80);
      width: px2rem(394);
      background-color: #ffa800;
      border-radius: px2rem(50);
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        font-size: px2rem(32);
        color: #fff;
      }
    }
  }
}
.active {
  color: #ffa800 !important;
}
</style>
