<template>
  <div id="app">
    <!--vue-ssr-outlet-->
    <loading v-show="isLoading"></loading>
    <!-- <transition :name="transitionName"> -->
    <keep-alive>
      <router-view v-show="!isLoading"/>
    </keep-alive>
    <!-- <router-view v-if="!$route.meta.keepAlive"/> -->
    <!-- </transition> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Loading from "./components/loading";
import Bus from "@/util/bus.js";
import { getQueryString, checkMobileSystem } from "./util/index";
import { getCookie, setCookie, removeCookie } from "@/util/auth.js";

// chains_type 2 拼活动 3 团活动 4 聚活动
export default {
  name: "app",
  components: {
    Loading
  },
  metaInfo() {
    return {
      meta: [
        {
          itemprop: "name",
          content: this.metaInfo.title
          // content: '标题'
        },
        {
          itemprop: "description",
          content: this.metaInfo.description
          // content: '描述'
        },
        {
          itemprop: "image",
          content: this.metaInfo.image
          // content: 'https://avatar-static.segmentfault.com/169/678/1696786649-59aab7092a4ab_big64'
        }
      ]
    };
  },
  data() {
    return {
      mobileSystem: checkMobileSystem(),
      chains_type: getQueryString("chains_type"),
      clientWidth: document.documentElement.clientWidth,
      transitionName: ""
    };
  },
  mounted() {
    // this.$store.dispatch("initParam");
    this.init();
    // Bus.$on('scrollTop', this.scrollTo)
    this.$store.commit("CHAINS_TYPE", this.chains_type);
    this.$store.commit("SET_MOBILE_SYSTEM", this.mobileSystem);
    window.addEventListener(
      "visibilitychange",
      this.handleVisibilityChange,
      false
    );
    this.queryOrder();
  },
  computed: {
    ...mapGetters(["isLoading", "metaInfo"])
  },
  watch: {
    clientWidth(nv) {
      document.documentElement.style.fontSize = nv / 10 + "px";
    }
    // $route(to, from) {
    //   //如果to的索引值为0，不添加任何动画；如果to索引大于from索引,判断为前进状态,反之则为后退状态
    //   if (to.meta.index > 0) {
    //     if (to.meta.index < from.meta.index) {
    //       this.transitionName = "slide-right";
    //     } else {
    //       this.transitionName = "slide-left";
    //     }
    //   } else if (to.meta.index == 0 && from.meta.index > 0) {
    //     this.transitionName = "slide-right";
    //   }
    // }
  },
  methods: {
    init() {
      document.documentElement.style.fontSize = this.clientWidth / 10 + "px";
      let resizeEvt =
        "orientationchange" in window ? "orientationchange" : "resize";
      window.addEventListener(resizeEvt, this.recalc);
    },
    recalc() {
      let docEl = document.documentElement;
      this.clientWidth = docEl.clientWidth;
    },
    queryOrder() {
      const _this = this;
      if (getCookie("h5recharge")) {
        removeCookie("h5recharge");
        this.$paymentAlert({
          title: "请确认微信支付是否已完成",
          successBtn: "已完成支付",
          errorBtn: "支付遇到问题 , 重新支付",
          success() {
            // 这里执行已完成支付要做的事、默认执行关闭弹框
            _this.$store.dispatch("queryOrder", "a_success");
          },
          error() {
            // 这里执行重新支付要做的事、默认执行关闭弹框
            _this.$store.dispatch("queryOrder", "a_error");
          }
        });
        // this.$store.dispatch("queryOrder");
      }
    },
    handleVisibilityChange() {
      if (document.hidden) {
        // 离开页面do something
      } else {
        this.queryOrder();
      }
    }
  }
};
</script>

<style lang="scss">
// .slide-right-enter-active,
// .slide-right-leave-active,
// .slide-left-enter-active,
// .slide-left-leave-active {
//   will-change: transform;
//   transition: all 0.5s;
//   transform: translateZ(0, 0, 0, 0.00001);
//   position: absolute;
//   width: 100%;
//   left: 0;
//   top: 0;
// }
// .slide-right-enter {
//   transform: translateX(-100%);
// }
// .slide-right-leave-active {
//   transform: translateX(100%);
// }
// .slide-left-enter {
//   transform: translateX(100%);
// }
// .slide-left-leave-active {
//   transform: translateX(-100%);
// }
</style>
