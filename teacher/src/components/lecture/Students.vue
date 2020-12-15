<template>
  <v-row justify="center">
    <v-col
      v-if="numStudents > 0"
      :cols="$vuetify.breakpoint.smAndDown ? 12 : 4"
      justify="center"
      align="center"
    >
      <bar-chart :chart-data="datacollection"></bar-chart>
      <div>
        <v-chip class="mr-1"
          >{{ numStudents }} student{{
            numStudents != 1 ? "s" : ""
          }}</v-chip
        >
      </div>
    </v-col>
    <v-col :cols="$vuetify.breakpoint.smAndDown ? 12 : 8">
      <template v-if="showNoStudentsMsg">
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
      </template>

      <v-select
        v-if="!showNoStudentsMsg"
        v-model="sortBy"
        :items="sortByItems"
        filled
        label="Sort by"
        hide-details
      ></v-select>
      <v-list>
        <template v-if="showTutorial !== 6">
          <template v-for="(student, i) in studentsSorted">
            <v-divider
              v-if="i !== 0"
              :key="i"
            ></v-divider>
            <StudentListItem 
              v-if="individualScores[student.uid] || individualScores[student.uid] == 0"
              :key="student.uid"
              :student="student"
              :understanding="individualScores[student.uid]"
              @removeStudent="(student) => {showDialog = true; setActive(student)}"
            />
          </template>
        </template>

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
            <StudentListItem 
              v-if="showTutorial == 6"
              :student="{
                photo: 'https://i.imgur.com/4Wj8Wz2.jpg',
                first_name: 'Joe',
                last_name: 'Smoe',
                ts: 1590016800000,
              }"
              :understanding="5"
            />
          </v-expand-transition>
        </TutorialDisplay>
      </v-list>
    </v-col>
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
  </v-row>
</template>

<script>
import TutorialDisplay from "./TutorialDisplay"
import LineChart from "./Chart"
import BarChart from "./BarChart"
import Dialog from "@/components/Dialog"
import StudentListItem from '@/components/lecture/StudentListItem'
import { post, compareString } from "@/helpers.js"

export default {
  name: "Students",

  props: {
    topics: Array,
    students: Object,
    showTutorial: Number,
    shortened: Boolean,
    joinCode: String,
    individualScores: Object
  },

  data() {
    return {
      preventFromJoining: false,
      activeStudent: "",
      showDialog: false,
      noStudentsToShow: true,
      sortByItems: ['Join time', 'Highest understanding', 'Lowest understanding', 'First name', 'Last name'],
      sortBy: 'Join time',
    }
  },

  components: {
    TutorialDisplay,
    LineChart,
    Dialog,
    BarChart,
    StudentListItem,
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
      Object.keys(this.students).forEach(id => {
        if (this.students[id].inLecture)
          y[this.individualScores[id]]++
      });
      return {
        labels: ["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"],
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
    numStudents() {
      return this.presentStudents.length
    },
    presentStudents() {
      return Object.values(this.students).filter(student => student.inLecture)
    },
    studentsSorted() {
      return Object.values(this.presentStudents).sort((a, b) => {
        a.first_name += ''; a.last_name += '' // Convert null names to 'null' strings
        b.first_name += ''; b.last_name += ''
        switch (this.sortBy) {
          case 'Join time':
            return a.ts - b.ts
          case 'Highest understanding':
            return this.individualScores[b.uid] - this.individualScores[a.uid] 
          case 'Lowest understanding':
            return this.individualScores[a.uid] - this.individualScores[b.uid] 
          case 'First name':
            return compareString(a.first_name, b.first_name)
          case 'Last name':
            return compareString(a.last_name, b.last_name)
        }
      })
    },
  },

  methods: {
    resetTutorial() {
      this.$emit("resetTutorial");
    },
    nextTutorial() {
      this.$emit("nextTutorial");
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
    },
  }
}
</script>
