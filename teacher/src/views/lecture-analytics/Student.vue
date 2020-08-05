<template>
  <v-container class="fill-height" fluid>
    <v-row class="fill-height" justify="center">
      <v-col
        cols="12"
        sm="12"
        md="10"
        lg="8"
      >
        <v-card v-if="student">
          <v-card-title>
            <v-avatar 
              class="mr-2"
              :size="$vuetify.breakpoint.xs ? '36' : '48'"
            >
              <img :src="student.photo">
            </v-avatar>
            <span 
              :class="$vuetify.breakpoint.xs ? 'text-h6' : 'text-h4'"
            >{{ `${student.first_name} ${student.last_name}` }}</span>
          </v-card-title>
          <v-card-text>
            <v-row class="text-center">
              <v-col
                cols="12"
                sm="3"
              >
                <div class="mb-2">Present-ness</div>
                <v-progress-circular
                  :width="3"
                  :value="presentPercent"
                  :size="size"
                  :rotate="-90"
                >{{ `${presentPercent}%` }}</v-progress-circular>
              </v-col>
              <v-col
                cols="12"
                sm="3"
              >
                <div class="mb-2">Avg. Understanding</div>
                <v-progress-circular
                  :width="3"
                  :value="understanding"
                  :size="size"
                  :rotate="-90"
                >{{ `${understanding}%` }}</v-progress-circular>
              </v-col>
              <v-col
                cols="12"
                sm="3"
              >
                <div class="mb-2">Questions Asked</div>
                <div :style="{ fontSize: `${size}px`, height: `${size}px`, position: 'relative' }">
                  <span style="position: absolute; bottom: 0;">1</span>
                </div>
              </v-col>
              <v-col
                cols="12"
                sm="3"
              >
                Questions Upvoted
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import analyticsData from '@/testdata/analyticsData.json'

export default {
  props: {
    lecture_uid: { type: String, required: true },
    student_uid: { type: String, required: true },
  },

  data() {
    return {
      testing: true,

      size: 100,
      
      student: null,
      lectureInfo: null,
      present: 0,
      understanding: 0,
    }
  },

  computed: {
    lectureLength() {
      return this.lectureInfo ? this.lectureInfo.end_time - this.lectureInfo.start_time : 0
    },
    presentPercent() {
      return Math.round((this.present / this.lectureLength) * 100)
    }
  },

  created() {
    if (this.testing) {
      this.student = analyticsData.student
      this.lectureInfo = analyticsData.lectureInfo
      this.present = analyticsData.studentPresent
      this.understanding = analyticsData.studentUnderstanding
    }
  },
}
</script>