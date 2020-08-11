<template>
  <span v-if="loaded">
    <router-view
      v-if="$route.name === 'LectureAnalytics'"
      :lecture_uid="lecture_uid"
      :lectureInfo="lectureInfo"
      :studentTableData="studentTableData"
      :questionTableData="questionTableData"
      :curQuestionUpvoters="curQuestionUpvoters"
      @showUpvoters="loadUpvoters"
    ></router-view>
    <router-view
      v-else-if="$route.name === 'LectureAnalyticsStudent'"
      :studentData="curStudentData"
      :maxUnderstanding="maxUnderstanding"
      :lectureInfo="lectureInfo"
    ></router-view> 
  </span>
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
    this.loaded = false
    this.init().then(() => {
      if (this.$route.name === 'LectureAnalyticsStudent')
        return this.initStudentPage()
      return
    }).then(() => {
      this.loaded = true
    })
  },

  watch: {
    $route: {
      handler(route) {
        if (route.name === 'LectureAnalyticsStudent') {
          this.loaded = false
          this.initStudentPage().then(() => this.loaded = true)
        }
      }
    }
  },

  data() {
    return {
      testing: false,

      loaded: false,
      maxUnderstanding: 10,
      
      // Overall lecture data
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

      // Student-specific data
      upvotes: [],
      intervals: [],

      // Specific question data
      curQuestionUpvoters: null, // null means loading upvoters
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
    curStudentData() {
      if (!this.student_uid) 
        return null
      return {
        student: this.getStudent(this.student_uid),
        present: this.getPresent(this.student_uid),
        understanding: this.getAvgUs(this.student_uid),
        quesCount: this.getQuesCount(this.student_uid),
        upvoteCount: this.getUpvoteCount(this.student_uid),
        questions: this.getQuestions(this.student_uid),
        upvotedQuestions: this.upvotedQuestions,
        intervals: this.intervals,
      }
    },
    upvotedQuestions() {
      // Get current student's upvoted questions
      return this.upvotes.map(upvote => {
        return {
          ...upvote,
          question: this.getQuestion(upvote.question_uid)
        }
      })
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
        this.scores = await this.get('/scores'); // can delayed until after the others
      }
    },
    async initStudentPage() {
      this.upvotes = await this.get(`/student/${this.student_uid}/upvotes`)
      this.intervals = await this.get(`/student/${this.student_uid}/intervals`)
    },
    async loadUpvoters(question_uid) {
      this.curQuestionUpvoters = null
      let upvotes = await this.get(`/question/${question_uid}/upvotes`)
      this.curQuestionUpvoters = upvotes.map((upvote) => {
        return {
          ...this.getStudent(upvote.account_uid),
          upvoteTime: upvote.elapsed,
        }
      })
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
    getQuestions(uid) {
      return this.questions.filter(question => question.creator_uid === uid)
    },
    getQuestion(question_uid) {
      return this.questions.find(question => question.question_uid === question_uid)
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