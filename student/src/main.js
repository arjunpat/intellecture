import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

// Import global css
import '@/assets/css/global.css'

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

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.commit('setAuthUser', user)
    user.getIdToken(true).then((idToken) => {
      return fetch('https://api.intellecture.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'firebase_token': idToken
        })
      })
    }).then((res) => res.json())
    .then((response) => {
      if (!response.success)
        throw response.error
      
      store.commit('setToken', response.data.token)
    }).catch((err) => {
      console.log(err)
    })
  } else {
    store.commit('setAuthUser', null)
  }
})


// Mount Vue App
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')