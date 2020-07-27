<template>
  <v-row align="center" justify="center">
    <v-col align="center">
      <v-row>
        <v-col align="left">
          <v-card class="mx-auto" max-width="400" tile style="font-family: var(--main-font);">
            <v-card-title style="font-weight: bold;">
              Key Topics
              <v-btn
                @click="$emit('showAllQuestions')"
                v-show="questions.length != displayQuestions.length"
                text
                color="primary"
                style="position: absolute; right: 10px;"
              >Show all</v-btn>
            </v-card-title>
            <v-card-text>
              <v-list-item v-if="topics.length === 0 && showTutorial != 4">
                <v-list-item-content>
                  <v-list-item-title>At least 5 questions are needed</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-for="(topic, index) in topics" v-bind:key="index">
                <v-list-item-content>
                  <v-list-item-title>
                    <div
                      style="display: inline-block; font-size: 20px;"
                      class="topic"
                      @click="$emit('showCategory', index)"
                    >
                      <span
                        v-if="topic.value.length > 20"
                      >{{ topic.value.substring(0, 20) }}...</span>
                      <span v-else>{{ topic.value }}</span>
                    </div>
                    <div id="topic-quantity" class="ml-3">{{ topic.questions.length }}</div>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <!-- EXAMPLE TOPIC -->
              <TutorialDisplay
                :show="showTutorial == 4"
                backgroundColor="white"
                @next="nextTutorial()"
                @cancel="resetTutorial()"
                bottom
              >
                <template v-slot:title>Topics</template>
                <template
                  v-slot:explanation
                >This shows the key topics from the questions and the number of questions that fall under that category. Click on a topic to see all the questions that fall under it.</template>
                <v-expand-transition>
                  <v-list-item v-if="showTutorial == 4">
                    <v-list-item-content>
                      <v-list-item-title>
                        <div
                          style="display: inline-block; font-size: 20px;"
                          class="topic"
                        >This is a topic</div>
                        <div id="topic-quantity" class="ml-3">{{ 5 }}</div>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-expand-transition>
              </TutorialDisplay>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col :cols="smallScreen ? 12 : 8">
          <div v-if="displayQuestions.length < 1 && showTutorial != 5">
            <h1 :style="{fontWeight: 'normal', fontSize: '25px'}">There are no questions to display</h1>
          </div>
          <ul style="list-style-type: none; font-family: var(--main-font);">
            <li
              v-for="question in displayQuestions"
              v-bind:key="question.question_uid"
              v-show="!question.dismissed"
            >
              <v-banner :style="{ textAlign: 'left' }">
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">{{question.question}}</span>
                  </template>
                  <span>
                    {{ students[question.creator_uid].first_name }} {{ students[question.creator_uid].last_name }}
                    <v-avatar size="20px" class="ml-1">
                      <img
                        alt="Avatar"
                        :src="students[question.creator_uid].photo"
                        style="background-color: #F5F5F5;"
                      />
                    </v-avatar>
                  </span>
                </v-tooltip>
                <template v-slot:actions>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <div v-on="on" id="upvotes">{{question.upvotes}}</div>
                    </template>
                    <span>
                      <div v-if="question.upvotedStudents.length > 0">
                        <div
                          v-for="student in question.upvotedStudents"
                          v-bind:key="student.account_uid"
                        >{{student.first_name}} {{student.last_name}}</div>
                      </div>
                      <div v-else>No upvotes</div>
                    </span>
                  </v-tooltip>
                  <v-btn text color="primary" v-on:click="$emit('dismiss', question.question_uid)">Dismiss</v-btn>
                </template>
              </v-banner>
            </li>
            <!-- EXAMPLE QUESTION -->
            <TutorialDisplay
              :show="showTutorial == 5"
              backgroundColor="white"
              @next="nextTutorial(); clickTab(2);"
              @cancel="resetTutorial()"
              bottom
            >
              <template v-slot:title>Questions</template>
              <template
                v-slot:explanation
              >Questions from the students will show up here along with the number of upvotes they get by the students (on the right). You can dismiss the question by clicking the dismiss button.</template>
              <v-expand-transition>
                <li>
                  <v-banner v-show="showTutorial == 5">
                    This is a question
                    <template v-slot:actions>
                      <div id="upvotes">5</div>
                      <v-btn text color="primary">Dismiss</v-btn>
                    </template>
                  </v-banner>
                </li>
              </v-expand-transition>
            </TutorialDisplay>
          </ul>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import TutorialDisplay from "./TutorialDisplay"
import LineChart from "./Chart"

export default {
  name: "Questions",
  props: {
    topics: Array,
    questions: Array,
    displayQuestions: Array,
    showTutorial: Number,
    datacollection: Object,
    shortened: Boolean,
    students: Object,
  },
  components: {
    TutorialDisplay,
    LineChart,
  },
  computed: {
    understandingFontSize() {
      //We should replace this with a single, simple calc statement at some point.
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "130px"
        case "sm":
          return "130px"
        case "md":
          return "130px"
        case "lg":
          return "160px"
        case "xl":
          return "180px"
      }
      /* This one doesn't really work
          let val = Math.min(window.innerWidth / 3.14, 180)
          console.log(val);
          return val + 'px'*/
    },
    progressColor() {
      if (this.understandingScore == null) {
        return "primary"
      } else if (this.understandingScore >= 70) {
        return "success"
      } else if (this.understandingScore <= 20) {
        return "error"
      } else {
        return "warning"
      }
    },
    smallScreen() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return true
        case "sm":
          return true
        case "md":
          return false
        case "lg":
          return false
        case "xl":
          return false
      }
    },
  },
  methods: {
    resetTutorial() {
      this.$emit("resetTutorial")
    },
    nextTutorial() {
      this.$emit("nextTutorial")
    },
    clickTab(num) {
      this.$emit("clickTab")
    },
  },
}
</script>

<style lang="scss" scoped>
</style>