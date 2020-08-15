<template>
  <v-row
    v-if="scheduleInfo.show"
    justify="center"
    align="center"
  >
    <v-col cols="12" sm="4" class="mx-0">
      <v-menu
        v-model="showDatePicker"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="dateFormatted"
            label="Date"
            hint="MM/DD/YYYY"
            v-bind="attrs"
            @blur="date = parseDate(dateFormatted)"
            v-on="on"
            outlined
            dense
            hide-details
            class="white"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="date"
          color="green lighten-1"
          no-title
          @input="showDatePicker = false"
        ></v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="12" sm="4" class="mx-0">
      <v-fade-transition leave-absolute>
        <v-menu
          ref="timeMenu"
          v-model="showTimePicker"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="timeFormatted"
              label="Time"
              v-bind="attrs"
              @blur="time = parseTime(timeFormatted)"
              v-on="on"
              readonly
              outlined
              dense
              hide-details
              class="white"
            ></v-text-field>
          </template>
          <v-time-picker v-model="time" color="green lighten-1">
            <v-spacer></v-spacer>
            <v-btn text color="black" @click="showTimePicker = false">Ok</v-btn>
          </v-time-picker>
        </v-menu>
      </v-fade-transition>
    </v-col>
    <v-btn
      @click="close()"
      dark
      color="error"
    >Cancel</v-btn>
  </v-row>
</template>

<script>
export default {
  name: 'ScheduleDateTime',

  props: {
    scheduleInfo: { type: Object, required: true }
  },

  model: {
    prop: 'scheduleInfo',
    event: 'update'
  },

  data() {
    return {
      showDatePicker: false,
      showTimePicker: false,
      date: this.scheduleInfo.datetime.toISOString().substr(0, 10),
      dateFormatted: this.formatDate(this.scheduleInfo.datetime.toISOString().substr(0, 10)),
      time: this.parseTime(this.timeFormatted),
      timeFormatted: this.formatTime(
        this.scheduleInfo.datetime.toTimeString().split(":")[0] + ":" + this.scheduleInfo.datetime.toTimeString().split(":")[1]
      ),
    }
  },

  computed: {
    datetime() {
      return Date.parse(this.date + "T" + this.time + ":00");
    }
  },

  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
      this.$emit('update', {
        show: this.scheduleInfo.show,
        datetime: this.datetime
      })
    },
    time(val) {
      this.timeFormatted = this.formatTime(this.time);
      this.$emit('update', {
        show: this.scheduleInfo.show,
        datetime: this.datetime
      })
    },
  },

  methods: {
    close() {
      this.date = new Date().toISOString().substr(0, 10)
      this.dateFormatted = this.formatDate(new Date().toISOString().substr(0, 10))
      this.timeFormatted = this.formatTime(
        new Date().toTimeString().split(":")[0] + ":" + new Date().toTimeString().split(":")[1]
      )
      this.time = this.parseTime(this.timeFormatted)

      this.$emit('update', {
        show: false,
        datetime: this.datetime
      })
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    parseTime(time) {
      if (!time) return null;

      var [hours, minutes] = time.split(":");
      if (minutes.split(" ")[1] == "am") {
        if (hours == "12") {
          hours = "00";
        }
        return hours + ":" + minutes.split(" ")[0];
      } else {
        if (hours != "12") {
          hours = parseInt(hours) + 12;
        }
        return hours + ":" + minutes.split(" ")[0];
      }
    },
    formatTime(time) {
      if (!time) return null;

      var [hours, minutes] = time.split(":");
      var am = true;
      if (parseInt(hours) >= 12) {
        am = false;
      }

      if (am) {
        if (parseInt(hours) == 0) {
          hours = "12";
        }
        return hours + ":" + minutes + " am";
      } else {
        if (parseInt(hours) != 12) {
          hours = parseInt(hours) - 12;
        }
        return hours + ":" + minutes + " pm";
      }
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
  },
}
</script>