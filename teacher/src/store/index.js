import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    endLecture: false,
    authUser: null,
    classes: null,
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
    setLectures(state, lectures) {
      state.lectures = lectures;
    },
    addLectures(state, lectures) {
      let priorlect=state.lectures;
      if (priorlect==null) {
        priorlect=[];
      }
      state.lectures=priorlect.concat(lectures);
    },
    setShowCode(state, showCode) {
      state.showCode = showCode
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [
  ]
})
