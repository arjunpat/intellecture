<template>
  <v-container fluid class="fill-height _green">
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
            >
            <div id="logo-text">INTELLECTURE</div>
          </div>
        </v-expand-transition>
        
        <v-card>
          <v-card-title>Join Room</v-card-title>
          <v-card-text align="center">
            <form @submit="join">
              <v-text-field
                label="Room Code"
                v-model="roomCode"
                :class="validRoomCode ? 'mb-n3' : ''"
                :rules="[ validRoomCode || 'Invalid room code!' ]"
                outlined
              ></v-text-field>

              <ButtonWithImage 
                :onClick="join" 
                :color="colors._green_2" 
                :dark="true" 
                :text="btnText" 
                :src="btnImageSrc" 
                :isAvatar="authUser !== null"
              />
            </form>

            <div v-if="authUser" class="mt-2">Not you? (<a href="" @click.prevent="signOut">Sign out</a>)</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  .v-text-field {
    transition: margin-bottom 0.3s;
  }

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
    width: 1.6em;
    height: 1.6em;
  }

  #logo-text {
    font-family: 'Noto Sans', sans-serif;
    font-size: 65px;
    font-weight: 600;
    display: inline-block;
    position: relative;
    bottom: 13px;
  }
</style>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import ButtonWithImage from '@/components/ButtonWithImage'
import { mapState } from 'vuex'
import { colors } from '@/constants.js'
import { get, setTokenForUser } from '@/helpers.js'

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
      validRoomCode: true,
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
    join(e) {
      e.preventDefault()

      if (this.authUser) {
        this.redirectToRoom()
      } else {
        // Sign user in if not already signed in
        this.signInGoogle().then((result) => {
          // TODO: find a better way to do this rather than setting token twice
          //       It sets it here and also in main.js
          return setTokenForUser(result.user)
        }).then(() => {
          this.redirectToRoom()
        }).catch((err) => {
          // TODO: make this not alert()
          alert(err.message)
        })
      }
    },
    redirectToRoom() {
      // Check if room exists
      this.validRoomCode = true
      get(`/lectures/exists/${this.roomCode}`).then((response) => {
        if (!response.success)
          throw response.error

        if (!response.data.exists) {
          // Room does not exist
          this.validRoomCode = false
        } else {
          // Redirect to room page
          this.$router.replace(`/room/${this.roomCode}`)
        }
      }).catch((err) => {
        console.log(err)
      })
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
