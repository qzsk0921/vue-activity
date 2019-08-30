<template>
  <div class="order">
    <p class="tip">{{meetInfo.title}}</p>
    <p class="ticket-title">选择票种</p>
    <div class="ticket-content">
      <div v-for="item in meetInfo.list" :key="item.id" class="item">
        <span class="name">{{item.name}}<i v-show="quantity">*{{quantity}}</i></span>
        <span class="price">{{item.amount_text}}</span>
        <!-- <span class="price">&yen; {{item.amount}} <i v-if="chainsType==3">( 团购价 )</i></span> -->
      </div>
    </div>
    <div class="purchase">
      <span class="purchase-title">购买数量</span>
      <div class="purchase-control">
        <div class="subtract" @click="subtractHandle">-</div>
        <input type="number" v-model.number="quantity" @input="quantity= +String(quantity).replace(/^0+\D/g, '')" @blur="blurHandle">
        <div class="add" @click="addHandle">+</div>
      </div>
    </div>
    <div class="footer">
      <span>应付: <i class="symbol">&yen;</i><i class="price">{{price}}</i></span>
      <div class="pay-btn" @click="recharge">
        <span>确认支付</span>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from '@/util/bus.js';
import { mapGetters } from 'vuex';
import { genOrder, initParam } from '@/api/common.js';
import { checkMobile } from "@/util/index";
import { scrollTo } from "@/util/scrollTo";
import { getCookie, setCookie, removeCookie } from "@/util/auth.js";

