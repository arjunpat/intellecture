<template>
  <v-content>
    <v-container>
      <div style="height: 10px;"></div>
      <span class="display-1">Hi {{ username }},</span>


      <br><br>
      <v-card flat class="pt-3" v-if="classes != []">
        <v-row align="center" justify="center">
          <v-row align="center" justify="center">
              <v-col cols="12">
                <h1>Classes</h1>
                <ul style="list-style-type: none">
                  <li v-for="cla in classes" v-bind:key="cla.id">
                  <v-banner>
                    {{cla.name}}
                  </v-banner>
                  </li>
                </ul>
                <ModalForm v-on:createdClass="loadClasses" class="mt-3"></ModalForm>
              </v-col>
          </v-row>
        </v-row>
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
