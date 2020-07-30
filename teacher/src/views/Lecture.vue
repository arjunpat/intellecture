<template>
  <span>
    <v-container fluid v-show="showCode" class="window roomContainer" ref="start-window">
      <v-col>
        <v-row class="close">
          <v-icon
            x-large
            class="xsign"
            @keydown.native.escape="exitFS()"
            @click.native="exitFS()"
          >{{ svgPath }}</v-icon>
        </v-row>
        <v-row>
          <div class="mx-auto">
            <h1 class="joinMessage">
              Head to
              <b>join.intellecture.app</b> to join!
            </h1>
          </div>
        </v-row>
        <v-row>
          <div class="mx-auto">
            <h1 class="roomcode">{{ lectureInfo.join_code }}</h1>
          </div>
        </v-row>
      </v-col>
    </v-container>
    <v-container fluid>
      <v-card flat>
        <transition name="fade">
          <div v-show="snackbar" id="snackbar">{{ snackbarMessage }}</div>
        </transition>
        <div style="width: 300px; position: absolute; top: 0px; right: 0px;">
          <TutorialDisplay
            style="text-align: left;"
            :show="showTutorial === 7"
            backgroundColor="white"
            @next="showTutorial++"
            @cancel="showTutorial = -1"
            bottom
          >
            <template v-slot:title>Room Code</template>
            <template
              v-slot:explanation
            >This is your room code, share it with your students so they can join the lecture. You can click on it to copy the room link or show a join screen.</template>
          </TutorialDisplay>
        </div>

        <v-card-title>
          <h2
          id="lecture-title"
          >{{ lectureInfo.lecture_name || 'Untitled Lecture' }}</h2>
        </v-card-title>

        <TutorialDisplay
          :show="showTutorial === 3"
          backgroundColor="white"
          @next="showTutorial++; clickTab(1)"
          @cancel="showTutorial = -1"
          bottom
        >
          <template v-slot:title>Tabs</template>
          <template
            v-slot:explanation
          >Click on these tabs to switch between the understanding, questions, and student view.</template>
          <v-tabs
            v-model="tab"
            background-color="transparent"
            color="#66bb6a"
            class="tabs-bar"
            :style="{width: smallScreen ? '100% !important' : '50% !important'}"
            grow
          >
            <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
          </v-tabs>
        </TutorialDisplay>

        <v-tabs-items v-model="tab">
          <!-- Start of Understanding tab -->
          <v-card v-show="tab === 0" min-height="75vh" flat class="pt-3 pb-3">
            <Understanding
              :understandingScore="understandingScore"
              :topics="topics"
              :showTutorial="showTutorial"
              :datacollection="datacollection"
              :shortened="shortened"
              @resetTutorial="resetTutorial()"
              @nextTutorial="nextTutorial()"
            />
          </v-card>
          <!-- End of Understanding tab -->

          <!-- Start of Questions tab -->
          <v-card v-show="tab === 1" flat class="pt-3" style="min-height: 75vh;">
            <Questions
              :questions="questions"
              :topics="topics"
              :showTutorial="showTutorial"
              :datacollection="datacollection"
              :shortened="shortened"
              :students="students"
              @resetTutorial="resetTutorial()"
              @nextTutorial="nextTutorial()"
              @showCategory="showCategory"
              @showAllQuestions="showAllQuestions"
              @dismiss="dismiss"
              :displayQuestions="displayQuestions"
              @clickTab="clickTab"
            />
          </v-card>
          <!-- End of Questions tab -->

          <!-- Start of Students tab -->
          <v-card v-show="tab === 2" flat class="pt-3" min-height="75vh">
            <Students
              :topics="topics"
              :showTutorial="showTutorial"
              :students="students"
              :shortened="shortened"
              :joinCode="lectureInfo.join_code"
              @resetTutorial="resetTutorial()"
              @nextTutorial="nextTutorial()"
              @clickTab="clickTab"
              @invertDialog="invertDialog()"
              @kickStudent="kickStudent"
            />
          </v-card>
          <!-- End of Students tab -->
        </v-tabs-items>
      </v-card>

      <div style="position: absolute; right: 10px; bottom: 10px; width: 400px;">
        <TutorialDisplay
          style="text-align: left;"
          :show="showTutorial == 8"
          backgroundColor="white"
          @next="resetTutorial()"
          @cancel="resetTutorial()"
          top
          last
        >
          <template v-slot:title>Help</template>
          <template v-slot:explanation>Click here to view this tutorial again.</template>
          <div style="text-align: right;">
            <v-btn
              style="display: inline-block;"
              color="green"
              bottom
              @click="clickTab(0); nextTutorial()"
              fab
              dark
            >
              <v-icon>mdi-help</v-icon>
            </v-btn>
          </div>
        </TutorialDisplay>
      </div>
    </v-container>
  </span>
