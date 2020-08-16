<template>
  <v-container fluid id="main">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="12" md="8" lg="6" xl="6">
        <v-card ref="form">
          <v-toolbar color="light-green lighten-2" dark flat>
            <v-toolbar-title
              style="font-family: 'Noto Sans', sans-serif; font-weight: bold; font-size: 25px;"
            >CREATE A LECTURE</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-form class="mt-6">
              <h1 class="mb-2">Select a class</h1>
              <v-row align="center" justify="center">
                <v-col :cols="$vuetify.breakpoint.xs ? 12 : 8">
                  <v-select
                    :items="
                      classes && classes.length > 0
                        ? classes
                        : ['No classes to show']
                    "
                    item-value="uid"
                    item-text="name"
                    label="Class name"
                    outlined
                    @change="changeClass"
                  ></v-select>
                </v-col>
              </v-row>

              <h1 class="mb-2">Give it a name</h1>
              <v-row align="center" justify="center">
                <v-col :cols="$vuetify.breakpoint.xs ? 12 : 8">
                  <v-text-field label="Lecture name" outlined v-model="lectureName" required hide-details></v-text-field>
                </v-col>
              </v-row>
              <!--<v-row align="center" justify="center" style="margin-bottom: 15px;">
                <v-checkbox
                  v-model="startNow"
                  :label="`Start this lecture now`"
                ></v-checkbox>
              </v-row>-->
              <v-row align="center" justify="center" class="my-4">
                <v-slide-y-transition leave-absolute>
                  <v-btn
                    @click="schedule"
                    style="font-family: var(--main-font);"
                    dark
                    outlined
                    medium
                    color="light-green lighten-2"
                    v-if="!scheduleInfo.show"
                    
                  >Schedule a time</v-btn>
                </v-slide-y-transition>
                <v-slide-y-transition leave-absolute>
                  <ScheduleDateTime 
                    v-model="scheduleInfo"
                  />
                </v-slide-y-transition>
              </v-row>
              <v-row align="center" justify="center">
                <v-fade-transition leave-absolute>
                <v-btn
                  @click="create"
                  style="font-family: var(--main-font);"
                  large
                  dark
                  color="light-green lighten-2"
                  v-if="!scheduleInfo.show"
                >Start now</v-btn>
                </v-fade-transition>
                <v-fade-transition leave-absolute>
                <v-btn
                  @click="create"
                  style="font-family: var(--main-font);"
                  large
                  dark
                  color="light-green lighten-2"
                  v-if="scheduleInfo.show"
                >Schedule</v-btn>
                </v-fade-transition>
              </v-row>
            </v-form>

            <br />
            <v-row align="center" justify="center">
              <v-col cols="12">
                <v-slide-y-transition leave-absolute>
                  <v-alert v-if="formErrors" type="error">{{ error }}</v-alert>
                </v-slide-y-transition>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from "@/store";
import { mapState } from "vuex";
import { post, get, log } from "@/helpers.js";
import ScheduleDateTime from '@/components/ScheduleDateTime'

export default {
  data() {
    return {
      lectureName: "",
      chosenClass: "", // id of class
      formErrors: false,
      classIndex: 0,
      error: "Fill out all the fields.",
      scheduleInfo: {
        show: false,
        datetime: Date.now()
      }
    };
  },

  components: {
    ScheduleDateTime,
  },

  methods: {
    create() {
      if (this.classes.length == 0) {
        this.error = "You must create a class";
        this.formErrors = true;
      } else if (this.chosenClass !== "" && this.lectureName !== "") {
        this.formErrors = false;
        if (!this.scheduleInfo.show) {
          post("/lectures/create", {
            class_uid: this.chosenClass,
            name: this.lectureName,
          }).then((data) => {
            this.$router.push({ path: "/lecture/" + data.data.lecture_uid });
          });
        } else {
          post("/lectures/create", {
            class_uid: this.chosenClass,
            name: this.lectureName,
            scheduled_start: this.scheduleInfo.datetime,
          }).then((data) => {
            log("Scheduled at " + this.scheduleInfo.datetime);
            if (!data.success) {
              this.error = "Scheduled time must be in the future";
              this.formErrors = true;
            } else {
              this.$emit('info', 'Your lecture has been scheduled!')
              this.$router.push({ name: 'ClassLectures', params: { class_uid: this.chosenClass } })
            }
          });
        }
      } else {
        this.formErrors = true;
      }
    },
    schedule() {
      this.scheduleInfo.show = !this.scheduleInfo.show;
    },
    changeClass(chose) {
      this.chosenClass = chose;
    },
  },
  mounted() {
    store.commit("setShowCode", false);
  },
  computed: {
    ...mapState(["classes"]),
    /*dateInputStyle() {
      return {
        border: "1px solid #9E9E9E",
        fontFamily: "var(--main-font)",
        padding: "3px 1px",
        fontSize: "15px",
        borderRadius: "5px",
      };
    },*/
  },
};
</script>

<style scoped>
h1 {
  color: #424242;
  text-align: center;
}

#datePicker,
#timePicker {
  position: absolute;
  z-index: 100;
  margin-bottom: 30px;
}

#main {
  padding-bottom: 400px;
}
</style>
