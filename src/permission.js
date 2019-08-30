import router from './router';
import store from './store';
import { getCookie, setCookie, removeCookie } from "@/util/auth.js";
import { init } from "@/api/common.js";

// import { initParam } from "@/api/common.js";
// import order from '@/components/dialog/order.vue';
// import { setLocalStorage } from "./util/commonUtil"
import { getQueryString } from "./util/index";

// chains_type 2 拼活动 3 团活动 4 聚活动
router.beforeEach((to, from, next) => {
    if(to.meta.title) {
        document.title = to.meta.title
    }
    if (location.search) {
        let smId = getQueryString('smId'),
            shareUserId = getQueryString('shareUserId');
        if (+smId && +shareUserId) {
            // 微信授权没有该参数，避免覆盖
            store.commit('SET_SMID', smId)
            store.commit('SET_SHARE_USER_ID', shareUserId)
            setCookie('smId', smId)
            setCookie('shareUserId', shareUserId)
            // setLocalStorage('smId', smId)
            // setLocalStorage('shareUserId', shareUserId)
        }
    }
    
    let ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        store.commit('SET_VENDOR', 'wx')
        store.dispatch('wxConfig')
        store.commit('SET_PAYTYPE', 8)
        // store.dispatch('initParam')

        // if (getCookie('wxrecharge')) {
        //     removeCookie('wxrecharge')
        //     initParam().then(res => {
        //         // console.log(res)
        //         if (res.result === 1) {
        //             let data = res.data
        //             let commonParams = {}
        //             if (data.wxtoken) {
        //                 setCookie('wxtoken', data.wxtoken)
        //                 store.commit('SET_WXTOKEN', data.wxtoken)
                        
        //                 commonParams.wxtoken = data.wxtoken

        //                 setCookie('commonParams', commonParams)
        //                 store.commit('SET_COMMONPARAMS', commonParams)

        //             }

        //             if (data.userId) {
        //                 setCookie('userId', data.userId)
        //                 store.commit('SET_USERID', data.userId)

        //                 commonParams.userId = data.userId

        //                 setCookie('commonParams', commonParams)
        //                 store.commit('SET_COMMONPARAMS', commonParams)
        //             }
        //             // if (!getCookie('wxtoken')) {
        //             //     // 只限微信
        //             //     store.dispatch('wxAuthorize')
        //             // }

        //             next();
                    
        //             setTimeout(() => {
        //                 order.methods.orderGen({
        //                     userId: getCookie('userId'),
        //                     smId: getCookie('smId'),
        //                     num: getCookie('num'),
        //                     shareUserId: getCookie('shareUserId'),
        //                     payType: 8
        //                 })
        //             }, 1000)

        //             // order.methods.recharge();
        //         } else {
        //             console.log(res.msg)
        //         }
        //     }).catch(err => {
        //         console.log(err)
        //     })
        // } else {
            next()
        // }
    } else if (ua.match(/MQQBrowser/i) == "mqqbrowser" && !(ua.match(/MicroMessenger/i) == "micromessenger")) {
        init({
            smId: getQueryString('smId'),
            shareUserId: getQueryString('shareUserId')
        }).then(res => {
            if (res.result === 1) {
                const data = res.data.share_info
                const metaInfo = {
                    title: data.title,
                    description: data.content,
                    image: data.pic
                }
                store.commit('CHANGE_META_INFO', metaInfo)
                next()
            }
        })
    } else {
        next()
    }
})