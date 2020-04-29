<template>
  <v-content>
    <v-container>
      <div style="height: 10px;"></div>
      <span class="display-1">Hi {{ username }},</span>


      <br><br>
      <v-card v-if="classes != []">
        
        <v-card-title style="background-color: #ECEFF1;" class="headline font-weight-bold">CLASSES</v-card-title>
        <v-divider></v-divider>
        
        <v-card-text align="center">
          <ul style="list-style-type: none">
            <li v-for="cla in classes" v-bind:key="cla.id">
            <v-banner>
              {{cla.name}}
            </v-banner>
            </li>
          </ul>
          <ModalForm v-on:createdClass="loadClasses" class="mt-3"></ModalForm>
        </v-card-text>
      </v-card>

    </v-container>

  </v-content>
</template>

<script>
import ModalForm from '@/components/ModalForm'
import { mapState } from 'vuex'
import { post, get } from '@/helpers.js'

export default {
  components: {
    ModalForm
  },
  data () {
    return {
      username: "",
      classes: []
    }
  },
  methods: {
    loadClasses() {
      get('/classes/mine').then((response) => {
        this.classes = response.data;
        this.classes.sort((a, b) => (a.name > b.name) ? 1 : -1)
      });
    }
  },
  mounted () {
    this.loadClasses()
    if(this.authUser) {
      this.username = this.authUser.displayName
      console.log(this.authUser);
    }
  },
  computed: {
    ...mapState(['authUser', 'token']),
  },
  watch: {
    token: function (val) {
      this.loadClasses()
    },
    authUser: function(val) {
      this.username = this.authUser.displayName
    }
  }
}
</script>

<style scoped>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>
