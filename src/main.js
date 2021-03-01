// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import store from './store'
import VCharts from 'v-charts'
import axios from 'axios'
import App from './App'
import moment from 'moment';

moment.locale('zh-cn');
Vue.prototype.$moment = moment;

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(VCharts)
axios.defaults.withCredentials = true
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
    router,
    store,
    render: h => h(App),
    created() {
        store.commit('savePage', this)
        store.commit('saveBackendVersion')
        this.$store.commit('updateUser')
    }
}).$mount('#app')

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})
