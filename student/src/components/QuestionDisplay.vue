<template>
  <v-expand-transition>
    <v-card tile v-if="questions.length !== 0">
      <v-list dense subheader>
        <v-subheader>
          {{ header }}
          <v-btn 
            v-if="!mine"
            text 
            rounded
            absolute 
            color="error"
            style="right: 0;"
            @click="dismissAllQuestions"
          >Dismiss All</v-btn>
        </v-subheader>
        <transition-group
          name="list-expand"
        >
          <div
            class="list-item"
            v-for="(_, i) in numDisplayedQuestions"
            :key="questions[i].question_uid"
          >
            <!-- TODO: catch for the case when you have a super duper long word -->
            <v-list-item-content>
              {{ questions[i].question }}
            </v-list-item-content>

            <template v-if="mine">
              <v-icon color="green lighten-3" class="mr-1">mdi-arrow-up-bold</v-icon>
              {{ questions[i].upvotes }}
            </template>
            <template v-else>
              <v-btn icon @click="upvoteQuestion(questions[i].question_uid)" :color="questions[i].upvoted ? 'green lighten-3' : ''" class="mr-1">
                <v-icon>{{ questions[i].upvoted ? 'mdi-arrow-up-bold' : 'mdi-arrow-up-bold-outline' }}</v-icon>
              </v-btn>
              <v-btn icon @click="dismissQuestion(questions[i].question_uid)" :color="questions[i].dismissed ? 'error' : ''">
                <v-icon>mdi-close-thick</v-icon>
              </v-btn>
            </template>
          </div>
        </transition-group>
      </v-list>

      <v-btn 
        v-if="!mine && numExtraQuestions > 0"
        block
        text
        class="mb-0"
        @click="viewMoreQuestions"
      >{{ viewMoreBtnText }}</v-btn>
    </v-card>
  </v-expand-transition>
</template>

<style scoped>
  .list-item {
    display: flex;
    flex: 1 1 100%;
    align-items: center;
    padding: 0 16px;
  }

  .list-expand-enter-active, .list-expand-leave-active {
    transition: all 0.3s ease;
  }

  .list-expand-enter, .list-expand-leave-to {
    max-height: 0;
    opacity: 0;
    margin: 0;
    padding: 0;
  }

  .list-expand-leave, .list-expand-enter-to {
    max-height: 10em; /* TODO: make this not a hardcoded height */
    opacity: 1;
  }
</style>

<script>
export default {
  name: 'QuestionDisplay',

  props: {
    header: {type: String, required: true},
    questions: {type: Array, required: true},
    mine: {type: Boolean, default: false},
  },

  data() {
    return {
      maxOtherQuestions: 3,
      expanded: false,
    }
  },

  computed: {
    numDisplayedQuestions() {
      if (this.mine || this.expanded)
        return this.questions.length
      return this.questions.length > this.maxOtherQuestions ? this.maxOtherQuestions : this.questions.length
    },
    numExtraQuestions() {
      return this.questions.length - this.maxOtherQuestions
    },
    viewMoreBtnText() {
      if (this.expanded)
        return `Collapse`
      else
        return `View ${this.numExtraQuestions} more question${this.numExtraQuestions > 1 ? 's' : ''}`
    }
  },

  methods: {
    dismissAllQuestions() {
      this.$emit('dismissAllQuestions')
    },
    upvoteQuestion(uid) {
      this.$emit('upvoteQuestion', uid)
    },
    dismissQuestion(uid) {
      this.$emit('dismissQuestion', uid)
    },
    viewMoreQuestions() {
      this.expanded = !this.expanded
    },
  },
}
</script>