</template>

<script>
import { mdiCloseThick } from '@mdi/js'
import { mapState } from 'vuex'
import { post, get, socketServerOrigin } from '@/helpers.js'
import store from '@/store'

import Understanding from '@/components/lecture/Understanding'
import Questions from '@/components/lecture/Questions'
import Students from '@/components/lecture/Students'

import TutorialDisplay from '@/components/lecture/TutorialDisplay'

import sampleQuestions from '@/testdata/questions.json'
import sampleTopics from '@/testdata/topics.json'
import sampleStudents from '@/testdata/students.json'

export default {
  components: {
    TutorialDisplay,
    Understanding,
    Students,
    Questions,
  },
  props: {
    id: { type: String },
  },
  data() {
    return {
      socket: null,
      lectureInfo: {},
      datacollection: null,
      understandingScore: null,
      svgPath: mdiCloseThick,
      questions: [],
      students: {},
      displayQuestions: [],
      topics: [],
      tab: 0,
      items: ['Understanding', 'Questions', 'Students'],
      understandingData: [],
      shortened: false,
      shortentext: 'Shorten',
      snackbar: false,
      snackbarMessage: '',
      showTutorial: -1,
      endCalled: false,
    }
  },
  methods: {
    dismiss(question_uid) {
      post(`/lectures/live/teacher/${this.lectureInfo.uid}/dismiss`, {
        question_uid,
      })
    },
    exitFS() {
      document.exitFullscreen()
    },
    nextTutorial() {
      this.showTutorial++
    },
    resetTutorial() {
      this.showTutorial = -1
    },
    initChart() {
      let x = []
      let y = []
      let data = [...this.understandingData]
      if (this.shortened) {
        for (let i = data.length - 1; i >= 0; i--) {
          if ((Date.now() - data[i].timestamp.getTime()) / 60000 > 5) {
            data.splice(0, i + 1)
            break
          }
        }
      }
      for (let i = 0; i < data.length; i++) {
        x.push(data[i].timestamp)
        y.push(data[i].score)
      }
      this.fillData(x, y)
    },
    fillData(x, y) {
      this.datacollection = {
        labels: x,
        datasets: [
          {
            label: 'Understanding',
            backgroundColor: '#4FC3F7',
            data: y,
          },
        ],
      }
    },
    endLectureMethod() {
      // window.onbeforeunload = undefined
      this.endCalled = true
      post(`/lectures/live/teacher/${this.id}/end`)
      this.socket.close()
      store.commit('setEndLecture', false)
    },
    showCategory(index) {
      this.displayQuestions = [...this.questions]
      const q = this.topics[index].questions
      this.displayQuestions = this.displayQuestions.filter((question) =>
        q.includes(question.question_uid)
      )
    },
    showAllQuestions() {
      this.displayQuestions = [...this.questions]
    },
    getStudentById(id) {
      return this.students[id]
    },
    getQuestionById(id) {
      return this.questions.find((question) => question.question_uid === id)
    },
    getQuestionIndexById(id) {
      for (let i = 0; i < this.questions.length; i++) {
        if (this.questions[i].question_uid === id) return i
      }
      return -1
    },
    showSnackBar(message) {
      this.snackbarMessage = message
      this.snackbar = true
      setTimeout(() => {
        this.snackbar = false
      }, 1000)
    },
    sortQuestions() {
      this.questions.sort((a, b) => b.upvotes - a.upvotes)
      this.displayQuestions.sort((a, b) => b.upvotes - a.upvotes)
    },
    getTabId(index) {
      return 'tab' + index
    },
    clickTab(index) {
      this.tab = index
    },
    displayNotification(subject, message) {
      if (Notification.permission === 'granted') {
        let img = 'https://i.imgur.com/lMPcw6k.png'
        let text = message
        let notification = new Notification(subject, { body: text, icon: img })
      }
    },
    kickStudent({ student_uid, banned }) {
      post(`/lectures/live/teacher/${this.lectureInfo.uid}/kick`, {
        student_uid,
        banned,
      })
    },
    handleMessage(data) {
      if (data.type === 'lecture_info') {
        this.lectureInfo = data

        this.$emit('startlecture', this.id, this.lectureInfo.join_code)
        document.addEventListener('fullscreenchange', (event) => {
          if (!document.fullscreenElement) {
            store.commit('setShowCode', false)
          }
        })
      } else if (data.type === 'student_join') {
        // data.ts is no longer set
        data.ts = data.elapsed + this.lectureInfo.start_time
        this.$set(this.students, data.uid, {
          ...data,
          inLecture: true,
        })
        this.showSnackBar(`${data.first_name} ${data.last_name} joined`)
        this.displayNotification(
          'Student joined',
          `${data.first_name} ${data.last_name} joined`
        )
      } else if (data.type === 'student_leave') {
        let left = this.students[data.uid]
        this.$set(this.students, data.uid, {
          ...left,
          inLecture: false,
        })
        this.showSnackBar(`${left.first_name} ${left.last_name} left`)
        this.displayNotification(
          'Student left',
          `${left.first_name} ${left.last_name} left`
        )
      } else if (data.type === 'us_update') {
        if (data.score != null) {
          let d = (Date.now() - this.start) / 1000
          this.understandingData.push({
            timestamp: new Date(),
            score: data.score,
          })
          this.understandingScore = data.score
          this.initChart()
        } else {
          this.understandingScore = '--'
        }
      } else if (data.type === 'new_question' && !this.getQuestionById(data.question_uid)) {
        this.questions.push({
          ...data,
          dismissed: false,
          upvotes: 0,
          upvotedStudents: [],
        })
        this.displayQuestions = [...this.questions]
        this.displayNotification('New Question', data.question)
      } else if (data.type === 'ques_categor') {
        this.topics = data.categories
      } else if (data.type === 'question_update') {
        let question = this.getQuestionById(data.question_uid)
        question.upvotes = data.upvotes
        this.sortQuestions()

        // this request should be made on hover
        /* get(`/analytics/lecture/${this.id}/question/${data.question_uid}/upvotes`).then(result => {
          if (result.success) {
            question.upvotedStudents = result.data
            this.sortQuestions()
          }
        }) */
      } else if (data.type === 'question_dismissed') {
        let index = this.getQuestionIndexById(data.question_uid)
        let question = this.questions[index]

        this.$set(this.questions, index, {
          ...question,
          dismissed: true,
        })
        this.displayQuestions = [...this.questions]
      } else if (data.type === 'end_lecture') {
        this.$router.replace({
          name: 'Feedback',
          params: { fromLectureEnd: true },
        })
      } else if (data.type === 'error') {
        this.$router.replace({ name: 'Dashboard' })
      } else if (data.type === 'bulk') {
        for (let msg of data.messages) this.handleMessage(msg)
      }
    },
  },
  mounted() {
    //Testing code
    // this.displayQuestions = sampleQuestions["questions"];
    // this.topics = sampleTopics["topics"];
    // this.students = sampleStudents;

    this.socket = new WebSocket(
      `${socketServerOrigin}/lectures/live/teacher/${this.id}`
    )
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.handleMessage(data)
    }
  },
  created() {
    this.initChart()
    /*  window.onbeforeunload = function () {
      return 'Reloading the page will end your lecture'
    } */
    if (!localStorage['notfirst']) {
      this.showTutorial = 0
      localStorage['notfirst'] = true
    }
  },
  computed: {
    ...mapState(['endLecture', 'showCode']),
    smallScreen() {
      return this.$vuetify.breakpoint.smAndDown
    },
    understandingWidth() {
      if (!this.smallScreen) {
        return '30vw'
      } else {
        return '90vw'
      }
    },
    questionWidth() {
      if (this.smallScreen) {
        return '80vw'
      }
    },
  },
  watch: {
    endLecture(val) {
      if (this.endLecture) {
        this.endLectureMethod()
        this.$router.replace({
          name: 'Feedback',
          params: { fromLectureEnd: true },
        })
      }
    },
    shortened(val) {
      this.initChart()
      this.shortentext = this.shortened ? 'Entire' : 'Shorten'
    },
    showCode(val) {
      if (this.showCode) {
        this.$refs['start-window'].requestFullscreen()
      } else if (document.fullScreen) {
        this.exitFS()
      }
    },
    showTutorial(val) {},
  },
  /* beforeRouteLeave(to, from, next) {
    if (!this.endCalled) {
      const answer = window.confirm(
        'Do you really want to leave? you have unsaved changes!'
      )
      if (answer) {
        this.endLectureMethod()
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }, */
}
</script>

