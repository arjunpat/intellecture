<template>
  <v-card outlined style="border-radius: 10px;" class="mainfont px-2 mt-4 mb-4">
    <v-card-title class="lecture-title">
      <span class="mr-2">{{ lecture.name }}</span>
      <v-menu :close-on-content-click="false" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-if="isScheduled(lecture)"
            class="px-2"
            color="primary"
            text
            v-on="on"
            v-bind="attrs"
            @click.prevent="copyLink(lecture.uid)"
            @mousedown.stop
            @touchstart.native.stop
          >
            <v-icon>mdi-link-variant</v-icon>Copy join link
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-text-field
              :value="getLinkToRoom(lecture.uid)"
              :id="`room-link-${lecture.uid}`"
              label="Room link"
              outlined
              hide-details
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-card-title>
    <v-row class="px-3">
      <v-col cols="12" sm="4" :class="$vuetify.breakpoint.smAndUp && 'text-left'">
        <h3 class="subtitle font-weight-regular" v-if="lecture.end_time">
          {{ lectureLengthString(lecture.end_time - lecture.start_time) }}
          long
        </h3>
        <div v-else>
          <h3 class="live" v-if="lecture.start_time && !lecture.end_time">LIVE</h3>
          <h3 v-else-if="lecture.scheduled_start" class="future">SCHEDULED</h3>
        </div>
      </v-col>
      <v-col cols="12" sm="4" :class="$vuetify.breakpoint.smAndUp && 'text-center'">
        <h3
          class="subtitle font-weight-regular"
          v-if="lecture.end_time"
        >{{ dateToString(lecture.end_time) }}</h3>
        <h3
          class="subtitle font-weight-regular"
          v-else-if="lecture.start_time && !lecture.end_time"
        >Live Now</h3>
        <h3
          class="subtitle font-weight-regular"
          v-else-if="isScheduled(lecture)"
        >Scheduled for {{ new Date(lecture.scheduled_start).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }) }}</h3>
      </v-col>
      <v-col cols="12" sm="4" :class="$vuetify.breakpoint.smAndUp && 'text-right'">
        <!-- <h3 class="subtitle font-weight-regular" v-if="lecture.end_time">
                {{ lecture.student_count }}
                students
        </h3>-->
        <v-btn
          v-if="lecture.end_time"
          outlined
          @click="$router.push({ path: '/lecture-analytics/' + lecture.uid})"
        >See analytics</v-btn>
        <v-btn
          v-else-if="lecture.start_time && !lecture.end_time"
          outlined
          color="red"
          @click="$router.push({ path: '/lecture/' + lecture.uid})"
        >Join lecture</v-btn>
        <v-btn
          v-else-if="lecture.scheduled_start"
          outlined
          color="#81c784"
          @click="$router.push({ path: '/lecture/' + lecture.uid})"
        >Start now</v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { getLinkToRoom, durationToString, dateToString } from '@/helpers'
export default {
  props: ['lecture'],
  methods: {
    getLinkToRoom,
    dateToString,
    isScheduled(lecture) {
      return lecture.scheduled_start && !lecture.start_time && !lecture.end_time
    },
    lectureLengthString(lectureLength) {
      let duration = durationToString(lectureLength, true)
      let durationArray = duration.split(' ')
      if (durationArray[durationArray.length - 1].includes('second')) {
        if (durationArray.length == 2) {
          duration = '< 1 minute'
        } else {
          durationArray.splice(durationArray.length - 2, 2)
          duration = durationArray.join(' ')
        }
      }
      return duration
    },
    copyLink(lecture_uid) {
      setTimeout(() => {
        let codeToCopy = document.getElementById(`room-link-${lecture_uid}`)
        codeToCopy.select()

        try {
          let successful = document.execCommand('copy')
          this.$emit('notify', [ 'info', 'Room link copied to clipboard' ])
        } catch (err) {
          this.$emit('notify', [ 'error', 'There was an error copying the link' ])
        }
      }, 300)
    },
  },
}
</script>

<style scoped>
.live {
  background-color: red;
  color: white;
  border-radius: 20px;
  padding: 7px;
  width: 80px;
  text-align: center;
}
.future {
  background-color: #81c784;
  color: white;
  width: 140px;
  border-radius: 20px;
  padding: 7px;
  text-align: center;
}
.lecture-title {
  font-weight: bold;
  font-size: 25px;
}

.subtitle {
  font-size: 18px;
  color: #444;
}
</style>