let quantity = null
const r = /(^[1-9]([0-9]*)$|^[0-9]$)/
export default {
  data() {
    return {
      meetInfo: {},
      quantity: 1, //票数
      price: 0, //票单价
    }
  },
  watch: {
    quantity(n, o) {
      this.quantity = +String(n).replace(/^0+[1-9]/g, '')
      if (this.meetInfo.maxCount != -1 ) {
        if (n > this.meetInfo.maxCount)
          this.quantity = o
      }
        // this.quantity = +strQuantity.subString(1)
      this.price = (this.quantity * this.meetInfo.list[0].amount).toFixed(2)
    }
  },
  computed: {
    // 7h5支付 8公众号支付
    ...mapGetters(['userId', 'smId', 'shareUserId', 'payType', 'chainsType', 'vendor', 'wxAuthorizeActive', 'num'])
  },
  mounted () {
    Bus.$on('meetInfo', (data) => {
      this.meetInfo = data
      this.price = this.quantity * this.meetInfo.list[0].amount
    })
    if (getCookie('wxrecharge')) {
      removeCookie('wxrecharge')
      setTimeout(() => {
        this.initParam()
      }, 600)
    }
  },
  methods: {
    subtractHandle () {
      if (this.quantity <= 0) {
        return
      }
      this.quantity -= 1
    },
    addHandle () {
      quantity = this.quantity
      // h5不限制最多购买数
      if (this.meetInfo.maxCount != -1 ) {
        if (++quantity > this.meetInfo.maxCount)
          return
      }
      this.quantity += 1
    },
    recharge () {
      if (this.quantity === 0) {
        this.$alert({
          content:'请选择购买数量',
        })
        return
      }

      if (this.vendor === 'wx' && !getCookie('wxtoken')) {
        setCookie('num', this.quantity)
        setCookie('wxrecharge', true)
        // 只限微信
        this.$store.dispatch('wxAuthorize')
        return
      }

      let data = {
        userId: this.userId,
        smId: this.smId,
        num: this.quantity,
        shareUserId: this.shareUserId,
        payType: this.payType
      }
      this.orderGen(data)
    },
    orderGen (data) {
      genOrder(data).then(res => {
        if(res.result === 1) {
          let data = res.data
          Bus.$emit('switchDialog', 'order', false)
          if (this.payType === 7) {
            // h5支付
            location.href = data.url
            setCookie('h5recharge', true)
          } else {
            // 公众号支付
            this.wxCallpay(data)
          }
        } else if (res.result === 100) {
          Bus.$emit('switchDialog', 'order', false)
          if (!this.wxAuthorizeActive) {
            setCookie('num', this.quantity)
            setCookie('wxrecharge', true)
            // 100:wxtoken授权过期
            this.$store.commit('SET_WX_AUTHORIZE', true)
            this.$store.dispatch('wxAuthorize')
          }
        } else {
          this.$alert({
            content: res.msg,
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //调用微信JS api 支付
    wxBridgeReady (data) {
      const _this = this
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          timeStamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
          package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: data.paySign, // 支付签名
          appId: data.appId,
        },
        function (res) {
          // if(res.err_msg == "get_brand_wcpay_request:ok" ) {
          //   _this.$router.push({name: 'success'})
          //   // 使用以上方式判断前端返回,微信团队郑重提示：
          //   //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          // } else {
          //   alert('支付失败')
          //   _this.$router.push({name: 'registration'})
          // }
          switch (res.err_msg) {
              case 'get_brand_wcpay_request:ok':
                  _this.$router.push({name: 'success'})
              break;
              case 'get_brand_wcpay_request:fail':
                  _this.$router.push({name: 'registration'})
              break;
              case 'get_brand_wcpay_request:cancel':
                  _this.$router.push({name: 'registration'})
              break;
              default:
                _this.$router.push({name: 'registration'})
                WeixinJSBridge.log(res.err_msg)
                console.log(res.err_msg)
          }
        }
      )
    },
    wxCallpay (wxParam) {
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', this.wxBridgeReady(wxParam), false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', this.wxBridgeReady(wxParam));
            document.attachEvent('onWeixinJSBridgeReady', this.wxBridgeReady(wxParam));
        }
      } else {
          this.wxBridgeReady(wxParam);
      }
    },
    blurHandle () {
      scrollTo(0)
    },
    initParam () {
      initParam().then(res => {
          // console.log(res)
          if (res.result === 1) {
              let data = res.data
              let commonParams = {}
              if (data.wxtoken) {
                  setCookie('wxtoken', data.wxtoken)
                  this.$store.commit('SET_WXTOKEN', data.wxtoken)
                  
                  commonParams.wxtoken = data.wxtoken

                  setCookie('commonParams', commonParams)
                  this.$store.commit('SET_COMMONPARAMS', commonParams)

              }

              if (data.userId) {
                  setCookie('userId', data.userId)
                  this.$store.commit('SET_USERID', data.userId)

                  commonParams.userId = data.userId

                  setCookie('commonParams', commonParams)
                  this.$store.commit('SET_COMMONPARAMS', commonParams)
              }
              // if (!getCookie('wxtoken')) {
              //     // 只限微信
              //     store.dispatch('wxAuthorize')
              // }

              this.orderGen({
                userId: getCookie('userId'),
                smId: getCookie('smId'),
                num: getCookie('num'),
                shareUserId: getCookie('shareUserId'),
                payType: 8
              })
              // order.methods.recharge();
          } else {
              console.log(res.msg)
          }
      }).catch(err => {
          console.log(err)
      })
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.order {
  transition: all 0.2s;
  position: fixed;
  top: 100%;
  width: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: left;
  padding-bottom: 0.8rem;
  border-top-left-radius: 0.266667rem;
  border-top-right-radius: 0.266667rem;
  padding: px2rem(20) px2rem(20) px2rem(150);
  .tip {

  }
  .ticket-title {
    margin-top: px2rem(50);      
  }
  .ticket-content {
    margin-top: px2rem(30);
    width: 100%;
    .item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      // align-items: center;
      height: 1.066667rem;
      line-height: 1.066667rem;
      border: 1px solid rgb(221, 221, 221);
      border-radius: 0.133333rem;
      padding: 0 0.266667rem;
      color: rgb(46, 46, 46);
      &:first-child {
        background-color: rgba(255, 144, 14, 0.1);
        color: rgb(255, 144, 14);
        border-color: rgb(255, 144, 14);
      }
      &:not(:first-child) {
        margin-top: 0.533333rem;
      }
      .name {
        font-size: 0.346667rem;
      }
      .price {
        font-size: 0.373333rem;
      }
    }
  }
  .purchase {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: px2rem(50);
    width: 100%;
    .purchase-control {
      display: flex;
      align-items: center;
      div {
        display: inline-block;
        width: px2rem(50);
        height: px2rem(50);
        border: 1px solid #dddddd;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: px2rem(30);
        color: #989898;
        line-height: px2rem(50);
      }
      input {
        outline: none;
        border-top: 1px solid #dddddd;
        border-bottom: 1px solid #dddddd;
        height: px2rem(50);
        line-height: px2rem(50);
        width: px2rem(80);
        text-align: center;
        border-radius: 0;
      }
      .subtract {
        border-top-left-radius: px2rem(10);
        border-bottom-left-radius: px2rem(10);
      }
      .add {
        border-top-right-radius: px2rem(10);
        border-bottom-right-radius: px2rem(10);
      }
    }
  }
  .footer {
    width: 100%;
    height: px2rem(100);
    padding-left: px2rem(20);
    position: absolute;
    left: 0;
    bottom: 0;
    border-top: 1px solid #dddddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: px2rem(26);
    .symbol {
      color: #ff900e;
      font-size: px2rem(28);
    }
    .price {
      margin-left: px2rem(7);
      color: #ff900e;
      font-size: px2rem(40);
    }
    .pay-btn {
      height: 100%;
      width: px2rem(200);
      background-color: rgb(255, 168, 0);
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        color: #fff;
      }
    }
  }
}
</style>

