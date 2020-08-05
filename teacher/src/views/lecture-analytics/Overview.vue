<template>
  <v-container class="fill-height py-0" fluid>
    <v-row 
      class="fill-height"
      justify="center"  
    >
      <v-col
        cols="12"
        sm="12"
        md="10"
        lg="8"
      >
        <LectureInfoCard 
          v-if="lectureInfo" 
          class="mb-4"
          :lectureInfo="lectureInfo"
          :numStudents="students.length"
        />

        <v-card class="pb-2">
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
            
            <v-tab-item
              value="students-tab"
            >
              <StudentTable
                :data="studentTableData"
                @studentClicked="redirectStudentPage"
              />
            </v-tab-item>

            <v-tab-item
              value="questions-tab"
            >
              <QuestionTable
                :data="questions"
              />
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { post, get, log } from '@/helpers.js'
import analyticsData from '@/testdata/analyticsData.json'
import Dialog from '@/components/Dialog'
import LectureInfoCard from '@/components/analytics/LectureInfoCard'
import StudentTable from '@/components/analytics/StudentTable'
import QuestionTable from '@/components/analytics/QuestionTable'

export default {
  props: {
    lecture_uid: { type: String, required: true },
  },

  components: {
    Dialog,
    LectureInfoCard,
    StudentTable,
    QuestionTable,
  },

  data() {
    return {
      testing: false,

      tab: null,
      tabs: [
        {
          icon: 'mdi-account',
          title: 'Students',
          id: '#students-tab',
        },
        {
          icon: 'mdi-forum',
          title: 'Questions',
          id: '#questions-tab',
        },
      ],

      lectureInfo: {},
      students: [],
      present: {},
      quesCount: {},
      upvoteCount: {},

      questions: [],

      intervals_present: null,
    }
  },

  computed: {
    studentTableData() {
      return this.students.map((student) => {
        return {
          ...student,
          name: `${student.first_name} ${student.last_name}`,
          present: this.getPresent(student.account_uid),
          understanding: this.getAvgUs(student.account_uid),
          quesCount: this.getQuesCount(student.account_uid),
          upvoteCount: this.getUpvoteCount(student.account_uid),
        }
      })
    },
    lectureLength() {
      return this.lectureInfo ? this.lectureInfo.end_time - this.lectureInfo.start_time : 0
    },
  },

  methods: {
    async init() {
      if (this.testing) {
        this.lectureInfo = analyticsData.lectureInfo
        this.students = analyticsData.students
        this.intervalsPresent = analyticsData.intervals_present
        this.present = analyticsData.present
        this.quesCount = analyticsData.question_count
        this.upvoteCount = analyticsData.upvotes
        this.avgUs = analyticsData.avgUs
      } else {
        let vals = await Promise.all(
          ['/info', '/students', '/general', '/question-counts', '/upvote-counts', '/questions'].map(e => this.get(e))
        );
        this.lectureInfo = vals[0]
        this.students = vals[1]
        this.present = vals[2].present
        this.avgUs = vals[2].avg_us
        this.quesCount = vals[3]
        this.upvoteCount = vals[4]
        this.questions = vals[5]
      }
    },
    getPresent(uid) {
      return Math.round((this.present[uid] / this.lectureLength) * 100)
    },
    getQuesCount(uid) {
      return this.quesCount[uid] || 0
    },
    getUpvoteCount(uid) {
      return this.upvoteCount[uid] || 0
    },
    getAvgUs(uid) {
      return this.avgUs[uid] || 'ERR'
    },
    get(addy) {
      return get(`/analytics/lecture/${this.lecture_uid}${addy}`).then(d => {
        if (d.success)
          return d.data
        log('failed', d.error)
      })
    },
    redirectStudentPage(student_uid) {
      this.$router.push({ name: 'LectureAnalyticsStudent', params: { lecture_uid: this.lecture_uid, student_uid: student_uid } })
    },
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

