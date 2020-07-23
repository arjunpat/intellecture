<template>
  <div>
    <v-row align="center" style="margin: 20px;">
      <TutorialDisplay
        :show="showTutorial == 0"
        backgroundColor="white"
        @next="nextTutorial()"
        @cancel="resetTutorial()"
        bottom
      >
        <template v-slot:title>Understanding Score</template>
        <template
          v-slot:explanation
        >The aggregated understanding score from your students will show up here.</template>
        <div style="padding: 10px;">
          <v-card-text style="text-align: center;">
            <span style="font-size: 23px; color: black; font-weight: bold;">
              <span
                style="background: red; padding: 2px 5px; color: white; border-radius: 3px; font-weight: normal;"
              >LIVE</span> UNDERSTANDING SCORE
            </span>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <span
              class="text--primary font-weight-black"
              style="margin-top: 40px; text-align: center; font-size: 180px; background: #E0E0E0; border-radius: 10px; padding: 4px 20px;"
              :style="{ fontSize: understandingFontSize }"
            >{{ understandingScore == null ? '--' : understandingScore }}%</span>
            <br />
            <br />
            <br />
            <br />
            <div style="width: 335px; display: inline-block;">
              <v-progress-linear :value="understandingScore == null ? 0 : understandingScore" :color="progressColor" rounded></v-progress-linear>
            </div>
          </v-card-text>
        </div>
      </TutorialDisplay>
      <TutorialDisplay
        :show="showTutorial == 1"
        backgroundColor="white"
        @next="nextTutorial()"
        @cancel="resetTutorial()"
        bottom
        style="flex: 1;"
      >
        <template v-slot:title>Understanding Graph</template>
        <template
          v-slot:explanation
        >This is a graph of the understanding score over the duration of your lecture. Click the shorten button to only show the last 5 minutes of data.</template>
        <div style="width: 90%; margin: auto; display: block; positive: relative;" align="center">
          <line-chart :chart-data="datacollection"></line-chart>
          <v-switch style="display: inline-block;" v-model="shortened" label="Shorten"></v-switch>
        </div>
      </TutorialDisplay>
    </v-row>

    <v-row
      class="mt-1"
      align="center"
      justify="center"
      v-if="topics.length > 0 || showTutorial == 2"
    >
      <TutorialDisplay
        :show="showTutorial == 2"
        backgroundColor="white"
        @next="nextTutorial()"
        @cancel="resetTutorial()"
        top
      >
        <template v-slot:title>Topics</template>
        <template
          v-slot:explanation
        >This is where the main topics of the questions asked by your students will show up.</template>
        <v-expand-transition>
          <v-card width="90vw" min-height="70px" style="padding: 5px 10px;">
            <v-row>
              <v-col align="left">
                <div
                  v-for="n in topics.length"
                  v-bind:key="n"
                  style="float: left; margin-bottom: 7px; height: 5vh;"
                  class="mr-3 topic"
                >
                  <h1 style="font-size: 20px;">{{ topics[n-1].value }}</h1>
                </div>
                <v-expand-transition>
                  <div
                    style="float: left; margin-bottom: 7px; height: 5vh;"
                    class="mr-3 topic"
                    v-if="showTutorial == 2"
                  >
                    <h1 style="font-size: 20px;">This is a topic</h1>
                  </div>
                </v-expand-transition>
              </v-col>
            </v-row>
          </v-card>
        </v-expand-transition>
      </TutorialDisplay>
    </v-row>
    <div style="text-align: right; position: absolute; right: 10px; bottom: 10px; width: 400px;">
      <TutorialDisplay
        style="text-align: left;"
        :show="showTutorial == 8"
        backgroundColor="white"
        @next="resetTutorial()"
        @cancel="resetTutorial()"
        top
        last
      >
        <template v-slot:title>Help</template>
        <template v-slot:explanation>Click here to view this tutorial again.</template>
        <div style="text-align: right;">
          <v-btn
            style="display: inline-block;"
            color="green"
            bottom
            @click="nextTutorial()"
            fab
            dark
            small
          >
            <v-icon>mdi-help</v-icon>
          </v-btn>
        </div>
      </TutorialDisplay>
    </div>
  </div>
</template>

<script>
import TutorialDisplay from '@/components/TutorialDisplay'
import LineChart from '../components/Chart'

export default {
    name:"Understanding", 
    props: {
      understandingScore: Number,
      topics: Array,
      showTutorial: Number,
      datacollection: Object,
      shortened: Boolean,
    }, 
    components: {
      TutorialDisplay, 
      LineChart,
    }
    , computed: {
        understandingFontSize () { //We should replace this with a single, simple calc statement at some point.
          /* switch (this.$vuetify.breakpoint.name) {
            case 'xs': return '180px'
            case 'sm': return '180px'
            case 'md': return '130px'
            case 'lg': return '180px'
            case 'xl': return '180px'
          } */
          let val = Math.min(window.innerWidth / 3.14, 180)
          return val + 'px'
        },
        progressColor () {
        if(this.understandingScore == null) {
          return 'primary'
        } else if(this.understandingScore >= 70) {
          return 'success'
        } else if(this.understandingScore <= 20) {
          return 'error'
        } else {
          return 'warning'
        }
        },
    },
     methods: {
      resetTutorial() {
        this.$emit('resetTutorial');
      },
      nextTutorial() {
        this.$emit('nextTutorial');
      },
    },
};
</script>

<style lang="scss" scoped>
</style>