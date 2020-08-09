<template>
  <v-container class="fill-height" fluid>
    <v-row class="fill-height" justify="center">
      <v-col
        cols="12"
        sm="12"
        md="10"
        lg="8"
      >
        <StudentInfoCard
          :student="student"
          :present="present"
          :understanding="understanding"
          :quesCount="quesCount"
          :upvoteCount="upvoteCount"
          :maxUnderstanding="maxUnderstanding"
          class="mb-4"
        /> 

        <v-card>
          <v-tabs
            v-model="tab"
            grow
            color="green"
          >
            <v-tab
              v-for="(tab, i) in tabs"
              :key="i"
              :href="tab.id"
            >
              <v-icon>{{ tab.icon }}</v-icon>
              {{ tab.title }}
            </v-tab>

            <v-tab-item value="questions-tab">
              <v-list>
                <template 
                  v-for="(question, i) in questions"
                >
                  <v-divider v-if="i !== 0" :key="`divider-${i}`"></v-divider>
                  <v-list-item :key="i">
                    <v-list-item-content>
                      {{ question.question }}
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list>
            </v-tab-item>

            <v-tab-item value="upvoted-tab">
              <v-list>
                <template 
                  v-for="(upvote, i) in upvotedQuestions"
                >
                  <v-divider v-if="i !== 0" :key="`divider-${i}`"></v-divider>
                  <v-list-item :key="i">
                    <v-list-item-content>
                      {{ upvote.question.question }}
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import analyticsData from '@/testdata/analyticsData.json'
import StudentInfoCard from '@/components/analytics/StudentInfoCard'
import { get, post } from '../../helpers'

export default {
  props: {
    student: { type: Object, required: true },
    present: { type: Number, required: true },
    understanding: { type: Number, required: true },
    quesCount: { type: Number, required: true },
    upvoteCount: { type: Number, required: true },
    questions: { type: Array, required: true },
    upvotedQuestions: { type: Array, required: true },
    intervals: { type: Array, required: true },
    maxUnderstanding: { type: Number, required: true },
  },

  components: {
    StudentInfoCard,
  },

  mounted() {
    get(`/analytics/lecture/${this.$route.params.lecture_uid}/student/${this.$route.params.student_uid}/intervals`)
  },

  data() {
    return {
      tab: null,
      tabs: [
        {
          icon: 'mdi-forum',
          title: 'Questions Asked',
          id: '#questions-tab',
        },
        {
          icon: 'mdi-arrow-up-bold',
          title: 'Upvoted Questions',
          id: '#upvoted-tab',
        }
      ],
    }
  },
}
</script>