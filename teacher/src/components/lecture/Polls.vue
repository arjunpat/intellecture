<template>
  <v-row align="center" justify="center">
    <AutoSnackbar :text="error" color="error" />
    <v-col v-show="activePoll >= 0" cols="12" align="center" justify="center"
      ><h1 style="font-size: 25px;">
        <v-icon
          color="green lighten-2"
          style="margin-right: -125px; font-size: 30px;"
          >poll_box</v-icon
        >
        {{ activePoll > -1 ? polls[activePoll].prompt : "" }}
      </h1></v-col
    >
    <v-col
      v-show="activePoll >= 0"
      :cols="$vuetify.breakpoint.smAndDown ? 12 : 6"
      align="center"
      justify="center"
    >
      <bar-chart :chart-data="datacollection"></bar-chart>
      <div>
        <v-chip class="mr-1"
          >{{ numResponses(votes) }} response{{
            numResponses(votes) == 1 ? "" : "s"
          }}</v-chip
        ><v-chip>{{ percentParticipation(votes) }}% participation</v-chip>
      </div>
    </v-col>
    <v-col cols="12" align="center" justify="center">
      <v-btn v-show="activePoll >= 0" color="red" dark @click="endPoll()"
        >End poll</v-btn
      >
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-show="activePoll < 0"
            :color="!savedPoll ? 'green' : 'green lighten-3'"
            bottom
            dark
            v-bind="attrs"
            v-on="on"
            >{{!savedPoll ? 'New' : 'Open'}} poll</v-btn
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
                  <v-textarea
                    solo
                    v-model="prompt"
                    name="question"
                    label="Question"
                    style="font-family: var(--main-font)"
                    required
                    auto-grow
                    rows="2"
                  ></v-textarea>
                </v-col>
                <v-slide-y-transition :group="true" style="width: 100%;">
                  <v-col
                    cols="12"
                    v-for="(choice, index) in options"
                    v-bind:key="index"
                    :style="{ marginTop: index != 0 ? '-40px' : '-30px' }"
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
                <v-col cols="12" style="margin-top: -30px;">
                  <v-btn @click="options.push('')" small class="mr-1">+</v-btn>
                  <v-btn
                    @click="removeOption()"
                    :disabled="this.options.length == 2"
                    small
                    >-</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              text
              @click="
                dialog = false;
                resetPoll();
              "
              >{{savedPoll ? 'Remove' : 'Cancel'}}</v-btn
            >
            <v-btn
              text
              @click="
                dialog = false;
                savePoll();
              "
              >Save</v-btn
            >
            <v-btn color="green lighten-1" text @click="createPoll()"
              >Create</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>

    <v-col
      cols="12"
      v-for="(poll, index) in pollsreversed"
      v-bind:key="index"
      justify="center"
      align="center"
    >
      <v-col v-if="!poll.active" cols="12" align="center" justify="center"
        ><h1 style="font-size: 25px;">
          <v-icon
            color="grey lighten-1"
            style="margin-right: -125px; font-size: 30px;"
            >poll_box</v-icon
          >
          {{ poll.prompt }}
        </h1></v-col
      >
      <v-col v-if="!poll.active" :cols="$vuetify.breakpoint.smAndDown ? 12 : 6">
        <bar-chart :chart-data="pastData[index]"></bar-chart>
        <div>
          <v-chip class="mr-1"
            >{{ numResponses(poll.votes) }} response{{
              numResponses(poll.votes) == 1 ? "" : "s"
            }}</v-chip
          ><v-chip
            >{{ percentParticipation(poll.votes) }}% participation</v-chip
          >
        </div>
      </v-col>
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
    polls: Array,
    students: Object
  },
  data() {
    return {
      dialog: false,
      options: ["", ""],
      prompt: "",
      snackbar: false,
      timeout: 1000,
      error: "",
      datacollection: {},
      pastData: [],
      savedPoll: false
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
      this.savedPoll = false;
      const newOptions = this.options.filter(option => option != "");
      if (this.prompt === "") {
        this.showError("You need a question to have a poll!");
      } else if (newOptions.length < 2) {
        this.showError("You more answer choices");
      } else if (this.presentStudents == 0) {
        this.showError("Wait until more students join");
      } else {
        this.dialog = false;
        this.options = newOptions;
        post(`/lectures/live/teacher/${this.lectureId}/poll`, {
          prompt: this.prompt,
          options: this.options
        }).then(result => {
          console.log(result);
          this.resetPoll();
        });
      }
    },
    endPoll() {
      post(`/lectures/live/teacher/${this.lectureId}/end-poll`, {
        poll_uid: this.polls[this.polls.length - 1].poll_uid
      }).then(result => {
        console.log(result);
        this.preparePastData();
      });
    },
    resetPoll() {
      this.savedPoll = false;
      this.prompt = "";
      this.options = ["", ""];
    },
    savePoll() {
      this.savedPoll = true;
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
    },
    preparePastData() {
      this.pastData = [];
      for (let i = 0; i < this.pollsreversed.length; i++) {
        this.pastData.push({
          labels: this.pollsreversed[i].options,
          datasets: [
            {
              label: "Answers",
              backgroundColor: "#aae691ff",
              hoverBackgroundColor: "#c9e8bc",
              data: this.pollsreversed[i].votes,
              borderWidth: 1
            }
          ]
        });
      }
    },
    numResponses(votes) {
      var sum = 0;
      for (let i = 0; i < votes.length; i++) {
        sum += votes[i];
      }
      return sum;
    },
    percentParticipation(votes) {
      var percent = this.numResponses(votes) / this.totalStudents;
      return Math.round(percent * 10000) / 100;
    }
  },
  created() {
    this.preparePastData();
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
    },
    pollsreversed() {
      return this.polls.slice().reverse();
    },
    totalStudents() {
      return Object.keys(this.students).length;
    },
    presentStudents() {
      return Object.values(this.students).filter(student => student.inLecture)
        .length;
    }
  },
  watch: {
    votes() {
      console.log("Votes changed " + this.votes);
      this.initChart();
    },
    polls() {
      this.initChart();
      this.preparePastData();
    }
  }
};
</script>
