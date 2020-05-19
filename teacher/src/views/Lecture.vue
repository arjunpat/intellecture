<template>
  <v-content>
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

      <v-card-title>
        <h1 class="display-1">Lecture: <strong><span style="font-family: 'Noto Sans'">{{ lectureName }}</span></strong></h1>
      </v-card-title>

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
        >
          {{ item }}
        </v-tab>
      </v-tabs>

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
                <v-card width="30%" height="60vh">
                    <v-card-text style="text-align: center;">
                        <span style="font-size: 23px; color: black; font-weight: bold;"><span style="background: red; padding: 2px 5px; color: white; border-radius: 3px; font-weight: normal;">LIVE</span> UNDERSTANDING SCORE</span>
                        <br><br><br><br><br><br><br><br>
                        <span class="text--primary font-weight-black" style="margin-top: 40px; text-align: center; font-size: 180px; background: #E0E0E0; border-radius: 10px; padding: 4px 20px;">{{ understandingScore }}%</span>
                        <br><br><br><br>
                        <div style="width: 335px; display: inline-block;"><v-progress-linear :value="understandingScore" :color="progressColor" rounded></v-progress-linear></div>
                    </v-card-text>
                </v-card>
                <v-card width="60%" height="60vh" align="center" justify="center">
                    <div style="max-width: 900px; margin-top: 3%;">
                        <line-chart :chart-data="datacollection"></line-chart>
                    </div>
                  <v-btn style="float: none;" class="" @click="shortened = !shortened">{{ shortentext }}</v-btn>
                </v-card>
            </v-row>
            <!-- TOPICS WILL ADD LATER -->
            <v-row class="mt-1" align="center" justify="center" v-if="topics.length > 0">
              <v-card width="90%" min-height="70px" style="padding: 5px 10px;">
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
                  </v-col>
                </v-row>
              </v-card>
            </v-row>

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
              <div v-if="students.length == 0">
                <v-progress-circular
                  :width="3"
                  :size="60"
                  color="black"
                  indeterminate
                  style="margin-left: 40px; margin-top: 40px;"
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
import LineChart from '../components/Chart'
import { mapState } from 'vuex'
import { post, get, setLectures } from '@/helpers.js'
import store from '@/store'

export default {
  components: {
    LineChart
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
      students: [],
      totalStudents: [],
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
      snackbarMessage: ''
    }
  },
  methods: {
    dismiss(question) {
      question.dismiss = true;
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
    }
  },
  mounted () {
    this.$emit('startlecture', this.id);

    //this.displayQuestions = this.questions;
    
    //this.questions.sort((a, b) => (a.upvotes < b.upvotes) ? 1 : -1)

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
            console.log(self.questions)
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
        return "Reloading the page will end your lecture";
    }
    
  },
  computed: {
    ...mapState(['endLecture']),
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
    }
  },
  watch: {
    endLecture(val) {
      if(this.endLecture) {
        this.endLectureMethod();
        this.$router.replace({ name: 'Feedback', params: { fromLectureEnd: true } })
      }
    },
    shortened(val) {
      this.initChart();
      this.shortentext = this.shortened ? "Entire" : "Shorten";
    }
  }
}
</script>

<style>
html {
  scroll-behavior: smooth;
}

#arrow-btn {
  transition: all 0.3s;
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
</style>
