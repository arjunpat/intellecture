<template>
  <div>
    <div style="position: relative;">
      <div
        :style="{ 
        'background-color': show ? backgroundColor : 'unset',
        'z-index': show ? 4 : 0,
        position: show ? 'relative' : 'static',
        'border-radius': (show && !last) ? '5px': '0px',
        'pointer-events': show ? 'none': 'unset',
      }"
      >
        <slot></slot>
      </div>
      <v-card
        v-if="show"
        class="tutorial-card"
        raised
        :style="{
          top: bottom ? `calc(100% + ${spacing})` : 'unset',
          bottom: top ? `calc(100% + ${spacing})` : 'unset',
        }"
      >
        <v-card-title>
          <slot name="title"></slot>
        </v-card-title>
        <v-card-text>
          <slot name="explanation"></slot>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="$emit('cancel')" text>Cancel</v-btn>
          <v-btn @click="$emit('next')" text color="info">
            <span v-if="!last">Next</span>
            <span v-else>Done</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <div v-if="show" class="tutorial-overlay"></div>
  </div>
</template>

<style scoped>
.tutorial-overlay {
  position: fixed;
  background: rgba(51, 51, 51, 0.7);
  z-index: 3;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
}

.tutorial-card {
  position: absolute;
  z-index: 4;
  width: 100%;
  font-family: var(--main-font);
}
</style>

<script>
export default {
  name: 'TutorialDisplay',

  props: {
    show: { type: Boolean, required: true },
    backgroundColor: { type: String, default: 'white' },
    spacing: { type: String, default: '10px' },
    bottom: { type: Boolean, default: false },
    top: { type: Boolean, default: false },
    last: { type: Boolean, default: false },
  },
}
</script>