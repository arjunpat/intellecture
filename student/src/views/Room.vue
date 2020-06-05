<template>
  <div class="fill-height">
    <AutoSnackbar
      :text="error"
      color="error"
    />
    <AutoSnackbar
      :text="info"
      color="info"
    />
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
              <span v-if="!myQuestionsVisible">
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
import QuestionDisplay from '@/components/QuestionDisplay'
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
      questions: {},
      myQuestions: [],
      myQuestionsVisible: false,
      lastQuestionElapsed: 0,
      showQuestionDialog: false,
      showTutorial: -1,
      error: '',
      info: '',
      tutorialQuestions: {
        tutorial: {
          "type":"new_question",
          "question_uid":"tutorial",
          "question":"Why is the sky blue?"
        },
      },
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
      testQuestions: {
        X8udiUQ8fN6F27C: {
          "type":"new_question",
          "question_uid":"X8udiUQ8fN6F27C",
          "question":"What is the relationship between voltage and a Gaussian surface?",
          upvoted: false,
        },
        a: {
          "type":"new_question",
          "question_uid":"a",
          "question":"What is 10 + 10?",
          upvoted: false,
        },
        b: {
          "type":"new_question",
          "question_uid":"b",
          "question":"Why?",
          upvoted: false,
        },
        c: {
          "type":"new_question",
          "question_uid":"c",
          "question":"Why not?",
          upvoted: false,
        },
        d: {
          "type":"new_question",
          "question_uid":"d",
          "question":"How do you ask a question?",
          upvoted: false,
        },
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
    questions(questions) {
      const questionData = {
        lectureId: this.id, 
        lastQuestionElapsed: this.lastQuestionElapsed, 
        questions: questions,
      };
      window.localStorage.setItem('questionData', JSON.stringify(questionData))
    },
  },

  created() {
    // FOR TESTING: 
    if (this.testing) {
      this.lectureInfo = this.testLectureInfo
      this.questions = this.testQuestions
    }

    if (window.localStorage.getItem('tutorialShown') == null) {
      this.showTutorial = 0
      window.localStorage.setItem('tutorialShown', '')
    }
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
    setUpSocketConnection() {
      // Set up socket stuff
      if (!this.socket) {
        this.socket = new WebSocket(`wss://api.intellecture.app/lectures/live/student/${this.id}`)

        this.socket.onopen = (event) => {}

        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data)
          switch (data.type) {
            case 'error':
              if (data.error === 'does_not_exist' || data.error === 'lecture_not_initialized') {
                if (!this.testing)
                  this.$router.replace({name: 'Join', params: { error: 'The lecture you tried to join does not exist!' } })
              } else if (data.error === 'already_ended') {
                this.$router.replace({name: 'Join', params: { error: 'The lecture you tried to join has already ended!' } })
              } else if (data.error === 'already_joined') {
                this.$router.replace({name: 'Join', params: { error: 'You already have that lecture open in another tab!' } })
              } else {
                this.$router.replace({name: 'Join', params: { error: 'Could not join lecture!' } })
              }
              break;
            case 'lecture_info':
              this.lectureInfo = data

              // Send initial slider value
              this.updateUnderstanding()

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
                this.error = 'There was an error fetching questions!'
              })
              break;
            case 'new_question':
              this.pushQuestion(data)
              break;
            case 'end_lecture':
              window.localStorage.removeItem('questionData')
              this.$router.replace({ name: 'Feedback', params: { fromLectureEnd: true } })
              break;
          }
        }

        this.socket.onclose = (event) => {}
        this.socket.onerror = (error) => {}
      }
    },
    updateUnderstanding() {
      const score = this.sliderValue
      if (this.socket.readyState === this.socket.OPEN) {
        post(`/lectures/live/student/${this.id}/score`, {
          score
        }).catch((err) => {
          this.error = 'There was an error updating your score!'
        })
      }
    },
    askQuestion(question) {
      this.error = ''
      this.info = ''
      post(`/lectures/live/student/${this.id}/question`, {
        question
      }).then(() => {
        this.info = 'Question submitted!'
      }).catch((err) => {
        this.error = 'There was an error submitting your question!'
      })
    },
    upvoteQuestion(uid) {
      this.error = ''
      if (!this.questions[uid].upvoted) {
        post(`/lectures/live/student/${this.id}/upvote`, {
          question_uid: uid
        }).then(() => {
          this.$set(this.questions[uid], 'upvoted', true)
          setTimeout(() => {
            this.$delete(this.questions, uid)
          }, 150)
        }).catch((err) => {
          this.error = 'There was an error upvoting the question!'
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
          this.error = 'There was an error getting your questions!'
        })
      }
    }
  },
}
</script>
