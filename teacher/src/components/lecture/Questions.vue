<template>
  <div>
    <v-row align="center" justify="center">
      <v-col :cols="8"  align="center" justify="center">
        <v-list-item v-for="(topic, index) in topics" v-bind:key="index" style="display: inline-block;">
          <v-list-item-content>
            <v-list-item-title>
              <div
                class="topic"
                @click="showTopic(index)"
                :style="{
                  display: 'inline-block',
                  fontSize: '20px',
                  backgroundColor: topicBackground(index)
                }"
                @mouseover="hoveredIndex = index"
                @mouseleave="hoveredIndex = -1"
              >
                <span v-if="topic.value.length > 20"
                  >{{ topic.value.substring(0, 20) }}...</span
                >
                <span v-else>{{ topic.value }}</span>
              </div>
              <div id="topic-quantity" class="ml-2">
                {{ topic.questions.length }}
              </div>
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
          <template v-slot:explanation
            >This shows the key topics from the questions and the number of
            questions that fall under that category. Click on a topic to see all
            the questions that fall under it.</template
          >
          <v-fade-transition :group="true">
            <v-list-item v-if="showTutorial == 4">
              <v-list-item-content>
                <v-list-item-title>
                  <div
                    style="display: inline-block; font-size: 20px;"
                    class="topic"
                  >
                    This is a topic
                  </div>
                  <div id="topic-quantity" class="ml-3">{{ 5 }}</div>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-fade-transition>
        </TutorialDisplay>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col :cols="smallScreen ? 12 : 8" align="center" justify="center">
        <div v-if="displayQuestions.length < 1 && showTutorial != 5">
          <h1 :style="{ fontWeight: 'normal', fontSize: '25px' }">
            There are no questions to display
          </h1>
        </div>
        <ul style="list-style-type: none; font-family: var(--main-font);">
            <v-slide-y-transition :group="true">
          <li
            v-for="question in displayQuestions"
            v-bind:key="question.question_uid"
            v-show="!question.dismissed"
          >
            <v-banner :style="{ textAlign: 'left' }">
              {{ question.question }}
              <div id="questionAskedBy" class="ml-3">
                {{ students[question.creator_uid].first_name }}
                {{ students[question.creator_uid].last_name }}
                <!--<v-avatar size="20px" class="ml-1">
                      <img
                        alt="Avatar"
                        :src="students[question.creator_uid].photo"
                        style="background-color: #F5F5F5;"
                      />
                  </v-avatar>-->
              </div>
              <template v-slot:actions>
                <v-chip
                  @click.stop="$emit('show-upvoters', question.question_uid)"
                >
                  <v-avatar left>
                    <v-icon color="green lighten-3">mdi-arrow-up-bold</v-icon>
                  </v-avatar>
                  {{ question.upvotes }}
                </v-chip>
                <v-btn
                  text
                  color="primary"
                  v-on:click="$emit('dismiss', question.question_uid)"
                  >Dismiss</v-btn
                >
              </template>
            </v-banner>
          </li>
            </v-slide-y-transition>
          <!-- EXAMPLE QUESTION -->
          <TutorialDisplay
            :show="showTutorial == 5"
            backgroundColor="white"
            @next="
              nextTutorial();
              clickTab(2);
            "
            @cancel="resetTutorial()"
            bottom
          >
            <template v-slot:title>Questions</template>
            <template v-slot:explanation
              >Questions from the students will show up here along with the
              number of upvotes they get by the students (on the right). You can
              dismiss the question by clicking the dismiss button.</template
            >
            <v-expand-transition>
              <li>
                <v-banner
                  :style="{ textAlign: 'left' }"
                  v-show="showTutorial == 5"
                >
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
  </div>
</template>

<script>
import TutorialDisplay from "./TutorialDisplay";
import LineChart from "./Chart";

export default {
  name: "Questions",
  props: {
    topics: Array,
    questions: Array,
    displayQuestions: Array,
    showTutorial: Number,
    datacollection: Object,
    shortened: Boolean,
    students: Object
  },
  components: {
    TutorialDisplay,
    LineChart
  },
  data() {
    return {
      selectedIndex: -1,
      hoveredIndex: -1
    };
  },
  computed: {
    smallScreen() {
      return this.$vuetify.breakpoint.smAndDown;
    }
  },
  methods: {
    resetTutorial() {
      this.$emit("resetTutorial");
    },
    nextTutorial() {
      this.$emit("nextTutorial");
    },
    clickTab(num) {
      this.$emit("clickTab", num);
    },
    topicBackground(index) {
      if (this.selectedIndex == index) {
        return "#E0E0E0";
      } else if (this.hoveredIndex == index) {
        return "#F5F5F5";
      } else {
        return "#EEEEEE";
      }
    },
    showTopic(index) {
      if (index != this.selectedIndex) {
        this.$emit("showCategory", index);
        this.selectedIndex = index;
      } else {
        this.$emit("showAllQuestions");
        this.selectedIndex = -1;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#questionAskedBy {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 15px;
  display: inline-block;
  text-align: center;
  padding: 2px 4px;
  border-radius: 3px;
}
</style>
