<template>
  <v-container>

      
    
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
    class_uid: { type: String },
  },

  data() {
    return {
      testing: false
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
        
      } else {
          /*
        this.lectureInfo = await this.get('/info')
        let students = await this.get('/students')
        this.present = await this.get('/present')
        this.quesCount = await this.get('/question-counts')

        this.lectureLength = this.lectureInfo.end_time - this.lectureInfo.start_time
        this.students = students*/

      }
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

