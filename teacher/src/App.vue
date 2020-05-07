<template>
  <v-app>
    <v-app-bar
      :collapse="false"
      :collapse-on-scroll="false"
      absolute
      color="green lighten-1"
      dark
      flat
      style="position: fixed; left: 0px; top: 0px;"
    >
      <img src="@/assets/logo.svg" width="35px" class="pointer">

      <v-toolbar-title @click="homeRedirect()"><span id="main-logo" class="pointer">INTELLECTURE</span> Teacher</v-toolbar-title>


      <v-spacer></v-spacer>

      <v-btn class="ml-1 light-green lighten-2" v-if="landing" @click="$router.push({ path: '/signin' })">Sign In</v-btn>
      <v-btn v-if="!started && dashboard" @click="$router.push({ path: '/new' })">Start Lecture</v-btn>
      <v-btn v-if="newlecture" @click="$router.push({ path: '/dashboard' })">Back</v-btn>
      <v-btn class="red" v-if="started && livelecture" @click="endlecture()">End Lecture</v-btn>
      <v-btn class="ml-1 deep-orange accent-2" v-if="!started && !landing && !signin && authUser" @click="signOut()">Sign out <img id="avt-img" class="ml-2" v-bind:src="authUser.photo" width="25px"></v-btn>
      <div v-if="started && livelecture" class="ml-3" style="background-color: #AED581; padding: 5px 8px; border-radius: 7px;">
        <span class="mr-1 font-weight-medium" style="font-size: 20px;">ROOM:</span> <span class="text--primary font-weight-black" style="background: #ddd; border-radius: 7px; padding: 2px 10px; font-size: 25px;">{{id}}</span>
      </div>

    </v-app-bar>

    <div style="height: 64px;"></div>

    <v-content>
      <router-view v-on:startlecture="starting" v-on:nonexistant="started = false" />
    </v-content>
    <v-footer padless color="green lighten-1" v-if="!livelecture">
        <v-card
          flat
          tile
          width="100%"
          class="green lighten-1 text-center"
        >
          <v-card-text class="white--text">
                {{ new Date().getFullYear() }} <strong>Intellecture, All rights reserved.</strong>
          </v-card-text>
        </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import firebase from 'firebase'
import store from './store'
import { post, get } from '@/helpers.js'
import { mapState } from 'vuex'

export default {
  name: 'App',
  created: function () {
    window.onbeforeunload = function() {}
    get('/auth/profile').then((result) => {
      if (result.success) {
        this.$store.commit('setAuthUser', result.data)
      } else {
        this.$store.commit('setAuthUser', null)
      }
      this.redirectAuthUser()
    }).catch((err) => {
    })
  },
  data: function () {
    return {
      started: false,
      imageurl: 'https://tonyxin-8bae2.firebaseapp.com/images/tonyxin2.png',
      id: ''
    }
  },
  computed: {
    ...mapState(['authUser']),
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
    }
  },
  watch: {
    $route: function (to, from) {
      this.redirectAuthUser()
    },
    authUser: function(val) {
      this.redirectAuthUser();
    }
  },
  methods: {
    signOut () {
      get('/auth/logout').then((result) => {
        if (!result.success)
          throw result.error
        store.commit('setAuthUser', null)
        this.$router.replace({ name: 'Landing' })
      })
    },
    redirectAuthUser () {
      // Redirects based on the state of authUser
      const authRoutes = ['Dashboard', 'New', 'Lecture']
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
    endlecture: function() {
      store.commit("setEndLecture", true)
      this.started = false
    },
    starting: function(e) {
      this.id = e;
      this.started = true;
    }
  }
}

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Noto+Sans&display=swap');
@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
@import url('https://fonts.googleapis.com/css?family=Poppins&display=swap');

:root {
  --main-font: 'Poppins';
}

h1 {
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

</style>


<style>
html {
  overflow-y: auto !important;
}
</style>