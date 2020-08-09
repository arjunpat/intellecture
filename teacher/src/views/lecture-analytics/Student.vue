<template>
  <v-container class="fill-height" fluid>
    <v-row class="fill-height" justify="center">
      <v-col
        cols="12"
        sm="12"
        md="10"
        lg="8"
      >
        <StudentInfoCard
          :student="studentData.student"
          :present="studentData.present"
          :understanding="studentData.understanding"
          :quesCount="studentData.quesCount"
          :upvoteCount="studentData.upvoteCount"
          :maxUnderstanding="maxUnderstanding"
          class="mb-4"
        /> 
        
        <div :class="$vuetify.breakpoint.xs ? 'text-h6' : 'text-h4'" class="mb-2">Understanding (%)</div>
        <LineChart 
          :chart-data="chartData"
          class="mb-4"
        />

        <v-card>
          <v-tabs
            v-model="tab"
            grow
            color="green"
          >
            <v-tab
              v-for="(tab, i) in tabs"
              :key="i"
              :href="tab.id"
            >
              <v-icon>{{ tab.icon }}</v-icon>
              {{ tab.title }}
            </v-tab>

            <v-tab-item value="questions-tab">
              <v-list>
                <template 
                  v-for="(question, i) in studentData.questions"
                >
                  <v-divider v-if="i !== 0" :key="`divider-${i}`"></v-divider>
                  <v-list-item :key="i">
                    <v-list-item-content>
                      <v-list-item-title>{{ question.question }}</v-list-item-title>
                      <v-list-item-subtitle>{{ elapsedToTimeString(question.elapsed) }}</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-icon>
                      <v-icon color="green lighten-3">mdi-arrow-up-bold</v-icon>
                      {{ question.upvotes }}
                    </v-list-item-icon>
                  </v-list-item>
                </template>
              </v-list>
            </v-tab-item>

            <v-tab-item value="upvoted-tab">
              <v-list>
                <template 
                  v-for="(upvote, i) in studentData.upvotedQuestions"
                >
                  <v-divider v-if="i !== 0" :key="`divider-${i}`"></v-divider>
                  <v-list-item :key="i">
                    <v-list-item-content>
                      <v-list-item-title>{{ upvote.question.question }}</v-list-item-title>
                      <v-list-item-subtitle>{{ elapsedToTimeString(upvote.elapsed) }}</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-icon>
                      <v-icon color="green lighten-3">mdi-arrow-up-bold</v-icon>
                      {{ upvote.question.upvotes }}
                    </v-list-item-icon>
                  </v-list-item>
                </template>
              </v-list>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import analyticsData from '@/testdata/analyticsData.json'
import StudentInfoCard from '@/components/analytics/StudentInfoCard'
import LineChart from '@/components/lecture/Chart'
import { get, post } from '../../helpers'

export default {
  props: {
    studentData: { type: Object, required: true },
    maxUnderstanding: { type: Number, required: true },
    lectureInfo: { type: Object, required: true },
  },

  components: {
    StudentInfoCard,
    LineChart,
  },

  created() {
    this.initChartData()
  },

  data() {
    return {
      tab: null,
      tabs: [
        {
          icon: 'mdi-forum',
          title: 'Questions Asked',
          id: '#questions-tab',
        },
        {
          icon: 'mdi-arrow-up-bold',
          title: 'Upvoted Questions',
          id: '#upvoted-tab',
        }
      ],

      chartData: null,
    }
  },

  computed: {
    lectureStart() {
      return this.lectureInfo.start_time
    },
    lectureEnd() {
      return this.lectureInfo.end_time
    },
  },

  methods: {
    elapsedToTimeString(elapsed) {
      return new Date(this.lectureStart + elapsed).toLocaleTimeString()
    },
    initChartData() {
      let x = [this.lectureStart]
      let y = [null]

      this.studentData.intervals.forEach((interval, i) => {
        if (i > 0) {
          let diff = interval.from - this.studentData.intervals[i-1].to
          if (diff > 0) {
            x.push(this.lectureStart + interval.from)
            y.push(null)
          }
        }
        x.push(this.lectureStart + interval.from)
        x.push(this.lectureStart + interval.to)
        y.push(interval.score*10)
        y.push(interval.score*10)
      })

      x.push(this.lectureEnd)
      y.push(null)

      this.chartData = {
        labels: x,
        datasets: [
          {
            label: 'Understanding',
            backgroundColor: '#4FC3F7',
            lineTension: 0,
            data: y,
          },
        ],
      }
    }
  },
}
</script>