import router from 'router'
import store from 'store'
import {Message} from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 页面加载进度条配置
NProgress.configure({showSpinner: false});

// 路由白名单
const whiteList = ['/LoginPage', '/404'];

// 进入路由页面前
router.beforeEach((to, from, next) => {
    // 进度条开始加载
    NProgress.start();

    // 在白名单里直接跳转
    if(whiteList.indexOf(to.path) !== -1){
        next();
        return
    }

    const Token = store.getters.token;

    // 需要登录且token存在
    if (Token) {

        // 刷新后重新获取异步路由
        let asyncRoutes = store.getters.asyncRoutes;
        if(asyncRoutes){
            next();
        }else{
            store.dispatch('user/setAsyncRoutes');
            next({...to, replace: true});
        }

    } else {
        Message.warning('登录状态已失效，请重新登录');
        next({ path: `/LoginPage?redirect=${to.path}`, replace: true })
    }

});

// 进入路由页面后
router.afterEach(() => {
    NProgress.done()
});
