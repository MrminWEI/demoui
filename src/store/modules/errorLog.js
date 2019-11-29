const state = {
    errLogs: []
};

const mutations = {
    ADD_ERROR_LOG: (state, log) => {
        state.errLogs.push(log)
    }
};

const actions = {
    addErrorLog({commit}, log) {
        commit('ADD_ERROR_LOG', log)
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
