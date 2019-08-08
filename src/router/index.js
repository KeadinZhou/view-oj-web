import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '@/components/page/index-page'
import AdminPage from '@/components/page/admin-page'
import LoginPage from '@/components/page/login-page'
import RanklistPage from '@/components/page/ranklist-page'
import UserinfoPage from '@/components/page/userinfo-page'
import MonitorPage from '@/components/page/monitor-page'
import Error404Page from '@/components/page/error404-page'
import Error401Page from '@/components/page/error401-page'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index-page',
      component: IndexPage,
      meta: {
        title: 'Home - viewOJ'
      }
    }, {
      path: '/admin',
      name: 'admin-page',
      component: AdminPage,
      meta: {
        title: 'Admin - viewOJ'
      }
    }, {
      path: '/login',
      name: 'login-page',
      component: LoginPage,
      meta: {
        title: 'Login - viewOJ'
      }
    }, {
      path: '/ranklist',
      name: 'ranklist-page',
      component: RanklistPage,
      meta: {
        title: 'Ranklist - viewOJ'
      }
    }, {
      path: '/user/:userid',
      name: 'userinfo-page',
      component: UserinfoPage,
      meta: {
        title: 'Userinfo - viewOJ'
      }
    }, {
      path: '/monitor',
      name: 'monitor-page',
      component: MonitorPage,
      meta: {
        title: 'Monitor - viewOJ'
      }
    }, {
      path: '/error401',
      name: 'error401-page',
      component: Error401Page,
      meta: {
        title: 'Error - viewOJ'
      }
    }, {
      path: '*',
      name: 'error404-page',
      component: Error404Page,
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
