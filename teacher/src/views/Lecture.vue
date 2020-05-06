<template>
  <v-content>
    <v-container
      fluid
    >
      <v-card>
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
            <v-row align="center" justify="center">
                <v-card width="30%" height="60vh">
                    <v-card-text>
                        <span style="font-size: 20px; color: black; font-weight: bold;"><span style="background: red; padding: 2px 5px; color: white; border-radius: 3px; font-weight: normal;">LIVE</span> UNDERSTANDING SCORE</span>
                        <br><br><br><br><br><br><br>
                        <span class="text--primary font-weight-black" style="margin-top: 40px; text-align: center; font-size: 180px; background: #ddd; border-radius: 7px; padding: 4px 10px;">{{ understandingScore }}%</span>
                        <br><br><br><br>
                        <span class="text--primary data-text">Average Understanding: </span>
                        <span class="text--primary font-weight-black" style="font-size: 20px; background: #ddd; padding: 2px 4px; border-radius: 3px;">{{ averageUnderstanding }}</span>
                        <div style="height: 5px;"></div>
                        <span class="text--primary data-text">Understanding Range: </span>
                        <span class="text--primary font-weight-black" style="font-size: 20px; background: #ddd; padding: 2px 4px; border-radius: 3px;">{{ range }}</span>
                        <br>
                    </v-card-text>
                </v-card>
                <v-card width="60%" height="60vh" align="center" justify="center">
                    <div style="max-width: 900px; margin-top: 3%;">
                        <line-chart :chart-data="datacollection"></line-chart>
                    </div>
                  <v-btn style="float: none;" class="" @click="shortened = !shortened">{{ shortentext }}</v-btn>
                </v-card>
            </v-row>
            <v-row class="mt-1" align="center" justify="center">
              <v-card width="90%" min-height="70px" style="padding: 5px 10px;">
                <v-row>
                  <v-col align="left">
                  <div
                      v-for="n in 3"
                      v-bind:key="n"
                      style="float: left; background-color: #EEEEEE; margin-bottom: 7px; border-radius: 10px; padding: 5px 7px; height: 5vh; text-align: center;"
                      class="mr-3"
                  >
                      <h1 style="font-size: 20px;">{{ keywords[n-1].word }} </h1>
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
            height="75vh"
          >
          <v-row align="center" justify="center">
            <v-col align="center">
            <v-row>
                <v-col align="left">
                <v-card
                    class="mx-auto"
                    max-width="400"
                    tile
                >
                    <v-card-title>Keywords</v-card-title>
                    <v-card-text>
                    <v-list-item
                        v-for="n in 3"
                        v-bind:key="n"
                    >
                        <v-list-item-content>
                        <v-list-item-title>{{ keywords[n-1].word }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    </v-card-text>
                </v-card>
                </v-col>

                <v-col cols="8">
                <ul style="list-style-type: none">
                    <li v-for="question in questions" v-bind:key="question.id" v-show="!question.dismiss">
                    <v-banner>
                        {{question.text}}
                        <template v-slot:actions>
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
            <v-row align="center" justify="center">
                <v-col cols="8">
                <ul style="list-style-type: none">
                    <li v-for="student in students" v-bind:key="student.id">
                    <v-banner>
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
                      {{student.first_name}} {{student.last_name}}
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

      <!-- <v-row align="center" justify="center">
        <v-col cols="12" sm="6" align="center">
          <v-card>
            <span>People in Lecture</span><br>
            <span v-for="person in peopleList" v-bind:key="person" style="display: block;">{{ person }}</span>
          </v-card>
        </v-col>
      </v-row> -->

    </v-container>
<!--
    <v-footer
      fixed
      color="green lighten-3"
      class="font-weight-medium"
    >
      <v-col
        class="text-center"
        cols="12"
        sm="8"
      >
        <span style="font-size: 28px;">Give your students the join code: <span class="text--primary font-weight-black" style="background: #ddd; border-radius: 7px; padding: 4px 10px;">{{ id }}</span></span>
      </v-col>
    </v-footer>-->
  </v-content>
</template>

<script>
import LineChart from '../components/Chart'
import { mapState } from 'vuex'
import { post, get } from '@/helpers.js'
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
      questions: [/* { text: 'What is a Gaussian surface?', id: 0, dismiss: false },
        { text: 'How do you calculate voltage?', id: 1, dismiss: false },
        { text: 'How do you make a Gaussian surface??', id: 2, dismiss: false },
        { text: 'Is a Gaussian surface a real physical object?', id: 3, dismiss: false},
        { text: "What's the formula for flux?", id: 4, dismiss: false },
        { text: 'How do you used a closed surface integral to calculate flux?', id: 5, dismiss: false },
        { text: 'What is the relationship between voltage and a Gaussian surface?', id: 6, dismiss: false }*/],
      students: [],
      whatever: "awefawef",
      keywords: /* hardcoded data */ [{ word: 'gaussian surface', count: 6 }, { word: 'electric flux', count: 4 }, { word: 'voltage', count: 3 }, { word: 'gaussian surface', count: 6 }, { word: 'electric flux', count: 4 }, { word: 'voltage', count: 3 }, { word: 'gaussian surface', count: 6 }, { word: 'electric flux', count: 4 }, { word: 'voltage', count: 3 }, { word: 'gaussian surface', count: 6 }, { word: 'electric flux', count: 4 }, { word: 'voltage', count: 3 }, { word: 'gaussian surface', count: 6 }, { word: 'electric flux', count: 4 }, { word: 'voltage', count: 3 }],
      currentTab: 0,
      tab: null,
      items: [
        'Understanding', 'Questions', 'Students'
      ],
      start: Date.now(),
      understandingData: [],
      socketdata: "",
      shortened: false,
      shortentext: "Shorten"
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
    }
  },
  mounted () {
    this.$emit('startlecture', this.id);

    get(`/lectures/exists/${this.id}`).then((response) => {
      if(response.success) {
        if(!response.data.exists) {
          this.$router.push({ path: '/dashboard' });
          this.$emit('nonexistant');
        }
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
      } else if(data.type == "student_leave") {
        self.students = self.students.filter(function( obj ) {
            return obj.uid !== data.uid
        });
      } else if(data.type == "us_update") {
        if(data.value != null) {
          var d = (Date.now() - self.start)/1000;
          self.understandingData.push({
            timestamp: new Date(),
            score: data.value
          })
          self.understandingScore = data.value
          self.initChart();
        }
      } else if(data.type == "new_question") {
        self.questions.push({
          text: data.question,
          id: self.questions.length,
          dismiss: false
        })
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
    ...mapState(['endLecture'])
  },
  watch: {
    endLecture(val) {
      if(this.endLecture) {
        this.socket.send(JSON.stringify({ type: "end_lecture" })); 
        this.socket.close();
        post(`/lectures/live/teacher/${this.id}/end`);
        this.$router.push({ path: '/dashboard' })
        store.commit("setEndLecture", false)
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
</style>
