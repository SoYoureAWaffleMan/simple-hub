import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import VueMeta from 'vue-meta'
import './filters.js'

Vue.config.productionTip = false

Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
})

if (document.querySelector('#app')) {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
}
