<template>
  <div class="fill-height">
    <v-overlay :value="!authUser" opacity="0.7" :dark="false">
      <NotSignedIn />
    </v-overlay>

    <v-container v-if="lectureInfo" style="padding-top: 10vh !important;" fluid class="fill-height">
      <v-row class="fill-height" justify="center">
        <v-col
          cols="12"
          sm="8"
          md="6"
          lg="4"
          class="fill-height"
        > 
          <div id="flex-container" class="fill-height">
            <v-expand-transition>
              <span v-show="!myQuestionsVisible">
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
                    @spammingTooMuch="spammingSliderTooMuch"
                    v-model="sliderValue"
                    :min="0"
                    :max="sliderMax"
                    :throttleDelay="throttleDelay"
                    :spamLimitPerMin="spamLimitPerMin"
                    :spamLockTime="spamLockTime"
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
                    :questionsDelay="questionsDelay"
                    class="mt-10 mb-12"
                  />
                </TutorialDisplay>
                
                <TutorialDisplay :show="showTutorial == 3" backgroundColor="white" @next="showTutorial++" @cancel="showTutorial = -1" bottom>
                  <template v-slot:title>
                    Questions list
                  </template>
                  <template v-slot:explanation>
                    Questions asked by other students will appear here. Use the buttons on the right to indicate whether or not you have the same question. 
                  </template>
                  
                  <QuestionDisplay
                    header="Questions asked by others" 
                    :questions="displayedQuestions"
                    @upvoteQuestion="upvoteQuestion"
                    @dismissQuestion="dismissQuestion"
                    @dismissAllQuestions="dismissAllQuestions"
                  />
                </TutorialDisplay>

                <v-spacer></v-spacer>
              </span>
            </v-expand-transition>

            <TutorialDisplay :show="showTutorial == 4" backgroundColor="white" @next="showTutorial = 5" @cancel="showTutorial = -1" top>
              <template v-slot:title>
                My questions
              </template>
              <template v-slot:explanation>
                Click here to view the questions you have asked.
              </template>
              <v-btn
                text
                block
                class="mt-4"
                :class="myQuestionsVisible ? 'mb-4' : ''"
                color="#65bb6aff"
                @click="showMyQuestions"
              >
                {{ myQuestionsVisible ? 'Go back' : 'My questions' }}
              </v-btn>

              <v-expand-transition>
                <template v-if="myQuestionsVisible">
                  <QuestionDisplay
                    v-if="myQuestions.length > 0"
                    header="My questions"
                    :questions="myQuestions"
                    mine
                  />
                  <div class="text-center" v-else>You haven't asked any questions yet.</div>
                </template>
              </v-expand-transition>
            </TutorialDisplay>

            <v-fade-transition>
              <TutorialDisplay v-if="!myQuestionsVisible" :show="showTutorial == 5" backgroundColor="white" @next="showTutorial = -1" @cancel="showTutorial = -1" top>
                <template v-slot:title>
                  Help
                </template>
                <template v-slot:explanation>
                  Click here to view this tutorial again.
                </template>
                <v-btn
                  text
                  block
                  color="info"
                  @click="showTutorial = 0"
                >
                Help!
                </v-btn>
              </TutorialDisplay>
            </v-fade-transition>
          </div>
        </v-col>
      </v-row>
      <v-dialog
        :value="Object.keys(poll).length > 0"
        persistent
        max-width="400" 
        content-class="ma-0"
      >
        <v-card>
          <v-card-text class="pb-0 pt-4">
            <div class="text-h6 black--text mb-2">{{ poll.prompt }}</div>
            <v-radio-group 
              v-model="pollOptionSelected" 
              class="mt-0"
              :error-messages="pollError"
            >
              <v-radio 
                v-for="(option, i) in poll.options"
                :key="i"
                :label="option"
                :value="i"
              >
              </v-radio>
            </v-radio-group>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="submitPoll"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
import AskQuestionDialog from '@/components/AskQuestionDialog'
import UserAvatarContent from '@/components/UserAvatarContent'
import TutorialDisplay from '@/components/TutorialDisplay'
import LectureInfo from '@/components/LectureInfo'
import QuestionDisplay from '@/components/QuestionDisplay'
import { mapState } from 'vuex'
import { get, post, socketServerOrigin, log } from '@/helpers'
import testData from '@/test/test.json'

