<template>
  <div style="display: inline-block">
    <slot name="activator"></slot>

    <v-dialog v-model="show" :width="width">
      <v-card style="font-family: var(--main-font);">
        <v-card-title v-if="!lowerHeader">{{ header }}</v-card-title>

        <v-card-text>
          <h1 v-if="lowerHeader" class="pt-5" id="dialogHeader">{{ header }}</h1>
          <slot name="content"></slot>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn :color="btnColor" text @click="submit">{{ btnText }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
export default {
  name: 'Dialog',

  props: {
    value: { type: Boolean, required: true },
    header: { type: String, required: true },
    width: { type: Number, default: 250 },
    btnText: { type: String, default: 'Okay' },
    btnColor: { type: String, default: 'green darken-1' },
    lowerHeader: { type: Boolean, default: false },
  },

  watch: {
    value() {
      this.show = this.value
      if (!this.value) {
        this.$emit('close')
      }
    },
    show() {
      this.$emit('input', this.show)
    },
  },

  data() {
    return {
      show: this.value,
    }
  },

  methods: {
    submit() {
      this.$emit('input', false)
      this.$emit('submit')
    },
  },
}
</script>

<style scoped>
#dialogHeader {
  font-size: 20px;
}
</style>