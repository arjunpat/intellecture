<template>
  <v-content>
    <v-container
      fluid
    >
      <v-card>
      <v-card-title>
        <h1 class="display-1">Lecture: <strong><span style="font-family: 'Noto Sans'">{{ lectureName }}</span></strong></h1>
      </v-card-title>

      <v-tabs
        v-model="tab"
        background-color="transparent"
        grow
      >
        <v-tab
          v-for="(item, index) in items"
          :class="{active: currentTab === index}"
          @click="currentTab = index"
          :key="item"
        >
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">

          <!-- Start of Understanding tab -->
          <v-card
            v-show="currentTab === 0"
            color="basil"
            flat
            height="65vh"
            class="pt-3"
          >
            <v-row align="center" justify="center">
                <v-card width="30%" height="60vh">
                    <v-card-text>
                        <span style="font-size: 20px; color: black; font-weight: bold;"><span style="background: red; padding: 2px 5px; color: white; border-radius: 3px; font-weight: normal;">LIVE</span> UNDERSTANDING SCORE</span>
                        <br><br><br><br><br><br><br>
                        <span class="text--primary font-weight-black" style="margin-top: 40px; text-align: center; font-size: 200px; background: #ddd; border-radius: 7px; padding: 4px 10px;">{{ understandingScore }}%</span>
                        <br><br><br><br>
                        <span class="text--primary data-text">Average Understanding: </span>
                        <span class="text--primary font-weight-black" style="font-size: 20px; background: #ddd; padding: 2px 4px; border-radius: 3px;">{{ averageUnderstanding }}</span>
                        <div style="height: 5px;"></div>
                        <span class="text--primary data-text">Understanding Range: </span>
                        <span class="text--primary font-weight-black" style="font-size: 20px; background: #ddd; padding: 2px 4px; border-radius: 3px;">{{ range }}</span>
                        <br>
                    </v-card-text>
                </v-card>
                <v-card width="60%" height="60vh" align="center" justify="center" style="padding-top: 50px;">
                    <div id="chart-container" class="ml-3" style="height: 300px; width: 700px"></div>
                </v-card>
            </v-row>
        </v-card>
          <!-- End of Understanding tab -->

          <!-- Start of Questions tab -->
        <v-card
            v-show="currentTab === 1"
            flat
            class="pt-3"
          >
          <v-row align="center" justify="center">
            <v-col align="center">
            <v-row>
                <v-col align="left">
                <v-card
                    class="mx-auto"
                    max-width="400"
                    tile
                >
                    <v-card-title>Keywords</v-card-title>
                    <v-card-text>
                    <v-list-item
                        v-for="n in 3"
                        v-bind:key="n"
                    >
                        <v-list-item-content>
                        <v-list-item-title>{{ (n) + ': ' + keywords[n-1].word }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    </v-card-text>
                </v-card>
                </v-col>

                <v-col cols="8">
                <ul style="list-style-type: none">
                    <li v-for="question in questions" v-bind:key="question.id">
                    <v-banner>
                        {{question.text}}
                        <template v-slot:actions>
                        <v-btn text color="primary">Dismiss</v-btn>
                        </template>
                    </v-banner>
                    </li>
                </ul>
                </v-col>
            </v-row>
            </v-col>
        </v-row>
        </v-card>
          <!-- End of Questions tab -->

      </v-tabs-items>
    </v-card>

      <!-- <v-row align="center" justify="center">
        <v-col cols="12" sm="6" align="center">
          <v-card>
            <span>People in Lecture</span><br>
            <span v-for="person in peopleList" v-bind:key="person" style="display: block;">{{ person }}</span>
          </v-card>
        </v-col>
      </v-row> -->

    </v-container>

    <v-footer
      fixed
      color="green lighten-3"
      class="font-weight-medium"
    >
      <v-col
        class="text-center"
        cols="12"
        sm="8"
      >
        <span style="font-size: 28px;">Give your students the join code: <span class="text--primary font-weight-black" style="background: #ddd; border-radius: 7px; padding: 4px 10px;">{{ id }}</span></span>
      </v-col>
    </v-footer>
  </v-content>
</template>

<script>

export default {
  data () {
    return {
      id: this.$route.query.id,
      lectureName: this.$route.query.name,
      understandingScore: '--',
      averageUnderstanding: '--',
      range: '--',
      questions: [{ text: 'What is a Gaussian surface?', id: 0 },
        { text: 'How do you calculate voltage?', id: 1 },
        { text: 'How do you make a Gaussian surface??', id: 2 },
        { text: 'Is a Gaussian surface a real physical object?', id: 3 },
        { text: "What's the formula for flux?", id: 4 },
        { text: 'How do you used a closed surface integral to calculate flux?', id: 5 },
        { text: 'What is the relationship between voltage and a Gaussian surface?', id: 6 }],
      keywords: /* hardcoded data */ [{ word: 'gaussian surface', count: 6 }, { word: 'electric flux', count: 4 }, { word: 'voltage', count: 3 }],
      currentTab: 0,
      tab: null,
      items: [
        'Understanding', 'Questions', 'Students'
      ]
    }
  },
  methods: {
    initChart () {

    }
  },
  mounted () {
    this.initChart()
    this.$emit('startlecture')
  }
}
</script>

<style>
html {
  scroll-behavior: smooth;
}

#arrow-btn {
  transition: all 0.3s;
}

#arrow-btn:hover {
  font-size: 20px;
}

.blink {
  animation: blink-animation 1s steps(5, start) infinite;
  -webkit-animation: blink-animation 1s steps(5, start) infinite;
}
@keyframes blink-animation {
  to {
    visibility: hidden;
  }
}
@-webkit-keyframes blink-animation {
  to {
    visibility: hidden;
  }
}

.data-text {
    font-size: 25px;
    font-weight: 500;
}
</style>
