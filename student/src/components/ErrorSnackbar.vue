<template>
  <v-snackbar
    v-model="show"
    top
    color="error"
  >
    {{ error }}
    <v-btn
      text
      @click="show = false"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'ErrorSnackbar',
  
  props: {
    error: {type: String, default: ''},
  },

  data() {
    return {
      show: false,
    }
  },

  watch: {
    error: {
      immediate: true,
      handler(error) {
        if (error)
          this.show = true
      },
    },
  },
}
</script>