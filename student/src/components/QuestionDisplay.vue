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
        <transition-group :name="listAction">
          <v-list-item
            v-for="q in questions"
            :key="q.question_uid"
            class="py-2"
          >
            <!-- TODO: catch for the case when you have a super duper long word -->
            <v-list-item-content>
              {{ q.question }}
            </v-list-item-content>

            <template v-if="mine">
              <v-icon color="green lighten-3" class="mr-1">mdi-arrow-up-bold</v-icon>
              {{ q.upvotes }}
            </template>
            <template v-else>
              <v-btn icon @click="upvoteQuestion(q.question_uid)" :color="q.upvoted ? 'green lighten-3' : ''" class="mr-1">
                <v-icon>{{ q.upvoted ? 'mdi-arrow-up-bold' : 'mdi-arrow-up-bold-outline' }}</v-icon>
              </v-btn>
              <v-btn icon @click="dismissQuestion(q.question_uid)" :color="q.dismissed ? 'error' : ''">
                <v-icon>mdi-close-thick</v-icon>
              </v-btn>
            </template>

          </v-list-item>
        </transition-group>
      </v-list>
    </v-card>
  </v-expand-transition>
</template>

<style scoped>
  .v-list-item__action--stack {
    flex-direction: row;
  }

  .list-upvote-enter-active, .list-upvote-leave-active,
  .list-dismiss-enter-active, .list-dismiss-leave-active {
    transition: all .3s ease;
  }

  .list-upvote-enter, .list-upvote-leave-to {
    transform: translateY(-10px);
    opacity: 0;
  }

  .list-dismiss-enter, .list-dismiss-leave-to {
    transform: translateX(10px);
    opacity: 0;
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
      listAction: 'list-dismiss',
    }
  },

  watch: {
    questions(cur, old) {
      if (cur.length > old.length) {
        // Adding a question
        this.listAction = 'list-dismiss'
      }
    },
  },

  methods: {
    dismissAllQuestions() {
      this.$emit('dismissAllQuestions')
    },
    upvoteQuestion(uid) {
      this.listAction = 'list-upvote'
      this.$emit('upvoteQuestion', uid)
    },
    dismissQuestion(uid) {
      this.listAction = 'list-dismiss'
      this.$emit('dismissQuestion', uid)
    },
  },
}
</script>