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

      <div>

        <div>
          <v-card
            class="mx-auto"
            max-width="344"
            v-for="a in students"
            :key="a.account_uid"
          >
            <v-img
              :src="a.photo"
              height="200px"
            ></v-img>
            <v-card-title>{{ a.first_name }} {{ a.last_name }}</v-card-title>
            <v-card-subtitle>{{ a.email }}</v-card-subtitle>
          </v-card>
        </div>



      </div>
    </v-app>
  </div>
</template>

<script>
import { post, get } from '@/helpers.js'

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
  mounted() {
    get(`/analytics/lecture/${this.lecture_uid}/info`).then(d => this.lectureInfo = d.data)
    get(`/analytics/lecture/${this.lecture_uid}/students`).then(d => this.students = d.data)
  }
}
</script>

