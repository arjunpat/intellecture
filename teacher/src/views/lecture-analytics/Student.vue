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

        <StudentTable
          :data="studentTableData"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { post, get, log } from '@/helpers.js'
import analyticsData from '@/testdata/analyticsData.json'
import Dialog from '@/components/Dialog'
import LectureInfoCard from '@/components/LectureInfoCard'
import StudentTable from '@/components/analytics/StudentTable'

export default {
  props: {
    lecture_uid: { type: String },
  },

  components: {
    Dialog,
    LectureInfoCard,
    StudentTable,
  },

  data() {
    return {
      testing: false,
      lectureInfo: {},
      students: [],
      present: {},
      quesCount: {},
      upvoteCount: {},
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
        this.quesUpvotes = analyticsData.upvotes
      } else {
        let vals = await Promise.all(
          ['/info', '/students', '/general', '/question-counts', '/upvote-counts'].map(e => this.get(e))
        );
        this.lectureInfo = vals[0]
        this.students = vals[1]
        this.present = vals[2].present
        this.avgUs = vals[2].avg_us
        this.quesCount = vals[3]
        this.upvoteCount = vals[4]
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

