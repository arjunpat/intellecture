<template>
  <v-app>
    <v-app-bar
      v-if="$route.path !== '/'"
      app
      color="green lighten-1"
      dark
    >
        <img src="@/assets/img/logo.svg" width="35px" class="pointer mr-2">

        <v-toolbar-title @click="homeRedirect()"><span id="main-logo" class="pointer">INTELLECTURE</span> Student</v-toolbar-title>

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
            <v-list-item-title><strong>{{ authUser.displayName }}</strong></v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="signOut">
            <v-list-item-title class="red--text">Sign Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase'
import { mapState } from 'vuex'
import UserAvatarContent from '@/components/UserAvatarContent'

export default {
  name: 'App',

  created() {
    this.redirectAuthUser()
  },

  components: {
    UserAvatarContent,
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
      firebase.auth().signOut()
    },
    redirectAuthUser() {
      // Redirects based on the state of authUser
      let authRoutes = ['Room', 'Join']
      let noAuthRoutes = ['']

      if (this.authUser) {
        if (noAuthRoutes.includes(this.$route.name)) {
          this.$router.replace({ name: 'Join' })
        }
      } else {
        if (authRoutes.includes(this.$route.name)) {
          this.$router.replace({ name: 'SignIn' })
        }
      }
    },
    homeRedirect() {
      if(this.authUser) {
        this.$router.replace({ name: 'Join' });
      } else {
        this.$router.replace({ name: 'SignIn' });
      }
    }
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Noto+Sans&display=swap');
@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
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

</style>