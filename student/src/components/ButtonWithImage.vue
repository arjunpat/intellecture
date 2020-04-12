<template>
  <v-btn :color="color" @click="onClick">
    <v-img 
      :src="require(`@/assets/${image}`)"
      contain
      max-height="2em"
      max-width="2em"
      class="btn-img"
      transition="scale-transition"
    ></v-img>
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
    image: {type: String, required: true},
    text: {type: String, required: true},
    onClick: {type: Function, required: true},
    color: {type: String, default: ''},
  },
}
</script>