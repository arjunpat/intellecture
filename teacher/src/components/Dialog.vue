<template>
  <v-row class="d-flex flex-row-reverse pr-3">
    <slot></slot>

    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">{{ header }}</v-card-title>

        <v-card-text>
          {{ text }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Okay
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
export default {
  name: 'Dialog',

  props: {
    show: { type: Boolean, required: true },
    header: { type: String, required: true },
    text: { type: String, required: true }
  },

  data() {
      return {
        dialog: false
      }
  },

  watch: {
    show(val) {
        if(val) {
            this.dialog = true
        }
    },
    dialog(val) {
        if(!val) {
            this.$emit('close');
        }
    }
  }
}
</script>