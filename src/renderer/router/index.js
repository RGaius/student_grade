import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'landing-page',
    component: require('@/view/Index').default,
    children: [{
      path: '/',
      component: require('@/view/EntryGrade').default
    }, {
      path: 'setting',
      component: require('@/view/Setting').default
    }]
  },
  {
    path: '*',
    redirect: '/'
  }]
})
