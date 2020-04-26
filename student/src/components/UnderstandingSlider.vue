<!-- TODO: support tap events (only supports mouse events rn) -->

<template>
  <div class="slider-container">
    <div 
      @click="moveToMouse"
      ref="slider"
      class="slider-bar"
      tabindex="0"
    >
    </div>
    <div 
      @mousedown="this.startDrag"
      ref="slider-thumb"
      class="slider-thumb"
      tabindex="0"
      draggable="false"
      :style="thumbStyle"
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

  .slider-thumb {
    z-index: 5;
    width: 1.5em;
    height: 1.5em;
    position: absolute;
    transition: left 0.1s ease-in-out;
    background-position: center;
    background-size: cover;
    outline: none;

    /* disable dragging/selecting */
    user-select: none;
  }

  .slider-thumb:hover {
    left: 10%;
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
    }
  },

  computed: {
    percentage() {
      return this.getPercentageFromValue(this.value)
    },
    thumbStyle() {
      const img = `background-image: url(${require('@/assets/img/happy.svg')});`
      const pos = `left: calc(${this.percentage}% - 0.75em);`
      return img + pos; 
    }
  },

  mounted() {
    window.addEventListener('mousemove', this.doDrag)
    window.addEventListener('mouseup', this.stopDrag)
  },

  destroyed() {
    window.removeEventListener('mousemove', this.doDrag)
    window.removeEventListener('mouseup', this.stopDrag)
  },

  methods: {
    startDrag(event) {
      this.dragging = true
      this.startX = event.x
    },
    doDrag(event) {
      if (this.dragging) {
        this.moveToMouse(event)
      }
    },
    stopDrag(event) {
      this.dragging = false
    },
    getTickStyle(i) {
      return `left: ${this.getPercentageFromValue(i)}%`
    },
    moveToMouse(event) {
      const rect = this.$refs['slider'].getBoundingClientRect()
      const sliderLeft = rect.left
      const incrementWidth = rect.width/this.max
      const mouseX = event.x

      const newValue = Math.round((mouseX-sliderLeft)/incrementWidth)
      
      if (newValue >= this.max) {
        this.updateValue(this.max)
      } else if (newValue <= this.min) {
        this.updateValue(this.min)
      } else {
        this.updateValue(newValue)
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