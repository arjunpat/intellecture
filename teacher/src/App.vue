<template>
  <v-app>
    <v-app-bar
      :collapse="false"
      :collapse-on-scroll="false"
      absolute
      color="green lighten-1"
      dark
      style="position: fixed; left: 0px; top: 0px;"
    >
      <img src="../public/logo.png" width="35px" class="">

      <v-toolbar-title><span id="main-logo">INTELLECTURE</span> Teacher</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn v-if="!started" @click="$router.push({ path: '/new' })">Start Lecture</v-btn>
      <v-btn class="red" v-if="started" @click="$router.push({ path: '/dashboard' }); started = false;">End Lecture</v-btn>
      <v-btn class="ml-1 deep-orange accent-2">Sign out <img id="avt-img" class="ml-2" v-bind:src="imageurl" width="25px"></v-btn>
    </v-app-bar>

    <div style="height: 64px;"></div>

    <v-content>
      <router-view v-on:startlecture="started = true" />
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: function () {
    return {
      started: false,
      imageurl: 'https://tonyxin-8bae2.firebaseapp.com/images/tonyxin2.png'
    }
  }
}

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Noto+Sans&display=swap');
</style>

<style scoped>

#main-logo {
  font-family: 'Noto Sans', sans-serif;
  font-size: 25px;
  font-weight: 600;
}

#avt-img {
  border-radius: 50%;
  background-color: white;
}

</style>
