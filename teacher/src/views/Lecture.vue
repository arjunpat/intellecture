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
      
      <v-card-title>
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

      <v-tabs-items v-model="tab">

          <!-- Start of Understanding tab -->
          <v-card
            v-show="currentTab === 0"
            flat
            min-height="75vh"
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
            flat
            class="pt-3"
            style="min-height: 75vh;"
          >
          <v-row align="center" justify="center">
            <v-col align="center">
            <v-row>
                <v-col align="left">
                <v-card
                    class="mx-auto"
                    max-width="400"
                    tile
                    style="font-family: var(--main-font);"
                >
                    <v-card-title style="font-weight: bold;">Key Topics <v-btn @click="displayQuestions = questions" v-show="questions.length != displayQuestions.length" text color="primary" style="position: absolute; right: 10px;">Show all</v-btn></v-card-title>
                    <v-card-text>
                    <v-list-item v-if="topics.length < 1 && showTutorial != 4">
                       <v-list-item-content>
                        <v-list-item-title>At least 5 questions are needed</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                        v-for="n in topics.length"
                        v-bind:key="n"
                    >
                        <v-list-item-content>
                        <v-list-item-title><div style="display: inline-block; font-size: 20px;" class="topic" @click="showCategory(n-1)"><span v-if="topics[n-1].value.length > 20">{{ topics[n-1].value.substring(0, 20) }}...</span><span v-else>{{ topics[n-1].value }}</span></div><div id="topic-quantity" class="ml-3">{{ topics[n-1].questions.length }}</div></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <!-- EXAMPLE TOPIC -->
                    <TutorialDisplay :show="showTutorial == 4" backgroundColor="white" @next="showTutorial++" @cancel="showTutorial = -1" bottom>
                      <template v-slot:title>
                        Topics
                      </template>
                      <template v-slot:explanation>
                        This shows the key topics from the questions and the number of questions that fall under that category. Click on a topic to see all the questions that fall under it.
                      </template>
                      <v-expand-transition>
                        <v-list-item v-if="showTutorial == 4">
                            <v-list-item-content>
                            <v-list-item-title><div style="display: inline-block; font-size: 20px;" class="topic">This is a topic</div><div id="topic-quantity" class="ml-3">{{ 5 }}</div></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                      </v-expand-transition>
                    </TutorialDisplay>
                  </v-card-text>
                </v-card>
                </v-col>

                <v-col cols="8">
                <div v-if="displayQuestions.length < 1 && showTutorial != 5">
                  <h1 style="font-weight: normal; font-size: 25px;">There are no questions to display</h1>
                </div>
                <ul style="list-style-type: none; font-family: var(--main-font);">
                    <li v-for="question in displayQuestions" v-bind:key="question.question_uid" v-show="!question.dismiss">
                    
                    <v-banner :style="{ textAlign: 'left', width: questionWidth }">
                      <v-tooltip right>
                        <template v-slot:activator="{ on }">
                         <span v-on="on">{{question.question}}</span>
                        </template>
                        <span>
                          {{ getStudentById(question.creator_uid).first_name }} {{ getStudentById(question.creator_uid).last_name }}
                          <v-avatar size="20px" class="ml-1">
                          <img
                            alt="Avatar"
                            :src="getStudentById(question.creator_uid).photo"
                            style="background-color: #F5F5F5;"
                          >
                          </v-avatar>
                        </span>
                      </v-tooltip>
                      <template v-slot:actions>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <div v-on="on" id="upvotes">{{question.upvotes}}</div>
                          </template>
                          <span>
                            <div v-if="question.upvotedStudents.length > 0">
                              <div v-for="student in question.upvotedStudents" v-bind:key="student.account_uid">
                                {{student.first_name}} {{student.last_name}}
                              </div>
                            </div>
                            <div v-else>No upvotes</div>
                          </span>
                        </v-tooltip>
                        <v-btn text color="primary" v-on:click="dismiss(question)">Dismiss</v-btn>
                      </template>
                    </v-banner>
                    </li>
                    <!-- EXAMPLE QUESTION -->
                    <TutorialDisplay :show="showTutorial == 5" backgroundColor="white" @next="showTutorial++; clickTab(2);" @cancel="showTutorial = -1" bottom>
                      <template v-slot:title>
                        Questions
                      </template>
                      <template v-slot:explanation>
                        Questions from the students will show up here along with the number of upvotes they get by the students (on the right). You can dismiss the question by clicking the dismiss button.
                      </template>
                      <v-expand-transition>
                        <li>
                          <v-banner v-show="showTutorial == 5">
                            This is a question
                            <template v-slot:actions>
                              <div id="upvotes">5</div>
                              <v-btn text color="primary">Dismiss</v-btn>
                            </template>
                          </v-banner>
                        </li>
                      </v-expand-transition>
                    </TutorialDisplay>
                </ul>
                </v-col>
            </v-row>
            </v-col>
        </v-row>
        </v-card>
        <!-- End of Questions tab -->

        <!-- Start of Students tab -->
        <v-card
            v-show="currentTab === 2"
            flat
            class="pt-3"
            height="75vh"
          >
          <v-row align="center" justify="center">
            <v-row align="center" justify="center" v-if="students.length == 0 && showTutorial != 6" >
              <v-col cols="8">
                <div style="font-family: var(--main-font); text-align: center;">
                <h1 style="font-weight: normal;">No students have joined the lecture. Have them go to <a>join.intellecture.app</a> and enter the code <span style="background-color: #eee; padding: 3px 10px; border-radius: 5px; font-weight: bold;">{{ joinCode }}</span> to join</h1>
                </div>
              </v-col>
            </v-row>
            <v-row align="center" justify="center">
                <v-col cols="8">
                <ul style="list-style-type: none">
                    <li v-for="student in students" v-bind:key="student.id">
                      <v-banner style="font-family: var(--main-font);">
                        <v-avatar
                          size="42px"
                          class="mr-3"
                        >
                          <img
                            alt="Avatar"
                            :src="student.photo"
                            style="background-color: #F5F5F5;"
                          >
                        </v-avatar>
                        {{ student.first_name }} {{ student.last_name }}
                        <template v-slot:actions>
                          <span style="font-size: 15px; color: #BDBDBD;">Joined {{ formatUnix(student.ts) }}</span>
                        </template>
                      </v-banner>
                    </li>
                    <!-- EXAMPLE QUESTION -->
                    <TutorialDisplay :show="showTutorial == 6" backgroundColor="white" @next="showTutorial++; clickTab(0)" @cancel="showTutorial = -1" bottom>
                      <template v-slot:title>
                        Students
                      </template>
                      <template v-slot:explanation>
                        Here, you can see a list of all the students that have joined your lecture.
                      </template>
                      <v-expand-transition>
                        <li v-if="showTutorial == 6">
                          <v-banner style="font-family: var(--main-font);">
                            <v-avatar
                              size="42px"
                              class="mr-3"
                            ><!-- CHANGE LATER -->
                              <img
                                alt="Avatar"
                                src="https://i.imgur.com/4Wj8Wz2.jpg"
                                style="background-color: #F5F5F5;"
                              >
                            </v-avatar>
                            Joe Smoe
                            <template v-slot:actions>
                              <span style="font-size: 15px; color: #BDBDBD;">Joined 8:00 AM</span>
                            </template>
                          </v-banner>
                        </li>
                      </v-expand-transition>
                    </TutorialDisplay>
                </ul>
                </v-col>
            </v-row>
        </v-row>
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
import TutorialDisplay from '@/components/TutorialDisplay'
import sampleQuestions from '@/testdata/questions.json'
import sampleTopics from '@/testdata/topics.json'

export default {
  components: {
    TutorialDisplay,
    Understanding
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
      understandingScore: '--',
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
      endCalled: false
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
    formatUnix(unix_timestamp) {
      if (unix_timestamp==undefined) {
        return "";
      }
      let date = new Date(unix_timestamp);
      return date.toLocaleTimeString();
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
      this.currentTab = index
    },
    displayNotification(subject, message) {
      if (Notification.permission == 'granted') {
          var img = 'https://i.imgur.com/lMPcw6k.png';
          var text = message;
          var notification = new Notification(subject, { body: text, icon: img });
      }
    }
  },
  mounted () {

    //Testing code
    //this.displayQuestions = sampleQuestions["questions"];
    //this.topics = sampleTopics["topics"];

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
        //this.$router.replace({ name: 'Dashboard'})
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
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return true
        case 'sm': return true
        case 'md': return false
        case 'lg': return false
        case 'xl': return false
      }
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

@media screen and (max-width: 500px) {
  .tabs-bar {
    width: 100% !important;
  }
}
</style>
