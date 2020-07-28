<template>
  <span>
    <AutoSnackbar
      :text="error"
      color="error"
    ></AutoSnackbar>
    <FeedbackForm 
      message="The lecture has ended"
      :questions="questions"
      redirectToPage="Dashboard"
      @updateOverallRating="updateOverallRating"
      @updateTechDiff="updateTechDiff"
      @updateAdditionalInfo="updateAdditionalInfo"
    />
  </span>
</template>

<script>
import FeedbackForm from '@/components/FeedbackForm'
import AutoSnackbar from '@/components/AutoSnackbar'
import { post } from '@/helpers.js'
import { mapState } from 'vuex'

export default {
  name: 'Feedback',

  props: {
    fromLectureEnd: {type: Boolean, default: false}
  },

  components: {
    AutoSnackbar,
    FeedbackForm,
  },

  created() {
    if (!this.fromLectureEnd  && !this.testing) {
      this.$router.replace({ name: 'Dashboard' })
    }
  },

  data() {
    return {
      testing: true,
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
          text: 'How helpful was it to your teaching?',
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
      this.error = ''
      if(!this.id) {
        post('/feedback/create', {
          stars: rating
        }).then((result) => {
          if (!result.success)
            throw result
          this.id = result.data.id;
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