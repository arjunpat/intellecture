<template>
  <v-card v-if="student">
    <v-card-title>
      <v-avatar 
        class="mr-2"
        :size="$vuetify.breakpoint.xs ? '36' : '48'"
      >
        <img :src="student.photo">
      </v-avatar>
      <span 
        :class="$vuetify.breakpoint.xs ? 'text-h6' : 'text-h4'"
        style="font-weight: bold;"
      >{{ `${student.first_name} ${student.last_name}` }}</span>
    </v-card-title> 
    <v-card-text>
      <v-row class="text-center">
        <v-col
          cols="12"
          sm="3"
        >
          <div class="mb-2">Present-ness</div>
          <v-progress-circular
            :color="getColor(present)"
            :width="3"
            :value="present"
            :size="size"
            :rotate="-90"
          >{{ `${present}%` }}</v-progress-circular>
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <div class="mb-2">Avg. Understanding (1-10)</div>
          <v-progress-circular
            :color="getColor(understandingPercent)"
            :width="3"
            :value="understandingPercent"
            :size="size"
            :rotate="-90"
          >{{ understanding }}</v-progress-circular>
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <div class="mb-2">Questions Asked</div>
          <div
            :style="{
              fontSize: `${size}px`,
              height: `${size}px`,
              position: 'relative'
            }"
          >
            <div class="centered-text">{{ quesCount }}</div>
          </div>
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <div class="mb-2">Questions Upvoted</div>
          <div
            :style="{
              fontSize: `${size}px`,
              height: `${size}px`,
              position: 'relative'
            }"
          >
            <div class="centered-text">{{ upvoteCount }}</div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.centered-text {
  position: absolute; 
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%);
}
</style>

<script>
export default {
  name: 'StudentInfoCard',

  props: {
    student: { type: Object, required: true },
    present: { type: Number, required: true },
    understanding: { type: Number, required: true },
    quesCount: { type: Number, required: true },
    upvoteCount: { type: Number, required: true }, 
    maxUnderstanding: { type: Number, required: true },
  },

  data() {
    return {
      size: 100,
    }
  },

  computed: {
    understandingPercent() {
      return this.understanding/this.maxUnderstanding * 100
    }
  },

  methods: {
    getColor(value) {
      if (value < 30)
        return 'error'
      if (value < 60)
        return 'warning'
      return 'success'
    },
  },
}
</script>