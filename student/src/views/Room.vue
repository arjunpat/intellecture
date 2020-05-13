<template>
  <div class="fill-height">
    <AutoSnackbar
      :text="error"
      color="error"
    />
    <v-overlay :value="!authUser" opacity="0.7" :dark="false">
      <NotSignedIn />
    </v-overlay>

    <v-container style="padding-top: 10vh !important;" fluid class="fill-height">
      <v-row class="fill-height" justify="center">
        <v-col
          cols="12"
          sm="8"
          md="6"
          lg="4"
          class="fill-height"
        > 
          <div id="flex-container" class="fill-height">
            <!-- TODO: make class name font size smaller when the name is longer -->
            <TutorialDisplay :show="showTutorial == 0" backgroundColor="white" @next="showTutorial++" @cancel="showTutorial = -1" bottom>
              <template v-slot:title>
                Lecture Info
              </template>
              <template v-slot:explanation>
                This displays information about the lecture you are currently in.
              </template>

              <LectureInfo v-if="lectureInfo !== null" :lectureInfo="lectureInfo" />
            </TutorialDisplay>

            <TutorialDisplay :show="showTutorial == 1" backgroundColor="white" @next="showTutorial++" @cancel="showTutorial = -1" bottom>
              <template v-slot:title>
                Understanding Score
              </template>
              <template v-slot:explanation>
                Move this slider to rate how well you understand the content being presented.
              </template>

              <div id="understanding" class="text-center headline mb-2" style="height: 2em;" :style="{color: color}">
                <div id="understandingText">{{ understanding }}</div>
                <img v-if="!understanding" :src="require('@/assets/img/sad.svg')" style="width: 2em; height: 2em" />
              </div>

              <UnderstandingSlider
                @updateUnderstanding="updateUnderstanding"
                v-model="sliderValue"
                :min="0"
                :max="sliderMax"
                :throttleDelay="throttleDelay"
                class="mb-4"
              />
            </TutorialDisplay>

            <TutorialDisplay :show="showTutorial == 2" backgroundColor="unset" @next="showTutorial++" @cancel="showTutorial = -1">
              <template v-slot:title>
                Ask questions
              </template>
              <template v-slot:explanation>
                Click here to ask questions.
              </template>

              <AskQuestionDialog
                v-model="showQuestionDialog"
                @askQuestion="askQuestion"
                class="mt-8 mb-8"
              />
            </TutorialDisplay>

            <v-spacer></v-spacer>

            <TutorialDisplay :show="showTutorial == 3" backgroundColor="white" @next="showTutorial = -1" @cancel="showTutorial = -1" top>
              <template v-slot:title>
                Help
              </template>
              <template v-slot:explanation>
                Click here to view this tutorial again.
              </template>
              <v-btn
                bottom
                text
                block
                color="info"
                @click="showTutorial = 0"
              >
              Help!
              </v-btn>
            </TutorialDisplay>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
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
    font-family: 'Poppins';
  }

  .noto {
    font-family: 'Noto Sans';
    font-weight: 600;
  }

  .row {
    max-width: unset !important;
  }

  #flex-container {
    /* 
    Currently does not do anything,
    may use in the future 
    */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
</style>

<script>
import UnderstandingSlider from '@/components/UnderstandingSlider'
import NotSignedIn from '@/components/NotSignedIn'
import AutoSnackbar from '@/components/AutoSnackbar'
import AskQuestionDialog from '@/components/AskQuestionDialog'
import UserAvatarContent from '@/components/UserAvatarContent'
import TutorialDisplay from '@/components/TutorialDisplay'
import LectureInfo from '@/components/LectureInfo'
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
      colors: ['rgb(240, 53, 36)', 'rgb(255, 183, 0)', 'rgb(250, 225, 0)', 'rgb(126, 196, 4)', '#B2FF59'],
      color: '',
      socket: null,
      lectureInfo: null,
      showQuestionDialog: false,
      showTutorial: -1,
      error: '',
      testLectureInfo: {
        type:"lecture_info",
        uid:"cqywa",
        start_time:1588889535833,
        class_name:"AP Calc BC",
        lecture_name:"Lecture A83",
        creator:{
          email:"ajpat1234@gmail.com",
          first_name:"Arjun",
          last_name:"Patrawala",
          photo:"https://lh3.googleusercontent.com/a-/AOh14GhLdwXOcIH2W9KoJdVZTTDkxu-TCJesb3_HRqDOpQ"
        }
      },
      testing: false,
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

  created() {
    // FOR TESTING: 
    if (this.testing)
      this.lectureInfo = this.testLectureInfo
  },

  destroyed() {
    this.socket.close()
  },

  components: {
    UnderstandingSlider,
    NotSignedIn,
    AutoSnackbar,
    AskQuestionDialog,
    UserAvatarContent,
    TutorialDisplay,
    LectureInfo,
  },

  computed: {
    ...mapState(['authUser', 'token']),
    understanding() {
      const index = Math.floor((+this.sliderValue+1)/2) - 1
      this.color = index < 0 ? 'rgb(0,0,0)' : this.colors[index]
      return index < 0 ? '' : this.levels[index]
    },
  },
  
  methods: {
    setUpSocketConnection() {
      // Set up socket stuff
      if (!this.socket) {
        this.socket = new WebSocket(`wss://api.intellecture.app/lectures/live/student/${this.id}`)
        this.socket.onopen = (event) => {
          // Send initial slider value
          this.updateUnderstanding()
        }
        this.socket.onmessage = (event) => {
          console.log('GOT MESSAGE', event.data)
          const data = JSON.parse(event.data)
          if (data.type === 'error') {
            if (!this.testing)
              this.$router.replace({name: 'Join', params: { error: 'The lecture you tried to join does not exist!' } })
          } else if (data.type === 'lecture_info') {
            this.lectureInfo = {...data}
          } else if (data.type === 'end_lecture') {
            this.$router.replace({ name: 'Feedback', params: { fromLectureEnd: true } })
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
    askQuestion(question) {
      post(`/lectures/live/student/${this.id}/question`, {
        question: question
      }).then(() => {
        // TODO: display success message when message sent
      }).catch((err) => {
        console.log('ERROR WHEN SENDING QUESTION: ', err)
      })
    },
  },
}
</script>
