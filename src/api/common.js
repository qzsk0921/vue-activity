import request from '@/util/request.js'


/**
 * 
 * @param {*} params 
 * @return {wxtoken, userId}
 */
export function initParam (params) {
    return request({
        url: '/meet-chains/init-param',
        method: 'post',
        data: {...params}
    })
}

/**
 * 获取微信授权
 * @param {*} params 
 */
export function wxAuthorize (params) {
    return request({
        url: '/meet-chains/get-wx-url',
        method: 'post',
        data: {...params}
    })
}
/**
 * 获取活动详情
 * @sm_id {*} params 
 * @share_user_id
 */
export function meetDetail (params) {
    return request({
        url: '/meet-chains/detail',
        method: 'get',
        params: {...params}
    })
}
/**
 * 获取活动状态
 * @smId {*} params
 */
export function signCheck (params) {
    return request({
        url: '/meet-chains/sign-check',
        method: 'post',
        data: {...params}
    })
}
/**
 * 获取手机验证码
 * @phone {*} params 
 */
export function getSmscode (params) {
    return request({
        url: '/meet-chains/get-smscode',
        // url: '/form/submit',
        // url: '/admin/site/login',
        method: 'post',
        data: {...params}
    })
}

/**
 * 活动报名
 * @phone {*} params 
 * @code
 * @sm_id
 * @name
 * @share_user_id
 */
export function sign (params) {
    return request({
        url: '/meet-chains/sign',
        method: 'post',
        data: {...params}
    })
}

/**
 * 
 * @meet_id {*} params
 */
export function getTicketInfo (params) {
    return request({
        url: '/meet-chains/pay-item/',
        method: 'get',
        params: {...params}
    })
}

/**
 * 创建支付订单
 * @user_id {*} params
 * @sm_id
 * @num
 * @share_user_id
 */
export function genOrder (params) {
    return request({
        url: '/meet-chains/create-order',
        method: 'post',
        data: {...params}
    })
}

/**
 * 报名成功
 * @sm_id
 */
export function rSuccess (params) {
    return request({
        url: '/meet-chains/sign-success',
        method: 'post',
        data: {...params}
    })
}

/**
 * 通用初始化数据
 * @smId
 * @shareUserId
 */
export function init (params) {
    return request({
        url: '/meet-chains/init',
        method: 'post',
        data: {...params}
    })
}

/**
 * 订单查询
 * @smId
 * @userId
 * @return status 1 成功 2 失败
 */
export function queryOrder (params) {
    return request({
        url: '/meet-chains/query-order',
        method: 'post',
        data: {...params}
    })
}