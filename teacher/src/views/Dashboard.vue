<template>
  <v-container v-if="authUser" class="mt-4">
    <v-btn
      depressed
      small
      v-if="!notification"
      @click="requestNotifications()"
      style="position: fixed; top: 70px; left: 10px; z-index: 100;"
    >
      Enable notifications
      <v-icon small>mdi-bell</v-icon>
    </v-btn>
    <h1 class="poppins mb-4 header" v-if="recentLectures.length > 0">Recent Lectures</h1>

    <v-row class="pl-3 pt-2">
      <div
        v-for="a in recentLectures"
        :key="a.uid"
        style="display: 'inline-block';"
      >
        <v-card
          :width="recentLectureCardSize"
          min-height="175"
          hover
          outlined
          class="mr-3 rounded-lg mainfont"
          :to="'/lecture-analytics/' + a.uid"
        >
          <v-card-title class="font-weight-bold">{{ a.name }}</v-card-title>
          <v-card-subtitle>{{ a.className }}</v-card-subtitle>
          <v-card-text>{{ dateToString(a.end_time) }}</v-card-text>

          <v-card-actions>
            <v-btn text color="#66BB6A">See Analytics</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-row>

    <v-row>
      <h1 class="poppins mt-10 mb-4 ml-3 header">Classes</h1>
      <ModalForm style="margin-top: 62px;" class="ml-1"></ModalForm>
    </v-row>

    <v-row class="pl-3 pt-2">
      <div id="noclasses" v-if="!classes || classes.length == 0">
        <v-img style="margin-left: 150px;" width="50px" src="@/assets/img/arrow.png"></v-img>
        <h1> Create your first class!</h1>
      </div>
      <div
        class="mr-3 mb-3"
        v-for="cla in classes"
        :key="cla.uid"
        style="display: 'inline-block';"
      >
        <v-card
          :width="$vuetify.breakpoint.xs ? '95vw' : 350"
          outlined
          hover
          min-height="100"
          class="rounded-lg poppins"
          @click="classRedirect(cla.uid)"
        >
          <v-card-title>{{ cla.name }}</v-card-title>
          <v-card-subtitle>{{ cla.section }}</v-card-subtitle>
          <v-card-text>{{ cla.lecture_count }} lecture{{ cla.lecture_count === 1 ? '' : 's' }}</v-card-text>

          <v-menu
            offset-x
            nudge-top
            :close-on-content-click="false"
            transition="slide-x-transition"
          >
            <template v-slot:activator="{ on }">
              <a v-on="on" style="position: absolute; right: 0px; top: 40px;"
                ><v-icon large id="menu-icon">more_vert</v-icon></a
              >
            </template>
            <v-list class="poppins">
              <v-list-item>
                <v-list-item-title><EditClass @removed="genRecentLectures()" :remove="true" :className="cla.name" :classId="cla.uid"></EditClass></v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><EditClass :remove="false" :className="cla.name" :classSection="cla.section" :classId="cla.uid"></EditClass></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card>
      </div>
    </v-row>

    <!-- OLD RECENT LECTURES
    <v-card class="mt-6" v-if="recentLectures.length !== 0" id="recent-lectures">
      <v-card-title class="card-title">RECENT LECTURES</v-card-title>
      <v-row class="pl-5 pt-2">
      <div
          v-for="a in recentLectures"
          :key="a.uid"
          style="display: 'inline-block';"
          class="pb-2">
        <v-card
          :width="recentLectureCardSize"
          min-height="175"
          hover
          outlined
          style="margin-right: 15px;"
          :to="'/lecture-analytics/' + a.uid"
        >
          <v-card-title>{{ a.name }}</v-card-title>
          <v-card-subtitle>{{ a.className }}</v-card-subtitle>
          <v-card-text>{{ dateToString(a.end_time) }}</v-card-text>

          <v-card-actions>
            <v-btn text color="#66BB6A">See Analytics</v-btn>
          </v-card-actions>
        </v-card>
      </div>
      </v-row>
    </v-card>
    -->

    <!-- OLD CLASSES AND LECTURES
    <v-card v-if="classes != []" class="mt-12">
      <v-card-title class="card-title">CLASSES</v-card-title>
      <v-divider></v-divider>
      <v-card-text align="left">
        <ul style="list-style-type: none">
          <li v-if="classes == [] && classses == null">
            <div class="noshow">No classes to show</div>
          </li>
          <li v-for="cla in classes" v-bind:key="cla.id">
            <v-banner style="font-family: 'Poppins';">{{ cla.name }}</v-banner>
          </li>
        </ul>
        <ModalForm class="mt-3 ml-6"></ModalForm>
      </v-card-text>
    </v-card>

    <v-card class="mt-12 mb-12" v-if="classes != [] && classes">
      <v-card-title class="card-title">
        LECTURES
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
        ></v-text-field>
      </v-card-title>

      <v-divider></v-divider>
      <v-card-text align="center">
        <v-data-table
          :headers="headers"
          :items="lectures == null ? skeleton : lectures"
          :items-per-page="5"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:item.end_time="{ item }">
            <div>{{ formatUnix(item.end_time) }}</div>
          </template>
          <template v-slot:item.start_time="{ item }">
            <div>{{ formatUnix(item.start_time) }}</div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    -->
  </v-container>
