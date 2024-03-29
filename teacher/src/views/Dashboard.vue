<template>
  <v-container v-if="authUser" class="mt-4">
    <v-btn
      depressed
      small
      v-if="!notification"
      @click="requestNotifications()"
      style="position: fixed; top: 70px; left: 10px; z-index: 100;"
    >
      Enable notifications
      <v-icon small>mdi-bell</v-icon>
    </v-btn>

    <h1 class="poppins mb-4 header" v-if="recentLectures.length > 0">Recent Lectures</h1>

    <v-row class="pl-3 pt-2">
      <div v-for="a in recentLectures" :key="a.uid" style="display: 'inline-block';">
        <v-card
          :width="recentLectureCardSize"
          min-height="175"
          hover
          outlined
          class="mr-3 mainfont"
          :to="a.live ? '/lecture/' + a.uid : '/lecture-analytics/' + a.uid"
        >
          <v-card-title class="font-weight-bold">{{ a.name }}</v-card-title>
          <v-card-subtitle v-if="!a.live">{{ dateToString(a.end_time) }}</v-card-subtitle>
          <v-card-subtitle v-if="a.live" style="color: red; font-weight: bold;">CURRENTLY LIVE</v-card-subtitle>
          <v-card-text>{{ getClassNameAndSection(a.class_uid) }}</v-card-text>

          <v-card-actions>
            <v-btn text color="#66BB6A" v-if="!a.live">See Analytics</v-btn>
            <v-btn text color="red" v-if="a.live">Join Lecture</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-row>

    <v-row>
      <h1 class="poppins mt-10 mb-4 ml-3 header">Classes</h1>
      <ModalForm style="margin-top: 62px;" class="ml-1"></ModalForm>
    </v-row>

    <v-row class="pl-3 pt-2">
      <div id="noclasses" v-if="!classes || classes.length == 0">
        <v-img style="margin-left: 150px;" width="50px" src="@/assets/img/arrow.png"></v-img>
        <h1>Create your first class<br v-if="$vuetify.breakpoint.smAndDown"> or watch this <a @click="showvid = true" style="color: #AED581; text-decoration: underline;">tutorial</a>!</h1>
      </div>
      <div class="mr-3 mb-3" v-for="cla in classes" :key="cla.uid" style="display: 'inline-block';">
        <v-card
          :width="$vuetify.breakpoint.xs ? '95vw' : 350"
          outlined
          hover
          min-height="100"
          class="poppins"
          @click="classRedirect(cla.uid)"
        >
          <v-card-title>{{ cla.name }}</v-card-title>
          <v-card-subtitle>{{ cla.section }}</v-card-subtitle>
          <v-card-text>{{ cla.lecture_count }} lecture{{ cla.lecture_count === 1 ? '' : 's' }}</v-card-text>

          <v-menu
            offset-x
            nudge-top
            :close-on-content-click="false"
            transition="slide-x-transition"
          >
            <template v-slot:activator="{ on }">
              <v-btn 
                v-on="on" 
                icon 
                style="position: absolute; right: 10px; top: 40px;" 
                @click.prevent=""
                @mousedown.stop 
                @touchstart.native.stop
              >
                <v-icon large id="menu-icon">more_vert</v-icon>
              </v-btn>
            </template>
            <v-list class="poppins">
              <v-list-item>
                <v-list-item-title>
                  <EditClass
                    @removed="genRecentLectures(); genScheduledLectures()"
                    :remove="true"
                    :className="cla.name"
                    :classId="cla.uid"
                  ></EditClass>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <EditClass
                    :remove="false"
                    :className="cla.name"
                    :classSection="cla.section"
                    :classId="cla.uid"
                  ></EditClass>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card>
      </div>
    </v-row>

    <h1 class="poppins mb-4 mt-10 header" v-if="scheduledLectures.length > 0">Upcoming</h1>

    <v-row class="pl-3 pt-2 mb-10">
      <div v-for="a in scheduledLectures" :key="a.uid" style="display: 'inline-block';">
        <v-card :width="recentLectureCardSize" min-height="175" outlined class="mr-3 mainfont">
          <v-card-title class="font-weight-bold">{{ a.name }}</v-card-title>
          <v-card-subtitle>{{ dateTimeToString(a.scheduled_start) }}</v-card-subtitle>
          <v-card-text>{{ getClassNameAndSection(a.class_uid) }}</v-card-text>

          <v-card-actions>
            <v-row>
                <v-dialog v-model="modalOpen" persistent max-width="30%">
                  <template v-slot:activator="{ on, attrs }">
                   <v-btn
                      hover
                      text
                      color="#66BB6A"
                      class="mb-2 ml-4"
                      v-bind="attrs"
                      v-on="on"
                    >Start Now</v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="headline">Are you sure?</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red" text @click="modalOpen = false">No</v-btn>
                      <v-btn color="green darken-1" text @click="modalOpen = false;$router.push({ path: `/lecture/${a.uid}` })">Start</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
            </v-row>
          </v-card-actions>
        </v-card>
      </div>
    </v-row>

    <v-fade-transition>
    <v-container id="vid-container" class="fill-height" fluid v-if="showvid">
      <v-btn text id="close-vid" @click="showvid = false"
        ><v-icon large>close</v-icon></v-btn
      >

      <v-row justify="center">
        <iframe
          width="972"
          height="547"
          src="https://www.youtube.com/embed/LaDN3ShhF0E?autoplay=1&modestbranding=1&rel=0"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </v-row>
    </v-container>
    </v-fade-transition>
  </v-container>
