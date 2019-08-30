<template>
    <div class="container">
        <h2>一、 什么是拼活动 ?</h2>
        <p>拼活动由商家发起 , 多人一起购买可享受对应优惠价。</p>
        <h2>二、 如何参与拼活动 ?</h2>
        <p>用户购买后可发起拼购队伍 , 登录合拍APP分享活动链接可邀请好友参加</p>
        <h2>三、 优惠价格如何计算 ?</h2>
        <p>用户先以原价购买 , 拼购达到目标人数后你和好友都可享受对应优惠价 , 所支付差价 ( 原价减去优惠价 ) 将在活动结束日期退回支付账户。</p>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .container {
        line-height: 1;
        padding: px2rem(59) px2rem(40) 0;
        font-size: px2rem(26);
        letter-spacing: px2rem(1);
        h2 {
            &:not(:first-child) {
                margin-top: px2rem(60);
            }
        }
        p {
            margin-top: px2rem(20);
            line-height: 1.8;
        }
    }
</style>


