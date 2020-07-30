<template>
  <v-container fluid>
    <v-row class="fill-height" justify="center">
      <v-col cols="12" lg="6" md="6" sm="9">
        <v-card class="mainfont px-2 py-2 rounded-lg">
          <v-card-title id="classTitle">{{ classInfo.name }}</v-card-title>
          <v-card-subtitle class="mt-2 subtitle" style="line-height: 30px;"
            >Period 1<br />{{ lectures.length }} lectures</v-card-subtitle
          >
        </v-card>
      </v-col>
    </v-row>

    <v-row
      class="fill-height"
      justify="center"
      v-for="lecture in lectures"
      :key="lecture.uid"
    >
      <v-col cols="12" lg="5" md="5" sm="8">
        <v-card class="mainfont px-2 py-2 rounded-lg">
          <v-card-title id="lectureTitle">{{ lecture.name }}</v-card-title>
          <v-row class="pl-3">
            <v-col cols="4">
            <h3 class="subtitle font-weight-regular">
              {{
                lectureLengthString(lecture.end_time - lecture.start_time)
              }}
              long
            </h3>
            </v-col>
            <v-col cols="4">
            <h3 class="subtitle font-weight-regular">
              {{ lecture.student_count }}
              students
            </h3>
            </v-col>
            <v-col cols="4">
            <h3 class="subtitle font-weight-regular">
              {{
                timeSinceEndTimeString(lecture.end_time)
              }}
              
            </h3>
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
  getClasses
} from "@/helpers.js";
import { mdiAndroidStudio } from "@mdi/js";
import { mapState } from "vuex";

export default {
  // mdi-timer-outline
  // mdi-update OR mdi-calendar-range
  props: {
    class_uid: { type: String }
  },

  data() {
    return {
      testing: false,
      lectures: [],
      classInfo: {},
      classes: []
    };
  },

  computed: {},

  methods: {
    async init() {
      if (this.testing) {
      } else {
        this.classes = await get("/classes/mine").then(result => {
          if (!result.success) throw result;
          result.data.sort((a, b) => (a.name > b.name ? 1 : -1));
          return result.data;
        });

        this.classInfo = this.classes.find(cla => cla.uid == this.class_uid);

        this.lectures = await get(`/lectures/by-class/${this.class_uid}`).then(
          d => {
            if (d.success) return d.data;
            log("failed", e);
          }
        );
        this.lectures.sort((a, b) => (a.end_time < b.end_time) ? 1 : -1)

        /*this.lectureLength = this.lectureInfo.end_time - this.lectureInfo.start_time
        this.students = students*/
      }
    },
    lectureLengthString(lectureLength) {
      var duration = durationToString(lectureLength, true);
      var durationArray = duration.split(" ");
      if (durationArray[durationArray.length - 1].includes("second")) {
        if (durationArray.length == 2) {
          duration = "< 1 minute";
        } else {
          durationArray.splice(durationArray.length - 2, 2);
          duration = durationArray.join(" ");
        }
      }
      return duration;
    },
    timeSinceEndTimeString(endTime) {
      return dateToString(endTime);
    }
  },

  mounted() {
    this.init();
  }
};
</script>

<style scoped>
#classTitle {
  font-size: 50px;
  font-weight: 900;
}

#lectureTitle {
  font-weight: bold;
  font-size: 25px;
}

.subtitle {
  font-size: 18px;
  color: gray;
}
</style>
