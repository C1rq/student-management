// 校验
import router from './router';
import { getUserInfo } from '@/api/login';
import store from './store';
router.beforeEach((to, from, next) => {
    // const token = localStorage.getItem("ssm-token");
    const token = store.state.user.token
    if (!token) {
        if (to.path == "/login") {
            next()
        } else if (to.path === "/register") {
            next();
        } else {
            next({ path: "/login" })
        }
    } else {
        if (to.path === "/login") {
            next();
        } else if (to.path === "/register") {
            next();
        } else {
            // const userInfo = localStorage.getItem("ssm-user");
            const userInfo = store.state.user.user
            console.log("store.state.user", store.state.user);
            console.log("store.state.user.user", store.state.user.user);
            if (userInfo) {
                next();
            } else {

                store.dispatch('GetUserInfo').then(response => {
                    if (response.flag) {
                        next()
                    } else {
                        next({ path: '/login' })
                    }
                }).catch(error => {

                })
                // getUserInfo(token).then(response => {
                //     const resp = response.data;
                //     if (resp.flag) {
                //         localStorage.setItem("ssm-user", JSON.stringify(resp.data))
                //     }
                // })
            }
        }
    }
})