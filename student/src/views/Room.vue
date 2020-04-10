<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col
        cols="12"
        sm="8"
        md="6"
        lg="4"
      >
        <v-card class="mb-3">
          <v-card-title>Rate your understanding</v-card-title>
          <v-card-text id="understanding" class="text-center headline" :style="{color: color}">{{ understanding }}</v-card-text>
          <v-card-actions>
          <v-slider
            v-model="sliderValue"
            :tick-labels="tickLabels"
            :max="10"
            thumb-label="always"
          ></v-slider>
          </v-card-actions>
        </v-card>
        <v-card>
          <v-card-title>Questions</v-card-title>
          <v-card-text align="center">
            <v-text-field
              label="Ask a question"
              hide-details="true"
              outlined
              class="mb-n3"
            ></v-text-field>
            <v-btn color="primary">Ask</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
  #understanding {
    transition: all 0.4s;
  }

  .v-btn {
    width: 100%;
    height: 3.7em !important;
  }

  .row {
    max-width: unset !important;
  }
</style>
<script>
export default {
  name: 'Room',
  data() {
    return {
      sliderValue: 5,
      tickLabels: ['😭', '', '', '', '', '😐', '', '', '', '', '😄'],
      levels: ['I\'m lost', 'I\'m confused', 'I kinda get it', 'I think I get it', 'I completely understand'],
      colors: ['rgb(240, 53, 36)', 'rgb(255, 183, 0)', 'rgb(250, 225, 0)', 'rgb(126, 196, 4)', 'rgb(127, 240, 7)'],
      color: '',
    };
  },
  computed: {
    understanding: function() {
      let index = Math.floor((this.sliderValue+1)/2) - 1;
      this.color = index < 0 ? 'rgb(0,0,0)' : this.colors[index];
      return index < 0 ? '😭' : this.levels[index];
    }
  }
};
</script>
