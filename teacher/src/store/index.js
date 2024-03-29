import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    endLecture: false,
    authUser: null,
    classes: [],
    lectures: null,
    showCode: false
  },
  mutations: {
    setEndLecture(state, endLecture) {
      state.endLecture = endLecture
    },
    setAuthUser(state, authUser) {
      state.authUser = authUser
    },
    setClasses(state, classes) {
      state.classes = classes
    },
    setShowCode(state, showCode) {
      state.showCode = showCode
    },
    setLectures(state, lectures) {
      state.lectures = lectures
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [
  ]
})
