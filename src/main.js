import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import './filters.js'

Vue.config.productionTip = false

if (document.querySelector('#app')) {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
}