<style lang='scss'>
html {
  scroll-behavior: smooth;
}

#lecture-title {
  font-family: 'Poppins'; 
  font-weight: bold; 
  font-size: 35px; 
  border-left: 2px solid #aae691ff; 
  line-height: 50px;
  padding-left: 5px;
}

#arrow-btn {
  transition: all 0.3s;
}
.roomContainer {
  background-color: #dcedc8;
  height: 100%;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close {
  position: absolute;
  top: 0;
  left: 10;
}
.xsign {
  margin-top: 40%;
  margin-left: 20%;
  cursor: pointer;
  transform: scale(2);
}
.joinMessage {
  margin-top: -7vw;
  height: 120px;
  font-size: 2vw;
  font-weight: 900;
  width: 100%;
  margin-bottom: 10vw;
  transform: scale(2);
}
.roomcode {
  background-color: white;
  height: 100px;
  border-radius: 15px;
  justify-content: center;
  text-align: center;
  font-size: 500%;
  line-height: 120%;
  padding-right: 20px;
  padding-left: 20px;

  width: 100%;
  transform: scale(3);
}
#arrow-btn:hover {
  font-size: 20px;
}
.blink {
  animation: blink-animation 1s steps(5, start) infinite;
  -webkit-animation: blink-animation 1s steps(5, start) infinite;
}
@keyframes blink-animation {
  to {
    visibility: hidden;
  }
}
@-webkit-keyframes blink-animation {
  to {
    visibility: hidden;
  }
}

.data-text {
  font-size: 25px;
  font-weight: 500;
}

span {
  font-family: var(--main-font);
}

.topic {
  background-color: #eeeeee;
  border-radius: 10px;
  padding: 5px 7px;
  text-align: center;
}

.topic:hover {
  cursor: pointer;
}

#topic-quantity {
  display: inline-block;
  font-size: 20px;
  background-color: #e1f5fe;
  border-radius: 10px;
  padding: 5px 7px;
  text-align: center;
}

#snackbar {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

#upvotes {
  display: inline-block;
  background-color: #dcedc8;
  padding: 0px 5px;
  border-radius: 5px;
  font-size: 20px;
}

html::-webkit-scrollbar {
  display: none;
}

html {
  -ms-overflow-style: none;
}

.tabs-bar {
  width: 100% !important;
  margin: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
