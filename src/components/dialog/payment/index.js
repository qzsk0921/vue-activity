import Vue from 'vue'
import Payment from  './payment'

let PaymentConstructor = Vue.extend(Payment)

let PaymentModel = (o) => {
    let paymentDom = new PaymentConstructor({
        el: document.createElement('div')
    })
    document.body.appendChild(paymentDom.$el)

    paymentDom.title = o.title //顶部标题
    paymentDom.successBtn = o.successBtn //支付成功按钮内容
    paymentDom.errorBtn = o.errorBtn //支付失败按钮内容

    // 两个事件 用户点击完成成功和支付失败（和实际结果无关）
    paymentDom.a_success = o.success || null
    paymentDom.a_error = o.error || null

}

export default PaymentModel

// this.$paymentAlert({
//     title: '请确认微信支付是否已完成',
//     successBtn: '已完成支付',
//     errorBtn: '支付遇到问题 , 重新支付',
//     success() {
//       // 这里执行已完成支付要做的事、默认执行关闭弹框
//     },
//     error() {
//       // 这里执行重新支付要做的事、默认执行关闭弹框
//     }
//   })