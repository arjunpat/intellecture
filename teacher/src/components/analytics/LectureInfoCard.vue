<template>
  <v-card>
    <div class="pl-2 py-1 green white--text mainfont">{{ lectureInfo.class_name }} - {{ lectureInfo.class_section }}</div>
    <v-card-text class="black--text mainfont">
      <div class="mb-3 mt-3" :style="{ fontSize: $vuetify.breakpoint.smAndDown ? '35px' : '40px' }">
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
          {{ studentsString }}
        </v-col>
        <v-col
          cols="12"
          sm="auto"
        >
          <v-icon>mdi-clock-outline</v-icon>
          {{ startTimeString }}
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { durationToString, dateToString, getQuantityString } from '@/helpers.js'

export default {
  props: {
    lectureInfo: { type: Object, required: true },
    numStudents: { type: Number, required: true },
  },

  computed: {
    lectureLengthString() {
      return durationToString(this.lectureLength, true)
    },
    timeSinceEndTimeString() {
      return dateToString(this.lectureInfo.end_time)
    },
    startTimeString() {
      let date = new Date(this.lectureInfo.start_time).toLocaleString('en-us', { year: 'numeric', month: 'long', day: 'numeric' })
      let time = new Date(this.lectureInfo.start_time).toLocaleString('en-us', { timeStyle: 'short' })
      return `${date} at ${time}`
    },
    lectureLength() {
      return this.lectureInfo ? this.lectureInfo.end_time - this.lectureInfo.start_time : 0
    },
    studentsString() {
      return getQuantityString(this.numStudents, 'student')
    },
  },

  methods: {

  },
}
</script>