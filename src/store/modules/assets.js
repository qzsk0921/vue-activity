const assets = {
    state: {
        download: 'https://quhepai.com/mobile/download',
        mobileSystem: null,
        chainsType: null,
        vendor: null,
        metaInfo: {
            title: null,
            description: null,
            image: null,
        }
    },
    mutations: {
        SET_MOBILE_SYSTEM (state, mobile_system) {
            state.mobileSystem = mobile_system
        },
        CHAINS_TYPE (state, chains_type) {
            state.chainsType = chains_type
        },
        SET_VENDOR (state, vendor) {
            state.vendor = vendor
        },
        CHANGE_META_INFO (state, metaInfo) {
            state.metaInfo = metaInfo
        }
    },
    actions: {}
}

export default assets