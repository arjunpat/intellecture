<template>
  <div class="fill-height">
    <v-banner 
      dark 
      single-line 
      color="grey darken-4"
    >
      <v-avatar
        slot="icon"
        color="red accent-4"
        size="40"
      >
        <v-icon color="white">mdi-alert-circle</v-icon>
      </v-avatar>

      This page is still in development, so many features/buttons will not work.
    </v-banner>

    <v-container class="fill-height py-0" fluid>
      <v-row class="fill-height">
          <v-navigation-drawer
            color="transparent"
            :permanent="true"
            :expand-on-hover="false"
            :mini-variant="false"
          >
            <v-list
              nav
              class="py-0"
            >
              <v-list-item two-line>
                <v-list-item-content>
                  <h2 style="font-weight: bold;">{{ lectureInfo.lecture_name }}</h2>
                  <v-list-item-subtitle>{{ lectureInfo.class_name }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item-group
                v-model="selectedItem"
              >
                <v-list-item
                  v-for="item in items"
                  :key="item.title"
                  link
                >
                  <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-navigation-drawer>
        <v-col>
          <v-card-text style="text-align: right;">{{ students.length }} student(s)</v-card-text>
          <div style="display: flex; justify-content: flex-start; flex-wrap: wrap;">
            <v-card
              class="mx-auto"
              width="250"
              height="300"
              v-for="a in students"
              :key="a.account_uid"
              style="margin: 15px;"
            >
              <v-img
                :src="a.photo"
                height="150px"
              ></v-img>
              <v-card-title>{{ a.first_name }} {{ a.last_name }}</v-card-title>
              <v-card-subtitle>{{ a.email }}</v-card-subtitle>

              <v-card-text>
                <span v-if="quesCount">{{ getQuesCount(a.account_uid) }} question{{ getQuesCount(a.account_uid) !== 1 ? 's' : '' }}</span><br>
                <span v-if="present">{{ getPresent(a.account_uid) }}% present</span>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { post, get, log } from '@/helpers.js'
import { mdiAndroidStudio } from '@mdi/js'
import analyticsData from '@/testdata/analyticsData.json'

export default {
  data() {
    return {
      testing: false,
      items: [
        { title: 'Students', icon: 'mdi-account' },
        { title: 'Understanding', icon: 'mdi-head-lightbulb' },
        { title: 'Questions', icon: 'mdi-comment-question' },
        { title: 'Attendance', icon: 'mdi-clipboard' },
      ],
      selectedItem: 0,
      lecture_uid: this.$route.params.lecture_uid,
      lectureInfo: {},
      students: [],
      present: null,
      quesCount: null,
      intervals_present: null,
    }
  },
  methods: {
    async init() {
      if (this.testing) {
        this.lectureInfo = analyticsData.lectureInfo
        this.lectureLength = this.lectureInfo.end_time - this.lectureInfo.start_time
        this.students = analyticsData.students
        this.intervalsPresent = analyticsData.intervals_present
        this.present = analyticsData.present
        this.quesCount = analyticsData.question_count
      } else {
        this.lectureInfo = await this.get('/info')
        let students = await this.get('/students')
        this.present = await this.get('/present')
        this.quesCount = await this.get('/question-counts')

        this.lectureLength = this.lectureInfo.end_time - this.lectureInfo.start_time
        this.students = students

        this.get(`/student/${students[0].account_uid}/questions`)
      }
    },
    getPresent(uid) {
      return Math.round((this.present[uid] / this.lectureLength) * 100)
    },
    getQuesCount(uid) {
      return this.quesCount[uid] || 0
    },
    get(addy) {
      return get(`/analytics/lecture/${this.lecture_uid}${addy}`).then(d => {
        if (d.success)
          return d.data
        log('failed', e)
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped>
span {
  font-family: 'Roboto';
}
</style>

