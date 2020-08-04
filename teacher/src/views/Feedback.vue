<template>
  <span>
    <FeedbackForm
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
import { post } from '@/helpers.js'
import { mapState } from 'vuex'

export default {
  name: 'Feedback',

  props: {
    fromLectureEnd: {type: Boolean, default: false}
  },

  components: {
    FeedbackForm,
  },

  created() {
    if (!this.fromLectureEnd  && !this.testing) {
      this.$router.replace({ name: 'Dashboard' })
    }

    this.$emit('info', 'The lecture has ended')
  },

  data() {
    return {
      testing: false,
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
    showError() {
      this.$emit('error', 'There was a problem trying to submit your feedback')
    },
    updateOverallRating(rating) {
      if(!this.id) {
        post('/feedback/create', {
          stars: rating
        }).then((result) => {
          if (!result.success)
            throw result
          this.id = result.data.id;
        }).catch((err) => {
          this.showError()
        })
      } else {
        post('/feedback/update', {
          id: this.id,
          stars: rating
        }).then((result) => {
          if (!result.success)
            throw result
        }).catch((err) => {
          this.showError()
        })
      }
    },
    updateEaseOfUseRating(rating) {
      post('/feedback/update', {
        id: this.id,
        diff_stars: rating
      }).then((result) => {
        if (!result.success)
          throw result
      }).catch((err) => {
        this.showError()
      })
    },
    updateHelpfulnessRating(rating) {
      post('/feedback/update', {
        id: this.id,
        helpful_stars: rating
      }).then((result) => {
        if (!result.success)
          throw result
      }).catch((err) => {
        this.showError()
      })
    },
    updateTechDiff(techDiff) {
      post('/feedback/update', {
        id: this.id,
        tech_comments: techDiff
      }).then((result) => {
        if (!result.success)
          throw result
      }).catch((err) => {
        this.showError()
      })
    },
    updateAdditionalInfo(additionalInfo) {
      post('/feedback/update', {
        id: this.id,
        comments: additionalInfo
      }).then((result) => {
        if (!result.success)
          throw result
      }).catch((err) => {
        this.showError()
      })
    },
  },
}
</script>