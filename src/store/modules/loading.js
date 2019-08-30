const loading = {
    state: {
        isLoading: false,
    },
    mutations: {
        UPDATE_LOADING_STATUS(state, payload) {
            state.isLoading = payload.isLoading
        },
    },
    actions: {

    }
}

export default loading