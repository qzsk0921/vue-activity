const getters = {
    isLoading: state => state.loading.isLoading,
    wxtoken: state => state.user.wxtoken,
    smId: state => state.user.smId,
    shareUserId: state => state.user.shareUserId,
    commonParams: state => state.user.commonParams,
    payType: state => state.user.payType,
    userId: state => state.user.userId,
    mobileSystem: state => state.assets.mobileSystem,
    chainsType: state => state.assets.chainsType,
    wxAuthorizeActive: state => state.user.wxAuthorizeActive,
    vendor: state => state.assets.vendor,
    download: state => state.assets.download,
    metaInfo: state => state.assets.metaInfo,
}

export default getters