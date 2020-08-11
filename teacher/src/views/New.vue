<template>
  <v-container fluid id="main">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="12" md="8" lg="6" xl="6">
        <v-card ref="form">
          <v-toolbar color="light-green lighten-2" dark flat>
            <v-toolbar-title
              style="font-family: 'Noto Sans', sans-serif; font-weight: bold; font-size: 25px;"
              >CREATE A LECTURE</v-toolbar-title
            >
          </v-toolbar>

          <v-card-text>
            <br />
            <br />
            <v-form>
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
                  <v-text-field
                    label="Lecture name"
                    outlined
                    v-model="lectureName"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
            <v-row align="center" justify="center">
              <v-btn
                @click="create"
                style="font-family: var(--main-font)"
                large
                dark
                color="light-green lighten-2"
                >Create</v-btn
              >
            </v-row>
            <v-row align="center" justify="center" style="min-height: 100px;">
              <v-slide-x-transition leave-absolute>
                <v-btn
                  @click="schedule"
                  style="font-family: var(--main-font); margin-top: -40px;"
                  dark
                  outlined
                  small
                  color="light-green lighten-2"
                  v-if="!showSchedule"
                  >Schedule a time</v-btn
                >
              </v-slide-x-transition>
              <v-slide-x-transition leave-absolute>
                <v-row
                  v-if="showSchedule"
                  justify="center"
                  align="center"
                >
                  <!--
                  <datetime
                    class="ml-2 theme-green"
                    v-model="date"
                    type="datetime"
                    use12-hour
                    :input-style="dateInputStyle"
                    :phrases="{ ok: 'Ok', cancel: 'Cancel' }"
                  ></datetime>-->
                  <v-col cols="3" class="mx-0">
                    <v-text-field
                      label="Date"
                      required
                      :value="date"
                      @focus="showDatePicker = true; showTimePicker = false;"
                      readonly
                      dense
                      outlined
                    ></v-text-field>
                    <v-fade-transition leave-absolute>
                      <v-date-picker
                        id="datePicker"
                        v-if="showDatePicker && !showTimePicker"
                        @change="hideDatePicker()"
                        v-model="date"
                        color="green lighten-1"
                      ></v-date-picker
                    ></v-fade-transition>
                  </v-col>
                  <v-col cols="2" class="mx-0 pr-1 pl-0">
                    <v-text-field
                      label="Time"
                      required
                      :value="time"
                      @focus="showTimePicker = true; showDatePicker = false;"
                      readonly
                      dense
                      outlined
                    ></v-text-field>
                    <v-fade-transition leave-absolute>
                      <v-time-picker
                        id="timePicker"
                        v-if="showTimePicker"
                        v-model="time"
                        color="green lighten-1"
                        ><v-spacer></v-spacer>
                        <v-btn text color="black" @click="showTimePicker = false"
                          >Ok</v-btn
                        ></v-time-picker
                      >
                    </v-fade-transition>
                  </v-col>
                  <v-btn
                    @click="showSchedule = false"
                    dark
                    color="error"
                    class="ml-2"
                    small
                    style="margin-top: -25px;"
                    >Cancel</v-btn
                  >
                </v-row>
              </v-slide-x-transition>
            </v-row>

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
import { Datetime } from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";

export default {
  data() {
    return {
      lectureName: "",
      chosenClass: "", // id of class
      formErrors: false,
      classIndex: 0,
      error: "Fill out all the fields.",
      date: "",
      time: "",
      showSchedule: false,
      showDatePicker: false,
      showTimePicker: false
    };
  },
  components: {
    datetime: Datetime
  },
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
            name: this.lectureName
          }).then(data => {
            this.$router.push({ path: "/lecture/" + data.data.lecture_uid });
          });
        } else {
          console.log(new Date(this.date).getTime());
          post("/lectures/create", {
            class_uid: this.chosenClass,
            name: this.lectureName,
            scheduled_start: new Date(this.date).getTime()
          }).then(data => {
            if (!data.success) {
              this.error = "Scheduled time must be in the future";
              this.formErrors = true;
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
    }
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
        borderRadius: "5px"
      };
    }
  },
  watch: {
    date(val) {
      console.log(val);
    }
  }
};
</script>

<style scoped>
h1 {
  color: #424242;
  text-align: center;
}

.slide-fade-enter-active {
  transition: all 1s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

.theme-green .vdatetime-popup__header,
.theme-green .vdatetime-calendar__month__day--selected > span > span,
.theme-green .vdatetime-calendar__month__day--selected:hover > span > span {
  background: #ff9800;
}

.theme-green .vdatetime-year-picker__item--selected,
.theme-green .vdatetime-time-picker__item--selected,
.theme-green .vdatetime-popup__actions__button {
  color: #ff9800;
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
