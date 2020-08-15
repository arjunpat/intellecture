<template>
  <v-container fluid>
    <v-row class="fill-height" justify="center">
      <v-col cols="12" lg="7" md="9" sm="12">
        <v-card class="mainfont px-2 py-2">
          <v-card-title id="classTitle">{{ classInfo.name }}</v-card-title>
          <v-card-subtitle class="mt-2 subtitle" style="line-height: 30px;">
            {{ classInfo.section }}
            <br />
            {{ lectures.length }} lectures
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-row
      class="fill-height"
      justify="center"
    >
      <v-col cols="12" lg="6" md="8" sm="11">
        <v-card class="mainfont px-2 py-2 inner-shadow" id="newLectureCard" :style="{ backgroundColor: '#f7f7f7' }">
          <v-card-title 
            class="font-weight-regular ml-n2"
            :style="{
              fontSize: $vuetify.breakpoint.xs ? '18px' : '20px'
            }"
          >Create a new lecture</v-card-title>
          <v-btn id="addBtn" fab dark :color="addColor" :style="{ transform: addRotate, top: '10px', right: '10px' }" @click="showNewLecture = !showNewLecture">
            <v-icon dark large>mdi-plus</v-icon>
          </v-btn>
          <v-expand-transition>
            <div v-show="showNewLecture" class="px-4">
              <v-row  
                align="center"
                class="mb-0"
              >
                <v-col class="pa-0">
                  <v-text-field
                    class="mainfont white"
                    label="Lecture name"
                    hint="What's the name of the new lecture?"
                    v-model="newLectureName"
                    hide-details
                    outlined
                    autocomplete="off"
                    @keyup.enter="create"
                  ></v-text-field>
                </v-col>
                <v-col cols="auto" class="pr-0">
                  <v-btn small text fab color="#aae691ff" @click="create">
                    <v-icon v-if="!scheduled">arrow_forward</v-icon>
                    <v-icon v-else>check</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-expand-transition leave-absolute>
                  <v-btn
                    v-if="!scheduleInfo.show"
                    block 
                    color="light-green lighten-2"
                    outlined
                    style="font-family: var(--main-font);"
                    @click="scheduleInfo.show = true"
                  >Schedule a time</v-btn>
                </v-expand-transition>
                <v-col cols="12" class="py-0">
                  <v-fade-transition leave-absolute>
                    <ScheduleDateTime
                      v-model="scheduleInfo"
                    />
                  </v-fade-transition>
                </v-col>
              </v-row>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="fill-height" justify="center" v-for="lecture in lectures" :key="lecture.uid">
      <v-col cols="12" lg="6" md="8" sm="11">
        <v-card
          hover
          outlined
          class="mainfont px-2 py-2"
          :to="lecture.end_time ? '/lecture-analytics/' + lecture.uid : '/lecture/' + lecture.uid"
        >
          <v-card-title id="lectureTitle">
            <span class="mr-2">{{ lecture.name }}</span> 
            <v-menu
              :close-on-content-click="false"
              offset-y
            >
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
                  <v-icon>mdi-link-variant</v-icon>
                  Copy link
                </v-btn>
              </template>
              <v-card>
                <v-card-text>
                  <v-text-field
                    :value="getLink(lecture.uid)"
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
                <h3 class="future" v-else-if="lecture.scheduled_start">SCHEDULED</h3>
              </div>
            </v-col>
            <v-col cols="12" sm="4" :class="$vuetify.breakpoint.smAndUp && 'text-center'">
              <h3 class="subtitle font-weight-regular" v-if="lecture.end_time">
                {{ lecture.student_count }}
                students
              </h3>
            </v-col>
            <v-col cols="12" sm="4" :class="$vuetify.breakpoint.smAndUp && 'text-right'">
              <h3
                class="subtitle font-weight-regular"
                v-if="lecture.end_time"
              >{{ timeSinceEndTimeString(lecture.end_time) }}</h3>
              <h3 class="subtitle font-weight-regular" v-else-if="lecture.start_time && !lecture.end_time">Live Now</h3>
              <h3
                class="subtitle font-weight-regular"
                v-else-if="isScheduled(lecture)"
              >Scheduled for {{ new Date(lecture.scheduled_start).toLocaleString() }}</h3>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  post,
  get,
  log,
  durationToString,
  dateToString,
  pad,
  loadClasses,
  getLinkToRoom,
} from '@/helpers.js'
import { mdiAndroidStudio } from '@mdi/js'
import { mapState } from 'vuex'
import ScheduleDateTime from '@/components/ScheduleDateTime'

