<template>
  <v-content v-if="authUser">
    <v-container>
      <div style="height: 10px;"></div>
      <h1 class="poppins">Hi {{ authUser.first_name }},</h1>
      <br>

      <v-card v-if="classes != []">
        <v-card-title style="background-color: #ECEFF1;" class="card-title">CLASSES</v-card-title>
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
          <ModalForm class="mt-3 ml-6"></ModalForm>
        </v-card-text>
      </v-card>

      <v-card class="mt-12" v-if="classes != []">
        <v-card-title style="background-color: #ECEFF1;" class="card-title">LECTURES
          <v-spacer></v-spacer>
          <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          color="green lighten-1"
          filled
          rounded
          single-line
          hide-details
        ></v-text-field></v-card-title>
        
        <v-divider></v-divider>
        <v-card-text align="center">
          <v-data-table
            :headers="headers"
            :items="(lectures==null) ? skeleton : lectures"
            :items-per-page="5"
            :search="search"
            class="elevation-1"
          >
             <template v-slot:item.end_time="{ item }">
               <div>{{formatUnix(item.end_time)}}</div>
            </template>
             <template v-slot:item.start_time="{ item }">
               <div>{{formatUnix(item.start_time)}}</div>
            </template>
          </v-data-table>
          Note: The console will error out until I figure out what time format that's stored in.
        </v-card-text>
      </v-card>

    </v-container>

  </v-content>
</template>

<script>
import ModalForm from '@/components/ModalForm'
import { post, get, getClasses, setLectures } from '@/helpers.js'
import { mapState } from 'vuex'

export default {
  components: {
    ModalForm
  },
  data () {
    return {
      authUser: null,
      search: "",
      skeleton:[{"uid":"WAIT","end_time":1589049106,"name":"Please wait.","start_time":1589049106,"className":"Loading Data"}],
      headers: [
        {
          text: 'Class Name',
          align: 'start',
          sortable: true,
          value: 'className',
        },
        { text: 'End Time', value: 'end_time' },
        { text: 'Start Time', value: 'start_time' },
        { text:"Lecture Name", value: `name`},
        { text: 'Student List', value: "" },
        { text: 'Code', value: 'uid' },
        ],
    }
  },
  methods: {
    formatUnix(unix_timestamp) {
      console.log(unix_timestamp)
      if (unix_timestamp==undefined) {
        return "";
      }
      let date = new Date(unix_timestamp);
      const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit',hour: "numeric", minute:"numeric" }) 
      return dtf.format(date);
    }
  },
  mounted () {
    get('/auth/profile').then((response) => {
      if(!response.success) {
        this.authUser = null;
      } else {
        this.authUser = response.data;
        if(!this.classes) {
          getClasses().then(()=>{setLectures()});
        }
      }
    });
  },
  computed: {
    ...mapState(['classes']),
    ...mapState(['lectures'])
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

.card-title {
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
