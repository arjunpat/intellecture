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
                <ModalForm></ModalForm>
              </v-col>
          </v-row>
        </v-row>
      </v-card>

    </v-container>

  </v-content>
</template>

<script>
import ModalForm from '@/components/ModalForm'

export default {
  data () {
    return {
      username: localStorage.username,
      classes: [
        {
            "uid":"GsF2nERLrwvLe0T",
            "created_at":1587439054817,
            "name":"AP Physics C"
        },
        {
            "uid":"j3fmOXvJyq5Dlww",
            "created_at":1587439080846,
            "name":"History"
        },
        {
            "uid":"YaneS98ttCj7ErF",
            "created_at":1587439072263,
            "name":"English"
        }

      ]
    }
  },
  components: {
    ModalForm
  }
}
</script>

<style scoped>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>
