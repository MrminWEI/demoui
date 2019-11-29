const state = {
    screenHeight: undefined,
};

const mutations = {
    SET_SCREENHEIGHT: (state, screenHeight) => {
        state.screenHeight = screenHeight;
    },
};

const actions = {

};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
