<template>
  <v-content v-if="authUser">
    <v-container>
      <v-btn depressed small v-if="!notification" @click="requestNotifications()" style="position: fixed; top: 70px; left: 10px; z-index: 100;">Enable notifications <v-icon small>mdi-bell</v-icon></v-btn>
      <h1 class="poppins">Hi {{ authUser.first_name === 'Arjun' ? 'Jonathan' : authUser.first_name }},</h1>
      <br>

      <v-card-title class="card-title" v-if="recentLectures.length !== 0">Your Recent Lectures</v-card-title>
      <div style="display: flex; justify-content: flex-start;">
        <v-card
          class="mx-auto"
          width="275"
          min-height="175"
          hover
          outlined
          v-for="a in recentLectures"
          :key="a.uid"
          :to="'/lecture-analytics/' + a.uid"
        >
          <v-card-title>{{ a.name }}</v-card-title>
          <v-card-subtitle>{{ a.className }}</v-card-subtitle>
          <v-card-text>{{ dateToString(a.start_time) }}</v-card-text>

          <v-card-actions>
            <v-btn text color="#66BB6A">See Analytics</v-btn>
          </v-card-actions>
        </v-card>
      </div>

      <br><br><br>

      <v-card v-if="classes != []">
        <v-card-title style="background-color: #ECEFF1;" class="card-title">CLASSES</v-card-title>
        <v-divider></v-divider>
        <v-card-text align="left">
          <ul style="list-style-type: none">
            <li v-if="classes == [] && classses == null">
              <div class="noshow">No classes to show</div>
            </li>
            <li v-for="cla in classes" v-bind:key="cla.id">
            <v-banner style="font-family: 'Poppins';">
              {{cla.name}}
            </v-banner>
            </li>
          </ul>
          <ModalForm class="mt-3 ml-6"></ModalForm>
        </v-card-text>
      </v-card>

      <v-card class="mt-12 mb-12" v-if="classes != [] && classes">
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
          dense
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
        </v-card-text>
      </v-card>

    </v-container>

  </v-content>
</template>

<script>
import ModalForm from '@/components/ModalForm'
import { post, get, getClasses, setLectures, dateToString } from '@/helpers.js'
import { mapState } from 'vuex'

export default {
  name: "Dashboard",
  components: {
    ModalForm
  },
  props: {
    fromLectureEnd: {type: Boolean, default: false}
  },
  data () {
    return {
      authUser: null,
      notification: Notification.permission == 'granted' ? true : false,
      search: "",
      skeleton:[{"uid":"","end_time":null,"name":"","start_time":null,"className":""}],
      recentLectures: [],
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
        //{ text: 'Student List', value: "" }, TODO
        { text: 'Code', value: 'uid' },
        ],
    }
  },
  methods: {
    dateToString,
    formatUnix(unix_timestamp) {
      if (unix_timestamp==undefined) {
        return "";
      }
      let date = new Date(unix_timestamp);
      const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit',hour: "numeric", minute:"numeric" }) 
      return dtf.format(date);
    },
    requestNotifications() {
      Notification.requestPermission(function(status) {
          console.log('Notification permission status:', status);
          if(this.status == 'granted') {
            this.notification = true
          }
      });
    },
    genRecentLectures() {
      let l = JSON.parse(JSON.stringify(this.lectures))
      
      // TODO for some reason there are duplicates and it is too late for me to figure out why
      // so i will just remove them
      // @Tony figure out why there are duplicates
      let map = {}
      for (let i = 0; i < l.length; i++) {
        if (map[l[i].uid]) {
          l.splice(i, 1);
          i--;
        } else {
          map[l[i].uid] = true;
        }
      }

      l.sort((a, b) => b.start_time - a.start_time)
      l.forEach(e => {
        if (e.name.length > 21) {
          e.name = e.name.slice(0, 18) + '...'
          console.log(e.name)
        }
      })
      this.recentLectures = l.slice(0, 4)
      console.log(JSON.parse(JSON.stringify(this.recentLectures)))
    }
  },
  mounted () {
    get('/auth/profile').then((response) => {
      if(!response.success) {
        this.authUser = null;
      } else {
        this.authUser = response.data;
        if(!this.classes) {
          setLectures();
        }
      }
    });
    this.genRecentLectures()
  },
  computed: {
    ...mapState(['classes', 'lectures'])
  },
  watch: {
    lectures() {
      this.genRecentLectures()
    }
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

.noshow {
  font-family: var(--main-font);
  font-size: 20px;
  text-align: left;
  height: 40px;
  line-height: 40px;
  color: #757575;
}

</style>
