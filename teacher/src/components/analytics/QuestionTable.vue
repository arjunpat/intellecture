<template>
  <span>
    <v-card-title class="mainfont">
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
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="data"
      :search="search"
      sort-by="upvotes"
      :sort-desc="true"
      must-sort
    >
      <template v-slot:item.question="{ item }">
        {{ item.question }}
        <span class="text-caption">{{ ` - ${item.student.first_name} ${item.student.last_name}` }}</span>
      </template>
    </v-data-table>
  </span>
</template>

<script>
export default {
  props: {
    data: { type: Array, required: true }
  },

  data() {
    return {
      search: '',
      headers: [
        { text: 'Question', value: 'question' },
        { text: 'Upvotes', value: 'upvotes', filterable: false },
      ],
    }
  },
}
</script>