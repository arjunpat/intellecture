<template>
  <v-container fluid style="height: 100%;">
    <AutoSnackbar
      :text="error"
      color="error"
    />
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="6"
        lg="4"
      >
        <v-card class="pb-3">
          <v-card-title style="font-family: var(--main-font); font-weight: 600;">SIGN IN</v-card-title>
          <v-divider></v-divider>
          <v-card-text align="center">
            <ButtonWithImage @click="signInWithGoogle" class="mb-2 mt-2" :src="require('@/assets/img/google_logo.svg')" text="Continue with Google" />
            <!--<ButtonWithImage :onClick="console.log('email signin')" :src="require('@/assets/img/mail.png')" text="Sign in with email/password" />-->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  .v-btn {
    width: 100%;
    height: 3em !important;
  }

  .row {
    max-width: unset !important;
  }
</style>

<script>
import ButtonWithImage from '@/components/ButtonWithImage'
import AutoSnackbar from '@/components/AutoSnackbar'
import { signInGoogle, log } from '@/helpers'

export default {
  name: 'SignIn',

  data() {
    return {
      error: '',
    }
  },

  components: {
    ButtonWithImage,
    AutoSnackbar
  },

  methods: {
    signInWithGoogle() {
      this.error = ''
      signInGoogle().catch((err) => {
        this.error = 'There was an error signing in! Please try again later.'
        log(err)
      })
    }
  }
}
</script>
