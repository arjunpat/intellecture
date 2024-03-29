<template>
  <v-container class="fill-height" fluid>
    <v-row class="fill-height" justify="center">
      <v-col cols="12" sm="12" md="10" lg="8">
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
        <LineChart :chart-data="chartData" :showLegend="true" class="mb-4" />

        <v-card>
          <v-tabs v-model="tab" grow color="green">
            <v-tab v-for="(tab, i) in tabs" :key="i" :href="tab.id">
              <v-icon>{{ tab.icon }}</v-icon>
              {{ tab.title }}
            </v-tab>

            <v-tab-item value="questions-tab">
              <v-list>
                <span v-if="studentData.questions.length > 0">
                  <template v-for="(question, i) in studentData.questions">
                    <v-divider v-if="i !== 0" :key="`divider-${i}`"></v-divider>
                    <v-list-item :key="question.question_uid">
                      <v-list-item-content>
                        <v-list-item-title>{{ question.question }}</v-list-item-title>
                        <v-list-item-subtitle>Asked at {{ elapsedToTimeString(lectureStart, question.elapsed) }}</v-list-item-subtitle>
                      </v-list-item-content>

                      <v-chip @click.stop="$emit('show-upvoters', question.question_uid)">
                        <v-avatar left>
                          <v-icon color="green lighten-3">mdi-arrow-up-bold</v-icon>
                        </v-avatar>
                        {{ question.upvotes }}
                      </v-chip>
                    </v-list-item>
                  </template>
                </span>
                <div v-else class="text-center">No questions asked.</div>
              </v-list>
            </v-tab-item>

            <v-tab-item value="upvoted-tab">
              <v-list>
                <span v-if="studentData.upvotedQuestions.length > 0">
                  <template v-for="(upvote, i) in studentData.upvotedQuestions">
                    <v-divider v-if="i !== 0" :key="`divider-${i}`"></v-divider>
                    <v-list-item :key="upvote.question_uid">
                      <v-list-item-content>
                        <v-list-item-title>{{ upvote.question.question }}</v-list-item-title>
                        <v-list-item-subtitle>Upvoted at {{ elapsedToTimeString(lectureStart, upvote.elapsed) }}</v-list-item-subtitle>
                      </v-list-item-content>

                      <v-chip @click.stop="$emit('show-upvoters', upvote.question_uid)">
                        <v-avatar left>
                          <v-icon color="green lighten-3">mdi-arrow-up-bold</v-icon>
                        </v-avatar>
                        {{ upvote.question.upvotes }}
                      </v-chip>
                    </v-list-item>
                  </template>
                </span>
                <div v-else class="text-center">No questions upvoted.</div>
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
import { get, post, log, elapsedToTimeString } from '../../helpers'

export default {
  props: {
    studentData: { type: Object, required: true },
    overallUnderstanding: { type: Object, required: true },
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
        },
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
    elapsedToTimeString,
    initChartData() {
      // This student's specific understanding
      let studentGraphData = [
        {
          x: this.lectureStart,
          y: null,
        },
      ]

      this.studentData.intervals.forEach((interval, i) => {
        if (i > 0) {
          let diff = interval.from - this.studentData.intervals[i - 1].to
          if (diff > 0) {
            studentGraphData.push({
              x: this.lectureStart + interval.from,
              y: null,
            })
          }
        }
        studentGraphData.push({
          x: this.lectureStart + interval.from,
          y: interval.score * 10,
        })
        studentGraphData.push({
          x: this.lectureStart + interval.to,
          y: interval.score * 10,
        })
      })

      studentGraphData.push({
        x: this.lectureEnd,
        y: null,
      })

      // Overall understanding during the lecture
      let overallGraphData = this.prepareOverallData(this.overallUnderstanding)

      this.chartData = {
        datasets: [
          {
            label: 'Student Understanding',
            backgroundColor: '#4FC3F7',
            lineTension: 0,
            data: studentGraphData,
          },
          {
            label: 'Class Understanding',
            backgroundColor: '#C1E3B3',
            // lineTension: 0,
            // steppedLine: true,
            data: overallGraphData,
          },
        ],
      }
    },
    prepareOverallData(data) {
      let us = data.score.map((score, i) => {
        return {
          x: this.lectureStart + data.elapsed[i],
          y: score,
        }
      })

      // adds points right before null
      for (let i = 1; i < us.length; i++) {
        if (typeof us[i - 1].y === 'number' && !us[i].y) {
          us.splice(i, 0, {
            x: us[i].x - 1,
            y: us[i - 1].y
          })
          i++
        }
      }

      // makes sure graph spans entire length
      us.unshift({ x: this.lectureStart, y: null })
      // final us point
      us.push({ x: this.lectureEnd, y: us[us.length - 1].y })

      // removes unnecessary points
      if (us.length > 100) {
        log('Points before', us.length)
        let lectureLength = this.lectureEnd - this.lectureStart
        for (let i = 1; i < us.length - 2; i++) {
          if (!us[i].y || !us[i + 1].y) continue // null

          let dy = Math.abs(us[i].y - us[i + 1].y)
          let dx = us[i + 1].x - us[i].x
          if (dy <= 2 && dx < 0.01 * lectureLength) {
            us.splice(i + 1, 1)
            i--
          }
        }
        log('Points after', us.length)
      }
      
      return us
    }
  },
}
</script>