
<template>
  <v-row>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn text color="primary" v-on="on" style="font-family: 'Poppins'; font-size: 15px;">Create New +</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span style="font-size: 30px; font-weight: bold;">Create a class</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="12">
                <v-text-field
                  class="mainfont"
                  label="Class name"
                  hint="What's the name of the new class?"
                  v-model="className"
                ></v-text-field>
                <v-text-field
                  class="mainfont"
                  label="Class section"
                  hint="What's the section of the new class?"
                  v-model="classSection"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false; createClass();">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped>
</style>

<script>
import { mapState } from 'vuex'
import { post, get, getClasses } from '@/helpers.js'

export default {
  name: 'ModalForm',
  data() {
    return {
      dialog: false,
      className: '',
      classSection: ''
    }
  },
  methods: {
    createClass() {
      post('/classes/create', {
        name: this.className,
        section: this.classSection
      }).then((response) => {
        this.className = ''
        this.classSection = ''
        getClasses()
      })
    },
  },
}
</script>
