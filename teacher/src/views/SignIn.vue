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
          <v-card-title>SIGN IN</v-card-title>
          <v-card-text align="center">
            <ButtonWithImage :onClick="signInGoogle" class="mb-4" image="google_logo.svg" text="Continue with Google" />
            <ButtonWithImage image="mail.png" text="Sign in with email/password" />
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
import { firebase } from '@/store/db.js'
import ButtonWithImage from '@/components/ButtonWithImage'

export default {
  name: 'SignIn',

  components: {
    ButtonWithImage
  },

  methods: {
    signInGoogle () {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider).then((result) => {
        console.log(result.user)
      }).catch((err) => {
        // TODO: make this not alert()
        alert(err.message)
      })
    }
  }
}
</script>
