<template>
  <v-content>
    <v-container>
      <div style="height: 10px;"></div>
      <span class="display-1">Hi {{ username }},</span>


      <br><br>
      <v-card flat class="pt-3">
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
                <ModalForm class="mt-3"></ModalForm>
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

export default {
  components: {
    ModalForm
  },
  data () {
    return {
      username: localStorage.username,
      classes: []
    }
  },
  methods: {
    loadClasses() {
      fetch('https://api.intellecture.app/classes/mine', {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + this.token
        }
      }).then((response) => {
        return response.json();
      })
      .then((data) => {
        this.classes = data.data;
        this.classes.sort((a, b) => (a.name > b.name) ? 1 : -1)
      });
    }
  },
  mounted () {
    this.loadClasses()
  },
  computed: {
    ...mapState(['token']),
  }
}
</script>

<style scoped>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>
