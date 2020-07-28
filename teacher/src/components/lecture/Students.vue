<template>
  <v-row align="center" justify="center">
    <v-row align="center" justify="center">
      <v-col cols="8">
        <ul style="list-style-type: none">
          <li v-for="student in students" v-bind:key="student.uid" v-show="student.inLecture">
            <v-banner style="font-family: var(--main-font);">
              <v-hover v-slot:default="{ hover }">
                <span>
                  <v-avatar size="42px" class="mr-3">
                    <img alt="Avatar" :src="student.photo" style="background-color: #F5F5F5;" />
                  </v-avatar>
                  {{ student.first_name }} {{ student.last_name }}
                  <transition name="fade">
                    <v-btn
                      v-if="hover"
                      class="ml-3"
                      text
                      color="red"
                      @click.stop="showDialog = true; setActive(student);"
                    >Remove</v-btn>
                  </transition>
                </span>
              </v-hover>
              <template v-slot:actions>
                <span style="font-size: 15px; color: #BDBDBD;">Joined {{ formatUnix(student.ts) }}</span>
              </template>
            </v-banner>
          </li>

          <li
            v-if="showNoStudentsMsg" 
          >
            <div 
              class="text-center heading-4"
              :style="{fontWeight: 'normal', fontSize: '25px'}"
            >
              No students have joined the lecture!
            </div>
            <div class="text-center subtitle-1">Have students go to <a>join.intellecture.app</a> and enter the code <span style="background-color: #eee; padding: 3px 10px; border-radius: 5px; font-weight: bold;">{{ joinCode }}</span> to join.</div>
          </li>

          <Dialog
            v-model="showDialog"
            :lowerHeader="true"
            :header="dialogHeader"
            @submit="removeStudent()"
            :width="600"
            btnColor="red"
            btnText="Remove"
          >
            <template v-slot:content>
              <v-checkbox
                v-model="preventFromJoining"
                color="success"
                label="Prevent from joining again"
              ></v-checkbox>
            </template>
          </Dialog>

          <!-- EXAMPLE QUESTION -->
          <TutorialDisplay
            :show="showTutorial === 6"
            backgroundColor="white"
            @next="nextTutorial(); clickTab(0)"
            @cancel="resetTutorial()"
            bottom
          >
            <template v-slot:title>Students</template>
            <template
              v-slot:explanation
            >Here, you can see a list of all the students that have joined your lecture.</template>
            <v-expand-transition>
              <li v-if="showTutorial == 6">
                <v-banner style="font-family: var(--main-font);">
                  <v-avatar size="42px" class="mr-3">
                    <!-- CHANGE LATER -->
                    <img
                      alt="Avatar"
                      src="https://i.imgur.com/4Wj8Wz2.jpg"
                      style="background-color: #F5F5F5;"
                    />
                  </v-avatar>Joe Smoe
                  <template v-slot:actions>
                    <span style="font-size: 15px; color: #BDBDBD;">Joined 8:00 AM</span>
                  </template>
                </v-banner>
              </li>
            </v-expand-transition>
          </TutorialDisplay>
        </ul>
      </v-col>
    </v-row>
  </v-row>
</template>

<script>
import TutorialDisplay from "./TutorialDisplay"
import LineChart from "./Chart"
import Dialog from "@/components/Dialog"
import { post } from "@/helpers.js"

export default {
  name: "Students",
  props: {
    topics: Array,
    students: Object,
    showTutorial: Number,
    shortened: Boolean,
    totalStudents: Array,
    joinCode: String,
  },
  data() {
    return {
      preventFromJoining: false,
      activeStudent: "",
      showDialog: false,
      noStudentsToShow: true
    }
  },
  components: {
    TutorialDisplay,
    LineChart,
    Dialog,
  },
  computed: {
    understandingFontSize() {
      //We should replace this with a single, simple calc statement at some point.
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "130px"
        case "sm":
          return "130px"
        case "md":
          return "130px"
        case "lg":
          return "160px"
        case "xl":
          return "180px"
      }
      /* This one doesn't really work
        let val = Math.min(window.innerWidth / 3.14, 180)
        console.log(val);
        return val + 'px'*/
    },
    dialogHeader() {
      return (
        "Are you sure you want to remove " +
        this.activeStudent.first_name +
        " " +
        this.activeStudent.last_name +
        "?"
      )
    },
    progressColor() {
      if (this.understandingScore == null) {
        return "primary"
      } else if (this.understandingScore >= 70) {
        return "success"
      } else if (this.understandingScore <= 20) {
        return "error"
      } else {
        return "warning"
      }
    },
    smallScreen () {
      return this.$vuetify.breakpoint.smAndDown
    },
    showNoStudentsMsg() {
      // Check if any students in lecture
      for (let key in this.students)
        if (this.students[key].inLecture)
          return false
      
      // No students in lecture, check if on tutorial step 6
      return this.showTutorial !== 6
    },
  },
  methods: {
    resetTutorial() {
      this.$emit("resetTutorial")
    },
    nextTutorial() {
      this.$emit("nextTutorial")
    },
    formatUnix(unix_timestamp) {
      if (unix_timestamp == undefined) {
        return ""
      }
      let date = new Date(unix_timestamp)
      return date.toLocaleTimeString()
    },
    setActive(student) {
      this.activeStudent = student
      console.log('set active!')
    },
    clickTab(num) {
      this.$emit("clickTab", num)
    },
    removeStudent() {
      this.$emit("kickStudent", {
        student_uid: this.activeStudent.uid,
        banned: this.preventFromJoining,
      })
      this.showDialog = false
      this.preventFromJoining = false
    },
  },
}
</script>
