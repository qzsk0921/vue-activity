import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMeta from 'vue-meta'
import './permission'
import service from './util/request.js'

import '@/style/index.scss' //global css

import alert from './components/alert/index'
import paymentAlert from './components/dialog/payment/index'
import toast from './components/toast/index'

Vue.prototype.$alert = alert
Vue.prototype.$paymentAlert = paymentAlert
Vue.prototype.$toast = toast

Vue.config.productionTip = false

// 只有以 VUE_APP_ 开头的变量会被 webpack.DefinePlugin 静态嵌入到客户端侧的包中
service.defaults.baseURL = process.env.VUE_APP_API

Vue.use(VueMeta)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
