import Vue from 'vue'
import VueRouter from 'vue-router'
import SimpleHub from './views/SimpleHub.vue'
import Event from './views/Event.vue'

Vue.use(VueRouter)

  const routes = [
    {
      // If this specific path is matched, load the event view
      path: '/event/:id',
      name: 'Event',
      component: Event
    },
    {
      // Default to the hub view
      path: '*',
      name: 'SimpleHub',
      component: SimpleHub
    },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
