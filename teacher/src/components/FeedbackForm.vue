<template>
  <v-container class="text-center fill-height">
    <template v-if="!submitted">
      <v-fade-transition>
        <div v-show="overallRating === 0" class="display-2 mt-8" style="position: absolute; top: 0; left: 0; right: 0;">{{ message }}</div>
      </v-fade-transition>

      <v-col
        cols="12"
        sm="8"
        md="6"
        lg="4"
        class="mt-8 mx-auto" 
        :style="{
          position: 'absolute', 
          top: overallTop, 
          left: '0', 
          right: '0',
          transition: 'top .3s',
        }"
      >
        <div class="display-2 font-weight-light mb-2">How was your experience?</div>
        <v-rating 
          v-model="overallRating"
          @input="changeOverallRating"
          hover
          :size="ratingSizeBig"
          color="yellow darken-1"  
          background-color="grey lighten-1"
        ></v-rating>

        <v-fade-transition>
          <div v-show="overallRating !== 0">
            <!-- TODO: have a "Thank you for your feedback. Care to tell us more?" thing-->
            <!-- Tell user that they can "Fill out as much or as little as you want" -->
            <!-- Be able to reset rating to 0 <-- maybe not? -->

            <div v-for="(question, i) in questions" :key="i">
              <div class="display-1 font-weight-light mb-2">{{ question.text }}</div>
              <v-rating 
                v-model="questionsState[i].rating"
                @input="question.handler(questionsState[i].rating)"
                hover
                :size="ratingSize"
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
        </v-fade-transition>
      </v-col>
    </template>
    
    <template v-else>
      <div class="display-2 font-weight-light mb-2">Thank you so much for your feedback! We really appreciate it.</div>
      <img
        src="@/assets/img/logo.svg"
      >
    </template>
  </v-container>
</template>

<style scoped>

</style>

<script>

export default {
  name: 'FeedbackForm',

  props: {
    message: {type: String},
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

  computed: {
    overallTop() {
      return this.overallRating === 0 ? '30%' : '0%' 
    },
    overallPosition() {
      return this.overallRating === 0 ? 'absolute' : 'relative'
    },
    ratingSize() {
      const breakpoint = this.$vuetify.breakpoint.name
      if (breakpoint === 'xs')
        return 36
      return 48
    },
    ratingSizeBig() {
      const breakpoint = this.$vuetify.breakpoint.name
      if (breakpoint === 'xs')
        return 48
      return 64
    },
  },

  methods: {
    changeOverallRating() {
      this.$emit('updateOverallRating', this.overallRating)
    },
    submitTechDiff() {
      this.$emit('updateTechDiff', this.techDiffText)
    },
    submitAdditionalInfo() {
      this.$emit('updateAdditionalInfo', this.additionalInfoText)
    },
    submit() {
      this.submitted = true
      console.log('submit!!')
    }
  }
}
</script>