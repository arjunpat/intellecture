<template>
  <span>
    <AutoSnackbar
      :text="message"
      color="info"
    />
    <v-container class="text-center fill-height" style="position:relative;">
      <v-row justify="center" class="fill-height">
        <v-col
          cols="12"
          lg="8"
          md="10"
          xl="6"
          class="mt-8" 
          :style="{
            position: 'relative', 
            'padding-top': overallTop, 
            left: '0', 
            right: '0',
            transition: 'padding-top .3s',
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
              <v-expand-transition>
                <div v-if="!showMore">
                  <div v-if="overallRating <= 2" :class="[$vuetify.breakpoint.smAndUp ? 'display-1' : 'headline']">We're sorry to hear that :(</div>
                  <div v-else :class="[$vuetify.breakpoint.smAndUp ? 'display-1' : 'headline']">Thank you for your feedback.</div>
                  <div :class="[$vuetify.breakpoint.smAndUp ? 'display-1' : 'headline']">Care to tell us more?</div>
                
                
                  <div class="mt-4">
                    <v-btn
                      color="primary"
                      class="mr-4"
                      @click="showMore = true"
                    >Sure!</v-btn>
                    <v-btn
                      @click="goHome"
                    >No thanks</v-btn>
                  </div>
                </div>
              </v-expand-transition>
              
              <v-expand-transition>
                <div v-show="showMore" class="mt-4">
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
                </div>
              </v-expand-transition>
            </div>
          </v-fade-transition>
        </v-col>
      </v-row>
    </v-container>
  </span>
</template>

<script>
import AutoSnackbar from '@/components/AutoSnackbar'
import ShowMoreContainer from '@/components/ShowMoreContainer'

export default {
  name: 'FeedbackForm',

  props: {
    message: {type: String, default: ''},
    questions: {type: Array, required: true},
    redirectToPage: {type: String, required: true},
  },

  components: {
    AutoSnackbar,
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
      showMore: false,
    }
  },

  computed: {
    overallTop() {
      return this.overallRating === 0 ? '20vh' : '0vh' 
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
      this.$router.replace({ name: this.redirectToPage, params: { info: 'Thank you so much for your feedback! We really appreciate it.' } })
    },
    goHome() {
      this.$router.replace({ name: this.redirectToPage })
    }
  }
}
</script>