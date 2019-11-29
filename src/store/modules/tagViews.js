import keys, {getItem, setItem} from 'utils/lsOperation'

const state = {
    showTagViews: getItem(keys.showTagViews)===undefined?true:getItem(keys.showTagViews),
    activatedPath: getItem(keys.activatedPath) || '/Home',
    tagViews: getItem(keys.tagViews) || []
};

const mutations = {
    SET_TAG_STATE: (state, bool) => {
        state.showTagViews = bool;
    },
    SET_ACTIVATED_PATH: (state, path) => {
        state.activatedPath = path;
    },
    ADD_TAG_VIEW: (state, tagView) => {
        state.tagViews.push(tagView);
    },
    REMOVE_TAG_VIEW: (state, index) => {
        state.tagViews.splice(index, 1);
    },
    CLOSE_ALL_TAG: (state) => {
        state.tagViews.splice(1, state.tagViews.length-1);
    },
    RESET_TAGS: (state) => {
        state.tagViews = [];
    }
};

const actions = {
    setTagViewState({commit}, bool) {
        commit('SET_TAG_STATE', bool);
        setItem(keys.showTagViews, bool);
    },
    setActivatedPath({commit}, path) {
        commit('SET_ACTIVATED_PATH', path);
        setItem(keys.activatedPath, path);
    },
    addTagView({commit, state}, tagView) {
        commit('ADD_TAG_VIEW', tagView);
        setItem(keys.tagViews, state.tagViews);
    },
    removeTagView({commit, state}, tagName) {
        state.tagViews.some((item, index) => {
            if(item.path === tagName){
                commit('REMOVE_TAG_VIEW', index);
                return true
            }
        });
        setItem(keys.tagViews, state.tagViews);
    },
    closeRightAll({commit, state}) {
        commit('CLOSE_ALL_TAG');
        setItem(keys.tagViews, [state.tagViews[0]]);
    },
    resetTags({commit}) {
        commit('RESET_TAGS');
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
