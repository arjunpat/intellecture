<template>
  <v-container fluid>
    <v-row class="fill-height" justify="center">
      <v-col cols="12" lg="6" md="6" sm="9">
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
      <v-col cols="12" lg="5" md="5" sm="8">
        <v-card
          class="mainfont px-2 py-2 inner-shadow"
          id="newLectureCard"
          :style="{ height: newLectureHeight, backgroundColor: '#f7f7f7' }"
        >
          <v-card-title class="font-weight-regular">Create a new lecture</v-card-title>
          <v-btn
            id="addBtn"
            fab
            dark
            :color="addColor"
            :style="{ transform: addRotate, top: '10px', right: '10px' }"
            @click="animateNewLecture()"
          >
            <v-icon dark large>mdi-plus</v-icon>
          </v-btn>
          <v-slide-y-transition>
            <v-row v-if="showNewLecture">
              <v-text-field
                class="mainfont ml-7"
                label="Lecture name"
                hint="What's the name of the new lecture?"
                v-model="newLectureName"
                @keyup.enter="create"
              ></v-text-field>
              <v-dialog v-model="dialog" persistent max-width="290">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    style="font-family: var(--main-font);align-self:center;margin-left:10px;"
                    dark
                    outlined
                    small
                    v-bind="attrs"
                    v-on="on"
                    color="light-green lighten-2"
                  >{{ scheduled ? parsedTime : "now"}}</v-btn>
                </template>
                <v-card class="modal">
                  <v-time-picker v-if="page==1" v-model="time" ampm-in-title color="#65bb6aff"></v-time-picker>
                  <v-date-picker v-model="date" v-if="page==2" color="#65bb6aff"></v-date-picker>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text dark @click="dialog = false" v-if="page==1">Cancel</v-btn>
                    <v-btn
                      color="#aae691ff"
                      dark
                      text
                      @click="page+=1"
                      v-if="page==1&&this.time!=``"
                    >Next</v-btn>
                    <v-btn color="red" text dark @click="page-=1" v-if="page==2">Back</v-btn>
                    <v-btn
                      color="#aae691ff"
                      dark
                      text
                      @click="confirmSchedule"
                      v-if="page==2&&new Date(this.date + `T` + this.time + `:00`).getTime()>new Date().getTime()"
                    >Done</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-btn small text color="#aae691ff" dark class="mt-5 mr-4 ml-1" @click="create">
                <v-icon v-if="!scheduled">arrow_forward</v-icon>
                <v-icon v-else>event</v-icon>
              </v-btn>
            </v-row>
          </v-slide-y-transition>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="fill-height" justify="center" v-for="lecture in lectures" :key="lecture.uid">
      <v-col cols="12" lg="5" md="5" sm="8">
        <v-card
          hover
          outlined
          class="mainfont px-2 py-2"
          :to="lecture.end_time ? '/lecture-analytics/' + lecture.uid : '/lecture/' + lecture.uid"
        >
          <v-card-title id="lectureTitle">{{ lecture.name }}</v-card-title>
          <v-row class="pl-3">
            <v-col cols="4">
              <h3 class="subtitle font-weight-regular" v-if="lecture.end_time">
                {{ lectureLengthString(lecture.end_time - lecture.start_time) }}
                long
              </h3>
              <div v-else>
                <h3 class="live" v-if="lecture.start_time && !lecture.end_time">LIVE</h3>
                <h3 class="future" v-else-if="lecture.scheduled_start">SCHEDULED</h3>
              </div>
            </v-col>
            <v-col cols="4">
              <h3 class="subtitle font-weight-regular">
                {{ lecture.student_count }}
                students
              </h3>
            </v-col>
            <v-col cols="4">
              <h3
                class="subtitle font-weight-regular"
                v-if="lecture.end_time"
              >{{ timeSinceEndTimeString(lecture.end_time) }}</h3>
              <h3 class="subtitle font-weight-regular" v-else-if="lecture.start_time && !lecture.end_time">Live Now</h3>
              <h3
                class="subtitle font-weight-regular"
                v-else-if="lecture.scheduled_start>new Date().getTime()"
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
  loadClasses
} from '@/helpers.js'
import { mdiAndroidStudio } from '@mdi/js'
import { mapState } from 'vuex'

export default {
  props: {
    class_uid: { type: String },
  },

  data() {
    return {
      testing: false,
      lectures: [],
      classInfo: {},
      time: '',
      picker: false,
      page: 1,
      date: '',
      scheduled: false,
      dialog: false,
      showNewLecture: false,
      newLectureName: '',
      newLectureHeight: '80px',
      addColor: '#81c784ff',
      addRotate: 'rotate(0deg)',
    }
  },
  computed: {
    parsedTime() {
      let d = new Date(this.date + 'T' + this.time + ':00')
      return `${d.getMonth()}/${d.getDay()}, ${d.getHours()}:${pad(d.getMinutes(), 2)}`
    },
    ...mapState(['classes'])
  },
  methods: {
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
    confirmSchedule() {
      let datetime = new Date(this.date + 'T' + this.time + ':00')
      if (datetime.getTime() > new Date().getTime()) {
        this.dialog = false
        this.scheduled = true
      }
    },

    animateNewLecture() {
      if (!this.showNewLecture) {
        this.showNewLecture = true
        this.newLectureHeight = '150px'
        this.addColor = 'red'
        this.addRotate = 'rotate(45deg)'
      } else {
        this.showNewLecture = false
        this.newLectureHeight = '80px'
        this.addColor = '#81c784ff'
        this.addRotate = 'rotate(0deg)'
      }
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
        var datetime = Date.parse(this.date + 'T' + this.time + ':00')
        post('/lectures/create', {
          class_uid: this.classInfo.uid,
          name: this.newLectureName,
          scheduled_start: datetime,
        }).then((data) => {
          console.log(data)
          if (!data.success) {
            this.error = 'Scheduled time must be in the future'
            this.formErrors = true
          } else {
            this.$router.push({ name: 'Dashboard' })
          }
        })
      }
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
  width: 70px;
  text-align: center;
}
.future {
  background-color: #aae691ff;
  color: white;
  border-radius: 20px;
  padding: 7px;
  width: 100px;
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
  height: 80px;
}

.inner-shadow {
  box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.25) !important;
}
</style>
