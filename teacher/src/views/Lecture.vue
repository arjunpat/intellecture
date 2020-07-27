<template>
  <span>
    <v-container fluid v-show="showCode" class="window roomContainer" ref="start-window">
      <v-col>
       <v-row class="close">
          <v-icon x-large class="xsign" @keydown.native.escape="exitFS()" @click.native="exitFS()" >{{ svgPath }}</v-icon>
       </v-row>
       <v-row>
        <div class="mx-auto">
          <h1 class="joinMessage">
            Head to <b>join.intellecture.app</b> to join!
          </h1>
        </div>
      </v-row>
      <v-row>
        <div class="mx-auto">
          <h1 class="roomcode">
            {{this.joinCode}}
          </h1>
        </div>
      </v-row>
      
      </v-col>
    </v-container>
    <v-container
      fluid
    >
    <v-card
      :flat="smallScreen ? true : false"
    >
      <transition name="fade">
        <div
          v-show="snackbar"
          id="snackbar"
        >
        {{ snackbarMessage }}
        </div>
      </transition>
      <div style="width: 300px; position: absolute; top: 0px; right: 0px;">
        <TutorialDisplay style="text-align: left;" :show="showTutorial == 7" backgroundColor="white" @next="showTutorial++" @cancel="showTutorial = -1" bottom>
          <template v-slot:title>
            Room Code
          </template>
          <template v-slot:explanation>
            This is your room code, share it with your students so they can join the lecture. You can click on it to copy the room link or show a join screen.
          </template>
        </TutorialDisplay>
      </div>
      
      <v-card-title >
        <h2 style="font-family: 'Noto Sans'; font-weight: bold;">{{ lectureName || 'Untitled Lecture' }}</h2>
      </v-card-title>

      <TutorialDisplay :show="showTutorial == 3" backgroundColor="white" @next="showTutorial++; clickTab(1)" @cancel="showTutorial = -1" bottom>
        <template v-slot:title>
          Tabs
        </template>
        <template v-slot:explanation>
          Click on these tabs to switch between the understanding, questions, and student view.
        </template>
        <v-tabs
          v-model="tab"
          background-color="transparent"
          color="#66bb6a"
          grow
          class="tabs-bar"
          :mobile-breakpoint="500"
        >
          <v-tab
            v-for="(item, index) in items"
            :class="{active: currentTab === index}"
            @click="currentTab = index"
            :key="item"
            :ref="getTabId(index)"
          >
            {{ item }}
          </v-tab>
        </v-tabs>
      </TutorialDisplay>
    </v-card>

      <v-tabs-items v-model="tab">

          <!-- Start of Understanding tab -->
          <v-card
            v-show="currentTab === 0"
            min-height="75vh"
            :flat="smallScreen ? true : false"
            class="pt-3 pb-3"
          >
            <Understanding 
            :understandingScore="understandingScore" :topics="topics" :showTutorial="showTutorial" :datacollection="datacollection" :shortened="shortened"
            @resetTutorial="resetTutorial()" @nextTutorial="nextTutorial()"
            />
        </v-card>
          <!-- End of Understanding tab -->

          <!-- Start of Questions tab -->
        <v-card
            v-show="currentTab === 1"
            :flat="smallScreen ? true : false"
            class="pt-3"
            style="min-height: 75vh;"
          >
            <Questions
            :questions="questions" :topics="topics" :showTutorial="showTutorial" :datacollection="datacollection" :shortened="shortened"
            @resetTutorial="resetTutorial()" @nextTutorial="nextTutorial()" :totalStudents="totalStudents" @showCategory="showCategory()"
            :displayQuestions="displayQuestions" @clickTab="clickTab(2)"
            />
        </v-card>
        <!-- End of Questions tab -->

        <!-- Start of Students tab -->
        <v-card
            v-show="currentTab === 2"
            :flat="smallScreen ? true : false"
            class="pt-3"
            min-height="75vh"
          >
          <Students
            :topics="topics" 
            :showTutorial="showTutorial" 
            :students="students" 
            :shortened="shortened"
            @resetTutorial="resetTutorial()" 
            @nextTutorial="nextTutorial()" 
            @clickTab="clickTab(0)"  
            @invertDialog="invertDialog()"
            @kickStudent="kickStudent"
          />
        </v-card>
          <!-- End of Students tab -->

      </v-tabs-items>
    </v-container>
  </span>
</template>

<script>
import { mdiCloseThick } from '@mdi/js';
import { mapState } from 'vuex'
import { post, get, setLectures, socketServerOrigin } from '@/helpers.js'
import store from '@/store'

