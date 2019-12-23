// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import store from './store'
import Router from 'vue-router'
import App from './App'
import 'obigo-js-ui/features/commonPopup'
import obigoUI from 'obigo-js-ui'
import Home from './components//AppSlider.vue'
// import Panel from './components/EcoPanel/EcoPanel.vue'
// import History from './components/History/History.vue'
import Setting from './components/Setting/Setting.vue'
import i18n from './i18n'
import 'obigo-js-webapi-rnbs/vehicle/vehicle'

Vue.use(obigoUI)
Vue.use(Router)

const routes = [
  {path: '/', name: 'home', component: Home},
//   {path: '/history', name: 'history', component: History},
  {path: '/setting', name: 'setting', component: Setting}
]
const router = new Router({
  mode: 'abstract',
  routes
})

router.push('/')

/* eslint-disable no-new */
var app = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
})

app.$mount('#app')
