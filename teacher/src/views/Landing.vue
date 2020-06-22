<template>
  <v-content class="fullscreen">
    <v-container class="section">
        <v-row align="center" class="page">
            <v-col align="center" class="title" cols="7"> 
                <h1 style="font-size: 70px; line-height: 110px;">Meet <div class="hat" style="background-color: #aed581; font-size: 100px;">Intellecture</div></h1>
                <br/>
                <h3>Teach online with confidence</h3>
                <br/>
                <v-btn color="light-green lighten-2" style="color: #424242;" x-large @click="$router.push({ path: '/signin' })">Request Access</v-btn>
            </v-col>
            <v-col align="center" class="carasoul pl-12" cols="5">
                <img src="@/assets/img/logo.svg" class="logo">
            </v-col>
        </v-row>
    </v-container>
    <!--
    <v-container>
        <v-row align="center" class="page">
          <v-col align="center"  class="col-8 overview gray">
            <v-col  class="">
              <v-card elevation="0" outlined  class="overview green lighten-1">
                  <v-list-item three-line>
                      <v-list-item-content>
                        <v-list-item-title class="headline mb-1"><div class="text">1: Create a class</div></v-list-item-title>
                        <v-list-item-subtitle>Description, or better still, screenshots of polished app. We might want to get some nice SVG art here to make it look more professional.</v-list-item-subtitle>
                      </v-list-item-content>
                  </v-list-item>  
              </v-card>
            </v-col>
            <v-col  class="">
              <v-card elevation="0" outlined  class="overview green lighten-1">
                  <v-list-item three-line>
                      <v-list-item-content>
                        <v-list-item-title class="headline mb-1"><div class="text">2: Start a lecture</div></v-list-item-title>
                        <v-list-item-subtitle>Description, or better still, screenshots of polished app. We might want to get some nice SVG art here to make it look more professional.</v-list-item-subtitle>
                      </v-list-item-content>
                  </v-list-item>  
              </v-card>
            </v-col>
            <v-col  class="">
              <v-card elevation="0" outlined  class="overview green lighten-1">
                  <v-list-item three-line>
                      <v-list-item-content>
                        <v-list-item-title class="headline mb-1"><div class="text">3: Recieve immediate feedback</div></v-list-item-title>
                        <v-list-item-subtitle>Description, or better still, screenshots of polished app. We might want to get some nice SVG art here to make it look more professional.</v-list-item-subtitle>
                      </v-list-item-content>
                  </v-list-item>  
              </v-card>
            </v-col>
          </v-col>
          <v-col align="center" class="title2"> 
                <h1>Quirky Comments About Setting Up.</h1>
                <br/>
                <h3>It's worth noting that this description here will likely be somewhat long and rather worthless. That's why I've left all of this negative space on the page-- this needs to be filled!</h3>
                <br/>
                <v-btn color="light-green lighten-2" style="color: #424242;" x-large>Placeholder Button.</v-btn>
          </v-col>
        </v-row>
    </v-container>
    <v-container>
        <v-row class="blurbs page container">
          <v-col><p>Here's a cool blurb! Join us to get industry leading something or other.</p></v-col>
          <v-col><p>Here's a cool blurb! Join us to get industry leading something or other.</p></v-col>
          <v-col><p>Here's a cool blurb! Join us to get industry leading something or other.</p></v-col>
        </v-row>
    </v-container>
    <v-container>
        <v-row class="blurbs page container">
          This space will eventually be used for user feedback. For now, it harbors this text...
        </v-row>
    </v-container>
  -->
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

h3 {
  font-family: var(--main-font);
}
.section {
  min-height: 100vh;
}
.container {
  //display:flex;
}
.blurbs {
  justify-content: space-evenly;
  font-size:1.5rem;
}
p {
    color:grey;
    flex-shrink: 3;
  }
grey {
  color:grey;
}
.overview {
  justify-content: space-evenly;
  align-self:flex-start;
}
.bubbled {
  border-radius: 10%;
  background-color:#aed581;
}
@keyframes up-down {
	50% {
		margin-top: -20px;
	}
}


.hat {
  /*
  &:before {
		content: "🎓";
		font-size: 4rem;
		transform: rotate(-20deg);
		right: -3.2rem;
		top: -2.4rem;
    display: inline-block;
    position: relative;  
	}
  */
  display: inline;
  white-space: nowrap;
  /*-moz-animation-duration: ;
  margin-left:-4rem;
  &:hover {
      &:before {
        transform: rotate(-24deg);
    }
  }
  */
}


.page {
  margin-top: 5%;
}
.logo {
  animation: up-down 3s  infinite;
  animation-timing-function: easeInOutCirc; 
  width:25rem;
}
.title {
  color:gray; // Please change this at some point. These values are here strictly to keep the styling consistent throughout the code.
  border-right: solid gray 1rem;
  padding-right: 10%;
}
.title2 {
  color:gray; // Please change this at some point. These values are here strictly to keep the styling consistent throughout the code.
  align-self:flex-start;
  border-left: solid gray 1rem;

}
.fullscreen {
  height:100%;
  width:100%;
  background-color: #d3f6db;
}
.title > h1 {
    font-size: 400%;
    line-height: 120%;
}
.title2 > h1 {
    font-size: 400%;
    line-height: 120%;
}
@media only screen and (max-width: 1100px) {
  .logo {
    width:15rem;
  }
  .container {
    display:flex;
    width:100%;
  }
  .overview {
    flex-grow: 4;
    width:100%;
  }
  .title {
    color:gray; // Please change this at some point. These values are here strictly to keep the styling consistent throughout the code.
    border-right: none;
  }
  .title2 {
    border-left:none;
  }
  @keyframes up-down {
	50% {
		margin-top: 0px;
	}
}
}


</style>
