<!-- TODO: support tap events (only supports mouse events rn) -->

<template>
  <div class="slider-container">
    <div 
      class="slider-bar"
      tabindex="0"
      ref="slider"
    >
    </div>
    <div 
      class="slider-thumb-container"
      tabindex="0"
      @click="sliderBarClick"
    ></div>
    <div 
      v-for="i in (max-1)" 
      :key="i"
      class="slider-tick"
      :style="getTickStyle(i)"
    >
    </div>
  </div>
</template>

<style scoped>
  .slider-container {
    margin: 0 1.5em;
    width: 100%;
    height: 1.5em;
    position: relative;
  }

  .slider-bar {
    z-index: 0;
    width: 100%;
    height: 80%;
    background-color: #eee;
    border-radius: 5px;
    box-shadow: inset 0 3px 10px rgba(0, 0, 0, 0.4);
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    outline: none;
  }

  .slider-thumb-container {
    z-index: 5;
    width: 100%;
    height: 100%;
    position: absolute;
    outline: none;
  }

  .slider-tick {
    z-index: 1;
    width: 5px;
    height: 5px;
    background-color:rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
  }
</style>

<script>
import { SVG } from '@svgdotjs/svg.js'

export default {
  name: 'UnderstandingSlider',

  props: {
    value: Number,
    min: Number,
    max: Number,
  },

  data() {
    return {
      dragging: false,
      startX: 0,
      draw: null,
      thumb: null,
    }
  },

  watch: {
    value: function(val, oldVal) {
      this.thumb.animate({
        duration: 50*Math.abs(val-oldVal)*0.75,
      }).cx(`${this.getPercentageFromValue(val)}%`)
    }
  },

  mounted() {
    window.addEventListener('mousemove', this.doDrag)
    window.addEventListener('mouseup', this.stopDrag)
    this.draw = SVG().addTo('.slider-thumb-container').size('100%', '100%')
    this.thumb = this.draw.circle('1.5em').attr({
      fill: '#f06', 
      cx: `${this.getPercentageFromValue(this.value)}%`,
    })
    this.thumb.on('mousedown', this.startDrag)
  },

  destroyed() {
    window.removeEventListener('mousemove', this.doDrag)
    window.removeEventListener('mouseup', this.stopDrag)
    this.thumb.off('mousedown')
  },

  methods: {
    startDrag(event) {
      this.dragging = true
      this.startX = event.x
    },
    doDrag(event) {
      if (this.dragging) {
        const rect = this.$refs['slider'].getBoundingClientRect()
        const sliderLeft = rect.left
        const sliderRight = rect.right
        const mouseX = event.x
        const incrementWidth = rect.width/this.max
        
        // If mouse is past the slider's boundaries,
        // set value to min or max respectively
        if (mouseX < sliderLeft) {
          if (this.value != this.min) {
            this.updateValue(this.min)
            this.startX = sliderLeft
          }
        } else if (mouseX > sliderRight) {
          if (this.value != this.max) {
            this.updateValue(this.max)
            this.startX = sliderRight
          }
        } else {
          const change = Math.round((mouseX - this.startX) / incrementWidth)
          
          this.updateValue(this.value + change)
          this.startX += change*incrementWidth
        }
      }
    },
    stopDrag(event) {
      this.dragging = false
    },
    getTickStyle(i) {
      return `left: ${this.getPercentageFromValue(i)}%`
    },
    sliderBarClick(event) {
      const rect = this.$refs['slider'].getBoundingClientRect()
      const sliderLeft = rect.left
      const incrementWidth = rect.width/this.max
      const mouseX = event.x

      const clickedValue = Math.round((mouseX-sliderLeft)/incrementWidth)
      
      if (clickedValue >= this.max) {
        this.updateValue(this.max)
      } else if (clickedValue <= this.min) {
        this.updateValue(this.min)
      } else {
        this.updateValue(clickedValue)
      }
    },
    getPercentageFromValue(value) {
      return value/(this.max-this.min) * 100
    },
    inRange(num, target, range) {
      return Math.abs(num - target) <= range
    },
    updateValue(value) {
      if (value > this.max)
        value = this.max
      else if (value < this.min)
        value = this.min

      this.$emit('input' , +value)
    },
  },

}
</script>