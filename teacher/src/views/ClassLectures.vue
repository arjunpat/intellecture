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

    <v-row class="fill-height" justify="center">
      <v-col cols="12" lg="6" md="8" sm="11">
        <v-card
          class="mainfont px-2 py-2 inner-shadow"
          id="newLectureCard"
          :style="{ backgroundColor: '#f7f7f7' }"
        >
          <v-card-title
            class="font-weight-regular ml-n2"
            :style="{
              fontSize: $vuetify.breakpoint.xs ? '18px' : '20px'
            }"
          >Create a new lecture</v-card-title>
          <v-btn
            id="addBtn"
            fab
            dark
            :color="addColor"
            :style="{ transform: addRotate, top: '10px', right: '10px' }"
            @click="showNewLecture = !showNewLecture"
          >
            <v-icon dark large>mdi-plus</v-icon>
          </v-btn>
          <v-expand-transition>
            <div v-show="showNewLecture" class="px-4">
              <v-row align="center" class="mb-0">
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
                    <ScheduleDateTime v-model="scheduleInfo" />
                  </v-fade-transition>
                </v-col>
              </v-row>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="fill-height" justify="center">
      <v-col cols="12" lg="6" md="8" sm="11">
        <div v-if="lectures.filter(e => !e.end_time).length !== 0" class="mb-12">
          <h1>Current Lectures</h1>
          <v-divider></v-divider>
          <LectureCard
            v-for="lecture in lectures.filter(e => !e.end_time)"
            :key="lecture.uid"
            :lecture="lecture"
            @notify="notify"
          ></LectureCard>
        </div>
        <div v-if="lectures.filter(e => !!e.end_time).length !== 0">
          <h1>Lecture History</h1>
          <v-divider></v-divider>
          <LectureCard
            v-for="lecture in lectures.filter(e => !!e.end_time)"
            :key="lecture.uid"
            :lecture="lecture"
            @notify="notify"
          ></LectureCard>
        </div>
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
  pad,
  loadClasses,
} from '@/helpers.js'
import { mdiAndroidStudio } from '@mdi/js'
import { mapState } from 'vuex'
import LectureCard from '@/components/class-lectures/LectureCard'
import ScheduleDateTime from '@/components/ScheduleDateTime'

export default {
  props: {
    class_uid: { type: String },
  },

  components: {
    ScheduleDateTime,
    LectureCard,
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
        datetime: Date.now(),
      },
    }
  },

  computed: {
    scheduled() {
      return this.scheduleInfo.show
    },
    ...mapState(['classes']),
  },

  watch: {
    showNewLecture(showNewLecture) {
      this.animateNewLecture(showNewLecture)

      if (!showNewLecture) this.resetNewLecture()
    },
  },

  methods: {
    getTimeFromLecture(lecture) {
      return lecture.end_time || lecture.start_time || lecture.scheduled_start
    },
    async init() {
      if (this.testing) {
      } else {
        await loadClasses()
        this.classInfo = this.classes.find((cla) => cla.uid == this.class_uid)

        this.lectures = await get(`/lectures/by-class/${this.class_uid}`).then(
          (d) => {
            if (d.success) return d.data
            log('failed', e)
          }
        )
        this.lectures.sort(
          (a, b) => this.getTimeFromLecture(b) - this.getTimeFromLecture(a)
        )
      }
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
        datetime: Date.now(),
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
    notify([type, text]) {
      this.$emit(type, text);
    }
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

.subtitle {
  font-size: 18px;
  color: #444;
}
</style>
