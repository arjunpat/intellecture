<template>
  <div>
    <v-app v-if="loaded">
      <AutoSnackbar
        :text="error"
        color="error"
      ></AutoSnackbar>
      <v-app-bar
        v-if="$route.path !== '/'"
        app
        color="green lighten-1"
        dark
      >
        <img src="@/assets/img/logo.svg" width="35px" class="pointer">

        <v-toolbar-title @click="homeRedirect" style="font-family: 'Roboto';"><span id="main-logo" class="pointer">INTELLECTURE</span> Student</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-menu
          v-if="authUser"
          offset-y
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-avatar>
                <UserAvatarContent :user="authUser" />
              </v-avatar>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title><strong>{{ `${authUser.first_name} ${authUser.last_name}` }}</strong></v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="signOut">
              <v-list-item-title class="red--text">Sign Out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <v-main>
        <router-view/>
      </v-main>
    </v-app>
    <LoadingScreen :show="!loaded" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UserAvatarContent from '@/components/UserAvatarContent'
import AutoSnackbar from '@/components/AutoSnackbar'
import LoadingScreen from '@/components/LoadingScreen'
import { get, signOut } from '@/helpers'

export default {
  name: 'App',

  data() {
    return {
      error: '',
      loaded: false,
    }
  },

  created() {
    get('/auth/profile').then((result) => {
      if (result.success) {
        this.$store.commit('setAuthUser', result.data)
      } else {
        this.$store.commit('setAuthUser', null)
      }
      this.redirectAuthUser()
      this.loaded = true
    }).catch((err) => {
      this.$store.commit('setAuthUser', null)
      this.redirectAuthUser()
      this.loaded = true
    })
  },

  components: {
    UserAvatarContent,
    AutoSnackbar,
    LoadingScreen,
  },

  watch: {
    $route: function(val) {
      this.redirectAuthUser()
    },
    authUser: function(val) {
      this.redirectAuthUser()
    }
  },

  computed: {
    ...mapState(['authUser']),
  },

  methods: {
    signOut() {
      signOut().then(() => {
        if (this.$route.name === 'Room')
          this.$router.replace({ name: 'Join' })
      }).catch((err) => {
        this.error = "There was an error signing out!"
      })
    },
    redirectAuthUser() {
      // Redirects based on the state of authUser
      // All redirecting based on authUser should be placed here
      let authRoutes = ['Feedback']

      if (!this.authUser) {
        if (authRoutes.includes(this.$route.name)) {
          this.$router.replace({ name: 'Join' })
        }
      }
    },
    homeRedirect() {
      this.$router.push({ name: 'Join' });
    }
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Noto+Sans&display=swap');
@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
@import url('https://fonts.googleapis.com/css?family=Poppins&display=swap');

:root {
  --main-font: 'Poppins';
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

* {
  font-family: var(--main-font);
}

</style>
