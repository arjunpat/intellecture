<template>
  <div
    class="pa-1"
    :style="{
      'max-height': maxHeight,
      overflow: 'hidden',
      position: 'relative',
      transition: 'max-height 1s',
    }"
  >
    <slot></slot>
    <v-btn v-if="!expand" class="show-more-btn" text color="black" @click="expand = true">
      <strong>Show more</strong>
    </v-btn>
  </div>
</template>

<style scoped>
.show-more-btn {
  height: 20%;
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  background-image: linear-gradient(
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.7),
    rgba(255, 255, 255, 1)
  );
  border-radius: 0;
}
</style>

<script>
export default {
  name: 'ShowMoreContainer',

  props: {
    initHeight: { type: String, default: '10rem' },
  },

  data() {
    return {
      expand: false,
    }
  },

  computed: {
    maxHeight() {
      if (!this.expand) return this.initHeight
      else return '1000px'
    },
  },
}
</script>