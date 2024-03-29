<template>
  <v-container fluid class="fill-height _green">
    <v-row
      justify="center"
      align="center"
      class="fill-height"
    >
      <v-col
        cols="12"
        sm="9"
        md="7"
        lg="4"
      >
        <v-expand-transition>
          <div 
            class="shadow white--text text-center"
            :class="$vuetify.breakpoint.smAndUp ? 'text-h1' : 'text-h2'"
            v-show="show"
          >Intellecture</div>
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
  .shadow {
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }

  .v-text-field {
    transition: margin-bottom 0.3s;
  }

  .v-btn {
    width: 100%;
    height: 3em !important;
  }
  
  .row {
    max-width: unset !important;
  }

  #logo {
    width: 100%;
  }
</style>

<script>
import ButtonWithImage from '@/components/ButtonWithImage'
import { mapState } from 'vuex'
import { colors } from '@/constants'
import { get, setTokenForUser, signInGoogle, signOut, log } from '@/helpers'

export default {
  name: 'Join',

  props: {
    error: {type: String, default: ''},
    info: {type: String, default: ''},
  },

  components: {
    ButtonWithImage,
  },

  watch: {
    authUser: {
      immediate: true,
      handler(authUser) {
        if (authUser) {
          this.btnText = `Continue as ${authUser.first_name}`
          this.btnImageSrc = authUser.photo
        } else {
          this.btnText = 'Continue with Google'
          this.btnImageSrc = require('@/assets/img/google_logo_white.svg')
        }
      }
    },
    error: {
      immediate: true,
      handler(error) {
        this.$emit('error', error)
      }
    },
    info: {
      immediate: true,
      handler(info) {
        this.$emit('info', info)
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
          this.$emit('error', 'There was an error signing in! Please try again later.')
          log(err)
        })
      }
    },
    redirectToRoom() {
      // Check if room exists
      this.validRoomCode = true
      this.$refs['form'].validate()
      get(`/lectures/exists/${this.roomCode.trim()}`).then((response) => {
        if (!response.success)
          throw response.error

        if (!response.data.exists) {
          // Room does not exist
          this.validRoomCode = false
          this.$refs['form'].validate()
        } else {
          // Redirect to room page
          this.$emit('enableNoSleep', true)
          this.$router.push({ name: 'Room', params: { id: response.data.lecture_uid } })
        }
      }).catch((err) => {
        this.$emit('error', 'Could not join room!')
        log(err)
      })
    },
    signOut() {
      signOut().catch((err) => {
        this.$emit('error', 'There was an error signing out!')
        log(err)
      })
    }
  }
}
</script>