</template>

<script>
import ModalForm from "@/components/ModalForm";
import EditClass from "@/components/EditClass";
import { post, get, dateToString } from "@/helpers.js";
import { mapState } from "vuex";

export default {
  name: "Dashboard",
  components: {
    ModalForm,
    EditClass
  },
  props: {
    fromLectureEnd: { type: Boolean, default: false }
  },
  data() {
    return {
      notification: Notification.permission == "granted" ? true : false,
      search: "",
      skeleton: [{ end_time: null, name: "", start_time: null, className: "" }],
      recentLectures: [],
      headers: [
        {
          text: "Class Name",
          align: "start",
          sortable: true,
          value: "className"
        },
        { text: "End Time", value: "end_time" },
        { text: "Start Time", value: "start_time" },
        { text: "Lecture Name", value: `name` }
        //{ text: 'Student List', value: "" }, TODO
        //{ text: 'Code', value: 'uid' },
      ]
    };
  },
  methods: {
    dateToString,
    formatUnix(unix_timestamp) {
      if (unix_timestamp == undefined) {
        return "";
      }
      let date = new Date(unix_timestamp);
      const dtf = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric"
      });
      return dtf.format(date);
    },
    requestNotifications() {
      Notification.requestPermission(function(status) {
        console.log("Notification permission status:", status);
        if (this.status == "granted") {
          this.notification = true;
        }
      });
    },
    async genRecentLectures() {
      let d = await get("/lectures/recent").then(d => d.data);
      d.forEach(e => {
        if (e.name.length > 21) e.name = e.name.slice(0, 18) + "...";
      });
      this.recentLectures = d;
    },
    classRedirect(classId) {
      this.$router.push({ path: `/lectures/${classId}` })
    }
  },
  mounted() {
    this.genRecentLectures();
  },
  computed: {
    ...mapState(["classes", "lectures", "authUser"]),
    smallScreen() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return true;
        case "sm":
          return true;
        case "md":
          return false;
        case "lg":
          return false;
        case "xl":
          return false;
      }
    },
    recentLectureCardSize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "170";
        case "sm":
          return "200";
        case "md":
          return "275";
        case "lg":
          return "275";
        case "xl":
          return "275";
      }
    }
  }
};
</script>

<style scoped>
.header {
  font-weight: 900;
  font-size: 50px;
}

.v-sheet--offset {
  top: -24px;
  position: relative;
}

.card-title {
  font-family: "Noto Sans";
  font-weight: 800;
  font-size: 25px;
  background-color: #eceff1;
}

.poppins {
  font-family: "Poppins";
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

#recent-lectures > div {
  display: flex;
  justify-content: flex-start;
}

#menu-icon {
  transition: 0.3s all;
  color: black;
}

#menu-icon:hover {
  transform: scale(1.1);
}

#noclasses {
  margin-top: -40px;
  margin-left: 70px;
}

#noclasses > h1 {
  font-size: 20px;
  font-weight: normal;
  margin-top: -10px;
}
</style>
