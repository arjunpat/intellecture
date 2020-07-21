<template>
  <div>
    <div style="height: 64px;"></div>
    <v-banner dark single-line color="grey darken-4">
      <v-avatar
        slot="icon"
        color="red accent-4"
        size="40"
      >
        <v-icon color="white">mdi-alert-circle</v-icon>
      </v-avatar>

      This page is still in development, so many features/buttons will not work.
    </v-banner>
    
    <v-app>
      <v-navigation-drawer
        color="transparent"
        :permanent="true"
        :expand-on-hover="false"
        :mini-variant="false"
        style="height: 100%;"
        absolute
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
        </v-list>
      </v-navigation-drawer>

      <div style="margin-left: 256px; overflow-y: scroll; height: 100vh;">
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
              <span v-if="quesCount">{{ getQuesCount(a.account_uid) }} questions</span><br>
              <span v-if="present">{{ getPresent(a.account_uid) }}% present</span>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </v-app>
  </div>
</template>

<script>
import { post, get } from '@/helpers.js'
import { mdiAndroidStudio } from '@mdi/js';

export default {
  data() {
    return {
      items: [
        { title: 'Students', icon: 'mdi-account' },
        { title: 'Attendance', icon: 'mdi-clipboard' },
        { title: 'Questions', icon: 'mdi-comment-question' },
        { title: 'Predictions', icon: 'mdi-head-lightbulb' },
      ],
      lecture_uid: this.$route.params.lecture_uid,
      lectureInfo: {},
      students: [],
      present: null,
      quesCount: null
    }
  },
  methods: {
    async init() {
      this.lectureInfo = await get(`/analytics/lecture/${this.lecture_uid}/info`).then(d => d.data);
      let students = await get(`/analytics/lecture/${this.lecture_uid}/students`).then(d => d.data);
      this.present = await get(`/analytics/lecture/${this.lecture_uid}/present`).then(d => d.data);
      this.quesCount = await get(`/analytics/lecture/${this.lecture_uid}/question-counts`).then(d => d.data);

      this.lectureLength = this.lectureInfo.end_time - this.lectureInfo.start_time;
      this.students = students;
    },
    getPresent(uid) {
      return Math.round((this.present[uid] / this.lectureLength) * 100);
    },
    getQuesCount(uid) {
      return this.quesCount[uid] || 0;
    }
  },
  mounted() {
    this.init();
  }
}
</script>

<style scoped>
span {
  font-family: 'Roboto';
}
</style>

