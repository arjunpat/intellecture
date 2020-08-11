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
      :footer-props="{
        'items-per-page-options': [100, -1],
      }"
    >
      <template v-slot:item.question="{ item }">
        {{ item.question }}
        <span class="text-caption">{{ ` - ${item.student.first_name} ${item.student.last_name}` }}</span>
      </template>
      <template v-slot:item.upvotes="{ item }">
        <v-chip @click.stop="$emit('showUpvoters', item.question_uid)">
          <v-avatar left>
            <v-icon color="green lighten-3">mdi-arrow-up-bold</v-icon>
          </v-avatar>
          {{ item.upvotes }}
        </v-chip>
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