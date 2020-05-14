<template>
  <v-row align="center" justify="center">
    <AutoSnackbar
      :text="error"
      color="error"
    />
    <v-col
      cols="12"
      sm="12"
      md="12"
      lg="12"
    >
      <div class="container white--text">
        <div class="display-4 text-center">{{ face }}</div>
        <div class="display-2 mb-2"> You do not appear to be signed in...</div>
        <ButtonWithImage
          :src="require('@/assets/img/google_logo.svg')"
          text="Continue with Google"
          color="white"
          :dark="false"
          @click="signInGoogle"
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
import AutoSnackbar from '@/components/AutoSnackbar'
import ButtonWithImage from '@/components/ButtonWithImage'
import { signInGoogle } from '@/helpers'

export default {
  name: 'NotSignedIn',
  
  components: {
    ButtonWithImage,
    AutoSnackbar,
  },

  data() {
    return {
      face: '😐',
      error: '',
    }
  },

  methods: {
    signInGoogle() {
      this.error = ''
      signInGoogle().then((result) => {
        this.face = '😍'
      }).catch((err) => {
        this.error = 'There was an error signing in! Please try again later.'
      })
    }
  },
}
</script>