<template>
  <v-row align="center" justify="center">
    <v-row
      class="mt-4"
      align="center"
      justify="center"
      v-if="showTutorial != 6"
    >
      <v-col cols="8">
        <div style="font-family: var(--main-font); text-align: center;">
          <h1 :style="{fontWeight: 'normal', fontSize: '25px'}">
            No students have joined the lecture
            <!--Have them go to <a>join.intellecture.app</a> and enter the code <span style="background-color: #eee; padding: 3px 10px; border-radius: 5px; font-weight: bold;">{{ joinCode }}</span> to join-->
          </h1>
        </div>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" v-if="students.length != 0 || showTutorial == 6">
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
                      @click="() => {invertDialog(); setActive(student)}"
                      @close="invertDialog"
                    >Remove</v-btn>
                  </transition>
                </span>
              </v-hover>
              <template v-slot:actions>
                <span style="font-size: 15px; color: #BDBDBD;">Joined {{ formatUnix(student.ts) }}</span>
              </template>
            </v-banner>
          </li>

          <Dialog
            :show="showDialog"
            :lowerHeader="true"
            :header="dialogHeader"
            @close="removeStudent()"
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
            :show="showTutorial == 6"
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
  },
  data() {
    return {
      preventFromJoining: false,
      activeStudent: "",
      showDialog: true,
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
    smallScreen() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return true
        case "sm":
          return true
        case "md":
          return false
        case "lg":
          return false
        case "xl":
          return false
      }
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
    invertDialog() {
      this.showDialog = !this.showDialog
    },
    setActive(student) {
      this.activeStudent = student
    },
    clickTab(num) {
      this.$emit("clickTab")
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
