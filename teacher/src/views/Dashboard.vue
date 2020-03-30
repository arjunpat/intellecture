<template>
  <v-content>
    <v-container>
      <div style="height: 10px;"></div>
      <span class="display-1">Hi {{ username }},</span>

      <div style="height: 60px;"></div>

      <br><br>

    </v-container>

  </v-content>
</template>

<script>

export default {
  data () {
    return {
      username: localStorage.username
    }
  }
}
</script>

<style scoped>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>
