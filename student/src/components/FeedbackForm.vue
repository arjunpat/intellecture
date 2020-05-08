<template>
  <v-container class="text-center pt-8">
    <div v-if="!submitted">
      <div class="display-2 mb-12">{{ message }}</div>

      <div class="display-2 font-weight-light mb-2">How was your experience?</div>
      <v-rating 
        v-model="overallRating"
        @input="changeOverallRating"
        hover
        size="64"
        color="yellow darken-1"  
        background-color="grey lighten-1"
      ></v-rating>

      <!-- TODO: have a "Thank you for your feedback. Care to tell us more?" thing-->
      <!-- Tell user that they can "Fill out as much or as little as you want" -->
      <!-- Be able to reset rating to 0 <-- maybe not? -->

      <div v-for="(question, i) in questions" :key="i">
        <div class="display-1 font-weight-light mb-2">{{ question.text }}</div>
        <v-rating 
          v-model="questionsState[i].rating"
          @input="question.handler(questionsState[i].rating)"
          hover
          size="48"
          color="yellow darken-1"  
          background-color="grey lighten-1"
        ></v-rating>
      </div>

      <div class="display-1 font-weight-light mb-2">Did you experience any technical difficulties?</div>
      <v-radio-group v-model="techDiff" row class="text-center d-inline-block">
        <v-radio
          label="Yes"
          value="yes"
        ></v-radio>
        <v-radio
          label="No"
          value="no"
        ></v-radio>
      </v-radio-group>
      <v-textarea
        v-if="techDiff == 'yes'"
        v-model="techDiffText"
        placeholder="Please explain..."
        @blur="submitTechDiff"
        solo
      ></v-textarea>

      <div class="display-1 font-weight-light mb-2">Anything else?</div>
      <v-textarea
        v-model="additionalInfoText"
        placeholder="Tell us here..."
        @blur="submitAdditionalInfo"
        solo
      ></v-textarea>

      <v-btn
        @click="submit"
        block
      >
        I'm done
      </v-btn>
    </div>
    
    <div v-if="submitted">
      <div class="display-2 font-weight-light mb-2">Thank you so much for your feedback! We really appreciate it.</div>
      <img
        src="@/assets/img/logo.svg"
      >
    </div>
  </v-container>
</template>

<style scoped>
</style>

<script>
import { post } from '@/helpers'

export default {
  name: 'FeedbackForm',

  props: {
    message: {type: String}, // TODO: display "how was your experience" at the center of the screen if no message
    questions: {type: Array, required: true},
  },

  created() {
    this.questionsState = this.questions.map((question) => {
      return {rating: 0}
    })
  },

  data() {
    return {
      overallRating: 0,
      techDiff: false,
      techDiffText: '',
      additionalInfoText: '',
      questionsState: [],
      submitted: false,
    }
  },

  methods: {
    changeOverallRating() {
      this.$emit('changeOverallRating', this.overallRating)
    },
    submitTechDiff() {
      this.$emit('submitTechDiff', this.techDiff)
    },
    submitAdditionalInfo() {
      this.$emit('submitAdditionalInfo', this.additionalInfoText)
    },
    submit() {
      this.submitted = true
      console.log('submit!!')
    }
  }
}
</script>