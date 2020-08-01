
<template>
  <v-row>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn
          text
          color="error"
          v-on="on"
          style="font-family: 'Poppins'; font-size: 15px;"
          v-if="remove"
        >Delete</v-btn>
        <v-btn
          text
          color="dark"
          v-on="on"
          style="font-family: 'Poppins'; font-size: 15px;"
          v-else
        >Rename</v-btn>
      </template>
      <v-card>
        <v-container>
          <span v-if="remove" style="font-size: 20px;">Are you sure you want to remove this class?</span>
          <span v-else style="font-size: 20px;">What would you like to rename it?</span>
        </v-container>
        <v-card-text>
          <v-container>
            <v-row v-if="remove">
              <v-col cols="12" sm="6" md="12">
                <v-text-field
                  class="mainfont"
                  :label="confirmMessage"
                  hint="Type in the name of the class"
                  v-model="confirm"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col cols="12" sm="6" md="12">
                <v-text-field
                  class="mainfont"
                  label="Class name"
                  hint="What's the new name of the class?"
                  v-model="newClassName"
                ></v-text-field>
                <v-text-field
                  class="mainfont"
                  label="Class section"
                  hint="What's the new section of the class?"
                  v-model="newClassSection"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn v-if="remove" color="red darken-1" text @click="removeClass();">Remove</v-btn>
          <v-btn v-else color="blue darken-1" text @click="dialog = false; renameClass();">Rename</v-btn>
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
  name: 'EditClass',
  props: {
    remove: { type: Boolean, required: true },
    className: { type: String, required: true },
    classSection: { type: String, default: '' },
    classId: { type: String, required: true },
  },
  data() {
    return {
      newClassName: this.className,
      newClassSection: this.classSection,
      confirm: '',
      dialog: false,
    }
  },
  methods: {
    removeClass() {
      if (this.confirm == this.className) {
        post('/classes/delete', {
          class_uid: this.classId,
        }).then((response) => {
          this.dialog = false
          this.$emit('removed')
          getClasses()
        })
      }
    },
    renameClass() {
      post('/classes/rename', {
        class_uid: this.classId,
        name: this.newClassName,
        section: this.newClassSection,
      }).then((response) => {
        getClasses()
      })
    },
  },
  computed: {
    confirmMessage() {
      return 'Type in "' + this.className + '" to confirm'
    },
  },
}
</script>
