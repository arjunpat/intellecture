import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

// GAuth
import GAuth from 'vue-google-oauth2'
const gauthOption = {
  clientId: '462381253872-6vibv72k3cjoqlo17u5jmebgss8c1h4b.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)

store.commit("setEndLecture", false)

// Mount Vue App
Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
