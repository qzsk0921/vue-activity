import axios from 'axios'
import store from '@/store'
import { getCookie } from "@/util/auth.js"
// import qs from 'qs'
// import { POINT_CONVERSION_COMPRESSED } from 'constants';

const service = axios.create({
    // baseURL: POINT_CONVERSION_COMPRESSED.env.VUE_APP_BASE_API, //url = base url + request url
    timeout: 10000
})

// request拦截器
service.interceptors.request.use(
    config => {
        let params = {}
        if (typeof store.getters.commonParams != 'undefined') {
            if (typeof store.getters.commonParams != "object") {
                params = JSON.parse('' + store.getters.commonParams + '')
            } else {
                params = store.getters.commonParams
            }
        }

        if (config.method == 'post') {
            // config.data = qs.stringify({

            //     ...config.data,

            //     ...params,

            // })
            let data = {
                ...config.data,
                ...params
            }
            // axios.defaults.transformRequest = [function (data) {
            let ret = ''
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            config.data = ret
                // return ret
            // }]
        } else if (config.method == 'get') {
            config.params = {
                ...config.params,
                ...params,
            }
        }

        return config
    },
    error => {
        console.log(error)
        Promise.reject(error)
    }
)

// resoinse 拦截器
service.interceptors.response.use(
    response => {
        /**
         * code为非20000是抛错 可结合自己业务进行修改
         */

        // console.log(response)
        let res = response.data
        // if (res.result === 100) {
        //     if (!store.state.user.wxAuthorizeActive) {
        //         // 100:wxtoken授权过期
        //         store.commit('SET_WX_AUTHORIZE', true)
        //         store.dispatch('wxAuthorize')
        //     }
        //     // Message({
        //     //   message: res.msg,
        //     //   type: 'error',
        //     //   duration: 1 * 1000
        //     // })
        //     // return Promise.reject(new Error(res.msg || 'Error'))
        //     return res
        // } else {
            return res
        // }
    },
    error => {
        console.log('err' + error) // for debug
        // Message({
        //   message: error.message,
        //   type: 'error',
        //   duration: 5 * 1000
        // })
        return Promise.reject(error)
    }
)

export default service