import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

// Import global css
import '@/assets/css/global.css'

// GAuth
import GAuth from 'vue-google-oauth2'

import './registerServiceWorker'
const gauthOption = {
  clientId: '462381253872-6vibv72k3cjoqlo17u5jmebgss8c1h4b.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)

// Mount Vue App
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')