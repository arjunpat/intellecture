<template>
  <div class="ask-question-container">
    <v-btn
      class="ask-btn"
      @click="click"
      fab
      color="#65bb6aff"
      dark
    >
      <v-icon>{{ showDialog ? 'mdi-send' : 'mdi-comment-question' }}</v-icon>
    </v-btn>

    <v-expand-transition>
      <v-card v-show="showDialog" color="#aed581ff" dark>
        <v-card-text>
        <form @submit="askQuestion">
          <v-text-field
            ref="textField"
            v-model="question"
            label="Ask a question"
            hide-details="true"
            autocomplete="off"
            solo-inverted
            @blur="onBlur"
          ></v-text-field>
        </form>
        </v-card-text>
      </v-card>
    </v-expand-transition>
  </div>
</template>

<style scoped>
  .ask-btn {
    z-index: 2;
    position: absolute;
    left: 50%;
    bottom: 0; 
    transform: translate(-50%, 50%);
  }

  .ask-question-container {
    position: relative;
  }
</style>

<script>
export default {
  name: 'AskQuestionDialog',

  data() {
    return {
      question: '',
      showDialog: false,
    }
  },

  methods: {
    onBlur(e) {
      if (!this.question)
        this.showDialog = false 
    },
    click(e) {
      if (!this.showDialog) {
        // Open dialog
        this.showDialog = true 
        this.$nextTick(() => this.$refs.textField.focus())
      } else {
        // Send question
        this.askQuestion(e)
      }
    },
    askQuestion(e) {
      e.preventDefault()

      if (this.question) {
        this.$emit('askQuestion', this.question)
        this.question = ''
        this.showDialog = false
      }
    },
  },
}
</script>