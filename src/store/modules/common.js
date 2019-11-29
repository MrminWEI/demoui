import keys, {setItem, getItem} from 'utils/lsOperation'

const state = {
    dict: getItem(keys.dict) || {}
};

const mutations = {
    SET_DICT: (state, dict) => {
        state.dict = dict;
    }
};

const actions = {
    setDictData({commit}, dict) {
        commit('SET_DICT', dict);
        setItem(keys.dict, dict);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
