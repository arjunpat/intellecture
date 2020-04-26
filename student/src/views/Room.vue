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
          <v-card-title class="noto">UNDERSTANDING</v-card-title>
          <v-card-text id="understanding" class="text-center headline mb-3" :style="{color: color}">{{ understanding }}</v-card-text>
          <v-card-actions>
          <UnderstandingSlider
            v-model="sliderValue"
            :min="0"
            :max="sliderMax"
          >
          </UnderstandingSlider>
          </v-card-actions>
        </v-card>
        <v-card>
          <v-card-title class="noto">QUESTIONS</v-card-title>
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

  .noto {
    font-family: 'Noto Sans';
    font-weight: 600;
  }

  .row {
    max-width: unset !important;
  }
</style>
<script>
import UnderstandingSlider from '@/components/UnderstandingSlider'

export default {
  name: 'Room',
  data() {
    return {
      sliderValue: 5,
      sliderMax: 10,
      tickLabels: ['😭', '', '', '', '', '😐', '', '', '', '', '😄'],
      levels: ['I\'m lost', 'I\'m confused', 'I kinda get it', 'I think I get it', 'I completely understand'],
      colors: ['rgb(240, 53, 36)', 'rgb(255, 183, 0)', 'rgb(250, 225, 0)', 'rgb(126, 196, 4)', 'rgb(127, 240, 7)'],
      color: '',
    }
  },

  components: {
    UnderstandingSlider,
  },

  computed: {
    understanding: function() {
      let index = Math.floor((+this.sliderValue+1)/2) - 1
      this.color = index < 0 ? 'rgb(0,0,0)' : this.colors[index]
      return index < 0 ? '😭' : this.levels[index]
    }
  },
}
</script>
