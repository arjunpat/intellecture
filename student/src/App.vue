<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <span class="display-1 shrink mt-1 hidden-sm-and-down">Intellecture</span>
      </div>

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
import firebase from 'firebase';
import { mapState } from 'vuex';
import UserAvatarContent from '@/components/UserAvatarContent';

export default {
  name: 'App',

  created() {
    this.redirectAuthUser();
  },

  components: {
    UserAvatarContent,
  },

  watch: {
    '$route': function(val) {
      this.redirectAuthUser();
    },
    'authUser': function(val) {
      this.redirectAuthUser();
    }
  },

  computed: {
    ...mapState(['authUser']),
  },

  methods: {
    signOut() {
      firebase.auth().signOut();
    },
    redirectAuthUser() {
      // Redirects based on the state of authUser
      let authRoutes = ['Room', 'Join'];
      let noAuthRoutes = ['SignIn'];

      if (this.authUser) {
        if (noAuthRoutes.includes(this.$route.name)) {
          this.$router.replace({ name: 'Join' });
        }
      } else {
        if (authRoutes.includes(this.$route.name)) {
          this.$router.replace({ name: 'SignIn' });
        }
      }
    }
  },
};
</script>
