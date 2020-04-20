<template>
  <v-container fluid class="fill-height green lighten-2">
    <v-row
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="6"
        lg="4"
      > 
        <v-expand-transition>
          <div class="display-2 white--text mb-4 text-center" v-show="show">
            
            <img
              src="@/assets/img/logo.svg"
              id="logo"
              class="mr-1"
            >
            <span id="logo-text">Intellecture</span>
          </div>
        </v-expand-transition>

        <v-card>
          <v-card-title>Join Room</v-card-title>
          <v-card-text align="center">
            <v-text-field
              label="Room Code"
              v-model="roomCode"
              hide-details="true"
              outlined
              class="mb-n3"
            ></v-text-field>

            <ButtonWithImage 
              :onClick="join" 
              color="green" 
              :dark="true" 
              :text="btnText" 
              :src="btnImageSrc" 
              :isAvatar="authUser !== null"
            />

            <div v-if="authUser" class="mt-2">Not you? (<a href="" @click.prevent="signOut">Sign out</a>)</div>
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
    width: 100%;
    position: absolute;
    top: 30%;
  }

  #logo {
    width: 1em;
    height: 1em;
  }
</style>

<script>
import firebase from 'firebase'
import ButtonWithImage from '@/components/ButtonWithImage'
import { mapState } from 'vuex'
import { colors } from '@/constants.js'

export default {
  name: 'Join',

  components: {
    ButtonWithImage,
  },

  watch: {
    authUser: {
      immediate: true,
      handler(authUser) {
        if (authUser) {
          this.btnText = `Continue as ${authUser.displayName}`
          this.btnImageSrc = authUser.photoURL
        } else {
          this.btnText = 'Continue with Google'
          this.btnImageSrc = require('@/assets/img/google_logo_white.svg')
        }
      }
    }
  },

  data() {
    return {
      colors,
      show: false,
      roomCode: '',
      btnText: 'Continue with Google',
      btnImageSrc: require('@/assets/img/google_logo_white.svg'),
    }
  },

  mounted() {
    // Do a cool little animation when loaded
    setTimeout(() => {this.show = true}, 100)
  },

  computed: {
    ...mapState(['authUser']),
  },

  methods: {
    join() {
      if (this.authUser) {
        this.redirectToRoom()
      } else {
        this.signInGoogle().then(() => {
          this.redirectToRoom()
        }).catch((err) => {
          // TODO: make this not alert()
          alert(err.message)
        })
      }
    },
    redirectToRoom() {
      // TODO: validate that room with code `roomCode` exists
      this.$router.replace(`/room/${this.roomCode}`)
    },
    signInGoogle() {
      let provider = new firebase.auth.GoogleAuthProvider()
      return firebase.auth().signInWithPopup(provider)
    },
    signOut() {
      firebase.auth().signOut()
    }
  }
}
</script>
