<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="12" md="8" lg="6" xl="6">
        <v-card ref="form">
          <v-toolbar color="light-green lighten-2" dark flat>
            <v-toolbar-title
              style="font-family: 'Noto Sans', sans-serif; font-weight: bold; font-size: 25px;"
            >CREATE A LECTURE</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <br />
            <br />
            <v-form>
              <h1 class="mb-2">Select a class</h1>
              <v-row align="center" justify="center">
                <v-col cols="12">
                  <v-select
                    :items="(classes && classes.length > 0) ? classes : ['No classes to show']"
                    item-value="uid"
                    item-text="name"
                    label="Class name"
                    outlined
                    @change="changeClass"
                  ></v-select>
                </v-col>
              </v-row>

              <h1 class="mb-2">Give it a name</h1>
              <v-row align="center" justify="center">
                <v-col cols="12">
                  <v-text-field label="Lecture name" outlined v-model="lectureName" required></v-text-field>
                </v-col>
              </v-row>
            </v-form>
            <div class="text-center">
              <v-btn
                @click="create"
                style="font-family: var(--main-font)"
                large
                dark
                color="light-green lighten-2"
              >Create</v-btn>
            </div>
            <br />
            <v-row align="center" justify="center">
              <v-col cols="12">
                <v-alert v-if="formErrors" type="error">{{ error }}</v-alert>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from "@/store"
import { mapState } from "vuex"
import { post, get } from "@/helpers.js"

export default {
  data() {
    return {
      lectureName: "",
      chosenClass: "", // id of class
      formErrors: false,
      classIndex: 0,
      error: "Fill out all the fields.",
    }
  },
  methods: {
    create() {
      if (this.classes.length == 0) {
        this.error = "You must create a class."
        this.formErrors = true
      } else if (this.chosenClass !== "" && this.lectureName !== "") {
        this.formErrors = false
        post("/lectures/create", {
          class_uid: this.chosenClass,
          name: this.lectureName,
        }).then((data) => {
          this.$router.push({ path: "/lecture/" + data.data.lecture_uid })
        })
      } else {
        this.formErrors = true
      }
    },
    changeClass(chose) {
      this.chosenClass = chose
    },
  },
  mounted() {
    store.commit("setShowCode", false)
  },
  computed: {
    ...mapState(["classes"]),
  },
}
</script>

<style scoped>
h1 {
  color: #424242;
  text-align: center;
}
</style>
