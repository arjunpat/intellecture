<template>
  <router-view
    v-if="$route.name === 'LectureAnalytics'"
    :lecture_uid="lecture_uid"
    :lectureInfo="lectureInfo"
    :numStudents="students.length"
    :studentTableData="studentTableData"
    :questionTableData="questionTableData"
  ></router-view>
  <router-view
    v-else-if="$route.name === 'LectureAnalyticsStudent'"
    :student="curStudent"
    :present="getPresent(student_uid)"
    :understanding="getAvgUs(student_uid)"
    :quesCount="getQuesCount(student_uid)"
    :upvoteCount="getUpvoteCount(student_uid)"
    :maxUnderstanding="maxUnderstanding"
  ></router-view> 
</template>

<script>
import { get, log } from '@/helpers.js'
import analyticsData from '@/testdata/analyticsData.json'

export default {
  props: {
    lecture_uid: { type: String, required: true },
    student_uid: { type: String, default: '' },
  },

  mounted() {
    this.init()
  },

  data() {
    return {
      testing: false,

      maxUnderstanding: 10,

      lectureInfo: {},
      students: [],
      stats: {
        first_join: {},
        question_counts: {},
        upvote_counts: {},
        avg_us: {},
        present: {}
      },
      questions: [],
    }
  },
  
  computed: {
    studentTableData() {
      return this.students.map((student) => {
        let uid = student.account_uid
        return {
          ...student,
          name: `${student.first_name} ${student.last_name}`,
          present: this.getPresent(uid),
          understanding: this.getAvgUs(uid),
          quesCount: this.getQuesCount(uid),
          upvoteCount: this.getUpvoteCount(uid),
          firstJoin: this.getFirstJoin(uid)
        }
      })
    },
    questionTableData() {
      return this.questions.map((question) => {
        return {
          ...question,
          student: this.getStudent(question.creator_uid)
        }
      })
    },
    lectureLength() {
      return this.lectureInfo ? this.lectureInfo.end_time - this.lectureInfo.start_time : 0
    },
    curStudent() {
      if (!this.student_uid) 
        return null
      return this.getStudent(this.student_uid)
    },
  },

  methods: {
    async init() {
      if (this.testing) {
        this.lectureInfo = analyticsData.lectureInfo
        this.students = analyticsData.students
        this.stats = analyticsData.stats
        this.questions = analyticsData.questions
      } else {
        let vals = await Promise.all(
          ['/info', '/students', '/stats', '/questions'].map(e => this.get(e))
        );
        this.lectureInfo = vals[0]
        this.students = vals[1]
        this.stats = vals[2]
        this.questions = vals[3]
      }
    },
    getPresent(uid) {
      return Math.round((this.stats.present[uid] / this.lectureLength) * 100)
    },
    getQuesCount(uid) {
      return this.stats.question_counts[uid] || 0
    },
    getUpvoteCount(uid) {
      return this.stats.upvote_counts[uid] || 0
    },
    getAvgUs(uid) {
      return this.stats.avg_us[uid] || 'ERR'
    },
    getFirstJoin(uid) {
      return this.stats.first_join[uid]
    },
    getStudent(uid) {
      return this.students.find(student => student.account_uid === uid)
    },
    get(addy) {
      return get(`/analytics/lecture/${this.lecture_uid}${addy}`).then(d => {
        if (d.success)
          return d.data
        log('failed', d.error)
      })
    },
  },
}
</script>