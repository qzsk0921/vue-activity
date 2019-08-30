import Vue from 'vue';
import Alert from './alert'; //引入刚才写的弹框组件 
let AlertConstructor = Vue.extend(Alert) // 返回一个“扩展实例构造器” 

let AlertModel = (o) => {
    let alertDom = new AlertConstructor({
        el: document.createElement('div') //将Alert组件挂载到新创建的div上 
    })
    document.body.appendChild(alertDom.$el) //把Alert组件的dom添加到body里 

    // 标题
    alertDom.title = o.title;
    // 单条内容
    alertDom.content = o.content;
    // 关闭按钮
    alertDom.cancelBtn = o.cancelBtn;
    // 确定按钮
    alertDom.comfirmBtnT = o.comfirmBtnT || '确定';

    // 弹框三个事件 右上角关闭 确定 取消
    alertDom.a_close = o.close || null;
    alertDom.a_confirm = o.confirm || null;
    alertDom.a_cancel = o.cancel || null;

}
export default AlertModel;

// this.$alert({
//     title: '信息',
//     content: '登入成功！',
//     cancelBtn: true, //这个是启用取消按钮，
//     close() {
//         // 这里执行点击右上角需要做的事，默认执行关闭弹框
//     },
//     confirm() {
//         // 这里执行点击确定按钮需要做的事，默认执行关闭弹框
//     },
//     cancel() {
//         // 这里执行点击取消按钮需要做的事，默认执行关闭弹框
//     }
// })