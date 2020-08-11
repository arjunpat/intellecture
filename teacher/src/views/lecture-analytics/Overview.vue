<template>
  <v-container class="fill-height py-0" fluid>
    <v-row 
      class="fill-height"
      justify="center"  
    >
      <v-col
        cols="12"
        sm="12"
        md="10"
        lg="8"
      >
        <LectureInfoCard 
          v-if="lectureInfo" 
          class="mb-4"
          :lectureInfo="lectureInfo"
          :numStudents="studentTableData.length"
        />

        <v-card class="pb-2">
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
            
            <v-tab-item value="students-tab">
              <StudentTable
                :data="studentTableData"
                @studentClicked="redirectStudentPage"
              />
            </v-tab-item>

            <v-tab-item value="questions-tab">
              <QuestionTable
                :data="questionTableData"
                @showUpvoters="showUpvoters"
              />
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialog"
      max-width="400"
      content-class="ma-0"
    >
      <v-card>
        <v-card-title>Upvoters</v-card-title>
        <v-divider></v-divider>

        <v-card-text style="height: 300px;">
          <div v-if="!curQuestionUpvoters" class="text-center">
            <v-progress-circular 
              :indeterminate="true"
              color="primary"
              class="mt-4"
            ></v-progress-circular>
          </div>
          <div v-else-if="curQuestionUpvoters.length === 0" class="text-center text-h6 mt-4">
            No upvoters!
          </div>
          <v-list v-else>
            <v-list-item
              v-for="(upvoter, i) in curQuestionUpvoters"
              :key="i"
            >
              <v-list-item-avatar>
                <v-img :src="upvoter.photo"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ `${upvoter.first_name} ${upvoter.last_name}` }}</v-list-item-title>
                <v-list-item-subtitle>{{ `Upvoted at ${elapsedToTimeString(upvoter.upvoteTime)}` }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="primary" 
            text 
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { log } from '@/helpers.js'
import Dialog from '@/components/Dialog'
import LectureInfoCard from '@/components/analytics/LectureInfoCard'
import StudentTable from '@/components/analytics/StudentTable'
import QuestionTable from '@/components/analytics/QuestionTable'

export default {
  props: {
    lecture_uid: { type: String, required: true },
    lectureInfo: { type: Object, required: true },
    studentTableData: { type: Array, required: true },
    questionTableData: { type: Array, required: true },
    curQuestionUpvoters: { type: Array, default: null }, // null means loading upvoters
  },

  components: {
    Dialog,
    LectureInfoCard,
    StudentTable,
    QuestionTable,
  },

  data() {
    return {
      dialog: false,
      tab: null,
      tabs: [
        {
          icon: 'mdi-account',
          title: 'Students',
          id: '#students-tab',
        },
        {
          icon: 'mdi-forum',
          title: 'Questions',
          id: '#questions-tab',
        },
      ],
    }
  },

  methods: {
    redirectStudentPage(student_uid) {
      this.$router.push({ name: 'LectureAnalyticsStudent', params: { lecture_uid: this.lecture_uid, student_uid } })
    },
    showUpvoters(question_uid) {
      this.$emit('showUpvoters', question_uid)
      this.dialog = true
    },
    elapsedToTimeString(elapsed) {
      return new Date(this.lectureInfo.start_time + elapsed).toLocaleTimeString()
    },
  },
}
</script>

<style scoped>
span {
  font-family: 'Roboto';
}
</style>

