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
          :numStudents="numStudents"
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
              />
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
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
    numStudents: { type: Number, required: true },
    studentTableData: { type: Array, required: true },
    questionTableData: { type: Array, required: true },
  },

  components: {
    Dialog,
    LectureInfoCard,
    StudentTable,
    QuestionTable,
  },

  data() {
    return {
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
      this.$router.push({ name: 'LectureAnalyticsStudent', params: { lecture_uid: this.lecture_uid, student_uid: student_uid } })
    },
  },
}
</script>

<style scoped>
span {
  font-family: 'Roboto';
}
</style>

