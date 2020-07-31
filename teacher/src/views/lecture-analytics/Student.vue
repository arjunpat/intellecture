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
          understanding: 'TEST%',
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
        this.lectureInfo = await this.get('/info')
        this.students = await this.get('/students')
        this.present = await this.get('/present')
        this.quesCount = await this.get('/question-counts')
        this.upvoteCount = await this.get('/upvote-counts')

        this.get(`/student/${this.students[0].account_uid}/questions`)
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
    get(addy) {
      return get(`/analytics/lecture/${this.lecture_uid}${addy}`).then(d => {
        if (d.success)
          return d.data
        log('failed', e)
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

