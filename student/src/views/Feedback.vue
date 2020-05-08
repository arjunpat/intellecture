<template>
  <FeedbackForm 
    :questions="questions"
    @changeOverallRating="changeOverallRating"
  />
</template>

<script>
import FeedbackForm from '@/components/FeedbackForm'

export default {
  name: 'Feedback',

  components: {
    FeedbackForm,
  },

  data() {
    return {
      questions: [
        {
          text: 'How easy was it to use Intellecture?',
          handler(rating) {
            console.log('change ease of use rating to ', rating)
          },
        },
        {
          text: 'How helpful was it to your learning?',
          handler(rating) {
            console.log('change helpfulness rating to ', rating)
          },
        },
      ],
    }
  },

  methods: {
    changeOverallRating(rating) {
      console.log('change overall rating to ', rating)
    },
  },
}
</script>