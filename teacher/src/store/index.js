import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authUser: null,
    token: '',
    endLecture: false
  },
  mutations: {
    setAuthUser (state, authUser) {
      state.authUser = authUser
    },
    setToken(state, token) {
      state.token = token
    },
    setEndLecture(state, endLecture) {
      state.endLecture = endLecture
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => Cookies.get(key),
        setItem: (key, value) => Cookies.set(key, value, { expires: 3 }),
        removeItem: key => Cookies.remove(key)
      }
    })
  ]
})
