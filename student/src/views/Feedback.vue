<!-- TODO: Only allow navigation to this page if from lecture_ended -->

<template>
  <FeedbackForm 
    message="The lecture has ended"
    :questions="questions"
    @changeOverallRating="changeOverallRating"
    @submitTechDiff="submitTechDiff"
    @submitAdditionalInfo="submitAdditionalInfo"
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
    submitTechDiff(techDiff) {
      console.log('change tech diff to ', techDiff)
    },
    submitAdditionalInfo(additionalInfo) {
      console.log('change additional info to ', additionalInfo)
    },
  },
}
</script>