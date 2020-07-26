<template>
  <div class="ask-question-container">
    <v-btn
      class="ask-btn"
      @click="click"
      fab
      color="#65bb6aff"
      dark
      :class="{ 'disabled': disabled }"
    >
      <v-icon>{{ value ? 'mdi-send' : 'mdi-comment-question' }}</v-icon>
    </v-btn>

    <v-expand-transition>
      <v-card v-show="value" color="#aed581ff">
        <v-card-text>
        <form @submit="askQuestion">
          <v-textarea
            ref="textField"
            class="textField"
            v-model="question"
            @blur="onBlur"
            @keydown="inputHandler"
            label="Ask a question"
            hint="Shift+enter to go to a new line"
            :persistent-hint="true"
            :auto-grow="true"
            autocomplete="off"
            clearable
            solo
          ></v-textarea>
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
  .textField {
    color:black;
  }
  .disabled {
    pointer-events: none;
    color: gray !important;
    background-color: lightgray !important;
    border-color: lightgray !important;
  }

  .ask-question-container {
    position: relative;
    min-height: 1px;
  }
</style>

<script>
export default {
  name: 'AskQuestionDialog',

  props: {
    value: {type: Boolean, required: true},
  },

  data() {
    return {
      question: '',
    }
  },

  computed: {
    disabled() {
      return this.value && !this.question
    },
  },

  methods: {
    onBlur(e) {
      if (!this.question && this.value)
        this.$emit('input', false)
    },
    click(e) {
      if (!this.value) {
        // Open dialog
        this.$emit('input', true)
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
        this.$emit('input', false)
      }
    },
    inputHandler(e) {
      if (e.key === 'Enter') {
        if (e.shiftKey) {
          e.preventDefault()
          this.question += '\n'
        } else {
          this.askQuestion(e)
        }
      }
    }
  },
}
</script>