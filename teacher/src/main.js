import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

// Initialize firebase stuff
import firebase from 'firebase/app'
import 'firebase/auth'

firebase.initializeApp({
  apiKey: 'AIzaSyCcVmiE6jRuOK-XrD2TeGHVAhRUamq80jU',
  authDomain: 'intellecture-6b3e6.firebaseapp.com',
  databaseURL: 'https://intellecture-6b3e6.firebaseio.com',
  projectId: 'intellecture-6b3e6',
  storageBucket: 'intellecture-6b3e6.appspot.com',
  messagingSenderId: '462381253872',
  appId: '1:462381253872:web:fc0f440c35a1c920026e35'
})

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)

store.commit("setEndLecture", false)

// Mount Vue App
Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
