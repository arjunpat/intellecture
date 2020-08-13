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
                  <v-text-field label="Lecture name" outlined v-model="lectureName" required></v-text-field>
                </v-col>
              </v-row>
              <!--<v-row align="center" justify="center" style="margin-bottom: 15px;">
                <v-checkbox
                  v-model="startNow"
                  :label="`Start this lecture now`"
                ></v-checkbox>
              </v-row>-->
              <v-row align="center" justify="center" class="my-0 py-0" style="min-height: 50px; margin-bottom: 15px;">
                <v-slide-y-transition leave-absolute>
                  <v-btn
                    @click="schedule"
                    style="font-family: var(--main-font); margin-top: -40px;"
                    dark
                    outlined
                    medium
                    color="light-green lighten-2"
                    v-if="!showSchedule"
                    
                  >Schedule a time</v-btn>
                </v-slide-y-transition>
                <v-slide-y-transition leave-absolute>
                  <v-row
                    v-if="showSchedule"
                    justify="center"
                    class="my-0 py-0"
                    align="center"
                    style="position: absolute;"
                  >
                    <v-col cols="4" class="mx-0">
                      <v-menu
                        ref="dateMenu"
                        v-model="showDatePicker"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="dateFormatted"
                            label="Date"
                            hint="MM/DD/YYYY"
                            v-bind="attrs"
                            @blur="date = parseDate(dateFormatted)"
                            v-on="on"
                            outlined
                            dense
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="date"
                          color="green lighten-1"
                          no-title
                          @input="showDatePicker = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="3" class="mx-0 pr-1 pl-0">
                      <v-fade-transition leave-absolute>
                        <v-menu
                          ref="timeMenu"
                          v-model="showTimePicker"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="timeFormatted"
                              label="Time"
                              v-bind="attrs"
                              @blur="time = parseTime(timeFormatted)"
                              v-on="on"
                              readonly
                              outlined
                              dense
                            ></v-text-field>
                          </template>
                          <v-time-picker v-model="time" color="green lighten-1">
                            <v-spacer></v-spacer>
                            <v-btn text color="black" @click="showTimePicker = false">Ok</v-btn>
                          </v-time-picker>
                        </v-menu>
                      </v-fade-transition>
                    </v-col>
                    <v-btn
                      @click="showSchedule = false"
                      dark
                      color="error"
                      class="ml-2"
                      medium
                      style="margin-top: -25px;"
                    >Cancel</v-btn>
                  </v-row>
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
                  v-if="!showSchedule"
                >Start now</v-btn>
                </v-fade-transition>
                <v-fade-transition leave-absolute>
                <v-btn
                  @click="create"
                  style="font-family: var(--main-font);"
                  large
                  dark
                  color="light-green lighten-2"
                  v-if="showSchedule"
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
import { post, get } from "@/helpers.js";

export default {
  data() {
    return {
      lectureName: "",
      chosenClass: "", // id of class
      formErrors: false,
      classIndex: 0,
      error: "Fill out all the fields.",
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
      timeFormatted: this.formatTime(
        new Date().toTimeString().split(":")[0] + ":" + new Date().toTimeString().split(":")[1]
      ),
      time: this.parseTime(this.timeFormatted),
      showSchedule: false,
      showDatePicker: false,
      showTimePicker: false
    };
  },
  components: {},
  methods: {
    create() {
      if (this.classes.length == 0) {
        this.error = "You must create a class";
        this.formErrors = true;
      } else if (this.chosenClass !== "" && this.lectureName !== "") {
        this.formErrors = false;
        if (!this.showSchedule) {
          post("/lectures/create", {
            class_uid: this.chosenClass,
            name: this.lectureName,
          }).then((data) => {
            this.$router.push({ path: "/lecture/" + data.data.lecture_uid });
          });
        } else {
          var datetime = Date.parse(this.date + "T" + this.time + ":00");
          post("/lectures/create", {
            class_uid: this.chosenClass,
            name: this.lectureName,
            scheduled_start: datetime,
          }).then((data) => {
            console.log("Scheduled at " + this.date + "T" + this.time + ":00");
            if (!data.success) {
              this.error = "Scheduled time must be in the future";
              this.formErrors = true;
            } else {
              this.$router.push({ name: "Dashboard" });
            }
          });
        }
      } else {
        this.formErrors = true;
      }
    },
    schedule() {
      this.showSchedule = !this.showSchedule;
    },
    changeClass(chose) {
      this.chosenClass = chose;
    },
    hideDatePicker() {
      setTimeout(() => {
        this.showDatePicker = false;
      }, 300);
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    formatTime(time) {
      if (!time) return null;

      var [hours, minutes] = time.split(":");
      console.log(hours + "   " + minutes);
      var am = true;
      if (parseInt(hours) >= 12) {
        am = false;
      }
      console.log(minutes);

      if (am) {
        if (parseInt(hours) == 0) {
          hours = "12";
        }
        return hours + ":" + minutes + " am";
      } else {
        if (parseInt(hours) != 12) {
          hours = parseInt(hours) - 12;
        }
        return hours + ":" + minutes + " pm";
      }
    },
    parseTime(time) {
      if (!time) return null;

      var [hours, minutes] = time.split(":");
      if (minutes.split(" ")[1] == "am") {
        if (hours == "12") {
          hours = "00";
        }
        return hours + ":" + minutes.split(" ")[0];
      } else {
        if (hours != "12") {
          hours = parseInt(hours) + 12;
        }
        return hours + ":" + minutes.split(" ")[0];
      }
    },
  },
  mounted() {
    store.commit("setShowCode", false);
  },
  computed: {
    ...mapState(["classes"]),
    dateInputStyle() {
      return {
        border: "1px solid #9E9E9E",
        fontFamily: "var(--main-font)",
        padding: "3px 1px",
        fontSize: "15px",
        borderRadius: "5px",
      };
    },
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
  },
  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
    },
    time(val) {
      this.timeFormatted = this.formatTime(this.time);
    },
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
