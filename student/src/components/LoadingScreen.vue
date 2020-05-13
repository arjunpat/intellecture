<template>
  <div :style="{
    position: 'absolute', 
    top: show ? '0' : '-100%',
    left: '0', 
    width: '100%',
    height: '100%',
    'z-index': '99',
    transition: 'top .5s ease',
  }" class="_green">
  </div>
</template>

<script>
export default {
  name: 'LoadingScreen',

  props: {
    show: { type: Boolean, required: true },
  },


}
</script>