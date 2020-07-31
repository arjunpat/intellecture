<template>
  <v-container class="fill-height py-0" fluid>
    <v-row 
      class="fill-height"
      justify="center"  
    >
      <v-col
        cols="12"
        sm="12"
        md="8"
        lg="6"
      >
        <v-card v-if="lectureInfo" class="mb-4">
          <div class="pl-2 green white--text text-subtitle-1">{{ lectureInfo.class_name }}</div>
          <v-card-text class="black--text">
            <div class="text-sm-h3 text-h4 mb-2">
              {{ lectureInfo.lecture_name }}
            </div>
            <v-row
              justify="start"
            >
              <v-col
                cols="12"
                sm="auto"
              >
                <v-icon>mdi-timer-outline</v-icon>
                {{ lectureLengthString }}
              </v-col>
              <v-col
                cols="12"
                sm="auto"
              >
                <v-icon>mdi-account</v-icon>
                {{ students.length + ' students' }}
              </v-col>
              <v-col
                cols="12"
                sm="auto"
              >
                <v-icon>mdi-update</v-icon>
                {{ timeSinceEndTimeString }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-title>
            Students
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              prepend-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="students"
          >
            <template v-slot:item.name="{ item }">
              <v-avatar size="36" class="mr-2">
                <img :src="item.photo">
              </v-avatar>
              {{ `${item.first_name} ${item.last_name}` }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { post, get, log, durationToString, dateToString } from '@/helpers.js'
import { mdiAndroidStudio } from '@mdi/js'
import analyticsData from '@/testdata/analyticsData.json'

export default {
  // mdi-timer-outline
  // mdi-update OR mdi-calendar-range
  props: {
    lecture_uid: { type: String },
  },

  data() {
    return {
      testing: false,
      lectureInfo: {},
      lectureLength: 0,
      search: '',
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Present-ness', value: 'present' },
        { text: 'Average Understanding', value: 'understanding' },
        { text: 'Questions Asked', value: 'quesCount' },
        { text: 'Questions Upvoted', value: 'quesUpvoted' },
      ],
      students: [],
      present: null,
      quesCount: null,
      intervals_present: null,
    }
  },

  computed: {
    lectureLengthString() {
      return durationToString(this.lectureLength, true)
    },
    timeSinceEndTimeString() {
      return dateToString(this.lectureInfo.end_time)
    },
  },

  methods: {
    async init() {
      if (this.testing) {
        this.lectureInfo = analyticsData.lectureInfo
        this.lectureLength = this.lectureInfo.end_time - this.lectureInfo.start_time
        this.students = analyticsData.students
        this.intervalsPresent = analyticsData.intervals_present
        this.present = analyticsData.present
        this.quesCount = analyticsData.question_count
      } else {
        this.lectureInfo = await this.get('/info')
        let students = await this.get('/students')
        this.present = await this.get('/present')
        this.quesCount = await this.get('/question-counts')
        this.upvoteCount = await this.get('/upvote-counts')

        this.lectureLength = this.lectureInfo.end_time - this.lectureInfo.start_time
        this.students = students

        this.get(`/student/${students[0].account_uid}/questions`)
      }
    },
    getPresent(uid) {
      return Math.round((this.present[uid] / this.lectureLength) * 100)
    },
    getQuesCount(uid) {
      return this.quesCount[uid] || 0
    },
    get(addy) {
      return get(`/analytics/lecture/${this.lecture_uid}${addy}`).then(d => {
        if (d.success)
          return d.data
        log('failed', e)
      })
    }
  },

  mounted() {
    this.init()
  }
}
</script>

<style scoped>
span {
  font-family: 'Roboto';
}
</style>

