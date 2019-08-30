// import { getLocalStorage } from "@/util/commonUtil.js"
import { getCookie, setCookie } from "@/util/auth.js"
import { wxAuthorize, init, queryOrder } from "@/api/common.js"
import wx from 'weixin-js-sdk'
import router from "@/router"
import alert from '@/components/alert/index'
import toast from '@/components/toast/index'

import registration from '@/pages/together/registration.vue'
import Bus from '@/util/bus.js'

const user = {
    state: {
        wxtoken: getCookie('wxtoken'),
        smId: getCookie('smId'),
        shareUserId: getCookie('shareUserId'),
        commonParams: getCookie('commonParams'),
        userId: getCookie('userId'),
        payType: 7, //默认h5支付
        wxAuthorizeActive: false
    },
    mutations: {
        SET_WXTOKEN(state, wxtoken) {
            state.wxtoken = wxtoken
        },
        SET_SMID(state, smId) {
            state.smId = smId
        },
        SET_SHARE_USER_ID(state, shareUserId) {
            state.shareUserId = shareUserId
        },
        SET_COMMONPARAMS(state, commonParams) {
            state.commonParams = commonParams
        },
        SET_USERID(state, userId) {
            state.userId = userId
        },
        SET_PAYTYPE(state, payType) {
            state.payType = payType
        },
        SET_WX_AUTHORIZE(state, wxAuthorizeActive) {
            state.wxAuthorizeActive = wxAuthorizeActive
        }
    },
    actions: {
        wxConfig({ state, commit, dispatch }) {
            return new Promise((resolve, reject) => {
                init({
                    smId: state.smId,
                    shareUserId: state.shareUserId
                }).then(res => {
                    if (res.result === 1) {
                        const data = res.data.share_info
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: data.config.appId, // 必填，公众号的唯一标识
                            timestamp: data.config.timestamp, // 必填，生成签名的时间戳
                            nonceStr: data.config.nonceStr, // 必填，生成签名的随机串
                            signature: data.config.signature,// 必填，签名
                            jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表
                        })
                        wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
                            wx.updateAppMessageShareData({
                                title: data.title, // 分享标题
                                desc: data.content, // 分享描述
                                link: data.share_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                                imgUrl: data.pic, // 分享图标
                                success: function () {
                                    // 设置成功
                                }
                            })

                            wx.updateTimelineShareData({
                                title: data.title, // 分享标题
                                link: data.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                                imgUrl: data.pic, // 分享图标
                                success: function () {
                                    // 设置成功
                                }
                            })
                        })
                    } else {
                        console.log(res.msg)
                    }
                }).catch(err => {
                    console.log(err)
                })
            })
        },
        wxAuthorize({ state, commit, dispatch }) {
            return new Promise((resolve, reject) => {
                wxAuthorize({
                    smId: state.smId,
                    shareUserId: state.shareUserId
                }).then(res => {
                    // console.log(res)
                    if (res.result === 1) {
                        // removeCookie('wxtoken');
                        location.href = res.data.url
                    } else {
                        console.log(res.msg)
                    }
                }).catch(err => {
                    console.log(err)
                })
            })
        },
        // initParam ({ state, commit, dispatch }) {
        //     return new Promise((resolve, reject) => {
        //         initParam().then(res => {
        //             // console.log(res)
        //             if (res.result === 1) {
        //                 let data = res.data
        //                 let commonParams = {}
        //                 if (data.wxtoken) {
        //                     commit('SET_WXTOKEN', data.wxtoken)
        //                     setCookie('wxtoken', data.wxtoken)

        //                     commonParams.wxtoken = data.wxtoken

        //                     commit('SET_COMMONPARAMS', commonParams)
        //                     setCookie('commonParams', commonParams)
        //                 }

        //                 if (data.userId) {
        //                     commit('SET_USERID', data.userId)
        //                     setCookie('userId', data.userId)

        //                     commonParams.userId = data.userId

        //                     commit('SET_COMMONPARAMS', commonParams)
        //                     setCookie('commonParams', commonParams)
        //                 }

        //                 if (!getCookie('wxtoken')) {
        //                     // 只限微信
        //                     dispatch('wxAuthorize')
        //                 }
        //             } else {
        //                 console.log(res.msg)
        //             }
        //         }).catch(err => {
        //             console.log(err)
        //         })
        //     })
        // },
        queryOrder({ state, commit, dispatch }, action) {
            const toastInstance = toast({
                content: '正在查询'
            })
            //@param: action
            //a_success表示用户点击已完成支付 a_error表示用户点击遇到问题重新支付（用户行为不同后续流程不同）
            return new Promise((resolve, reject) => {
                queryOrder({
                    smId: state.smId,
                    userId: state.userId
                }).then(res => {
                    toastInstance.show = false
                    if (res.result === 1) {
                        // toast.content = '查询成功'
                        // toast.show = false
                        // status 1 成功 2 失败
                        if (res.data.status === 2) {
                            switch (action) {
                                case 'a_success':
                                    alert({
                                        title: '提示',
                                        content: '您未完成支付 , 请返回支付',
                                        confirm() {
                                            registration.methods.getTicketInfo(state.smId)
                                            Bus.$emit('switchDialog', 'order', true)
                                            // 这里执行点击确定按钮需要做的事，默认执行关闭弹框
                                        }
                                    })
                                    break;
                                case 'a_error':
                                    registration.methods.getTicketInfo(state.smId)
                                    Bus.$emit('switchDialog', 'order', true)
                                    break;
                                default:
                                    router.push({ name: 'registration' })
                            }

                        } else if (res.data.status === 1) {
                            switch (action) {
                                case 'a_success':
                                    router.push({name: 'success'})
                                    break;
                                case 'a_error':
                                    alert({
                                        title: '提示',
                                        content: '您已经支付完成 , 无需重新支付',
                                        comfirmBtnT: '查看报名',
                                        confirm() {
                                            router.push({name: 'success'})                  
                                        },
                                    })
                                    break;
                                default:
                                    router.push({ name: 'registration' })
                            }
                        }
                    } else {
                        console.log(res.msg)
                    }
                }).catch(err => {
                    console.log(err)
                })
            })
        }
    }
}

export default user