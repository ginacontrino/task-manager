import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from './components/dashboard.js'
import { Bootstrap } from './domain/actions'
import state from './domain/state'
import Board from './components/board.js'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', component: Dashboard },
        { path: '/:id', component: Board }
    ]
})

Bootstrap()

new Vue({
    router,
    el: '#app',
    data: { state },

})
