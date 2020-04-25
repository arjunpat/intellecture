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
                            label="Class name"
                            outlined
                            v-model="className"
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

export default {
  data () {
    return {
      lectureName: '',
      classes: ['AP Calculus BC', 'AP Chemistry', 'AP Physics C: E & M', 'AP Physics C: Mechanics', 'Multivariable Calculus'],
      className: '',
      formErrors: false
    }
  },
  methods: {
    create () {
      if (this.className !== '' && this.lectureName !== '') {
        this.formErrors = false
        const id = this.makeId(5)
        /*axios.post(`api.intellecture.app/classes/create`, {
          name: this.lectureName
        })
        .then(response => {})
        .catch(e => {
          this.errors.push(e)
        })*/
        this.$router.push({ path: '/lecture?id=' + id + '&name=' + this.lectureName })
      } else {
        this.formErrors = true
      }
    },
    makeId (length) {
      let result = ''
      const characters = 'abcdefghijklmnopqrstuvwxyz'
      const len = characters.length
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * len))
      }
      return result
    }
  }
}

</script>

<style scoped>

h1 {
    color: #424242;
    text-align: center;
}

</style>
