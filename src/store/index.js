import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import loading from './modules/loading'
import assets from './modules/assets'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        loading,
        assets,
        user
    },
    getters
})

export default store

