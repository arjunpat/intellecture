<template>
    <v-container fluid id="container">
        <v-row justify="center" class="mt-12">
            <img @click="homeRedirect()" src="@/assets/img/logo.svg" width="60px" class="pointer">

            <h1 @click="homeRedirect()"><span id="main-logo" class="pointer">INTELLECTURE</span></h1>

        </v-row>
        <v-row justify="center">
            <h1>404. Page not found</h1>
        </v-row>
    </v-container>
</template>

<script>

export default {
  name: 'NotFound',

  methods: {
    homeRedirect() {
      if(!this.dashboard) {
        this.$router.push({ path: '/dashboard' })
      }
    }
  },

  mounted() {
    this.$emit("notFound");
  }

}
</script>

<style scoped>

  #container {
    background-color: #65bb6aff;
    color: white;
    min-height: 100vh;
  }

  #main-logo {
    font-family: 'Noto Sans', sans-serif;
    font-size: 50px;
    font-weight: 600;
  }

  .pointer:hover {
    cursor: pointer;
  }

</style>