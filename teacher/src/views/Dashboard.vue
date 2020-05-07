<template>
  <v-content v-if="authUser">
    <v-container>
      <div style="height: 10px;"></div>
      <h1 class="poppins">Hi {{ authUser.first_name }},</h1>
      <br>

      <v-card v-if="classes != []">
        <v-card-title style="background-color: #ECEFF1;" id="class-title">CLASSES</v-card-title>
        <v-divider></v-divider>
        <v-card-text align="center">
          <ul style="list-style-type: none">
            <h1 v-if="!classes">No classes</h1>
            <li v-for="cla in classes" v-bind:key="cla.id">
            <v-banner style="font-family: 'Poppins';">
              {{cla.name}}
            </v-banner>
            </li>
          </ul>
          <ModalForm v-on:createdClass="loadClasses" class="mt-3 ml-6"></ModalForm>
        </v-card-text>
      </v-card>

    </v-container>

  </v-content>
</template>

<script>
import ModalForm from '@/components/ModalForm'
import { post, get } from '@/helpers.js'

export default {
  components: {
    ModalForm
  },
  data () {
    return {
      authUser: null,
      classes: []
    }
  },
  methods: {
    loadClasses() {
      get('/classes/mine').then((response) => {
        this.classes = response.data;
        console.log(this.classes);
        if(this.classes) {
          this.classes.sort((a, b) => (a.name > b.name) ? 1 : -1)
        }
      });
    }
  },
  mounted () {
    get('/auth/profile').then((response) => {
      if(!response.success) {
        this.authUser = null;
      } else {
        this.authUser = response.data;
        this.loadClasses()
      }
    });
  },
  computed: {
  },
  watch: {
  }
}
</script>

<style scoped>

.v-sheet--offset {
  top: -24px;
  position: relative;
}

#class-title {
  font-family: 'Noto Sans';
  font-weight: 800;
  font-size: 25px;
}

.poppins {
  font-family: 'Poppins';
}

h1 {
  font-size: 40px;
}

</style>
