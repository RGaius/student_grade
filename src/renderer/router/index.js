import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        component: require('@/view/Init').default
    },{
        path: '/index',
        name: 'index',
        component: require('@/view/Index').default,
        children: [{
            path: '/',
            component: require('@/view/EntryGrade').default
        },{
            path: '/grade',
            component: require('@/view/EntryGrade').default
        },{
            path: '/data',
            component: require('@/view/EntryGrade').default
        },{
            path: '/setting',
            component: require('@/view/Setting').default
        },{
            path: '/help',
            component: require('@/view/EntryGrade').default
        }]
    }]
})
