<template>
  <v-container fluid>
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
            <ButtonWithImage :onClick="signInWithGoogle" class="mb-2 mt-2" image="google_logo.svg" text="Continue with Google" />
            <!--<ButtonWithImage :onClick="console.log('email signin')" image="mail.png" text="Sign in with email/password" />-->
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
import firebase from 'firebase';
import ButtonWithImage from '@/components/ButtonWithImage'
import { signInGoogle } from '@/helpers.js'

export default {
  name: 'SignIn',

  components: {
    ButtonWithImage
  },

  methods: {
    signInWithGoogle: function () {
      signInGoogle();
    }
  }
}
</script>
