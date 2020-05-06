import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    endLecture: false,
    authUser: null,
  },
  mutations: {
    setEndLecture(state, endLecture) {
      state.endLecture = endLecture
    },
    setAuthUser(state, authUser) {
      state.authUser = authUser
    },
  },
  actions: {
  },
  modules: {
  },
  plugins: [
  ]
})