export default {
  name: 'Room',
  
  props: {
    id: {type: String},
  },

  data() {
    return {
      testing: false,

      // General
      socket: null,
      lectureInfo: null,
      
      // Slider
      sliderValue: 5,
      sliderMax: 10,
      throttleDelay: 1000,    // Limit understanding to only be updated once every `throttleDelay` ms
      spamLimitPerMin: 30,    // Notify user after spamming slider `spamLimitPerMin` times in a minute
      spamLockTime: 60000,    // ms to lock slider after spamming
      questionsDelay: 10000,  // Limit questions to only be asked once per `questionsDelay` ms  
      levels: ['I\'m lost', 'I\'m confused', 'I kinda get it', 'I think I get it', 'I completely understand'],
      colors: ['rgb(240, 53, 36)', 'rgb(255, 183, 0)', 'rgb(250, 225, 0)', 'rgb(126, 196, 4)', '#B2FF59'],
      color: '',

      // Questions
      questions: {},
      myQuestions: [],
      myQuestionsVisible: false,
      lastQuestionElapsed: 0,
      showQuestionDialog: false,
      
      // Polls
      poll: {},
      pollOptionSelected: -1,
      pollError: '',

      // Tutorial
      showTutorial: -1,
      tutorialQuestions: {
        tutorial: {
          "type":"new_question",
          "question_uid":"tutorial",
          "question":"Why is the sky blue?"
        },
      },
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
    questions(questions) {
      const questionData = {
        lectureId: this.id, 
        lastQuestionElapsed: this.lastQuestionElapsed, 
        questions: questions,
      };
      window.localStorage.setItem('questionData', JSON.stringify(questionData))
    },
    pollOptionSelected(option) {
      if (option !== -1 && this.pollError)
        this.pollError = ''
    },
  },

  created() {
    // FOR TESTING: 
    if (this.testing) {
      this.lectureInfo = testData.testLectureInfo
      this.questions = testData.testQuestions
      this.poll = testData.testPoll
    }

    // Show tutorial if first time
    if (window.localStorage.getItem('tutorialShown') == null) {
      this.showTutorial = 0
      window.localStorage.setItem('tutorialShown', '')
    }

    // NoSleep (in case user reloads)
    document.addEventListener('click', () => {
      this.$emit('enableNoSleep', true)
    }, {once: true})
    document.addEventListener('touchmove', () => {
      this.$emit('enableNoSleep', true)
    }, {once: true})
  },

  beforeDestroy() {
    clearInterval(this.wsInterval)
    this.socket.close()
    this.$emit('enableNoSleep', false)
  },

  components: {
    UnderstandingSlider,
    NotSignedIn,
    AskQuestionDialog,
    UserAvatarContent,
    TutorialDisplay,
    LectureInfo,
    QuestionDisplay,
  },

  computed: {
    ...mapState(['authUser', 'token']),
    understanding() {
      const index = Math.floor((+this.sliderValue+1)/2) - 1
      this.color = index < 0 ? 'rgb(0,0,0)' : this.colors[index]
      return index < 0 ? '' : this.levels[index]
    },
    displayedQuestions() {
      if (this.showTutorial === 3 && Object.keys(this.questions).length === 0) 
        return Object.values(this.tutorialQuestions)
      return Object.values(this.questions).sort((a,b) => (a.elapsed > b.elapsed) ? 1 : -1)
    }
  },
  
  methods: {
    reconnect() {
      this.socket = new WebSocket(`${socketServerOrigin}/lectures/live/student/${this.id}`)
      this.socket.onopen = (event) => {}

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        switch (data.type) {
          case 'error':
            if (data.error === 'does_not_exist') {
              if (!this.testing)
                this.$router.replace({name: 'Join', params: {error: 'The lecture you tried to join does not exist!'} })
            } else if (data.error === 'lecture_not_initialized') {
              this.$router.replace({name: 'Join', params: {info: 'The lecture you tried to join has not started yet!'} })
            } else if (data.error === 'already_ended') {
              this.$router.replace({name: 'Join', params: {error: 'The lecture you tried to join has already ended!'} })
            } else if (data.error === 'already_joined') {
              this.$router.replace({name: 'Join', params: {error: 'You already have that lecture open in another tab!'} })
            } else if (data.error === 'banned') {
              this.$router.replace({name: 'Join', params: {error: 'You have been banned from joining that lecture!'} })
            } else {
              this.$router.replace({name: 'Join', params: {error: 'Could not join lecture!'} })
            }
            break
          case 'lecture_info':
            this.lectureInfo = data

            // Send initial slider value
            setTimeout(() => this.updateUnderstanding(), 500); // give a bit for db to register user

            // Get previously asked questions
            const questionData = JSON.parse(window.localStorage.getItem('questionData'))
            if (questionData === null || questionData.lectureId !== this.id) {
              this.questions = {}
            } else {
              this.lastQuestionElapsed = questionData.lastQuestionElapsed;
              this.questions = questionData.questions
            }
            
            get(`/lectures/live/student/${this.id}/questions?after=${this.lastQuestionElapsed}`).then((result) => {
              if (!result.success)
                throw result

              this.updateQuestions(result.data)
            }).catch((err) => {
              this.$emit('error', 'There was an error fetching questions!')
            })
            break
          case 'new_question':
            this.pushQuestion(data)
            break
          case 'end_lecture':
            window.localStorage.removeItem('questionData')
            this.$router.replace({ name: 'Feedback', params: { fromLectureEnd: true } })
            break
          case 'kick_student':
            if (data.to === this.authUser.uid) {
              this.$router.replace({ name: 'Join', params: { error: 'You were kicked from the lecture!' } })
            }
            break
          case 'question_dismissed':
            this.dismissQuestion(data.question_uid)
            break
        }
      }

      this.socket.onclose = (event) => {}
      this.socket.onerror = (error) => {}
    },
    setUpSocketConnection() {
      // Set up socket stuff
      if (!this.socket) {
        this.reconnect()
        this.wsInterval = setInterval(() => {
          if (this.socket.readyState === WebSocket.CLOSED)
            this.reconnect()
        }, 5 * 1000); // 2 seconds
      }
    },
    updateUnderstanding() {
      const score = this.sliderValue
      if (this.socket.readyState === this.socket.OPEN) {
        post(`/lectures/live/student/${this.id}/score`, {
          score
        }).catch((err) => {
          this.$emit('error', 'There was an error updating your score!')
          log(err)
        })
      }
    },
    askQuestion(question) {
      post(`/lectures/live/student/${this.id}/question`, {
        question
      }).then(() => {
        this.$emit('info', 'Question submitted!')
      }).catch((err) => {
        this.$emit('error', 'There was an error submitting your question!')
        log(err)
      })
    },
    upvoteQuestion(uid) {
      if (!this.questions[uid].upvoted) {
        post(`/lectures/live/student/${this.id}/upvote`, {
          question_uid: uid
        }).then(() => {
          this.$set(this.questions[uid], 'upvoted', true)
          setTimeout(() => {
            this.$delete(this.questions, uid)
          }, 150)
        }).catch((err) => {
          this.$emit('error', 'There was an error upvoting the question!')
          log(err)
        })
      }
    },
    dismissQuestion(uid) {
      this.$set(this.questions[uid], 'dismissed', true)
      setTimeout(() => {
        this.$delete(this.questions, uid)
      }, 150)
    },
    dismissAllQuestions() {
      this.questions = {}
    },
    updateQuestions(questionsArray) {
      for (let question of questionsArray)
        this.pushQuestion(question)
    },
    pushQuestion(question) {
      if (question.creator_uid !== this.authUser.uid) {
        if (question.elapsed > this.lastQuestionElapsed)
          this.lastQuestionElapsed = question.elapsed;
        this.$set(this.questions, question.question_uid, {...question, upvoted: false, dismissed: false})
      }
    },
    showMyQuestions() {
      if (this.myQuestionsVisible) {
        this.myQuestionsVisible = false;
      } else {
        get(`/lectures/live/student/${this.id}/questions/mine`).then((result) => {
          if (!result.success)
            throw result

          this.myQuestions = result.data
          this.myQuestionsVisible = true
        }).catch((err) => {
          this.$emit('error', 'There was an error getting your questions!')
          log(err)
        })
      }
    },
    spammingSliderTooMuch() {
      this.$nextTick(() => {
        this.$emit('info', 'You moved the slider too much! It has been disabled for 1 minute.') 
      })
    },
    submitPoll() {
      if (this.pollOptionSelected === -1)
        this.pollError = 'Please select an option!'
      else {
        // Post to poll-vote api, then
        this.resetPoll()
      }
    },
    resetPoll() {
      this.poll = {}
      this.pollOptionSelected = -1
    },
  },
}
</script>
