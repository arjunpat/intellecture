<template>
  <v-content>
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
            {{this.$route.params.id}}
          </h1>
        </div>
      </v-row>
      
      </v-col>
    </v-container>
    <v-container
      fluid
    >
      <v-card>

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
        <div style="position: absolute; top: 0px; right: 0px;">
          
        </div>
      </TutorialDisplay>
      </div>

      <v-card-title>
        <h1 class="display-1">Lecture: <strong><span style="font-family: 'Noto Sans'">{{ lectureName }}</span></strong></h1>
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
          grow
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
            color="basil"
            flat
            min-height="75vh"
            class="pt-3 pb-3"
          >
            <v-row align="center" justify="center" style="margin-top: 20px;">
                <TutorialDisplay :show="showTutorial == 0" backgroundColor="white" @next="showTutorial++" @cancel="showTutorial = -1" bottom>
                  <template v-slot:title>
                    Understanding Score
                  </template>
                  <template v-slot:explanation>
                    The aggregated understanding score from your students will show up here.
                  </template>
                  <v-card :width="understandingWidth" height="65vh">
                    <v-card-text style="text-align: center;">
                      <span style="font-size: 23px; color: black; font-weight: bold;"><span style="background: red; padding: 2px 5px; color: white; border-radius: 3px; font-weight: normal;">LIVE</span> UNDERSTANDING SCORE</span>
                      <br><br><br><br><br><br><br><br>
                      <span class="text--primary font-weight-black" style="margin-top: 40px; text-align: center; font-size: 180px; background: #E0E0E0; border-radius: 10px; padding: 4px 20px;" :style="{ fontSize: understandingFontSize }">{{ understandingScore }}%</span>
                      <br><br><br><br>
                      <div style="width: 335px; display: inline-block;"><v-progress-linear :value="understandingScore" :color="progressColor" rounded></v-progress-linear></div>
                    </v-card-text>
                  </v-card>
                </TutorialDisplay>
                <TutorialDisplay :show="showTutorial == 1" backgroundColor="white" @next="showTutorial++" @cancel="showTutorial = -1" bottom>
                  <template v-slot:title>
                    Understanding Graph
                  </template>
                  <template v-slot:explanation>
                    This is a graph of the understanding score over the duration of your lecture. Click the shorten button to only show the last 5 minutes of data.
                  </template>
                  <v-card width="60vw" style="height: 65vh;" align="center" justify="center" v-if="!smallScreen">
                      <div style="max-width: 90%; padding-top: 3%;">
                          <line-chart :chart-data="datacollection"></line-chart>
                          <v-btn style="float: none;" class="" @click="shortened = !shortened">{{ shortentext }}</v-btn>
                      </div>
                  </v-card>
                </TutorialDisplay>
            </v-row>
            <v-row align="center" justify="center" v-if="smallScreen">
                <v-card width="90%" style="min-height: 60vh" class="pb-3" align="center" justify="center">                    
                    <div style="max-width: 900px; margin-top: 3%;">
                      <line-chart :chart-data="datacollection"></line-chart>
                    </div>
                  <v-btn style="float: none;" class="" @click="shortened = !shortened">{{ shortentext }}</v-btn>
                </v-card>
            </v-row>

            <v-row class="mt-1" align="center" justify="center" v-if="topics.length > 0 || showTutorial == 2">
              <TutorialDisplay :show="showTutorial == 2" backgroundColor="white" @next="showTutorial++" @cancel="showTutorial = -1" top>
                <template v-slot:title>
                  Topics
                </template>
                <template v-slot:explanation>
                  This is where the main topics of the questions asked by your students will show up.
                </template>
                <v-expand-transition>
                    <v-card width="90vw" min-height="70px" style="padding: 5px 10px;">
                      <v-row>
                        <v-col align="left">
                        <div
                            v-for="n in topics.length"
                            v-bind:key="n"
                            style="float: left; margin-bottom: 7px; height: 5vh;"
                            class="mr-3 topic"
                        >
                            <h1 style="font-size: 20px;">{{ topics[n-1].value }} </h1>
                        </div>
                        <v-expand-transition>
                          <div
                              style="float: left; margin-bottom: 7px; height: 5vh;"
                              class="mr-3 topic"
                              v-if="showTutorial == 2"
                          >
                              <h1 style="font-size: 20px;">This is a topic</h1>
                          </div>
                        </v-expand-transition>
                        </v-col>
                      </v-row>
                    </v-card>
                </v-expand-transition>
              </TutorialDisplay>
            </v-row>
            <div style="text-align: right; position: absolute; right: 10px; bottom: 10px; width: 400px;"> 
              <TutorialDisplay style="text-align: left;" :show="showTutorial == 8" backgroundColor="white" @next="showTutorial = -1" @cancel="showTutorial = -1" top last>
                <template v-slot:title>
                  Help
                </template>
                <template v-slot:explanation>
                  Click here to view this tutorial again. 
                </template>
                <div style="text-align: right;">
                  <v-btn style="display: inline-block;" color="green" bottom @click="showTutorial = 0" fab dark small>
                    <v-icon>mdi-help</v-icon>
                  </v-btn>
                </div>
              </TutorialDisplay>
            </div>
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
                        This shows the key topics from the questions and the number of questions that fall under that category.
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
                <ul style="list-style-type: none; font-family: var(--main-font);">
                    <li v-for="question in displayQuestions" v-bind:key="question.question_uid" v-show="!question.dismiss">
                    
                    <v-banner>
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
            <v-row align="center" justify="center" style="width: 100vw;">
              <div v-if="students.length == 0 && showTutorial != 6">
                <v-progress-circular
                  :width="3"
                  :size="60"
                  color="black"
                  indeterminate
                  style="margin-top: 40px; margin-left: 65px;"
                ></v-progress-circular>
              </div>
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
      
    </v-card>
    </v-container>
  </v-content>
