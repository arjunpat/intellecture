<template>
  <v-card>
    <v-card-title>
      Students
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search"
        filled
        rounded
        dense
        single-line
        hide-details
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
      ></v-text-field>
      <v-btn
        icon
        class="ml-2"
        @click.stop="settingsDialog = true"
      >
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-card-title>
    <Dialog 
      v-model="settingsDialog"
      header="Settings"
      btn-text="Done"
      :width="300"
    >
      <template v-slot:content>
        <v-switch v-model="scalePresent" label="Scale present-ness"></v-switch>
        <v-select
          v-model="sortNameBy"
          :items="sortNameByItems"
          label="Sort name by"
        ></v-select>
      </template>
    </Dialog>
    <v-data-table
      :headers="headers"
      :items="data"
      :search="search"
      :custom-sort="customSort"
      sort-by="name"
      must-sort
    >
      <template v-slot:item.name="{ item }">
        <v-row align="center" class="pl-2">
          <v-avatar v-if="!smallScreen" size="36" class="mr-2">
            <img :src="item.photo">
          </v-avatar>
          <v-col class="pa-0">
            {{ `${item.first_name} ${item.last_name}` }}
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.present="{ item }">
        {{ scalePresent ? `${getScaledPresent(item.present)}%` : `${item.present}%` }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import Dialog from '@/components/Dialog'
import { compareString } from '@/helpers.js'

export default {
  props: {
    data: { type: Array, required: true }
  },

  components: {
    Dialog
  },

  data() {
    return {
      settingsDialog: false,
      settingsDialog: false,
      sortNameBy: 'Last name',
      sortNameByItems: ['First name', 'Last name'],
      scalePresent: false,
      search: '',
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Present-ness', value: 'present', filterable: false },
        { text: 'Average Understanding', value: 'understanding', filterable: false },
        { text: 'Questions Asked', value: 'quesCount', filterable: false },
        { text: 'Questions Upvoted', value: 'upvoteCount', filterable: false },
      ],
    }
  },

  computed: {
    smallScreen() {
      return this.$vuetify.breakpoint.smAndDown
    },
    highestPresent() {
      return Math.max.apply(Math, this.data.map(item => item.present))
    }
  },

  methods: {
    getScaledPresent(present) {
      return Math.round(present/this.highestPresent * 100)
    },
    customSort(items, index, isDesc) {
      items.sort((a, b) => {
        if (index[0] === 'name') {
          // Sort based on first name or last name
          if (this.sortNameBy === 'First name') {
            if (!isDesc[0])
              return compareString(a.first_name, b.first_name)
            else 
              return compareString(b.first_name, a.first_name)
          } else {
            if (!isDesc[0])
              return compareString(a.last_name, b.last_name)
            else
              return compareString(b.last_name, a.last_name)
          }
        } else {
          if (a[index] !== null && b[index] !== null) {
            if (!isDesc[0])
              return compareString(a[index], b[index])
            else
              return compareString(b[index], a[index])
          }
        } 
      })
      return items
    },
  },
}
</script>