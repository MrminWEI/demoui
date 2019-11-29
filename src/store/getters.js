const getters = {
    /* user */
    token: state => state.user.token,
    userInfo: state => state.user.userInfo,
    menuTree: state => state.user.menuTree,
    asyncRoutes: state => state.user.asyncRoutes,

    /* sysSetting */
    showSetting: state => state.sysSetting.showSetting,
    menuOpenState: state => state.sysSetting.menuOpenState,
    showMenuBtn: state => state.sysSetting.showMenuBtn,
    themeBgColor: state => state.sysSetting.themeBgColor,
    pageAnimation: state => state.sysSetting.pageAnimation,
    xScroll: state => state.sysSetting.xScroll,

    /* tagViews */
    showTagViews: state => state.tagViews.showTagViews,
    activatedPath: state => state.tagViews.activatedPath,
    tagViews: state => state.tagViews.tagViews,

    /* common */
    dict: state => state.common.dict,

    /*app*/
    screenHeight:state =>state.app.screenHeight,
};

export default getters
