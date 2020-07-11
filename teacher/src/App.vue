<template>
  <v-app>
    <v-app-bar
      v-if="$route.path !== '/'"
      :collapse="false"
      :collapse-on-scroll="false"
      color="green lighten-1"
      app
      dark
      flat
    >
      <img src="@/assets/img/logo.svg" width="35px" class="pointer">

      <v-toolbar-title @click="homeRedirect()" v-if="!smallScreen || !livelecture"><span id="main-logo" class="pointer">INTELLECTURE</span> Teacher</v-toolbar-title>
    

      <v-spacer></v-spacer>

      <v-btn class="ml-1 light-green lighten-2" v-if="landing" @click="$router.push({ path: '/signin' })">Sign In</v-btn>
      <v-btn v-if="!started && dashboard" @click="$router.push({ path: '/new' })">Start Lecture</v-btn>
      <v-btn v-if="newlecture" @click="$router.push({ path: '/dashboard' })">Back</v-btn>
      <v-btn class="red" v-if="started && livelecture" @click="endlecture()">End Lecture</v-btn>
      <v-btn class="ml-1 deep-orange accent-2" v-if="!started && !landing && !signin && authUser" @click="signOutAuth()">Sign out <img id="avt-img" class="ml-2" v-bind:src="authUser.photo" width="25px"></v-btn>
      <v-menu
        v-if="started && livelecture"
        offset-y
        :close-on-content-click="false"
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ on }">
          <div v-on="on" class="ml-3" id="roomCode">
            <span class="mr-1 font-weight-medium" style="font-size: 20px;">ROOM:</span> <span class="text--primary font-weight-black" style="background: #ddd; border-radius: 7px; padding: 2px 10px; font-size: 25px;">{{id}}</span>
          </div>
        </template>
        <v-list>
          <v-list-item @click="showCode()">
            <v-list-item-title>Show code</v-list-item-title>
          </v-list-item>
          <v-list-item @click="copyLink()">
            <v-list-item-title>Copy link</v-list-item-title>
            <input type="hidden" id="linkToCopy" :value="linkToRoom">
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      top
      color="light-green lighten-2"
      style="font-family: var(--main-font);"

    >
      {{message}}<v-icon style="color: white">mdi-clipboard</v-icon>  
    </v-snackbar>

    <router-view v-on:startlecture="starting" v-on:nonexistant="started = false" />

    <v-footer padless color="green lighten-1" v-if="landing || dashboard || signin">
        <v-card
          flat
          tile
          width="100%"
          class="green lighten-1 text-center"
        >
          <v-card-text class="white--text" style="font-family: var(--main-font);">
            © {{ new Date().getFullYear() }} <strong>INTELLECTURE{{$vuetify.breakpoint.smAndUp ? ' | ALL RIGHTS RESERVED' : ''}}</strong>
          </v-card-text>
        </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import store from './store'
import { post, get, setLectures, signOut } from '@/helpers.js'
import { mapState } from 'vuex'

export default {
  name: 'App',
  created: function () {
    get('/auth/profile').then((result) => {
      if (result.success) {
        this.$store.commit('setAuthUser', result.data)
        setLectures();
      } else {
        this.$store.commit('setAuthUser', null)
        this.$store.commit('setClasses', null)
        this.$store.commit('setLectures', null)
      }
      this.redirectAuthUser()
    }).catch((err) => {
    })
  },
  data: function () {
    return {
      started: false,
      imageurl: 'https://tonyxin-8bae2.firebaseapp.com/images/tonyxin2.png',
      id: '',
      error: '',
      snackbar: false,
      message: '',
      timeout: 1000
    }
  },
  computed: {
    ...mapState(['authUser', 'lectures']),
    landing: function () {
      return this.$route.name === 'Landing'
    },
    dashboard: function () {
      return this.$route.name === 'Dashboard'
    },
    signin: function () {
      return this.$route.name === 'SignIn'
    },
    livelecture: function () {
      return this.$route.name === 'Lecture'
    },
    newlecture: function () {
      return this.$route.name === 'New'
    },
    feedback: function () {
      return this.$route.name === 'Feedback'
    },
    linkToRoom: function () {
      const isProd = process.env.NODE_ENV === 'production';
      return `https://join.intellecture.app/${ isProd ? '#/' : '' }room/${this.id}`
    },
    smallScreen () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return true
        case 'sm': return true
        case 'md': return false
        case 'lg': return false
        case 'xl': return false
      }
    }
  },
  watch: {
    $route: function (to, from) {
      if(to.name == "Dashboard") {
        this.started = false
      }
      this.redirectAuthUser()
    },
    authUser: function(val) {
      this.redirectAuthUser()
    },
    error: function(val) {
      this.message = this.error
      this.snackbar = true
    }
  },
  methods: {
    signOutAuth () {
      signOut().then(() => {
        this.$router.replace({ name: 'Landing' })
      })
    },
    redirectAuthUser () {
      // Redirects based on the state of authUser
      // All redirecting based on authUser should be placed here
      const authRoutes = ['Dashboard', 'New', 'Lecture', 'Feedback']
      const noAuthRoutes = ['Landing', 'SignIn']

      if (this.authUser) {
        if (noAuthRoutes.includes(this.$route.name)) {
          this.$router.replace({ name: 'Dashboard' })
        }
      } else {
        if (authRoutes.includes(this.$route.name)) {
          this.$router.replace({ name: 'SignIn' })
        }
      }
    },
    homeRedirect() {
      if(this.started) {
        return;
      } else if(this.authUser) {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.$router.push({ path: '/' })
      }
    },
    endlecture() {
      store.commit("setEndLecture", true)
      this.started = false
    },
    starting(e) {
      this.id = e;
      this.started = true;
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
        this.message = "Room link copied to clipboard"
        this.snackbar = true
      } catch (err) {
        this.error = 'There was an error copying the link'
      }

      /* unselect the range */
      codeToCopy.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges()
    }
  }
}

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Noto+Sans&display=swap');
@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
@import url('https://fonts.googleapis.com/css?family=Poppins&display=swap');

:root {
  --main-font: 'Poppins', 'Roboto', 'Sans-serif';
}

h1 {
  font-family: var(--main-font);
}

html {
  overflow-y: auto !important;
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
  background-color: #AED581;
  padding: 5px 8px;
  border-radius: 7px;
}

#roomCode:hover {
  cursor: pointer;
}
</style>
