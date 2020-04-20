import Vue from 'vue'
import VueRouter from 'vue-router'
import SimpleHub from './views/SimpleHub.vue'

Vue.use(VueRouter)

  const routes = [
    {
      // If this specific path is matched, load the event view
      path: '/event/:id',
      name: 'Event',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "event" */ './views/Event.vue')
    },
    {
      // Default to the hub view
      path: '*',
      name: 'SimpleHub',
      component: SimpleHub
    },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
