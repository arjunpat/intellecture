<template>
  <v-content>
    <v-container
      fluid
    >
      <h1 class="display-1">Lecture: <strong>{{ lectureName }}</strong></h1>
      <br><br>

      <div style="height: 55vh;">
      <v-row align="center" justify="center">
        <v-card width="450" height="400">
          <v-card-text>
            <span class="text--primary title"><span style="background: red; padding: 2px 5px; color: white; border-radius: 3px;animation: animation: blink 1s step-start 0s infinite;" class="blink">LIVE</span> Understanding Score</span>
            <br><br><br><br><br><br>
            <span class="text--primary font-weight-black" style="margin: 0 auto; text-align: center; font-size: 150px; background: #ddd; border-radius: 7px; padding: 4px 10px;">{{ understandingScore }}%</span>
            <br><br><br><br>
            <span class="text--primary title">Average Understanding: </span>
            <span class="text--primary font-weight-black" style="font-size: 20px; background: #ddd; padding: 2px 4px; border-radius: 3px;">{{ averageUnderstanding }}</span>
            <br>
            <span class="text--primary title">Understanding Range: </span>
            <span class="text--primary font-weight-black" style="font-size: 20px; background: #ddd; padding: 2px 4px; border-radius: 3px;">{{ range }}</span>
            <br>
          </v-card-text>
        </v-card>
        <v-card width="800px" height="400px" align="center" justify="center" style="padding-top: 50px;">
          <div id="chart-container" class="ml-3" style="height: 300px; width: 700px"></div>
        </v-card>
      </v-row>

      <!-- <v-row align="center" justify="center">
        <v-col cols="12" sm="6" align="center">
          <v-card>
            <span>People in Lecture</span><br>
            <span v-for="person in peopleList" v-bind:key="person" style="display: block;">{{ person }}</span>
          </v-card>
        </v-col>
      </v-row> -->

      </div>

      <v-row align="center" justify="center">
        <v-col align="center" class="pt-9">
          <a href="#questions"><i id="arrow-btn" class="fas fa-chevron-down" style="font-size:8vmin;color:gray;transform:translate(0,0);"></i></a>

          <h1 id="questions" class="display-2 mt-9 mb-4 pt-9">Questions</h1>

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
              <div style="height: 80vh;"></div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
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
      questions: [{ text: 'What is a Gaussian surface?', id: 0 },
        { text: 'How do you calculate voltage?', id: 1 },
        { text: 'How do you make a Gaussian surface??', id: 2 },
        { text: 'Is a Gaussian surface a real physical object?', id: 3 },
        { text: "What's the formula for flux?", id: 4 },
        { text: 'How do you used a closed surface integral to calculate flux?', id: 5 },
        { text: 'What is the relationship between voltage and a Gaussian surface?', id: 6 }],
      keywords: /* hardcoded data */ [{ word: 'gaussian surface', count: 6 }, { word: 'electric flux', count: 4 }, { word: 'voltage', count: 3 }]
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
</style>
