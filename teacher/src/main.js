import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { firestorePlugin } from 'vuefire'
import { firebase } from './store/db'

// Initialize firebase stuff
Vue.use(firestorePlugin)
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
  store,
  render: h => h(App)
}).$mount('#app')

import { createLecture } from './store/db.js'

setTimeout(() => {
  // createClass()
  // createLecture('psUn2zmIkFYc8sWsxuKG', 'Lecture 1')

  firebase.auth().currentUser.getIdToken(true).then(data => {
    console.log(data);
  });

}, 1000);
