<template>
  <v-content>
    <v-container
      class="fill-height"
      fluid
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="6"
          sm="8"
          md="8"
        >
          <v-card ref="form">
            <v-toolbar
              color="light-green lighten-2"
              dark
              flat
            >
              <v-toolbar-title style="font-family: 'Noto Sans', sans-serif; font-weight: bold;">CREATE A LECTURE</v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <br><br>
              <v-form>
                <h1>Select a class</h1>
                <v-row align="center" justify="center">
                    <v-col  cols="12" sm="6">
                        <v-select
                            :items="classes"
                            item-value="uid"
                            item-text="name"
                            label="Class name"
                            outlined
                            @change="changeClass"
                        ></v-select>
                    </v-col>
                </v-row>

                <h1>Give it a name</h1>
                <v-row align="center" justify="center">
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Lecture name"
                      outlined
                      v-model="lectureName"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
              <div class="text-center">
                <v-btn @click="create" color="light-green lighten-2" style="color: #424242;" x-large>Create</v-btn>
              </div>
              <br>
                <v-row align="center" justify="center">
                  <v-col cols="12" sm="12">
              <v-alert v-if="formErrors" type="error">
                Fill out all the fields.
              </v-alert>
                  </v-col>
                </v-row>
            </v-card-text>

          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import { mapState } from 'vuex'
import { post, get } from '@/helpers.js'

export default {
  data () {
    return {
      lectureName: '',
      classes: ['Loading classes...'],
      chosenClass: '', // id of class
      formErrors: false,
      classIndex: 0
    }
  },
  methods: {
    create () {
      if (this.chosenClass !== '' && this.lectureName !== '') {
        this.formErrors = false
        post('/lectures/create', {
          class_uid: this.chosenClass,
          name: this.lectureName
        }).then((data) => {
          this.$router.push({ path: '/lecture/' + data.data.lecture_uid })
        });
      } else {
        this.formErrors = true
      }
    },
    loadClasses () {
      get('/classes/mine').then((response) => {
        this.classes = response.data;
        this.classes.sort((a, b) => (a.name > b.name) ? 1 : -1)
      });
    },
    changeClass (chose) {
      this.chosenClass = chose;
    }
  },
  mounted() {
    this.loadClasses();
  },
  computed: {
    ...mapState(['token']),
  }
}

</script>

<style scoped>

h1 {
    color: #424242;
    text-align: center;
}

</style>
