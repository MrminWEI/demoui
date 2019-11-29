import keys, {getItem, setItem} from 'utils/lsOperation'
import variables from 'styles/variables.scss'

const state = {
    showSetting: false,
    menuOpenState: true,
    showMenuBtn: getItem(keys.showMenuBtn) || false,
    themeBgColor: getItem(keys.themeBgColor) || variables.menuBg,
    pageAnimation: getItem(keys.pageAnimation) || 'fade-transform',
    xScroll: false,
};

const mutations = {
    SETSETTING_STATE: (state, bool) => {
        state.showSetting = bool;
    },
    CHANGE_SETTING_STATE: (state) => {
        state.showSetting = !state.showSetting;
    },
    CHANGE_MENU_STATE: (state) => {
        state.menuOpenState = !state.menuOpenState;
    },
    SET_MENU_STATE: (state, bool) => {
        state.menuOpenState = bool;
    },
    SHOW_MENU_BTN: (state, bool) => {
        state.showMenuBtn = bool;
    },
    SET_THEME_BG_COLOR: (state, color) => {
        state.themeBgColor = color;
    },
    SET_PAGE_ANIMATION: (state, anima) => {
        state.pageAnimation = anima;
    },
    SET_X_SCROLL: (state, bool) => {
        state.xScroll = bool;
    },
};

const actions = {
    setSettingState({commit}, bool) {
        commit('SETSETTING_STATE', bool);
    },
    changeSettingState({commit}) {
        commit('CHANGE_SETTING_STATE');
    },
    changeMenuState({commit}) {
        commit('CHANGE_MENU_STATE');
    },
    setMenuState({commit}, bool) {
        commit('SET_MENU_STATE', bool);
    },
    showMenuBtn({commit}, bool) {
        commit('SHOW_MENU_BTN', bool);
        setItem(keys.showMenuBtn, bool);
    },
    setThemeBgColor({commit}, color) {
        commit('SET_THEME_BG_COLOR', color);
        setItem(keys.themeBgColor, color);
    },
    setPageAnimation({commit}, anima) {
        commit('SET_PAGE_ANIMATION', anima);
        setItem(keys.pageAnimation, anima);
    },
    setXScroll({commit}, bool) {
        commit('SET_X_SCROLL', bool);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
