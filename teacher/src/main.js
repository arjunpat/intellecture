import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

var firebaseConfig = {
    apiKey: "AIzaSyCcVmiE6jRuOK-XrD2TeGHVAhRUamq80jU",
    authDomain: "intellecture-6b3e6.firebaseapp.com",
    databaseURL: "https://intellecture-6b3e6.firebaseio.com",
    projectId: "intellecture-6b3e6",
    storageBucket: "intellecture-6b3e6.appspot.com",
    messagingSenderId: "462381253872",
    appId: "1:462381253872:web:fc0f440c35a1c920026e35"
};
  
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
