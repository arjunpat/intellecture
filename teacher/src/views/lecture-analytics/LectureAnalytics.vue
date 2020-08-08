<template>
  <router-view
    v-if="$route.name === 'LectureAnalytics'"
    :lecture_uid="lecture_uid"
    :lectureInfo="lectureInfo"
    :numStudents="students.length"
    :studentTableData="studentTableData"
    :questions="questions"
  ></router-view>
  <router-view
    v-else-if="$route.name === 'LectureAnalyticsStudent'"
    :student="curStudent"
    :present="getPresent(student_uid)"
    :understanding="getAvgUs(student_uid)"
    :quesCount="getQuesCount(student_uid)"
    :upvoteCount="getUpvoteCount(student_uid)"
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
      present: {},
      avgUs: {},
      quesCount: {},
      upvoteCount: {},
      questions: [],
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
    curStudent() {
      if (!this.student_uid) 
        return null
      return this.students.find(student => student.account_uid === this.student_uid)
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
          ['/info', '/students', '/stats', '/questions'].map(e => this.get(e))
        );
        this.lectureInfo = vals[0]
        this.students = vals[1]
        this.present = vals[2].present
        this.avgUs = vals[2].avg_us
        this.quesCount = vals[2].question_counts;
        this.upvoteCount = vals[2].upvote_counts;
        this.questions = vals[3]
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
      return Math.round((this.avgUs[uid] / this.maxUnderstanding) * 100) || 'ERR'
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