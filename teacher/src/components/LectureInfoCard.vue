<template>
  <v-card>
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
          {{ studentsString }}
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