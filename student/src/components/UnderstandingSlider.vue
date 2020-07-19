<!-- TODO: support tap events (only supports mouse events rn) -->

<template>
  <div 
    @touchstart="moveThumbToTouch"
    @touchmove="moveThumbToTouch"
    @touchend="touchEnd"
    @mousedown="startDrag"
    @click="moveThumbToMouse"
    class="slider-container"
    tabindex="0"
    ref="slider-container"
  >
    <div 
      ref="slider"
      class="slider-bar"
    >
    </div>
    <v-img
      ref="slider-thumb"
      class="slider-thumb"
      :src="thumbSrc"
      :style="thumbStyle"
      transition="scale-transition"
      rel="preload"
    ></v-img>
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
    margin: 0 0.75em;
    height: 1.5em;
    position: relative;
    outline: none;
  }

  .slider-container:hover {
    cursor: pointer;
  }

  .slider-bar {
    z-index: 0;
    width: 100%;
    height: 80%;
    background-color: #eee;
    border-radius: 5px;
    /* box-shadow: inset 0 3px 10px rgba(0, 0, 0, 0.4); */
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    outline: none;

    user-select: none;
  }

  .slider-thumb {
    z-index: 2;
    width: 1.5em;
    height: 1.5em;
    position: absolute;
    transition: left 0.05s ease-in-out;
    outline: none;
    border-style: solid;
    border-radius: 50%;
    border-width: 1px;
    background-color: #ffdd55;

    /* disable dragging/selecting */
    user-select: none;
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

    user-select: none;
  }
</style>

<script>

export default {
  name: 'UnderstandingSlider',

  props: {
    value: Number,
    min: Number,
    max: Number,
    throttleDelay: Number,
    spamDelay: Number,
    spamLimit: Number,
  },

  data() {
    return {
      dragging: false,
      faces: {
        sad: require('@/assets/img/sad.svg'),
        meh: require('@/assets/img/meh.svg'),
        happy: require('@/assets/img/happy.svg'),
        wow: require('@/assets/img/wow.svg')
      },
      lastValue: this.value,
      lastValueTime: (new Date()).getTime(),
      lastValueSent: this.value,
      lastValueSentTime: (new Date()).getTime(),
      timeout: null,
      spamAmt: 0,
    }
  },

  computed: {
    percentage() {
      return this.getPercentageFromValue(this.value)
    },
    thumbSrc() {
      if (this.dragging) {
        return this.faces.wow
      } else if (this.valueInRange(0, 25)) {
        return this.faces.sad
      } else if (this.valueInRange(26, 65)) {
        return this.faces.meh
      } else if (this.valueInRange(66, 100)) {
        return this.faces.happy
      }
    },
    thumbStyle() {
      const img = `background-image: url(${this.thumbSrc});`
      const pos = `left: calc(${this.percentage}% - 0.75em);`
      return pos; 
    },
    range() {
      return this.max - this.min
    }
  },

  mounted() {
    window.addEventListener('mousemove', this.doDrag)
    window.addEventListener('mouseup', this.stopDrag)

    // Preload images (not sure if this works)
    /*for (let face in this.faces) {
      let img = new Image()
      img.onload = () => {
        console.log(`${face} preloaded`)
      }
      let imgURL = this.faces[face]
      img.src = imgURL
    }*/
  },

  destroyed() {
    window.removeEventListener('mousemove', this.doDrag)
    window.removeEventListener('mouseup', this.stopDrag)
  },

  methods: {
    startDrag(event) {
      this.dragging = true
    },
    doDrag(event) {
      if (this.dragging) {
        this.moveThumb(event.x)
      }
    },
    stopDrag(event) {
      this.dragging = false
      this.updateUnderstanding()
    },
    touchEnd() {
      this.dragging = false
      this.updateUnderstanding()
    },
    moveThumbToMouse(event) {
      this.moveThumb(event.x)
    },
    moveThumbToTouch(event) {
      this.dragging = true
      this.moveThumb(event.touches[0].clientX)
    },
    moveThumb(x) {
      //this.$refs['slider-container'].focus()
      const rect = this.$refs['slider'].getBoundingClientRect()
      const sliderLeft = rect.left
      const incrementWidth = rect.width/this.max

      const newValue = Math.round((x-sliderLeft)/incrementWidth)
      
      if (newValue >= this.max) {
        this.updateValue(this.max)
      } else if (newValue <= this.min) {
        this.updateValue(this.min)
      } else {
        this.updateValue(newValue)
      }
    },
    getTickStyle(i) {
      return `left: ${this.getPercentageFromValue(i)}%`
    },
    getPercentageFromValue(value) {
      return value/(this.max-this.min) * 100
    },
    getDiffPercentage(v1, v2) {
      return getPercentageFromValue(abs(v1-v2))
    },
    inRange(num, a, b) {
      return num >= a && num <= b
    },
    valueInRange(beginPercent, endPercent) {
      return this.inRange(this.value, this.min + beginPercent/100*this.range, this.min + endPercent/100*this.range)
    },
    updateValue(value) {
      if (value === this.value)
        return
      
      if (value > this.max)
        value = this.max
      else if (value < this.min)
        value = this.min

      this.$emit('input' , +value)
    },
    updateUnderstanding() {
      // Throttle sending student understanding to send 
      // at max once per `throttleDelay` milliseconds
      const currentTime = (new Date()).getTime()
      const sentDiff = Math.abs(currentTime - this.lastValueSentTime) // diff from when sent last value
      const diff = Math.abs(currentTime - this.lastValueTime)
      
      this.checkIfSpamming(diff)
      this.lastValue = this.value
      this.lastValueTime = currentTime
      
      let delay = 0
      if (sentDiff < this.throttleDelay)
        delay = this.throttleDelay - sentDiff  

      if (this.timeout)
        clearTimeout(this.timeout)

      this.timeout = setTimeout(() => {
        if (this.lastValueSent !== this.value) {
          this.lastValueSent = this.value
          this.lastValueSentTime = (new Date()).getTime()
          this.$emit('updateUnderstanding')
        }
      }, delay)
    },
    checkIfSpamming(timeDiff) {
      console.log('timediff ', timeDiff)
      if (timeDiff < this.spamDelay) {
        this.spamAmt++
        if (this.spamAmt > this.spamLimit) {
          console.log('SPAMMING TOO MUCH')
        }
      } else {
        this.spamAmt = 0
      }
    },
  },

}
</script>