export default {
  props: {
    class_uid: { type: String },
  },

  components: {
    ScheduleDateTime
  },

  data() {
    return {
      testing: false,
      lectures: [],
      classInfo: {},
      showNewLecture: false,
      newLectureName: '',
      addColor: '#81c784ff',
      addRotate: 'rotate(0deg)',
      scheduleInfo: {
        show: false,
        datetime: Date.now()
      },
    }
  },

  computed: {
    scheduled() {
      return this.scheduleInfo.show
    },
    ...mapState(['classes'])
  },

  watch: {
    showNewLecture(showNewLecture) {
      this.animateNewLecture(showNewLecture)

      if (!showNewLecture)
        this.resetNewLecture()
    }
  },

  methods: {
    isScheduled(lecture) {
      return lecture.scheduled_start && !lecture.start_time && !lecture.end_time
    },
    getTimeFromLecture(lecture) {
      return lecture.end_time || lecture.start_time || lecture.scheduled_start
    },
    async init() {
      if (this.testing) {
      } else {
        await loadClasses();
        this.classInfo = this.classes.find(cla => cla.uid == this.class_uid);

        this.lectures = await get(`/lectures/by-class/${this.class_uid}`).then(
          (d) => {
            if (d.success) return d.data
            log('failed', e)
          }
        )
        this.lectures.sort((a, b) => this.getTimeFromLecture(b) - this.getTimeFromLecture(a))
      }
    },
    lectureLengthString(lectureLength) {
      var duration = durationToString(lectureLength, true)
      var durationArray = duration.split(' ')
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
    timeSinceEndTimeString(endTime) {
      return dateToString(endTime)
    },
    animateNewLecture(show) {
      if (show) {
        this.addColor = 'red'
        this.addRotate = 'rotate(45deg)'
      } else {
        this.addColor = '#81c784ff'
        this.addRotate = 'rotate(0deg)'
      }
    },
    resetNewLecture() {
      this.scheduleInfo = {
        show: false,
        datetime: Date.now()
      }
      this.newLectureName = ''
      this.showNewLecture = false
    },
    create() {
      if (!this.scheduled) {
        post('/lectures/create', {
          class_uid: this.classInfo.uid,
          name: this.newLectureName,
        }).then((data) => {
          this.$router.push({ path: '/lecture/' + data.data.lecture_uid })
        })
      } else {
        post('/lectures/create', {
          class_uid: this.classInfo.uid,
          name: this.newLectureName,
          scheduled_start: this.scheduleInfo.datetime,
        }).then((data) => {
          if (!data.success) {
            this.$emit('error', 'Scheduled time must be in the future')
          } else {
            this.$emit('info', 'Your lecture has been scheduled!')
            this.resetNewLecture()
            this.init()
          }
        })
      }
    },
    copyLink(lecture_uid) {
      setTimeout(() => {
        let codeToCopy = document.getElementById(`room-link-${lecture_uid}`)
        codeToCopy.select()

        try {
          var successful = document.execCommand('copy')
          this.$emit('info', 'Room link copied to clipboard')
        } catch (err) {
          this.$emit('error', 'There was an error copying the link')
        }
      }, 300)
    },
    getLink(lecture_uid) {
      return getLinkToRoom(lecture_uid)
    },
  },

  mounted() {
    this.init()
  },
}
</script>

<style scoped>
.modal {
  width: 100%;
  height: 450px;
  overflow: hidden;
}
#classTitle {
  font-size: 50px;
  font-weight: 900;
}
.live {
  background-color: red;
  color: white;
  border-radius: 20px;
  padding: 7px;
  width:80px;
  text-align: center;
}
.future {
  background-color: #aae691ff;
  color: white;
  width:140px;
  border-radius: 20px;
  padding: 7px;
  text-align: center;
}
#lectureTitle {
  font-weight: bold;
  font-size: 25px;
}

.subtitle {
  font-size: 18px;
  color: gray;
}

#addBtn {
  position: absolute;
  transition: 0.3s all;
}

#newLectureCard {
  transition: 0.3s all;
}

.inner-shadow {
  box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.25) !important;
}
</style>
