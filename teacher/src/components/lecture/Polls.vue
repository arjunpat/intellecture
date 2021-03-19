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
            >{{!savedPoll ? 'Create new' : 'Open poll'}}</v-btn
          >
        </template>

        <EditPolls :givenOptions="options" :givenPrompt="prompt" :savedPoll="savedPoll" @resetPoll="dialog=false; resetPoll()" @savePoll="dialog=false; savePoll();" @setOptions="setOptions" @setPrompt="setPrompt" @createPoll="createPoll"></EditPolls>
        
      </v-dialog>

      <v-dialog v-model="useOldDialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="ml-1"
            :color="'green lighten-5'"
            bottom
            
            v-bind="attrs"
            v-on="on"
            v-show="!savedPoll & activePoll < 0"
            @click="selectedPoll = false;"
            >Use Existing</v-btn
          >
        </template>

        <SearchPolls v-if="!selectedPoll" :pastPolls="polls" @cancel="useOldDialog = false" @pollSelected="pollSelected"></SearchPolls>

        <EditPolls v-if="selectedPoll" :givenOptions="options" :givenPrompt="prompt" :savedPoll="savedPoll" @resetPoll="useOldDialog=false; resetPoll()" @savePoll="useOldDialog=false; savePoll();" @setOptions="setOptions" @setPrompt="setPrompt" @createPoll="createPoll"></EditPolls>
        
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
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="ml-2"
                fab
                dark
                small
                color="green"
                v-bind="attrs"
                v-on="on"
                @click="sendResults(poll.poll_uid, index)"
              >
                <v-icon dark>
                  {{ !sentIcon[index] ? 'mdi-send' : 'mdi-send-check' }}
                </v-icon>
              </v-btn>
            </template>
            <span>Share results with students</span>
          </v-tooltip>
          
        </div>
      </v-col>
    </v-col>
  </v-row>
</template>

<script>
import TutorialDisplay from "./TutorialDisplay";
import Dialog from "@/components/Dialog";
import EditPolls from "@/components/EditPolls";
import SearchPolls from "@/components/lecture/SearchPolls";
import { post } from "@/helpers.js";
import AutoSnackbar from "@/components/AutoSnackbar";
import BarChart from "./BarChart";

export default {
  name: "Polls",
  props: {
    lectureId: String,
    polls: Array,
    votes: Array,
    students: Object
  },
  data() {
    return {
      dialog: false,
      useOldDialog: false,
      options: ["", ""],
      prompt: "",
      snackbar: false,
      timeout: 1000,
      error: "",
      datacollection: {},
      pastData: [],
      savedPoll: false,
      selectedPoll: false,
      sentIcon: []
    };
  },
  components: {
    TutorialDisplay,
    Dialog,
    AutoSnackbar,
    BarChart,
    EditPolls,
    SearchPolls
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
        this.useOldDialog=false;
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
    resetPoll() { // fix with component
      this.savedPoll = false;
      this.prompt = "";
      this.options = ["", ""];
    },
    savePoll() {
      this.savedPoll = true;
    },
    sendResults(uid, index) {
      post(`/lectures/live/teacher/${this.lectureId}/share-poll-results`, {
        poll_uid: uid
      }).then(result => {
        if(result.success) {
          this.sentIcon[index] = true;
          console.log(result);
          console.log(this.sentIcon);
        } else {
          this.showError("Could not send results");
        }
      });
    },
    pollSelected(poll) {
      this.options = poll.options;
      this.prompt = poll.prompt;
      this.selectedPoll = true;
    },
    setOptions(options) {
      this.options = options;
    },
    setPrompt(prompt) {
      this.prompt = prompt
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
      this.sentIcon = [];
      for (let i = 0; i < this.pollsreversed.length; i++) {
        this.sentIcon.push(false)
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
