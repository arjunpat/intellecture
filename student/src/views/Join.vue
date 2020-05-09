<template>
  <v-container fluid class="fill-height _green overflow">
    <ErrorSnackbar
      :error="currentError"
    ></ErrorSnackbar>
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
          <div class="display-2 white--text mb-4 text-center" style="display:inline-block" v-show="show">
            <v-row class="bufferUp text-center mx-auto justify-contents-center align-center">
              <img
                src="@/assets/img/logo.svg"
                id="logo"
              >
              <div id="logo-text">INTELLECTURE</div>
            </v-row>
          </div>
        </v-expand-transition>

        <v-card class="mt-3">
          <v-card-title class="font-weight-bold">Join Room</v-card-title>
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
  .overflow {
    overflow:hidden;
  }
  #element::-webkit-scrollbar {
    display: none;
  }

  .v-btn {
    width: 100%;
    height: 3em !important;
  }
  .bufferUp {
    transform:translateY(-160%);
    align-content: center;
  }
  .row {
    width: 100%;
    position: absolute;
    top: 30%;
  }

  #logo {
    width: 1.6em;
    height: 1.6em;
    display: inline-block;
  }

  #logo-text {
    font-family: 'Noto Sans', sans-serif;
    font-size: 3.8vw;
    font-weight: 600;
    display: inline-block;
    position: relative;
    bottom: 0px;
  }
  @media only screen and (max-width: 1600px) {
    #logo-text {
      font-size: 3.5vw;
    }
  }
  @media only screen and (max-width: 1260px) {
    #logo-text {
      font-size: 5.5vw;
    }
  }
  @media only screen and (max-width: 950px) {
    #logo-text {
      font-size: 8vw;
    }
  }
  @media only screen and (max-width: 600px) {
    #logo-text {
      font-size: 10vw;
    }
  }
  @media only screen and (max-width: 440px) {
    #logo-text {
      font-size: 13vw;
    }
    #logo {
    width: 0em;
    height: 0em;
     }
    .bufferUp {
      transform:translateY(-200%);
    }
  }
</style>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import ButtonWithImage from '@/components/ButtonWithImage'
import ErrorSnackbar from '@/components/ErrorSnackbar'
import { mapState } from 'vuex'
import { colors } from '@/constants'
import { get, setTokenForUser, signInGoogle, logOut } from '@/helpers'

export default {
  name: 'Join',

  props: {
    error: {type: String, default: ''},
  },

  components: {
    ButtonWithImage,
    ErrorSnackbar,
  },

  watch: {
    authUser: {
      immediate: true,
      handler(authUser) {
        if (authUser) {
          this.btnText = `Continue as ${authUser.first_name} ${authUser.last_name}`
          this.btnImageSrc = authUser.photo
        } else {
          this.btnText = 'Continue with Google'
          this.btnImageSrc = require('@/assets/img/google_logo_white.svg')
        }
      }
    },
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
      currentError: '',
    }
  },

  mounted() {
    // Do a cool little animation when loaded
    setTimeout(() => {this.show = true}, 100)

    this.currentError = this.error
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
          this.currentError = 'There was an error signing in!'
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
          this.$router.push({ name: 'Room', params: { id: this.roomCode } })
        }
      }).catch((err) => {
        this.currentError = 'Could not join room!'
      })
    },
    signOut() {
      logOut().catch((err) => {
        this.currentError = 'There was an error signing out!'
      })
    }
  }
}
</script>
