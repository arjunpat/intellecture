import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { firestorePlugin } from 'vuefire'
import firebase from 'firebase/app'
import { post } from '@/helpers.js'

firebase.initializeApp({
  apiKey: 'AIzaSyCcVmiE6jRuOK-XrD2TeGHVAhRUamq80jU',
  authDomain: 'intellecture-6b3e6.firebaseapp.com',
  databaseURL: 'https://intellecture-6b3e6.firebaseio.com',
  projectId: 'intellecture-6b3e6',
  storageBucket: 'intellecture-6b3e6.appspot.com',
  messagingSenderId: '462381253872',
  appId: '1:462381253872:web:fc0f440c35a1c920026e35'
})

// Initialize firebase stuff
Vue.use(firestorePlugin)
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.commit('setAuthUser', user)
    user.getIdToken(true).then((idToken) => {
      post('/auth/login', {
        firebase_token: idToken
      }).then((response) => {
        if (!response.success)
          throw response.error
        
        store.commit('setToken', response.data.token)
      })
    }).catch((err) => {
      console.log(err)
    })
  } else {
    store.commit('setAuthUser', null)
    store.commit('setToken', '')
  }
})

store.commit("setEndLecture", false)

// Mount Vue App
Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
