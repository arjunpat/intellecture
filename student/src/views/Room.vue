<template>
  <v-container>
    <v-card>
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
    <v-row>
    </v-row>
  </v-container>
</template>
<style>
  #understanding {
    transition: all 0.4s;
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
      this.color = this.colors[index < 0 ? 0 : index];
      return this.levels[index < 0 ? 0 : index];
    }
  }
};
</script>
