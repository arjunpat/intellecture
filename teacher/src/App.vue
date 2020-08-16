<template>
  <v-app>
    <AutoSnackbar :text="error" color="error" />
    <AutoSnackbar :text="info" color="info" />
    <v-app-bar v-if="$route.path !== '/' && !pageNotFound" color="green lighten-1" app dark flat>
      <img
        @click="homeRedirect()"
        src="@/assets/img/logo.svg"
        :width="smallScreen ? '40px' : '35px'"
        class="pointer"
      />

      <v-toolbar-title @click="homeRedirect()" v-if="!smallScreen || signin">
        <span id="main-logo" class="pointer">INTELLECTURE</span> Teacher
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        class="ml-1 light-green lighten-2"
        v-if="landing"
        @click="$router.push({ path: '/signin' })"
      >Sign In</v-btn>
      <Dialog v-model="showDialog" :header="dialogHeader" @close="showDialog = false">
        <!-- Child detect change -->
        <template v-slot:activator>
          <v-btn
            v-if="!started && dashboard"
            @click="startLecture()"
            @close="showDialog = false"
          >Start Lecture</v-btn>
        </template>
        <template v-slot:content>{{ dialogText }}</template>
      </Dialog>
      <v-btn
        v-if="!dashboard && !feedback"
        @click="$router.push({ name: backRoute })"
        :style="{marginRight: livelecture? '10px' : '0px'}"
      >Back</v-btn>
      <v-btn class="red" v-if="started && livelecture" @click="endlecture()">End Lecture</v-btn>
      <v-btn
        class="ml-1 deep-orange accent-2"
        v-if="!started && !landing && !signin && authUser"
        @click="signOutAuth()"
      >
        Sign out
        <img id="avt-img" class="ml-2" v-bind:src="authUser.photo" width="25px" />
      </v-btn>
      <v-menu
        v-if="started && livelecture"
        offset-y
        :close-on-content-click="false"
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ on }">
          <div v-on="on" class="ml-3" id="roomCode">
            <span class="mr-1 font-weight-medium" style="font-size: 20px;">ROOM:</span>
            <span
              class="text--primary font-weight-black"
              style="background: #ddd; border-radius: 7px; padding: 2px 10px; font-size: 25px;"
            >{{joinCode}}</span>
          </div>
        </template>
        <v-list>
          <v-list-item @click="showCode()">
            <v-list-item-title>Show code</v-list-item-title>
          </v-list-item>
          <v-list-item @click="copyLink()">
            <v-list-item-title>Copy link</v-list-item-title>
            <input type="hidden" id="linkToCopy" :value="linkToRoom" />
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main class="fill-height">
      <router-view
        @error="showError"
        @info="showInfo"
        v-on:startlecture="starting"
        v-on:nonexistant="started = false"
        v-on:notFound="pageNotFound = true"
      />
    </v-main>

    <v-footer padless color="green lighten-1" v-if="landing || dashboard || signin">
      <v-card flat tile width="100%" class="green lighten-1 text-center">
        <v-card-text class="white--text" style="font-family: var(--main-font);">
          © {{ new Date().getFullYear() }}
          <strong>INTELLECTURE{{$vuetify.breakpoint.smAndUp ? ' | ALL RIGHTS RESERVED' : ''}}</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import store from './store'
import { post, get, loadClasses, signOut, getLinkToRoom } from '@/helpers.js'
import { mapState } from 'vuex'
import Dialog from '@/components/Dialog'
import AutoSnackbar from '@/components/AutoSnackbar'

