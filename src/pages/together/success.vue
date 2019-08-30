<template>
  <div class="container">
    <div class="result">
      <img class="r-icon" :src="result.icon" alt>
      <p>{{result.text}}</p>
    </div>
    <div class="content">
      <div class="card">
        <div class="tit">{{sign_success_data_h5.meet_theme}}</div>
        <div class="content-list">
          <div class="left">
            <div class="item" v-for="(item, i) in content_list" :key="i">
              <i class="point">·</i>
              <span>{{item.name}}</span>
            </div>
          </div>
          <img class="right" :src="`${sign_success_data_h5.meet_cover}!S1`" alt>
        </div>
      </div>
      <div class="btn" @click="clickHandle">
        <span>前往合拍</span>
      </div>
      <p class="tip">登录合拍获取活动核销码 , 凭码参加活动</p>
    </div>
  </div>
</template>

<script>
import { rSuccess } from "@/api/common";
import { mapGetters } from "vuex";
import orderData from "@/assets/js/orderData.js";

export default {
  data() {
    return {
      result: {},
      sign_success_data_h5: {},
      content_list: [
        {
          name: ""
        },
        {
          name: ""
        },
        {
          name: ""
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["smId", "download"])
  },
  created() {
    this.rSuccess();
  },
  methods: {
    rSuccess() {
      rSuccess({
        smId: this.smId
      })
        .then(res => {
          if (res.result === 1) {
            const data = res.data.sign_success_data_h5;
            this.sign_success_data_h5 = data;
            // this.meet_info = data.meet_info

            this.content_list[0].name = data.huodong_time;
            this.content_list[1].name = data.huodong_address;
            this.content_list[2].name = data.meet_order_amount;
            //1是报名成功，2已退出。
            if (data.status == 1) {
              this.result = orderData.success;
            } else if (data.status == 2) {
              this.result = orderData.fail;
            }
          }
        })
        .catch(err => {
          this.$alert({
            content: err
          });
          console.log(err);
        });
    },
    clickHandle() {
      location.href = this.download;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.container {
  .result {
    border: 1px solid transparent;
    text-align: center;
    height: px2rem(474);
    background: linear-gradient(#ffb055, #ff6d51);
    background-size: cover;
    .r-icon {
      margin: px2rem(160) auto px2rem(30);
      width: px2rem(200);
      height: px2rem(134);
    }
    p {
      font-size: px2rem(38);
      color: #fff;
    }
  }
  .content {
    border: 1px solid transparent;
    position: relative;
    padding: 0 px2rem(34) px2rem(100);
    .card {
      position: absolute;
      top: px2rem(-70);
      left: 0;
      width: 100%;
      z-index: 99;
      padding: px2rem(102) px2rem(68) px2rem(84);
      line-height: 1;
      background: url("~@/assets/images/pic_hepai_pinhuodong_baoming_chenggong_xiaopiao@2x.png")
        no-repeat 0 0;
      background-size: 100%;
      .tit {
        font-size: px2rem(32);
        color: #2e2e2e;
      }
      .content-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          .item {
            line-height: 1;
            &:first-child {
              margin-top: px2rem(40);
            }
            &:not(:last-child) {
              span {
                font-size: px2rem(24);
                color: #989898;
              }
            }
            &:not(:first-child) {
              margin-top: px2rem(30);
            }
            &:last-child {
              span {
                font-size: px2rem(38);
                color: #ffa800;
              }
            }
            .point {
              font-size: px2rem(20);
              margin-right: px2rem(30);
            }
          }
        }
        .right {
          width: px2rem(130);
          height: px2rem(130);
          border-radius: px2rem(10);
        }
      }
    }
    .btn {
      margin: px2rem(524) auto 0;
      width: px2rem(410);
      height: px2rem(80);
      background-color: #ffa800;
      border-radius: px2rem(50);
      text-align: center;
      line-height: px2rem(80);
      span {
        font-size: px2rem(32);
        color: #fff;
      }
    }
    .tip {
      text-align: center;
      margin-top: px2rem(80);
      font-size: px2rem(24);
      color: #858585;
      line-height: 1.5;
    }
  }
}
</style>