import Understanding from '../components/Understanding'
import Questions from '../components/Questions'
import Students from '../components/Students'

import TutorialDisplay from '@/components/TutorialDisplay'
import Dialog from '@/components/Dialog'

import sampleQuestions from '@/testdata/questions.json'
import sampleTopics from '@/testdata/topics.json'
import sampleStudents from '@/testdata/students.json'

export default {
  components: {
    TutorialDisplay,
    Understanding,
    Dialog,
    Students,
    Questions
  },
  props: {
    id: { type: String }
  },
  data () {
    return {
      connected: false,
      socket: '',
      joinCode: '',
      lectureName: '',
      datacollection: null,
      understandingScore: null,
      averageUnderstanding: '--',
      range: '--',
      svgPath: mdiCloseThick,
      questions: [],
      displayQuestions: [],
      totalStudents: [],
      students: [],
      topics: [],
      currentTab: 0,
      tab: null,
      items: [
        'Understanding', 'Questions', 'Students'
      ],
      start: Date.now(),
      understandingData: [],
      socketdata: "",
      shortened: false,
      shortentext: "Shorten",
      snackbar: false,
      timeout: 1000,
      snackbarMessage: '',
      showTutorial: -1,
      endCalled: false,
    }
  },
  methods: {
    dismiss(question) {
      question.dismiss = true;
    },
    exitFS() {
      document.exitFullscreen()
    },
    nextTutorial() {
      this.showTutorial++;
    },
    resetTutorial() {
      this.showTutorial=-1;
    },
    initChart () {
      var x = new Array();
      var y = new Array();
      var data = [...this.understandingData];
      if(this.shortened) {
        for(let i=data.length-1; i>=0; i--) {
          if((Date.now() - data[i].timestamp.getTime())/60000 > 5) {
            data.splice(0, i+1);
            break;
          }
        }
      }
      for(let i=0; i<data.length; i++) {
        x.push(data[i].timestamp);
        y.push(data[i].score);
      }
      this.fillData(x, y);
    },
    fillData (x, y) {
      this.datacollection = {
        labels: x,
          datasets: [
            {
              label: 'Understanding',
              backgroundColor: '#4FC3F7',
              data: y
            }
          ]
        }
    },
    endLectureMethod() {
      window.onbeforeunload = undefined
      this.endCalled = true
      post(`/lectures/live/teacher/${this.id}/end`)
      this.socket.close();
      console.log("Ending lecture")
      store.commit("setEndLecture", false)
      setLectures()
    },
    showCategory(index) {
      console.log("showing category "+index)
      this.displayQuestions = [...this.questions]
      const q = this.topics[index].questions
      this.displayQuestions = this.displayQuestions.filter(question => q.includes(question.question_uid))
    },
    getStudentById(id) {
      return this.totalStudents.find(student => student.uid == id)
    },
    showSnackBar(message) {
      this.snackbarMessage = message;
      this.snackbar = true;
      setTimeout(() => {
        this.snackbar = false;
      }, this.timeout);
    },
    sortQuestions() {
      this.questions.sort((a, b) => (a.upvotes < b.upvotes) ? 1 : -1)
      this.displayQuestions.sort((a, b) => (a.upvotes < b.upvotes) ? 1 : -1)
    },
    getTabId(index) {
      return "tab" + index
    },
    clickTab(index) {
      if(index == 1) {
        //console.log(this.$refs.tab2[0])
        //this.$refs.tab2[0].click(); IM BEING STUPID TODO IMPLEMENT LATER
      }
      console.log("Switching to tab " + index);
      this.currentTab = index;
    },
    displayNotification(subject, message) {
      if (Notification.permission == 'granted') {
          var img = 'https://i.imgur.com/lMPcw6k.png'
          var text = message
          var notification = new Notification(subject, { body: text, icon: img })
      }
    },
    kickStudent({ student_uid, banned }) {
      post(`/lectures/live/teacher/${this.id}/kick`, {
        student_uid,
        banned,
      }).then((data) => {
        this.removeStudent(student_uid)
      })
    },
    removeStudent(uid) {
      this.students = this.students.filter((student) => {
        return student.uid !== uid
      })
    },
  },
  mounted () {

    //Testing code
    //this.displayQuestions = sampleQuestions["questions"];
    //this.topics = sampleTopics["topics"];
    //this.students = sampleStudents["students"];

    this.socket = new WebSocket(`${socketServerOrigin}/lectures/live/teacher/${this.id}`)
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log(data);
      if(data.type == "lecture_info") {
        this.connected = true
        this.lectureName = data.lecture_name
        this.joinCode = data.join_code

        this.$emit('startlecture', this.id, this.joinCode);
        document.addEventListener('fullscreenchange', (event) => {
          if (!document.fullscreenElement) {
            store.commit("setShowCode", false)
          }
        });
      } else if(data.type == "student_join") {
        this.students.push(data)
        this.totalStudents.push(data)
        this.showSnackBar(`${ this.students[this.students.length-1].first_name } ${ this.students[this.students.length-1].last_name } joined`)
        this.displayNotification("Student joined", `${ this.students[this.students.length-1].first_name } ${ this.students[this.students.length-1].last_name } joined`)
      } else if(data.type == "student_leave") {
        const left = this.students.find(student => student.uid == data.uid)
        this.showSnackBar(`${ left.first_name } ${ left.last_name } left`)
        this.displayNotification("Student left", `${ left.first_name } ${ left.last_name } left`)
        this.students = this.students.filter(function( obj ) {
            return obj.uid !== data.uid
        });
      } else if(data.type == "us_update") {
        if(data.score != null) {
          var d = (Date.now() - this.start)/1000;
          this.understandingData.push({
            timestamp: new Date(),
            score: data.score
          })
          this.understandingScore = data.score
          this.initChart()
        } else {
          this.understandingScore = '--'
        }
      } else if(data.type == "new_question") {
        this.questions.push({
          question_uid: data.question_uid,
          creator_uid: data.creator_uid,
          question: data.question,
          dismiss: false,
          upvotes: 0,
          upvotedStudents: []
        })
        this.displayQuestions = [...this.questions]
        this.displayNotification("New Question", data.question)
      } else if(data.type == "ques_categor") {
        this.topics = data.categories
      } else if(data.type == "question_update") {
        var question = this.questions.find(question => question.question_uid == data.question_uid)
        question.upvotes++
        get(`/analytics/lecture/${this.id}/question/${data.question_uid}/upvotes`).then(result => {
          if(result.success) {
            question.upvotedStudents = result.data
            this.sortQuestions()
          }
        })
      } else if (data.type === 'end_lecture') {
        this.$router.replace({ name: 'Feedback', params: { fromLectureEnd: true } })
      } else if(data.type == "error") {
        this.endLectureMethod()
        this.$router.replace({ name: 'Dashboard'})
      }
    }
  },
  created () {
    this.initChart()
    window.onbeforeunload = function() {
      return "Reloading the page will end your lecture"
    }
    if(!localStorage['notfirst']) {
      this.showTutorial = 0
      localStorage['notfirst'] = true
    }
  },
  computed: {
    ...mapState(['endLecture', 'showCode']),
    smallScreen () {
      return this.$vuetify.breakpoint.smAndDown
    },
    understandingWidth () {
      if(!this.smallScreen) {
        return '30vw'
      } else {
        return '90vw'
      }
    },
    questionWidth() {
      if(this.smallScreen) {
        return '80vw';
      }
    }
  },
  watch: {
    endLecture(val) {
      if(this.endLecture) {
        this.endLectureMethod()
        this.$router.replace({ name: 'Feedback', params: { fromLectureEnd: true } })
        console.log("done")
      }
    },
    shortened(val) {
      this.initChart();
      this.shortentext = this.shortened ? "Entire" : "Shorten";
    },
    showCode(val) {
      if(this.showCode) {
        this.$refs["start-window"].requestFullscreen();
      } else if(document.fullScreen){
        this.exitFS();
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if(!this.endCalled) {
      const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
      if (answer) {
        this.endLectureMethod()
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
}
</script>

<style lang='scss'>
html {
  scroll-behavior: smooth;
}

#arrow-btn {
  transition: all 0.3s;
}
.roomContainer {
    background-color: #DCEDC8;
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
  top:0;
  left:10;
}
.xsign {
  margin-top:40%;
  margin-left:20%;
  cursor:pointer;
  transform: scale(2);
}
.joinMessage{
  margin-top:-7vw;
  height:120px;
  font-size: 2vw;
  font-weight: 900;
  width:100%;
  margin-bottom: 10vw;
  transform: scale(2);
}
.roomcode {
  background-color: white;
  height:100px;
  border-radius: 15px;
  justify-content: center;
  text-align: center;
  font-size: 500%;
  line-height: 120%;
  padding-right:20px;
  padding-left:20px;

  width:100%;
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
  background-color: #EEEEEE;
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
  background-color: #E1F5FE;
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

#upvotes {
  display: inline-block;
  background-color: #DCEDC8;
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
  width: 50% !important;
  margin: auto;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

@media screen and (max-width: 500px) {
  .tabs-bar {
    width: 100% !important;
  }
}
</style>
