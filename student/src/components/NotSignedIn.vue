<template>
<v-row align="center" justify="center">
  <v-col
    cols="12"
    sm="12"
    md="12"
    lg="12"
  >
    <div class="container">
      <div class="display-4 text-center">😐</div>
      <div class="display-2 mb-2"> You do not appear to be signed in...</div>
      <ButtonWithImage
        :src="require('@/assets/img/google_logo.svg')"
        text="Continue with Google"
        color="white"
        :dark="false"
      ></ButtonWithImage>
    </div>
  </v-col>
</v-row>
</template>

<style scoped>
.v-btn {
  width: 100%;
}

.container {
  width: 100%;
}
</style>

<script>
import ButtonWithImage from '@/components/ButtonWithImage'

export default {
  name: 'NotSignedIn',
  
  components: {
    ButtonWithImage,
  }
}
</script>