</template>

<script>
import ModalForm from '@/components/ModalForm'
import EditClass from '@/components/EditClass'
import { post, get, httpDelete, dateToString, dateTimeToString } from '@/helpers.js'
import { mapState } from 'vuex'

export default {
  name: 'Dashboard',
  components: {
    ModalForm,
    EditClass,
  },
  props: {
    fromLectureEnd: { type: Boolean, default: false },
  },
  data() {
    return {
      notification: Notification.permission == 'granted' ? true : false,
      showvid: false,
      search: '',
      modalOpen:false,
      deleteModalOpen: false,
      skeleton: [{ end_time: null, name: '', start_time: null, className: '' }],
      recentLectures: [],
      scheduledLectures: [],
      headers: [
        {
          text: 'Class Name',
          align: 'start',
          sortable: true,
          value: 'className',
        },
        { text: 'End Time', value: 'end_time' },
        { text: 'Start Time', value: 'start_time' },
        { text: 'Lecture Name', value: `name` },
        //{ text: 'Student List', value: "" }, TODO
        //{ text: 'Code', value: 'uid' },
      ],
    }
  },
  methods: {
    dateToString,
    dateTimeToString,
    formatUnix(unix_timestamp) {
      if (unix_timestamp == undefined) {
        return ''
      }
      let date = new Date(unix_timestamp)
      const dtf = new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
      })
      return dtf.format(date)
    },
    requestNotifications() {
      Notification.requestPermission(function (status) {
        console.log('Notification permission status:', status)
        if (this.status == 'granted') {
          this.notification = true
        }
      })
    },
    prepareLectures(l) {
      l.forEach((e) => {
        if (e.name.length > 21) e.name = e.name.slice(0, 12) + '...'
        e.live = typeof e.end_time !== 'number'
      })
      return l
    },
    async genRecentLectures() {
      let d = await get('/lectures/recent').then((d) => d.data)
      this.recentLectures = this.prepareLectures(d)
    },
    async genScheduledLectures() {
      let d = await get('/lectures/scheduled').then((d) => d.data)
      this.scheduledLectures = this.prepareLectures(d)
    },
    classRedirect(classId) {
      this.$router.push({ path: `/lectures/${classId}` })
    },
    getClassNameAndSection(uid) {
      let cl = this.classes.find((c) => c.uid === uid)
      if (cl) {
        return `${cl.name} - ${cl.section}`
      }
      return 'Loading...'
    },
  },
  mounted() {
    this.genRecentLectures()
    this.genScheduledLectures()
  },
  computed: {
    ...mapState(['classes', 'lectures', 'authUser']),
    smallScreen() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return true
        case 'sm':
          return true
        case 'md':
          return false
        case 'lg':
          return false
        case 'xl':
          return false
      }
    },
    recentLectureCardSize() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '170'
        case 'sm':
          return '200'
        case 'md':
          return '275'
        case 'lg':
          return '275'
        case 'xl':
          return '275'
      }
    },
  },
}
</script>

<style scoped>
.header {
  font-weight: 900;
  font-size: 50px;
}

#vid-container {
  position: absolute;
  left: 0px;
  top: 0px;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 100;
}

#close-vid {
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
}

.v-sheet--offset {
  top: -24px;
  position: relative;
}

.card-title {
  font-family: 'Noto Sans';
  font-weight: 800;
  font-size: 25px;
  background-color: #eceff1;
}

.poppins {
  font-family: 'Poppins';
}

h1 {
  font-size: 40px;
}

.noshow {
  font-family: var(--main-font);
  font-size: 20px;
  text-align: left;
  height: 40px;
  line-height: 40px;
  color: #757575;
}

#recent-lectures > div {
  display: flex;
  justify-content: flex-start;
}

#menu-icon {
  transition: 0.3s all;
  color: black;
}

#menu-icon:hover {
  transform: scale(1.1);
}

#noclasses {
  margin-top: -40px;
  margin-left: 70px;
}

#noclasses > h1 {
  font-size: 20px;
  font-weight: normal;
  margin-top: -10px;
}
</style>
