import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import vuetify from './plugins/vuetify'
import { firestorePlugin } from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'

// Initialize firebase stuff
Vue.use(firestorePlugin)
firebase.initializeApp({
  apiKey: 'AIzaSyCcVmiE6jRuOK-XrD2TeGHVAhRUamq80jU',
  authDomain: 'intellecture-6b3e6.firebaseapp.com',
  databaseURL: 'https://intellecture-6b3e6.firebaseio.com',
  projectId: 'intellecture-6b3e6',
  storageBucket: 'intellecture-6b3e6.appspot.com',
  messagingSenderId: '462381253872',
  appId: '1:462381253872:web:fc0f440c35a1c920026e35'
})
export const db = firebase.firestore()
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.commit('setAuthUser', user)
  } else {
    store.commit('setAuthUser', null)
  }
})

// Mount Vue App
Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
