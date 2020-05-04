<template>
  <v-container fluid class="fill-height _green">
    <v-snackbar
      v-model="snackbar"
      top
      color="error"
    >
      {{ error }}
      <v-btn
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
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
            <v-form 
              v-model="validForm" 
              ref="form"
              lazy-validation 
              @submit="join"
            >
              <v-text-field
                label="Room Code"
                v-model="roomCode"
                :class="validForm ? 'mb-n3' : ''"
                :rules="roomCodeRules"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                @input="roomCodeInput"
                outlined
              ></v-text-field>

              <ButtonWithImage 
                @click="join" 
                :color="colors._green_2" 
                :dark="true" 
                :text="btnText" 
                :src="btnImageSrc" 
                :isAvatar="authUser !== null"
              />
            </v-form>

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
import { colors } from '@/constants'
import { get, setTokenForUser, signInGoogle } from '@/helpers'

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

  props: {
    error: {type: String, default: ''},
  },

  data() {
    return {
      colors,
      show: false,
      validForm: true,
      roomCode: '',
      validRoomCode: true,
      btnText: 'Continue with Google',
      btnImageSrc: require('@/assets/img/google_logo_white.svg'),
      roomCodeRules: [
        v => !!v || 'Please enter a room code.', 
        v => this.validRoomCode || 'Invalid room code!', 
      ],
      snackbar: false,
    }
  },

  mounted() {
    // Do a cool little animation when loaded
    setTimeout(() => {this.show = true}, 100)

    if (this.error)
      this.snackbar = true
  },

  computed: {
    ...mapState(['authUser']),
  },

  methods: {
    roomCodeInput() {
      this.validRoomCode = true
      this.$refs['form'].validate()
    },
    join(e) {
      e.preventDefault()

      this.$refs['form'].validate()
      if (!this.roomCode)
        return

      this.roomCode = this.roomCode.toLowerCase()

      if (this.authUser) {
        this.redirectToRoom()
      } else {
        // Sign user in if not already signed in
        signInGoogle().then((result) => {
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
      this.$refs['form'].validate()
      get(`/lectures/exists/${this.roomCode}`).then((response) => {
        if (!response.success)
          throw response.error

        if (!response.data.exists) {
          // Room does not exist
          this.validRoomCode = false
          this.$refs['form'].validate()
        } else {
          // Redirect to room page
          this.$router.replace(`/room/${this.roomCode}`)
        }
      }).catch((err) => {
        console.log('ERROR WHEN CHECKING EXISTS: ', err)
      })
    },
    signOut() {
      firebase.auth().signOut()
    }
  }
}
</script>
