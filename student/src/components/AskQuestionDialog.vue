<template>
  <div id="container" class="mt-8">
    <v-btn
      id="ask-btn"
      @click="click"
      fab
      color="primary"
    >
      <v-icon>{{ showDialog ? 'mdi-send' : 'mdi-comment-question' }}</v-icon>
    </v-btn>

    <v-expand-transition>
      <v-card id="form-card" v-show="showDialog">
        <v-card-text>
        <form @submit="askQuestion">
          <v-text-field
            ref="textField"
            v-model="question"
            label="Ask a question"
            hide-details="true"
            outlined
            autocomplete="off"
          ></v-text-field>
        </form>
        </v-card-text>
      </v-card>
    </v-expand-transition>
  </div>
</template>

<style scoped>
  #ask-btn {
    z-index: 2;
    position: absolute;
    left: 50%;
    bottom: 0; 
    transform: translate(-50%, 50%);
  }

  #container {
    position: relative;
  }
</style>

<script>
export default {
  name: 'AskQuestionDialog',

  data() {
    return {
      question: '',
      showDialog: true,
    }
  },

  methods: {
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

      this.$emit('askQuestion', this.question)
      this.question = ''
      this.showDialog = false
    },
  },
}
</script>