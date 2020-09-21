<template>
  <v-row align="center" justify="center">
    <v-col
      v-show="presentStudents > 0"
      :cols="$vuetify.breakpoint.smAndDown ? 12 : 6"
      justify="center"
      align="center"
    >
      <bar-chart :chart-data="datacollection"></bar-chart>
      <div>
        <v-chip class="mr-1"
          >{{ presentStudents }} student{{
            presentStudents != 1 ? "s" : ""
          }}</v-chip
        >
      </div>
    </v-col>
    <v-col :cols="$vuetify.breakpoint.smAndDown ? 12 : 8">
      <ul style="list-style-type: none">
        <li
          v-for="student in students"
          v-bind:key="student.uid"
          v-show="student.inLecture"
        >
          <v-banner style="font-family: var(--main-font);">
            <span>
              <v-avatar size="42px" class="mr-3">
                <img
                  alt="Avatar"
                  :src="student.photo"
                  style="background-color: #F5F5F5;"
                />
              </v-avatar>
              {{ student.first_name }} {{ student.last_name }}
              <v-btn
                class="ml-3"
                text
                color="red"
                @click.stop="
                  showDialog = true;
                  setActive(student);
                "
                >Remove</v-btn
              >
            </span>
            <template v-slot:actions>
              <v-chip class="mr-3"
                >{{
                  individualScores[student.uid] > 0
                    ? individualScores[student.uid] + "0"
                    : individualScores[student.uid]
                }}% understanding</v-chip
              >
              <span style="font-size: 15px; color: #BDBDBD;"
                >Joined {{ formatUnix(student.ts) }}</span
              >
            </template>
          </v-banner>
        </li>

        <li v-if="showNoStudentsMsg">
          <div
            class="text-center heading-4"
            :style="{
              fontWeight: 'normal',
              fontSize: '25px',
              fontFamily: 'var(--main-font)'
            }"
          >
            No students have joined the lecture!
          </div>
          <div class="text-center" style="font-family: var(--main-font)">
            Have students go to
            <a>join.intellecture.app</a> and enter the code
            <span
              style="background-color: #eee; padding: 3px 5px; border-radius: 5px; font-weight: bold;"
              >{{ joinCode }}</span
            >
            to join.
          </div>
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
          @next="
            nextTutorial();
            clickTab(0);
          "
          @cancel="resetTutorial()"
          bottom
        >
          <template v-slot:title>Students</template>
          <template v-slot:explanation>
            Here, you can see a list of all the students that have joined your
            lecture.
          </template>
          <v-expand-transition>
            <li v-if="showTutorial == 6">
              <v-banner style="font-family: var(--main-font);">
                <v-avatar size="42px" class="mr-3">
                  <!-- CHANGE LATER -->
                  <img
                    alt="Avatar"
                    src="https://i.imgur.com/4Wj8Wz2.jpg"
                    style="background-color: #F5F5F5;"
                  /> </v-avatar
                >Joe Smoe
                <template v-slot:actions>
                  <span style="font-size: 15px; color: #BDBDBD;"
                    >Joined 8:00 AM</span
                  >
                </template>
              </v-banner>
            </li>
          </v-expand-transition>
        </TutorialDisplay>
      </ul>
    </v-col>
  </v-row>
</template>

<script>
import TutorialDisplay from "./TutorialDisplay";
import LineChart from "./Chart";
import BarChart from "./BarChart";
import Dialog from "@/components/Dialog";
import { post } from "@/helpers.js";

export default {
  name: "Students",
  props: {
    topics: Array,
    students: Object,
    showTutorial: Number,
    shortened: Boolean,
    totalStudents: Array,
    joinCode: String,
    individualScores: Object
  },
  data() {
    return {
      preventFromJoining: false,
      activeStudent: "",
      showDialog: false,
      noStudentsToShow: true
    };
  },
  components: {
    TutorialDisplay,
    LineChart,
    Dialog,
    BarChart
  },
  computed: {
    dialogHeader() {
      return (
        "Are you sure you want to remove " +
        this.activeStudent.first_name +
        " " +
        this.activeStudent.last_name +
        "?"
      );
    },
    smallScreen() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    showNoStudentsMsg() {
      // Check if any students in lecture
      for (let key in this.students)
        if (this.students[key].inLecture) return false;

      // No students in lecture, check if on tutorial step 6
      return this.showTutorial !== 6;
    },
    datacollection() {
      let y = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      Object.keys(this.students).forEach(id => y[this.individualScores[id]]++);
      return {
        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: [
          {
            label: "Amount",
            backgroundColor: "#aae691ff",
            hoverBackgroundColor: "#c9e8bc",
            data: y,
            borderWidth: 1
          }
        ]
      };
    },
    totalStudents() {
      return Object.keys(this.students).length;
    },
    presentStudents() {
      return Object.values(this.students).filter(student => student.inLecture)
        .length;
    }
  },
  created() {},
  watch: {},
  methods: {
    resetTutorial() {
      this.$emit("resetTutorial");
    },
    nextTutorial() {
      this.$emit("nextTutorial");
    },
    formatUnix(unix_timestamp) {
      if (unix_timestamp == undefined) {
        return "";
      }
      let date = new Date(unix_timestamp);
      return date.toLocaleTimeString();
    },
    setActive(student) {
      this.activeStudent = student;
    },
    clickTab(num) {
      this.$emit("clickTab", num);
    },
    removeStudent() {
      this.$emit("kickStudent", {
        student_uid: this.activeStudent.uid,
        banned: this.preventFromJoining
      });
      this.showDialog = false;
      this.preventFromJoining = false;
    }
  }
};
</script>
