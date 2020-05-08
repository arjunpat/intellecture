<template>
  <v-container class="text-center pt-8">
    <div class="display-2 font-weight-light mb-2">How was your experience?</div>
    <v-rating 
      v-model="overallRating"
      @input="changeOverallRating"
      hover
      size="64"
      color="yellow darken-1"  
      background-color="grey lighten-1"
    ></v-rating>

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
    
    <div class="display-1 font-weight-light mb-2">Anything else?</div>
  </v-container>
</template>

<style scoped>
</style>

<script>
import { post } from '@/helpers'

export default {
  name: 'FeedbackForm',

  props: {
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
      questionsState: [],
    }
  },

  methods: {
    changeOverallRating() {
      this.$emit('changeOverallRating', this.overallRating)
    },
  }
}
</script>