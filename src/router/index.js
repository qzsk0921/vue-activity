import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import registation from '@/pages/together/registration.vue'

export const constantRouterMap = [
    {
        path: '',
        // name: 'index',
        // component: Index,
        redirect: { name: 'registration' },
        meta: {
            authorization: true
        }
    },
    {
        name: 'registration', //活动报名
        path: '/registration',
        component: registation,
        meta: {
            index: 1,
            authorization: true,
            title: '活动报名',
            keepAlive: true
        }
    }, {
        name: 'instruction', //活动说明
        path: '/instruction',
        component: () => import('@/pages/together/instruction'),
        meta: {
            index: 2,
            title: '活动说明',
            keepAlive: true
        }
    }, {
        name: 'success', //活动报名成功
        path: '/success',
        component: () => import('@/pages/together/success.vue'),
        meta: {
            index: 3,
            authorization: true,
            // title: '\u200E'
            title: '报名成功',
            keepAlive: true
        }
    },
]

export default new Router({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    // scrollBehavior(to) {
    //     if (to.path === "/article" || to.path === "/ranking") {
    //         return { x: 0, y: 0 };
    //     }
    // },
    routes: constantRouterMap
})