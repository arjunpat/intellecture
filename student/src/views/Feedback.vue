<!-- TODO: Only allow navigation to this page if from lecture_ended -->

<template>
  <div>
    <ErrorSnackbar
      :error="error"
    ></ErrorSnackbar>
    <FeedbackForm 
      message="The lecture has ended"
      :questions="questions"
      @updateOverallRating="updateOverallRating"
      @updateTechDiff="updateTechDiff"
      @updateAdditionalInfo="updateAdditionalInfo"
    />
  </div>
</template>

<script>
import FeedbackForm from '@/components/FeedbackForm'
import ErrorSnackbar from '@/components/ErrorSnackbar'
import { post } from '@/helpers.js'
import { mapState } from 'vuex'

export default {
  name: 'Feedback',

  components: {
    ErrorSnackbar,
    FeedbackForm,
  },

  created() {
    // TODO: catch if user did not navigate here from /room/:id
  },

  data() {
    return {
      error: '',
      id: 0,
      questions: [
        {
          text: 'How easy was it to use Intellecture?',
          handler: (rating) => {
            this.updateEaseOfUseRating(rating)
          },
        },
        {
          text: 'How helpful was it to your learning?',
          handler: (rating) => {
            this.updateHelpfulnessRating(rating)
          },
        },
      ],
    }
  },

  computed: {
    ...mapState(['authUser']),
  },

  methods: {
    updateOverallRating(rating) {
      console.log('change overall rating to ', rating)
      this.error = ''
      if(this.id == '') {
        post('/feedback/create', {
          stars: rating
        }).then((result) => {
          if (!result.success)
            throw result

          this.id = result.data.id;
          console.log(this.id + " posted");
        }).catch((err) => {
          this.error = 'There was a problem trying to submit your feedback'
        })
      } else {
        post('/feedback/update', {
          id: this.id,
          stars: rating
        }).then((result) => {
          if (!result.success)
            throw result
        }).catch((err) => {
          this.error = 'There was a problem trying to submit your feedback'
        })
      }
    },
    updateEaseOfUseRating(rating) {
      console.log('change ease of use rating to ', rating)
      this.error = ''
      post('/feedback/update', {
        id: this.id,
        diff_stars: rating
      }).then((result) => {
        if (!result.success)
          throw result
      }).catch((err) => {
        this.error = 'There was a problem trying to submit your feedback'
      })
    },
    updateHelpfulnessRating(rating) {
      console.log('change helpfulness rating to ', rating)
      this.error = ''
      post('/feedback/update', {
        id: this.id,
        helpful_stars: rating
      }).then((result) => {
        if (!result.success)
          throw result
      }).catch((err) => {
        this.error = 'There was a problem trying to submit your feedback'
      })
    },
    updateTechDiff(techDiff) {
      console.log('change tech diff to ', techDiff)
      this.error = ''
      post('/feedback/update', {
        id: this.id,
        tech_comments: techDiff
      }).then((result) => {
        if (!result.success)
          throw result
      }).catch((err) => {
        this.error = 'There was a problem trying to submit your feedback'
      })
    },
    updateAdditionalInfo(additionalInfo) {
      console.log('change additional info to ', additionalInfo)
      this.error = ''
      post('/feedback/update', {
        id: this.id,
        comments: additionalInfo
      }).then((result) => {
        if (!result.success)
          throw result
      }).catch((err) => {
        this.error = 'There was a problem trying to submit your feedback'
      })
    },
  },
}
</script>