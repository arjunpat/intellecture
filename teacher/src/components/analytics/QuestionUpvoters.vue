<template>
  <v-dialog v-model="showLocal" max-width="400" content-class="ma-0">
    <v-card>
      <v-card-title>Upvoters</v-card-title>
      <v-divider></v-divider>

      <v-card-text style="height: 300px; overflow-y: scroll">
        <div v-if="!upvoters" class="text-center">
          <v-progress-circular :indeterminate="true" color="primary" class="mt-4"></v-progress-circular>
        </div>
        <div v-else-if="upvoters.length === 0" class="text-center text-h6 mt-4">No upvoters!</div>
        <v-list v-else>
          <v-list-item v-for="upvoter in upvoters" :key="upvoter.account_uid">
            <v-list-item-avatar>
              <v-img :src="upvoter.photo"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ `${upvoter.first_name} ${upvoter.last_name}` }}</v-list-item-title>
              <v-list-item-subtitle>Upvoted at {{ elapsedToTimeString(startTime, upvoter.upvoteTime) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="$emit('close')">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { elapsedToTimeString } from '@/helpers.js'

export default {
  props: {
    upvoters: { type: Array, default: null },
    show: { type: Boolean, default: false },
    startTime: Number,
  },
  data() {
    return {
      showLocal: false,
    }
  },
  methods: {
    elapsedToTimeString,
  },
  watch: {
    show() {
      this.showLocal = this.show
    },
    showLocal() {
      if (this.showLocal === false) {
        this.$emit('close')
      }
    },
  },
}
</script>