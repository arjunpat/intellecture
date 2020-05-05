<!-- TODO: catch for the case if user navigates to this page directly from a url -->

<template>
  <v-container fluid class="fill-height">
    <ErrorSnackbar
      :error="error"
    ></ErrorSnackbar>
    <v-overlay :value="!authUser" opacity="0.7" :dark="false">
      <NotSignedIn></NotSignedIn>
    </v-overlay>
    <v-row align="center" justify="center">
      <v-col
        cols="12"
        sm="8"
        md="6"
        lg="4"
      >
        <v-card class="mb-3">
          <v-card-title class="noto">UNDERSTANDING</v-card-title>
          <v-card-text id="understanding" class="text-center headline mb-2" style="height: 2em;" :style="{color: color}">
            <div id="understandingText">{{ understanding }}</div>
            <img v-if="!understanding" :src="require('@/assets/img/sad.svg')" style="width: 2em; height: 2em" />
          </v-card-text>
          
          <v-card-actions>
          <UnderstandingSlider
            @updateUnderstanding="updateUnderstanding"
            v-model="sliderValue"
            :min="0"
            :max="sliderMax"
            :throttleDelay="throttleDelay"
            class="mb-4"
          ></UnderstandingSlider>
          </v-card-actions>
        </v-card>
        <v-card>
          <v-card-title class="noto">QUESTIONS</v-card-title>
          <v-card-text align="center">
            <form @submit="askQuestion">
              <v-text-field
                v-model="question"
                label="Ask a question"
                hide-details="true"
                outlined
                class="mb-n3"
                autocomplete="off"
              ></v-text-field>
              <v-btn 
                @click="askQuestion"
                color="primary"
              >Ask</v-btn>
            </form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
  #understanding {
    transition: all 0.4s;
    position: relative;
  }

  #understandingText {
    position: absolute;
    top: 0.5em;
    bottom: 0.5em;
    left: 0;
    right: 0;
  }

  .v-btn {
    width: 100%;
    height: 3.7em !important;
  }

  .noto {
    font-family: 'Noto Sans';
    font-weight: 600;
  }

  .row {
    max-width: unset !important;
  }
</style>
<script>
import UnderstandingSlider from '@/components/UnderstandingSlider'
import NotSignedIn from '@/components/NotSignedIn'
import ErrorSnackbar from '@/components/ErrorSnackbar'
import { mapState } from 'vuex'
import { get, post } from '@/helpers'

export default {
  name: 'Room',

  props: {
    id: {type: String},
  },

  data() {
    return {
      sliderValue: 5,
      sliderMax: 10,
      throttleDelay: 1000, 
      levels: ['I\'m lost', 'I\'m confused', 'I kinda get it', 'I think I get it', 'I completely understand'],
      colors: ['rgb(240, 53, 36)', 'rgb(255, 183, 0)', 'rgb(250, 225, 0)', 'rgb(126, 196, 4)', 'rgb(127, 240, 7)'],
      color: '',
      question: '',
      socket: null,
      lectureInfo: null,
      error: '',
    }
  },

  watch: {
    authUser: {
      immediate: true,
      handler(authUser) {
        if (authUser && !this.socket) 
          this.setUpSocketConnection()
      },
    },
  },

  destroyed() {
    this.socket.close()
  },

  components: {
    UnderstandingSlider,
    NotSignedIn,
    ErrorSnackbar,
  },

  computed: {
    ...mapState(['authUser', 'token']),
    understanding() {
      let index = Math.floor((+this.sliderValue+1)/2) - 1
      this.color = index < 0 ? 'rgb(0,0,0)' : this.colors[index]
      return index < 0 ? '' : this.levels[index]
    }
  },

  methods: {
    setUpSocketConnection() {
      // Set up socket stuff
      if (!this.socket) {
        this.socket = new WebSocket(`wss://api.intellecture.app/lectures/live/student/${this.id}`)
        this.socket.onopen = (event) => {}
        this.socket.onmessage = (event) => {
          console.log('GOT MESSAGE', event.data)
          const data = JSON.parse(event.data)

          if (data.type === 'error') {
            switch(data.error) {
              case 'does_not_exist':
                this.$router.replace({name: 'Join', params: { error: 'The lecture you tried to join does not exist!' } })
                break;
            }
          } else if (data.type === 'lecture_info') {
            // TODO: show lecture name and creation time somewhere
            this.lectureInfo = {...data}
          } else if (data.type === 'end_lecture') {
            // TODO: show a "lecture ended" screen, with a place to rate their experience/give feedback
            console.log('teacher ended lecture')
          }
        }
        this.socket.onclose = (event) => {
          console.log('Socket connection was closed')
        }
        this.socket.onerror = (error) => {
          console.log('Websocket error: ', error)
        }
      }
    },
    updateUnderstanding() {
      const score = this.sliderValue
      if (this.socket.readyState === this.socket.OPEN) {
        post(`/lectures/live/student/${this.id}/score`, {
          score: score
        }).catch((err) => {
          console.log('ERROR WHEN SENDING SCORE: ', err)
        })
      }
    },
    askQuestion(e) {
      e.preventDefault()

      post(`/lectures/live/student/${this.id}/question`).then(() => {
        this.question = ''
      }).catch((err) => {
        console.log('ERROR WHEN SENDING QUESTION: ', err)
      })
    },
  },
}
</script>
