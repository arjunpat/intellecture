<template>
  <v-content>
    <v-container>
      <div style="height: 10px;"></div>
      <span class="display-1">Hi {{ username }},</span>

      <div style="height: 60px;"></div>

      <v-layout wrap>
        <v-flex
          style="margin: 12px 20px;"
          md12
          sm12
          lg4
        >
          <v-card
            max-width="400"
          >
            <v-sheet
              class="v-sheet--offset mx-auto"
              color="cyan"
              elevation="12"
              max-width="calc(100% - 32px)"
            >
              <v-sparkline
                :labels="lastLecture.labels"
                :value="lastLecture.value"
                color="white"
                line-width="2"
                padding="16"
              ></v-sparkline>
            </v-sheet>

            <v-card-text class="pt-0">
              <div class="title font-weight-light mb-2">Avg. Student Understanding</div>
              <div class="subheading font-weight-light grey--text">Higher is Better</div>
              <v-divider class="my-2"></v-divider>
              <v-icon
                class="mr-2"
                small
              >
                mdi-clock
              </v-icon>
              <span class="caption grey--text font-weight-light">last lecture 32 minutes ago</span>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex
          style="margin: 12px 20px;"
          md12
          sm12
          lg4
        >
          <v-card
            max-width="400"
          >
            <v-sheet
              class="v-sheet--offset mx-auto"
              color="light-green darken-2"
              elevation="12"
              max-width="calc(100% - 32px)"
            >
              <v-sparkline
                :labels="lastLecture.labels"
                :value="lastLecture.valueRange"
                color="white"
                line-width="2"
                padding="16"
              ></v-sparkline>
            </v-sheet>

            <v-card-text class="pt-0">
              <div class="title font-weight-light mb-2">Range of Student Understanding</div>
              <div class="subheading font-weight-light grey--text">Lower is Better</div>
              <v-divider class="my-2"></v-divider>
              <v-icon
                class="mr-2"
                small
              >
                mdi-clock
              </v-icon>
              <span class="caption grey--text font-weight-light">last lecture 32 minutes ago</span>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <br><br>
      <v-layout>
        <v-data-table
          :headers="bestStudents.headers"
          :items="bestStudents.items"
          :items-per-page="5"
          class="elevation-1"
        ></v-data-table>
      </v-layout>

    </v-container>

  </v-content>
</template>

<script>

export default {
  data () {
    return {
      username: localStorage.username,
      lastLecture: {
        labels: [
          '0 min',
          '5 min',
          '10 min',
          '15 min',
          '20 min',
          '25 min',
          '30 min',
          '35 min'
        ],
        value: [
          8,
          6,
          8,
          3,
          3.5,
          2,
          7,
          9
        ],
        valueRange: [
          3,
          1,
          3,
          7,
          7,
          2,
          3,
          1
        ]
      },
      bestStudents: {
        headers: [
          { text: 'Name', value: 'n' },
          { text: 'Avg. Understanding', value: 'au' },
          { text: 'Avg. Concept Grasp Time', value: 'acg' },
          { text: 'Est. Test Performance', value: 'tp' },
          { text: 'Left App', value: 'la' },
          { text: 'Updated Ticker', value: 'ut' }
        ],
        items: [
          { n: 'Dante Olivar', au: '9.3 (Complete Understand)', acg: '3 min', tp: 'A', la: 0, ut: 42 },
          { n: 'Nazia Riley', au: '6.3 (Somewhat Understand)', acg: '8 min', tp: 'B', la: 2, ut: 14 },
          { n: 'Peggy Freeman', au: '4.3 (Confused)', acg: '12 min', tp: 'C', la: 19, ut: 4 },
          { n: 'Ari Alfaro', au: '3.3 (Confused)', acg: '5 min', tp: 'B', la: 2, ut: 49 },
          { n: 'Arjun Patrawala', au: '1.3 (Lost)', acg: '17 min', tp: 'C', la: 902, ut: 48 },
          { n: 'Nazia Riley', au: '6.3 (Somewhat Understand)', acg: '8 min', tp: 'B', la: 2, ut: 14 },
          { n: 'Peggy Freeman', au: '4.3 (Confused)', acg: '12 min', tp: 'C', la: 19, ut: 4 },
          { n: 'Ari Alfaro', au: '1.3 (Lost)', acg: '5 min', tp: 'B', la: 2, ut: 49 },
          { n: 'Dante Olivar', au: '9.3 (Complete Understand)', acg: '3 min', tp: 'A', la: 0, ut: 42 },
          { n: 'Nazia Riley', au: '6.3 (Somewhat Understand)', acg: '8 min', tp: 'B', la: 2, ut: 14 },
          { n: 'Peggy Freeman', au: '4.3 (Confused)', acg: '12 min', tp: 'C', la: 19, ut: 4 },
          { n: 'Ari Alfaro', au: '1.3 (Lost)', acg: '5 min', tp: 'B', la: 2, ut: 49 }
        ]
      }
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
