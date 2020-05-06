<template>
  <v-content>
    <v-container>
        <v-row align="center" class="page">
            <v-col align="center" class="title">
                <h1>Education that's as smart as you are.</h1>
                <br/>
                <h3>It's worth noting that this description here will likely be somewhat long and rather worthless. That's why I've left all of this negative space on the page-- this needs to be filled!</h3>
                <br/>
                <v-btn color="light-green lighten-2" style="color: #424242;" x-large>Sign Up Today</v-btn>
            </v-col>
            <v-col align="center" class="carasoul">
                <img src="@/assets/logo.svg" class="logo">
            </v-col>
        </v-row>
    </v-container>
  </v-content>
</template>

<script>

export default {
  name: 'Landing',
  data () {
    return {
    }
  }
}
</script>

<style scoped lang="scss">

.container {
  display:flex;
}
@keyframes floatSubtle {
  0% {
    transform:translateY(-5%);
  }
  50% {
    transform:translateY(5%);
  }
  0% {
    transform:translateY(-.25%);
  }
}
@keyframes rainbow { // This is highly cuttable. I thought it was a somewhat nice effect here, though, giving the page a different splash of color.
  0%, 100% {
  }
  50% {
    filter:hue-rotate(180deg);
  }
  
}

.page {
  margin-top: 5%;
}
.logo {
  animation: floatSubtle 5s  infinite alternate,
             rainbow 20s infinite;
  animation-timing-function: easeInOutCirc; 
  width:25rem;
}
.title {
  color:gray; // Please change this at some point. These values are here strictly to keep the styling consistent throughout the code.
  border-right: solid gray 1rem;
}
.title > h1 {
    font-size: 400%;
    line-height: 120%;
}
@media only screen and (max-width: 600px) {
  .logo {
    width:15rem;
  }
  .title {
    color:gray; // Please change this at some point. These values are here strictly to keep the styling consistent throughout the code.
    border-right: none;
  }
} 
</style>
