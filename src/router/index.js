import Vue from 'vue'
import Router from 'vue-router'
import LoginPage from 'src/views/LoginPage.vue'

Vue.use(Router);

let asyncRoutes = [
    {
        path: '/layout',
        name: 'layout',
        component: () => import(`layout/index.vue`),
        redirect: '/Home',
        children: [
            {
                path: '/Home',
                name: 'Home',
                component: () => import(`views/Home.vue`),
            }
        ]
    },
    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
];

const staticRoutes = [
    {
        path: '/',
        redirect: '/LoginPage'
    },
    {
        path: '/LoginPage',
        name: 'LoginPage',
        component: LoginPage,
    },
    {
        path: '/404',
        component: () => import(`views/NotFoundPage.vue`),
        name: '404',
        hidden: true
    }
];

export { asyncRoutes }

export default new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: staticRoutes
})
