<template>
  <v-container class="text-center pt-8">
    <div class="display-2 font-weight-light mb-2">How was your experience?</div>
    <v-rating 
      v-model="rating"
      @input="changeOverallRating"
      hover
      size="64"
      color="yellow darken-1"  
      background-color="grey lighten-1"
    ></v-rating>
  </v-container>
</template>

<style scoped>
</style>

<script>
import { post } from '@/helpers'

export default {
  name: 'Feedback',

  data() {
    return {
      rating: 0,
      questions: [
        'How easy was it to use Intellecture?',
        'How helpful was it to your learning?',
        'Did you experience any technical difficulties?',
        'Anything else?',
      ]
    }
  },

  methods: {
    changeOverallRating() {

    },
  }
}
</script>