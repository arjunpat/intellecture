<template>
  <v-container fluid>
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
                  style="font-family: var(--main-font)"
                  dark
                  outlined
                  small
                  color="light-green lighten-2"
                  class="mb-12"
                  v-if="!showCalendar"
                  >Schedule a time</v-btn
                >
              </v-slide-x-transition>
              <v-slide-x-transition leave-absolute>
                <v-row
                  v-if="showCalendar"
                  justify="center"
                  align="center"
                  class="mb-12"
                >
                  <datetime
                    class="ml-2"
                    v-model="date"
                    type="datetime"
                    use12-hour
                    :input-style="dateInputStyle"
                    :phrases="{ ok: 'Create', cancel: 'Cancel' }"
                  ></datetime>
                  <v-btn
                    @click="showCalendar = false"
                    dark
                    color="error"
                    class="ml-2"
                    small
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
      showCalendar: false
    };
  },
  components: {
    datetime: Datetime
  },
  methods: {
    create() {
      if (this.classes.length == 0) {
        this.error = "You must create a class.";
        this.formErrors = true;
      } else if (this.chosenClass !== "" && this.lectureName !== "") {
        this.formErrors = false;
        post("/lectures/create", {
          class_uid: this.chosenClass,
          name: this.lectureName
        }).then(data => {
          this.$router.push({ path: "/lecture/" + data.data.lecture_uid });
        });
      } else {
        this.formErrors = true;
      }
    },
    schedule() {
      this.showCalendar = !this.showCalendar;
    },
    changeClass(chose) {
      this.chosenClass = chose;
    }
  },
  mounted() {
    store.commit("setShowCode", false);
    this.date = new Date().toISOString();
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
</style>
