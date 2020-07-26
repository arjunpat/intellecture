<template>
  <div style="display: inline-block">
    <slot name="activator"></slot>

    <v-dialog
      v-model="dialog"
      :width="width"
    >
      <v-card style="font-family: var(--main-font);">
        <v-card-title v-if="!lowerHeader">
          {{ header }}
        </v-card-title>
        
        <v-card-text>
          <h1 v-if="lowerHeader" class="pt-5" id="dialogHeader">{{ header }}</h1>
          <slot name="content"></slot>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            :color="btnColor"
            text
            @click="dialog = false"
          >
            {{ btnText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
export default {
  name: 'Dialog',

  props: {
    show: { type: Boolean, required: true },
    header: { type: String, required: true },
    width: { type: Number, default: 250 },
    btnText: { type: String, default: 'Okay'},
    btnColor: { type: String, default: 'green darken-1'},
    lowerHeader: {type: Boolean, default: false }
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

<style scoped>

  #dialogHeader {
    font-size: 20px;
  }

</style>