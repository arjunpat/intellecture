<template>
  <v-list-item>
    <v-list-item-avatar size="42px">
      <img
        alt="Avatar"
        :src="student.photo"
        style="background-color: #F5F5F5;"
      />
    </v-list-item-avatar>
    <v-list-item-content style="font-family: var(--main-font);">
      <v-row align="center">
        <v-col cols="auto" class="py-0 pr-0">
          <v-list-item-title>{{ student.first_name }} {{ student.last_name }}</v-list-item-title>
          <v-list-item-subtitle>Joined {{ formatUnix(student.ts) }}</v-list-item-subtitle>
        </v-col>

        <v-col class="py-0">
          <v-btn
            text
            color="red"
            @click.stop="remove"
          >Remove</v-btn>
        </v-col>
      </v-row>
    </v-list-item-content>

    <v-list-item-action>
      <v-chip 
        class="mr-3"
        :color="understandingColor"
      >
        {{
          understanding > 0
            ? understanding + "0"
            : understanding
        }}% understanding
      </v-chip>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
  name: 'StudentListItem',

  props: {
    student: {type: Object, required: true},
    understanding: {type: Number, required: true},
  },

  data() {
    return {
      understandingColors: ['rgb(240, 53, 36)', 'rgb(255, 183, 0)', 'rgb(250, 225, 0)', 'rgb(126, 196, 4)', '#B2FF59'],
      maxUnderstanding: 10,
    }
  },

  computed: {
    understandingColor() {
      const percent = this.understanding / this.maxUnderstanding
      let index = Math.round(percent * (this.understandingColors.length-1))
      const color = this.understandingColors[index]
      return color
    },
  },

  methods: {
    remove() {
      this.$emit('removeStudent', this.student)
    },
    formatUnix(unix_timestamp) {
      if (unix_timestamp == undefined) {
        return "";
      }
      let date = new Date(unix_timestamp);
      return date.toLocaleTimeString();
    },
  },
}
</script>