export default {
  name: 'App',
  components: {
    Dialog,
    AutoSnackbar,
  },
  created() {
    get('/auth/profile')
      .then((result) => {
        if (result.success) {
          this.$store.commit('setAuthUser', result.data)
          loadClasses()
        } else {
          this.$store.commit('setAuthUser', null)
          this.$store.commit('setClasses', null)
          this.$store.commit('setLectures', null)
        }
        this.redirectAuthUser()
      })
      .catch((err) => {})
  },
  data() {
    return {
      started: false,
      pageNotFound: false,
      imageurl: 'https://tonyxin-8bae2.firebaseapp.com/images/tonyxin2.png',
      id: '',
      joinCode: '',
      snackbar: false,
      timeout: 1000,
      showDialog: false,
      dialogHeader: 'No classes',
      dialogText:
        'You must create a class in order to start a lecture. Create a new class by hitting the new class button.',
      error: '',
      info: '',
      backRoute: 'Dashboard'
    }
  },
  computed: {
    ...mapState(['authUser', 'lectures', 'classes']),
    landing() {
      return this.$route.name === 'Landing'
    },
    dashboard() {
      return this.$route.name === 'Dashboard'
    },
    signin() {
      return this.$route.name === 'SignIn'
    },
    livelecture() {
      return this.$route.name === 'Lecture'
    },
    newlecture() {
      return this.$route.name === 'New'
    },
    lectures() {
      return this.$route.name === 'ClassLectures'
    },
    analytics() {
      return this.$route.name === 'LectureAnalyticsOverview'
    },
    feedback() {
      return this.$route.name === 'Feedback'
    },
    linkToRoom() {
      return getLinkToRoom(this.id)
    },
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
  },
  watch: {
    $route: function (to, from) {
      if (from.name == 'NotFound') {
        this.pageNotFound = false
      }
      if (to.name == 'Dashboard') {
        this.started = false
      }
      if (to.name == 'LectureAnalytics' || to.name == 'livelecture') {
        this.backRoute = 'Dashboard';
      } else {
        this.backRoute = from.name;
      }

      this.redirectAuthUser()
    },
    authUser: function (val) {
      this.redirectAuthUser()
    },
  },
  methods: {
    signOutAuth() {
      signOut().then(() => {
        this.$router.replace({ name: 'Landing' })
      })
    },
    redirectAuthUser() {
      // Redirects based on the state of authUser
      // All redirecting based on authUser should be placed here
      const authRoutes = ['Dashboard', 'New', 'Lecture', 'Feedback']
      const noAuthRoutes = ['Landing']

      if (this.authUser) {
        if (noAuthRoutes.includes(this.$route.name)) {
          this.$router.replace({ name: 'Dashboard' })
        }
      } else {
        if (authRoutes.includes(this.$route.name)) {
          this.$router.replace({ name: 'Landing' })
        }
      }
    },
    homeRedirect() {
      if (this.authUser) {
        if (!this.dashboard) {
          this.$router.push({ path: '/dashboard' })
        }
      } else {
        this.$router.push({ path: '/' })
      }
    },
    showError(error) {
      this.error = ''
      this.$nextTick(() => {
        this.error = error
      })
    },
    showInfo(info) {
      this.info = ''
      this.$nextTick(() => {
        this.info = info
      })
    },
    endlecture() {
      store.commit('setEndLecture', true)
      this.started = false;
    },
    starting(id, joinCode) {
      this.id = id
      this.joinCode = joinCode
      this.started = true
    },
    showCode() {
      store.commit('setShowCode', true)
    },
    copyLink() {
      let codeToCopy = document.querySelector('#linkToCopy')
      codeToCopy.setAttribute('type', 'text')
      codeToCopy.select()

      try {
        var successful = document.execCommand('copy')
        this.showInfo('Room link copied to clipboard')
      } catch (err) {
        this.showError('There was an error copying the link')
      }

      /* unselect the range */
      codeToCopy.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges()
    },
    startLecture() {
      if (this.classes.length != 0) {
        this.$router.push({ path: '/new' })
      } else {
        this.showDialog = true
      }
    },
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Noto+Sans&display=swap');
@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
@import url('https://fonts.googleapis.com/css?family=Poppins&display=swap');
@import url('https://fonts.googleapis.com/css?family=Material+Icons');

:root {
  --main-font: 'Poppins', 'Roboto', 'Sans-serif';
}

h1 {
  font-family: var(--main-font);
}

html {
  overflow-y: auto !important;
}

.mainfont {
  font-family: var(--main-font);
}
</style>

<style scoped>
.pointer:hover {
  cursor: pointer;
}

#main-logo {
  font-family: 'Noto Sans', sans-serif;
  font-size: 25px;
  font-weight: 600;
}

#avt-img {
  border-radius: 50%;
  background-color: white;
}

.pointer:hover {
  cursor: pointer;
}

#roomCode {
  background-color: #aed581;
  padding: 5px 8px;
  border-radius: 7px;
}

#roomCode:hover {
  cursor: pointer;
}
</style>
