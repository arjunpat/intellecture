<template>
  <div>
    <div style="height: 76px;"></div>
    
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

      <div style="margin-left: 256px;">
        <div style="display: flex; justify-content: flex-start; flex-wrap: wrap;">
          <v-card
            class="mx-auto"
            width="250"
            height="300"
            v-for="a in students"
            :key="a.account_uid"
            style="margin-bottom: 30px;"
          >
            <v-img
              :src="a.photo"
              height="150px"
            ></v-img>
            <v-card-title>{{ a.first_name }} {{ a.last_name }}</v-card-title>
            <v-card-subtitle>{{ a.email }}</v-card-subtitle>

            <v-card-text>{{ randInt(1, 5) }} questions<br>{{ getParticipation(a.account_uid) }}% participation</v-card-text>
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
        { title: 'Predictions', icon: 'mdi-head-lightbulb' },
      ],
      lecture_uid: this.$route.params.lecture_uid,
      lectureInfo: {},
      students: []
    }
  },
  methods: {
    randInt(from, to) {
      return parseInt(Math.random() * (to - from + 1)) + from;
    },
    async init() {
      let lectureInfo = (await get(`/analytics/lecture/${this.lecture_uid}/info`)).data;
      let students = (await get(`/analytics/lecture/${this.lecture_uid}/students`)).data;
      let stuLog = (await get(`/analytics/lecture/${this.lecture_uid}/attendance`)).data;

      let len = lectureInfo.end_time - lectureInfo.start_time;
      console.log(len);

      // this code calculates how much time they spent on intellecture
      let time = {}
      for (let i = 0; i < stuLog.length; i++) {
        let uid = stuLog[i].account_uid;
        if (!time[uid]) {
          time[uid] = [];
        }

        time[uid].push(stuLog[i].elapsed);
      }

      for (let each in time) {
        time[each] = this.sum(this.diff(time[each])) / len;
      }
      this.time = time;
      this.lectureInfo = lectureInfo;
      this.students = students;
    },
    diff(arr) {
      let res = [];
      for (let i = 1; i < arr.length; i++)
        res.push(arr[i] - arr[i - 1]);
      return res;
    },
    sum(arr) {
      let sum = 0;
      for (let each of arr) sum += each;
      return sum;
    },
    getParticipation(uid) {
      return Math.round(this.time[uid] * 100);
    }
  },
  mounted() {
    this.init();
  }
}
</script>