</template>

<script>
import { mdiCloseThick } from '@mdi/js';
import LineChart from '../components/Chart'
import TutorialDisplay from '@/components/TutorialDisplay'
import { mapState } from 'vuex'
import { post, get, setLectures } from '@/helpers.js'
import store from '@/store'

export default {
  components: {
    LineChart,
    TutorialDisplay,
  },
  props: {
    id: { type: String }
  },
  data () {
    return {
      connected: false,
      socket: '',
      lectureName: '',
      datacollection: null,
      understandingScore: '--',
      averageUnderstanding: '--',
      range: '--',
      svgPath: mdiCloseThick,
      questions: [/*{
  "type":"new_question",
  "question_uid":"jDuw6QJmDQiRfJo",
  "creator_uid":"rUJyP317iuZErNlhrn2",
  "question":"What is the relationship between voltage and a Gaussian surface?",
          upvotes: 5,
          upvotedStudents: [
            {
      "account_uid":"4qZpEpLkqFgUMdiyjuwWt8lY6Hy2",
      "email":"100021830@mvla.net",
      "first_name":"Arjun",
      "last_name":"Patrawala",
      "photo":"https://lh3.googleusercontent.com/a-/AOh14GipzqLNsIg"
    },
    {
      "account_uid":"rUJyP317iuZErNlhrnnyn8eT7uY2",
      "email":"ajpat1234@gmail.com",
      "first_name":"Arjun",
      "last_name":"Patrawala",
      "photo":"https://lh3.googleusercontent.com/a-/AOh14Gh1hi7LxPF0wFC8OM1j2xg"
    } ]
},
{
  "type":"new_question",
  "question_uid":"X8udiUQ8fN6F27C",
  "creator_uid":"rUJyP317iuZErNlhrn2",
  "question":"What is the relationship between voltage and a Gaussian surface?",
          upvotes: 12,
          upvotedStudents: [{
      "account_uid":"4qZpEpLkqFgUMdiyjuwWt8lY6Hy2",
      "email":"100021830@mvla.net",
      "first_name":"Arjun",
      "last_name":"Patrawala",
      "photo":"https://lh3.googleusercontent.com/a-/AOh14GipzqLNsIg"
    },
    {
      "account_uid":"rUJyP317iuZErNlhrnnyn8eT7uY2",
      "email":"ajpat1234@gmail.com",
      "first_name":"Arjun",
      "last_name":"Patrawala",
      "photo":"https://lh3.googleusercontent.com/a-/AOh14Gh1hi7LxPF0wFC8OM1j2xg"
    }]

},
{
  "type":"new_question",
  "question_uid":"74i74G1UUuJJ13H",
  "creator_uid":"rUJyP317iuZErNlhrn2",
  "question":"What is the relationship between voltage and a Gaussian surface?",
          upvotes: 5,
          upvotedStudents: [{
      "account_uid":"4qZpEpLkqFgUMdiyjuwWt8lY6Hy2",
      "email":"100021830@mvla.net",
      "first_name":"Arjun",
      "last_name":"Patrawala",
      "photo":"https://lh3.googleusercontent.com/a-/AOh14GipzqLNsIg"
    },
    {
      "account_uid":"rUJyP317iuZErNlhrnnyn8eT7uY2",
      "email":"ajpat1234@gmail.com",
      "first_name":"Arjun",
      "last_name":"Patrawala",
      "photo":"https://lh3.googleusercontent.com/a-/AOh14Gh1hi7LxPF0wFC8OM1j2xg"
    }]

},
{
  "type":"new_question",
  "question_uid":"mwZPFrIykOY8ZlZ",
  "creator_uid":"rUJyP317iuZErNlhrn2",
  "question":"What is the relationship between voltage and a Gaussian surface?",
          upvotes: 0,
          upvotedStudents: []
}*/],
      displayQuestions: [],
      totalStudents: [],
      students: [],
      topics: [/*
    {
      "type":"keyphrase",
      "value":"gaussian surface",
      "questions":[
        "jDuw6QJmDQiRfJo",
        "T9JpRo4NuTSKOJH",
        "74i74G1UUuJJ13H",
        "X8udiUQ8fN6F27C"
      ],
      "score":1,
      "weight":8
    },
    {
      "type":"keyword",
      "value":"surface",
      "questions":[
        "jDuw6QJmDQiRfJo",
        "T9JpRo4NuTSKOJH",
        "74i74G1UUuJJ13H",
        "mwZPFrIykOY8ZlZ",
        "X8udiUQ8fN6F27C"
      ],
      "score":1
    },
    {
      "type":"keyword",
      "value":"gaussian",
      "questions":[
        "jDuw6QJmDQiRfJo",
        "T9JpRo4NuTSKOJH",
        "74i74G1UUuJJ13H",
        "X8udiUQ8fN6F27C"
      ],
      "score":0.8
    },
    {
      "type":"keyword",
      "value":"voltage",
      "questions":[
        "mopv0qoAZDgScCB",
        "X8udiUQ8fN6F27C"
      ],
      "score":0.4
    },
    {
      "type":"keyword",
      "value":"flux",
      "questions":[
        "r87LkYcgqyOFmCF",
        "mwZPFrIykOY8ZlZ"
      ],
      "score":0.4
    }*/],
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
      window.onbeforeunload = function() {}
      this.endCalled = true
      this.socket.send(JSON.stringify({ type: "end_lecture" }))
      this.socket.close()
      post(`/lectures/live/teacher/${this.id}/end`)
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
    }
  },
  mounted () {
    this.$emit('startlecture', this.id);
    this.$refs["start-window"].requestFullscreen();
    document.addEventListener('fullscreenchange', (event) => {
      if (!document.fullscreenElement) {
        store.commit("setShowCode", false)
      }
    });

    this.socket = new WebSocket(`wss://api.intellecture.app/lectures/live/teacher/${this.id}`);
    var self = this;
    this.socket.onmessage = function (event) {
      const data = JSON.parse(event.data)
      console.log(data);
      if(data.type == "lecture_info") {
        self.connected = true
        self.lectureName = data.lecture_name
      } else if(data.type == "student_join") {
        self.students.push(data)
        self.totalStudents.push(data)
        self.showSnackBar(`${ self.students[self.students.length-1].first_name } ${ self.students[self.students.length-1].last_name } joined`)
      } else if(data.type == "student_leave") {
        const left = self.students.find(student => student.uid == data.uid)
        self.showSnackBar(`${ left.first_name } ${ left.last_name } left`)
        self.students = self.students.filter(function( obj ) {
            return obj.uid !== data.uid
        });
      } else if(data.type == "us_update") {
        if(data.score != null) {
          var d = (Date.now() - self.start)/1000;
          self.understandingData.push({
            timestamp: new Date(),
            score: data.score
          })
          self.understandingScore = data.score
          self.initChart()
        } else {
          self.understandingScore = '--'
        }
      } else if(data.type == "new_question") {
        self.questions.push({
          question_uid: data.question_uid,
          creator_uid: data.creator_uid,
          question: data.question,
          dismiss: false,
          upvotes: 0,
          upvotedStudents: []
        })
        self.displayQuestions = [...self.questions]
      } else if(data.type == "ques_categor") {
        self.topics = data.categories
      } else if(data.type == "question_update") {
        var question = self.questions.find(question => question.question_uid == data.question_uid)
        question.upvotes++
        get(`/analytics/lecture/${self.id}/question/${data.question_uid}/upvotes`).then(result => {
          if(result.success) {
            question.upvotedStudents = result.data
            self.sortQuestions()
          }
        })
      }else if(data.type == "error") {
        self.endLectureMethod()
        self.$router.replace({ name: 'Dashboard'})
      }
    }
  },
  created () {
    this.initChart()
    window.onbeforeunload = function() {
      return "Reloading the page will end your lecture"
    }
    
  },
  computed: {
    ...mapState(['endLecture', 'showCode']),
    progressColor () {
      if(this.understandingScore == '--') {
        return 'primary'
      } else if(this.understandingScore >= 70) {
        return 'success'
      } else if(this.understandingScore <= 20) {
        return 'error'
      } else {
        return 'warning'
      }
    },
    understandingFontSize () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '180px'
        case 'sm': return '180px'
        case 'md': return '130px'
        case 'lg': return '180px'
        case 'xl': return '180px'
      }
    },
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
</style>
