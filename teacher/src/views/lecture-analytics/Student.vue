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
        /> 

        <!--<v-card>
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
            
            <v-tab-item
              value="students-tab"
            >
              <StudentTable
                :data="studentTableData"
                @studentClicked="redirectStudentPage"
              />
            </v-tab-item>

            <v-tab-item
              value="questions-tab"
            >
              <QuestionTable
                :data="questions"
              />
            </v-tab-item>
          </v-tabs>
        </v-card>-->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import analyticsData from '@/testdata/analyticsData.json'
import StudentInfoCard from '@/components/analytics/StudentInfoCard'

export default {
  props: {
    student: { type: Object, required: true },
    present: { type: Number, required: true },
    understanding: { type: Number, required: true },
    quesCount: { type: Number, required: true },
    upvoteCount: { type: Number, required: true }
  },

  components: {
    StudentInfoCard,
  },
}
</script>