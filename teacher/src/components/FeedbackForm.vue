<template>
  <v-container class="text-center fill-height" style="position:relative;">
    <template v-if="!submitted">
      <v-fade-transition>
        <div 
          v-show="overallRating === 0" 
          class="mt-8" 
          :class="[$vuetify.breakpoint.smAndUp ? 'display-2' : 'display-1']" 
          style="position: absolute; top: 0; left: 0; right: 0;"
        >{{ message }}</div>
      </v-fade-transition>

      <v-col
        cols="12"
        lg="8"
        md="10"
        class="mt-8 mx-auto fill-height pa-0" 
        :style="{
          position: 'relative', 
          top: overallTop, 
          left: '0', 
          right: '0',
          transition: 'top .3s',
        }"
      >
        <div 
          class="display-2 font-weight-light mb-2"
          :class="[$vuetify.breakpoint.smAndUp ? 'display-2' : 'display-1']"
        >How was your experience?</div>
        <v-rating 
          v-model="overallRating"
          @input="changeOverallRating"
          hover
          :size="ratingSizeBig"
          color="yellow darken-1"  
          background-color="grey lighten-1"
          class="mb-8"
        ></v-rating>

        <v-fade-transition>
          <div v-show="overallRating !== 0">

            <div v-if="overallRating <= 2" :class="[$vuetify.breakpoint.smAndUp ? 'display-1' : 'headline']">We're sorry to hear that :(</div>
            <div v-else :class="[$vuetify.breakpoint.smAndUp ? 'display-1' : 'headline']">Thank you for your feedback.</div>
            <div :class="[$vuetify.breakpoint.smAndUp ? 'display-1' : 'headline']">Care to tell us more?</div>
            <div class="subtitle-1 mb-8" >Fill out as little or as much as you want</div>
            
            <!-- have an expand thing showing the rest of it, and a no thanks link at the bottom-->
            <!--<v-card outlined class="mb-4">-->
            <ShowMoreContainer class="mb-4" initHeight="10rem">
              <div class="mb-2" v-for="(question, i) in questions" :key="i">
                <div 
                  :class="[$vuetify.breakpoint.smAndUp ? 'display-1' : 'headline']"
                  class="font-weight-light"
                >{{ question.text }}</div>
                <v-rating 
                  v-model="questionsState[i].rating"
                  @input="question.handler(questionsState[i].rating)"
                  hover
                  :size="ratingSize"
                  color="yellow darken-1"  
                  background-color="grey lighten-1"
                ></v-rating>
              </div>

              <div 
                class="font-weight-light"
                :class="[$vuetify.breakpoint.smAndUp ? 'display-1' : 'headline']"
              >Did you experience any technical difficulties?</div>
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
              <v-expand-transition>
                <v-textarea
                  v-show="techDiff == 'yes'"
                  v-model="techDiffText"
                  placeholder="Please explain..."
                  @blur="submitTechDiff"
                  solo
                ></v-textarea>
              </v-expand-transition>

              <div 
                class="font-weight-light mb-2"
                :class="[$vuetify.breakpoint.smAndUp ? 'display-1' : 'headline']"
              >Anything else?</div>
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
            </ShowMoreContainer>
            <!--</v-card>-->

            <a href="" @click.prevent="goHome">No thanks</a>
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

<script>
import ShowMoreContainer from '@/components/ShowMoreContainer'

export default {
  name: 'FeedbackForm',

  props: {
    message: {type: String},
    questions: {type: Array, required: true},
  },

  components: {
    ShowMoreContainer,
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
        return 42
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
      this.$router.replace({ name: 'Join', params: { info: 'Thank you so much for your feedback! We really appreciate it.' } })
    },
    goHome() {
      this.$router.replace({ name: 'Join' })
    }
  }
}
</script>