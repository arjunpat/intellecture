<template>
  <v-container class="text-center green lighten-2 fill-height p-relative" fluid>
    <!--<v-btn
          color="light-green lighten-1" 
          dark
          class="mr-2 ml-0"
        >teacher</v-btn>
        <a
          href="https://join.intellecture.app"
          style="text-decoration: none;">
        <v-btn
          color="light-green lighten-1" 
          dark
          class="mr-2"
        >student</v-btn>
        </a>-->
    <v-row style="padding-top: 10vh; z-index: 4;" class="fill-height">
      <v-btn
        color="white"
        text
        absolute
        right
        top
        @click.stop="
          dialog = true;
          signUp = false;
        "
        >Sign in</v-btn
      >
      <v-col cols="12">
        <div class="mt-8">
          <div
            class="shadow white--text"
            :class="$vuetify.breakpoint.smAndUp ? 'text-h1' : 'text-h2'"
          >
            Intellecture
          </div>
          <div
            class="font-weight-light white--text"
            :class="$vuetify.breakpoint.smAndUp ? 'text-h5' : 'text-h6'"
          >
            Teach online with confidence
          </div>
        </div>
        <v-btn
          class="mt-8"
          color="light-green lighten-2"
          dark
          @click.stop="
            dialog = true;
            signUp = true;
          "
          >Get started</v-btn
        >
        <v-btn class="mt-8 ml-2" color="white" text @click="showvid = true"
          ><v-icon class="mr-1">play_circle_filled</v-icon>See how it
          works</v-btn
        >
        <br />
        <div style="height: 5px;"></div>
        <a id="student-link" href="https://join.intellecture.app"
          >Are you a student?</a
        >
      </v-col>
    </v-row>
    <img
      src="@/assets/img/logo_pile_left.svg"
      :style="logoPileStyle"
      style="position: absolute; left:0; bottom: 0;"
    />
    <img
      src="@/assets/img/logo_pile_right.svg"
      :style="logoPileStyle"
      style="position: absolute; right:0; bottom: 0;"
    />

    <v-container id="vid-container" class="fill-height" fluid v-if="showvid">
      <v-btn text id="close-vid" @click="showvid = false"
        ><v-icon large>close</v-icon></v-btn
      >

      <v-row justify="center">
        <iframe
          width="972"
          height="547"
          src="https://www.youtube.com/embed/gEi5K-KifhE?autoplay=1&modestbranding=1&rel=0"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </v-row>
    </v-container>

    <v-dialog v-model="dialog" max-width="400" content-class="ma-0">
      <v-card>
        <v-card-title
          style="font-family: var(--main-font); font-weight: bold;"
          >{{ signUp ? "Sign up" : "Sign in" }}</v-card-title
        >
        <v-card-text>
          <ButtonWithImage
            @click="signInWithGoogle"
            class="mb-2 mt-2"
            style="width: 100%"
            :src="require('@/assets/img/google_logo.svg')"
            text="Continue with Google"
          />
          <div v-if="signUp">
            <p class="text-center text-caption" style="line-height: 1.2">
              By signing up, you agree to our
              <a
                href=""
                @click.prevent="$router.push({ name: 'PrivacyPolicy' })"
                >Privacy Policy</a
              >
              and consent to receiving emails from us about new features and
              opportunities. You can unsubscribe at any time.
            </p>
            <p class="text-center">
              Already have an account?
              <a href="" @click.prevent="signUp = false">Sign in</a>
            </p>
          </div>
          <div v-else class="text-center">
            Don't have an account?
            <a href="" @click.prevent="signUp = true">Sign up</a>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>

  <!--<v-content class="fullscreen">
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
  </v-content>-->
</template>

<script>
import ButtonWithImage from "@/components/ButtonWithImage";
import { signInGoogle, log } from "@/helpers.js";

export default {
  name: "Landing",

  components: {
    ButtonWithImage
  },

  data() {
    return {
      showvid: false,
      dialog: false,
      signUp: false
    };
  },

  computed: {
    logoPileStyle() {
      let breakpoint = this.$vuetify.breakpoint.name;
      if (breakpoint == "lg" || breakpoint == "xl") {
        return "width: 40%;";
      } else if (breakpoint == "md" || breakpoint == "sm") {
        return "width: 60%;";
      } else {
        return "width: 60%;";
      }
    }
  },

  methods: {
    signInWithGoogle() {
      signInGoogle().catch(err => {
        this.$emit(
          "error",
          "There was an error signing in! Please try again later."
        );
        log(err);
      });
    }
  }
};
</script>

<style scoped lang="scss">
.v-dialog {
  margin: 0 !important;
}

.shadow {
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
h3 {
  font-family: var(--main-font);
}
.section {
  min-height: 100vh;
}

#vid-container {
  position: absolute;
  left: 0px;
  top: 0px;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 100;
}

#close-vid {
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
}

.blurbs {
  justify-content: space-evenly;
  font-size: 1.5rem;
}
p {
  color: grey;
  flex-shrink: 3;
}
grey {
  color: grey;
}
.overview {
  justify-content: space-evenly;
  align-self: flex-start;
}
.bubbled {
  border-radius: 10%;
  background-color: #aed581;
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
  animation: up-down 3s infinite;
  animation-timing-function: easeInOutCirc;
  width: 20rem;
}
.title {
  color: gray; // Please change this at some point. These values are here strictly to keep the styling consistent throughout the code.
  border-right: solid gray 1rem;
  padding-right: 10%;
}
.title2 {
  color: gray; // Please change this at some point. These values are here strictly to keep the styling consistent throughout the code.
  align-self: flex-start;
  border-left: solid gray 1rem;
}
.fullscreen {
  height: 100%;
  width: 100%;
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
#student-link {
  font-family: var(--main-font); 
  color: #F1F8E9; 
  opacity: 1.0;
  font-size: 13px;
  transition: 0.3s all;
  text-decoration-thickness: .125em;
  text-underline-offset: 1.5px;
}
#student-link:hover {
  opacity: 0.8;
}
@media only screen and (max-width: 1100px) {
  .logo {
    width: 15rem;
  }
  .container {
    display: flex;
    width: 100%;
  }
  .overview {
    flex-grow: 4;
    width: 100%;
  }
  .title {
    color: gray; // Please change this at some point. These values are here strictly to keep the styling consistent throughout the code.
    border-right: none;
  }
  .title2 {
    border-left: none;
  }
  @keyframes up-down {
    50% {
      margin-top: 0px;
    }
  }
}
</style>
