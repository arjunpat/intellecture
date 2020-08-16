
<template>
   <div class="container">
      <div class="descriptContainer">
         <div class="description">
            Intellecture  is an education platform designed to make learning as efficient as possible online.
         </div>
      </div>
      <div class="teamContainer">
         <h2 class="teamheader">Meet The Team!</h2>
         <div class="teamrow"> 
            <v-card
               class="person"
               v-for="person in people"
               :key="person"
            >
               <v-img
                  :src="require(`@/assets/img/${person.img}`)"
                  max-height="400"
                  class="white--text align-end"
                  >
                  <v-card-title class="name">
                     {{person.name}}
                  </v-card-title>
               </v-img>


               <v-card-subtitle>
                  {{person.description}}
               </v-card-subtitle>

               <v-card-actions class="personRow">
                  <v-btn text :href="person.github">Github</v-btn>

                  <v-btn
                  color="blue"
                  :href="person.linkedin"
                  text
                  >
                  LinkedIn
                  </v-btn>
                   <v-btn
                  color="purple"
                  :href="`mailto:${person.email}`"
                  text
                  >
                  Email
                  </v-btn>
               </v-card-actions>
            </v-card>
         </div>
      </div>
      <div class="lastStuff">
         <h2 class="teamheader">Any questions?</h2>
          <div style="">
            <span class="contact" @click="emailus">Contact Us.</span>
         </div>
      </div>
      <div class="background">
         <div class="header">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="headSVG">
               <path fill="#AED581" d="M44.2,-67.9C53.5,-62.9,54.5,-44.1,58.3,-28.7C62.1,-13.3,68.6,-1.3,70.5,12.6C72.3,26.4,69.4,42,59.5,49.1C49.6,56.3,32.7,54.9,16.9,61.1C1.2,67.3,-13.3,81,-27.9,82.5C-42.6,83.9,-57.4,73.2,-60.8,58.6C-64.3,44,-56.5,25.5,-51.8,11.7C-47,-2,-45.4,-11,-44.4,-23.2C-43.4,-35.4,-43,-50.9,-35.7,-56.8C-28.4,-62.7,-14.2,-59,1.6,-61.6C17.5,-64.1,35,-72.9,44.2,-67.9Z" transform="translate(100 100)" />
               <text x="47%" y="70%" dominant-baseline="middle" text-anchor="middle" class="svgText">About Us</text>    
            </svg>
         </div>
      </div>
      <div class="backgroundColor"></div>
   </div>
</template>

<script>
  const people= [{
     name:"Aidan Smith",
     github:"https://github.com/AidanJSmith",
     description:"Aidan Smith is a junior at MVHS with a passion for code, board games, and hardware. He hopes his work on intellecture will leave a lasting positive impact on the MVHS community.",
     img:"Aidan.jpg",
     email:"100023755@mvla.net",
     linkedin:"https://www.linkedin.com/in/aidan-smith-68baa4177/"
  },
  {
     name:"Write Your",
     github:"https://github.com/AidanJSmith",
     description:"Name and info in the object in @/src/views/AboutUs.vue. Sorry if this is lazy, I'm tired. The images are included via relative paths to assets/img",
     img:"logo.png",
     email:"email",
     linkedin:"linkedIn"
  },
  ]
  export default {
    name: 'about',

    data() {
      return {
        src: 'https://drive.google.com/file/d/125XXyn-Vk978m-cpqxQVr0HFhkuWmUZZ/preview',
        people:people,
      }
    },
    methods: {
       emailus() {
         window.location.href="mailto:intellectureteam@gmail.com"
       }
    },
  }
</script>

<style lang="scss">
.container {
   width:100%;
   overflow-x:hidden;
}
.lastStuff {
   position: relative;
   z-index: 3;
   text-align:center;
   font-size:5vw;
   color:white;
   .contact {
      font-size:4vw;
      cursor:pointer;
      background-color:#65bb6a;
   }
}
.descriptContainer {
   position: relative;
   display: grid;
   height:70vh;
   grid-template-columns: 17vw 5fr 3fr;
   grid-template-rows: 30vh 8fr 2fr;
}
.teamContainer {
   display: flex;
   flex-direction: column;
   margin-top:10vh;
   overflow: hidden;
   text-align: center;
   .teamrow {
      display: flex;
      align-content: center;
      justify-content: center;
      flex-direction: row;
      flex-wrap: wrap;
       width:100%;
   }
   .personRow {
      display: flex;
      flex-direction: row;
      flex-wrap:wrap;
   }
   .person {
      z-index: 3;
      margin:20px;
      max-width:700px;
      .name {
         background-color:#65bb6a;
      }
   }
   .teamheader {
      position: relative;
       z-index: 3;
      font-size:10em;
      color:white;
   }
}

.description {
   position: relative;
   grid-row: 2;
   grid-column: 2;
   background: #65bb6a;
   text-align: center;
   color:white;
   z-index:4;
   font-size:3em;
   max-width:400px;
}

.foreground {
   text-align:center;
   position: relative;
   z-index: 2;
   display: grid;
   width:100%;
   grid-template-rows: 50% 50%;
   grid-template-columns: 30% 70%;
   background: transparent;
   h1 {
      color:white;
      font-size:30px;
      grid-column-start:2;
      font-size:290%;
   }
}
.background {
   width:100%;
   height:100%;
   z-index: 2;
}
.svgText {
   color:white;
   font-weight: 600;
}
.svgText2 {
   color:white;
   font-weight: 600;
   font-size:7px;
}
.mainDesc {
   position: absolute;
   z-index: 2;
   top:-89vh;
   left:-90vw;
   width:225vw;
   height:625vh;
}
.mainDesc2 {
   position: absolute;
   z-index: 0;
   top:60vh;
   left:-30vw;
   width:125vw;
   height:125vh;
   .svgSubText {
      font-size:8px;
      position: absolute;
      width:40px;
   }
}
.headSVG {
   position: absolute;
   z-index: 2;
   top:-80vh;
   scale: 2;
   left:-10vw;
   width:140vw;
   height:110vh;
}
html, 
body {
    margin: 0;
    padding: 0;
    z-index:0;
    max-width: 100%;
    overflow-x: hidden;
    background-color:#d3f6dbff;
}
.backgroundColor {
   position: absolute;
   top:0;
   left:0;
   width:100vw;
   height:100%;
   background-color:#d3f6dbff;
   z-index:1;
}
@media screen and (max-width: 800px) {
   .lastStuff {
      font-size:10vw;
      .contact {
         font-size:14vw;
      }
   }
  .svgText {
      transform:translate(-.05vw,1.5vh);
   }
   .teamContainer {
      margin-top:80vh;
      .teamheader {
         font-size:4em;
      }
   }
   .person {
      max-width:none;
      min-width:20px;
   }
.mainDesc {
      top:-1500px;
   }
.description {
   max-width:100%;
   grid-column:2;
}
.descriptContainer {
   position: relative;
   display: grid;
   height:70vh;
   grid-template-columns: 10% 1fr 10%;
   grid-template-rows: 30vh 8fr 2fr;
}
}
</style>
