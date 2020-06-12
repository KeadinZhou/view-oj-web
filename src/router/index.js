import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index-page',
      component: () => import('@/components/page/index-page'),
      meta: {
        title: 'Home - viewOJ'
      }
    }, {
      path: '/admin',
      name: 'admin-page',
      component: () => import('@/components/page/admin-page'),
      meta: {
        title: 'Admin - viewOJ'
      }
    }, {
      path: '/login',
      name: 'login-page',
      component: () => import('@/components/page/login-page'),
      meta: {
        title: 'Login - viewOJ'
      }
    }, {
      path: '/ranklist',
      name: 'ranklist-page',
      component: () => import('@/components/page/ranklist-page'),
      meta: {
        title: 'Ranklist - viewOJ'
      }
    }, {
      path: '/user/:userid',
      name: 'userinfo-page',
      component: () => import('@/components/page/userinfo-page'),
      meta: {
        title: 'Userinfo - viewOJ'
      }
    }, {
      path: '/monitor',
      name: 'monitor-page',
      component: () => import('@/components/page/monitor-page'),
      meta: {
        title: 'Monitor - viewOJ'
      }
    }, {
      path: '/error401',
      name: 'error401-page',
      component: () => import('@/components/page/error401-page'),
      meta: {
        title: 'Error - viewOJ'
      }
    }, {
      path: '*',
      name: 'error404-page',
      component: () => import('@/components/page/error404-page'),
      meta: {
        title: 'Error - viewOJ'
      }
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
