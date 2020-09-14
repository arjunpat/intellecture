<template>
  <v-row align="center" justify="center">
    <AutoSnackbar :text="error" color="error" />
    <v-col v-show="activePoll >= 0" cols="6">
      <bar-chart :chart-data="datacollection"></bar-chart>
    </v-col>
    <v-col cols="12" align="center" justify="center">
      <v-btn v-show="activePoll >= 0" color="red" dark @click="endPoll()"
        >End poll</v-btn
      >
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-show="activePoll < 0"
            color="green"
            bottom
            dark
            v-bind="attrs"
            v-on="on"
            >New poll</v-btn
          >
        </template>
        <v-card>
          <v-card-title>
            <span style="font-family: var(--main-font);"
              >Create a new poll</span
            >
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="prompt"
                    label="Question"
                    required
                    autocomplete="off"
                    style="font-family: var(--main-font)"
                  ></v-text-field>
                </v-col>
                <v-slide-y-transition :group="true">
                <v-col
                  cols="12"
                  v-for="(choice, index) in options"
                  v-bind:key="index"
                  :style="{marginTop: index != 0 ? '-40px' : '0px'}"
                >
                  <v-text-field
                    :label="'Choice ' + (index + 1)"
                    required
                    autocomplete="off"
                    :value="choice"
                    v-model="options[index]"
                  ></v-text-field>
                </v-col>
                </v-slide-y-transition>
                <v-col cols="12">
                  <v-btn @click="options.push('')">+</v-btn>
                  <v-btn @click="removeOption()" :disabled="this.options.length == 2">-</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="dialog = false">Cancel</v-btn>
            <v-btn color="green lighten-1" text @click="createPoll()"
              >Create</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import TutorialDisplay from "./TutorialDisplay";
import Dialog from "@/components/Dialog";
import { post } from "@/helpers.js";
import AutoSnackbar from "@/components/AutoSnackbar";
import BarChart from "./BarChart";

export default {
  name: "Polls",
  props: {
    lectureId: String,
    votes: Array,
    polls: Array
  },
  data() {
    return {
      dialog: false,
      options: ["", ""],
      prompt: "",
      snackbar: false,
      timeout: 1000,
      error: "",
      datacollection: {}
    };
  },
  components: {
    TutorialDisplay,
    Dialog,
    AutoSnackbar,
    BarChart
  },
  computed: {
    smallScreen() {
      return this.$vuetify.breakpoint.smAndDown;
    }
  },
  methods: {
    createPoll() {
      const newOptions = this.options.filter(option => option != "");
      if (this.prompt === "") {
        this.showError("You need a question to have a poll!");
      } else if (newOptions.length < 2) {
        this.showError("You more answer choices");
      } else {
        this.dialog = false;
        this.options = newOptions;
        post(`/lectures/live/teacher/${this.lectureId}/poll`, {
          prompt: this.prompt,
          options: this.options
        }).then(result => {
          console.log(result);
        });
      }
    },
    endPoll() {
      post(`/lectures/live/teacher/${this.lectureId}/end-poll`, {
        poll_uid: this.polls[this.polls.length - 1].poll_uid
      }).then(result => {
        console.log(result);
      });
    },
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
    clickTab(num) {
      this.$emit("clickTab", num);
    },
    removeOption() {
      if (this.options.length > 2) this.options.pop();
    },
    showError(error) {
      this.error = "";
      this.$nextTick(() => {
        this.error = error;
      });
    },
    initChart() {
      if (this.activePoll >= 0) {
        let x = this.polls[this.activePoll].options;
        let y = this.votes;
        this.fillData(x, y);
      }
    },
    fillData(x, y) {
      this.datacollection = {
        labels: x,
        datasets: [
          {
            label: "Answers",
            backgroundColor: "#aae691ff",
            hoverBackgroundColor: "#c9e8bc",
            data: y,
            borderWidth: 1
          }
        ]
      };
    }
  },
  mounted() {
    this.initChart();
  },
  computed: {
    activePoll() {
      if (this.polls.length == 0) return -1;
      if (this.polls[this.polls.length - 1].active)
        return this.polls.length - 1;
      else return -1;
    }
  },
  watch: {
    votes() {
      this.initChart();
    },
    polls() {
      this.initChart();
    }
  }
};
</script>
