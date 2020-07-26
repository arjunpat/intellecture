<template>
  <v-btn :color="color" @click="onClick" :dark="dark">
    <v-img 
      v-if="!isAvatar"
      :src="src"
      contain
      max-height="2em"
      max-width="2em"
      class="btn-img"
      :class="dark ? '' : ''"
      transition="scale-transition"
    ></v-img>
    <v-avatar
      v-else
      height="2em"
      width="2em"
    >
      <img :src="src">
    </v-avatar>
    {{ text }}
  </v-btn>
</template>

<style scoped>
  .btn-img {
    position: absolute;
    left: 0;
  }
</style>

<script>
export default {
  name: 'ButtonWithImage',
  props: {
    src: {type: String, required: true},
    text: {type: String, required: true},
    color: {type: String, default: ''},
    dark: {type: Boolean, default: false},
    isAvatar: {type: Boolean, default: false},
  },
  methods: {
    onClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>