<!-- TODO: Only allow navigation to this page if from lecture_ended -->

<template>
  <FeedbackForm 
    message="The lecture has ended"
    :questions="questions"
    :feedbackId="id"
    @changeOverallRating="changeOverallRating"
    @submitTechDiff="submitTechDiff"
    @submitAdditionalInfo="submitAdditionalInfo"
  />
</template>

<script>
import FeedbackForm from '@/components/FeedbackForm'
import { post } from '@/helpers.js'

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
          handler(rating, feedbackId) {
            console.log('change ease of use rating to ', rating)
            post('/feedback/update', {
                id: feedbackId,
                diff_stars: rating
            }).then((result) => {
                console.log(result);
            })
          },
        },
        {
          text: 'How helpful was it to your learning?',
          handler(rating, feedbackId) {
            console.log('change helpfulness rating to ', rating)
            post('/feedback/update', {
                id: feedbackId,
                helpful_stars: rating
            }).then((result) => {
                console.log(result);
            })
          },
        },
      ],
      id: 0
    }
  },

  methods: {
    changeOverallRating(rating) {
        console.log('change overall rating to ', rating)
        var self = this;
        if(this.id == '') {
            post('/feedback/create', {
                stars: rating
            }).then((result) => {
                self.id = result.data.id;
                console.log(self.id + " posted");
            })
        } else {
            post('/feedback/update', {
                id: self.id,
                stars: rating
            }).then((result) => {
                console.log(result);
            })
        }
    },
    submitTechDiff(techDiff) {
        console.log('change tech diff to ', techDiff)
        var self = this;
        post('/feedback/update', {
            id: self.id,
            tech_comments: techDiff
        }).then((result) => {
            console.log(result);
        })
    },
    submitAdditionalInfo(additionalInfo) {
        console.log('change additional info to ', additionalInfo)
        var self = this;
        post('/feedback/update', {
            id: self.id,
            comments: additionalInfo
        }).then((result) => {
            console.log(result);
        })
    },
  },
}
</script>